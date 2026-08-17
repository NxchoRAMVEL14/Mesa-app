// Interpretación de lo que devuelve el lector: puede ser un código de barras
// clásico (sólo dígitos) o un QR.
//
// Los QR de producto suelen traer un GS1 Digital Link: una URL cuyo camino
// codifica el identificador con el formato /01/{GTIN}, opcionalmente seguido de
// lote (/10/), serie (/21/) o caducidad (/17/). El estándar exige que el GTIN
// vaya a 14 dígitos rellenado con ceros a la izquierda, así que un UPC de 12
// dígitos aparece como 00614141123452.
//
// Open Food Facts indexa por el código impreso en el empaque (EAN-13, UPC-12,
// EAN-8), no por el GTIN-14 rellenado. Por eso hay que quitar el relleno y, si
// no se acierta de primera, probar las variantes razonables.
//
// Muchos QR de empaque, en cambio, son sólo una URL de publicidad sin ningún
// identificador dentro. Ese caso no tiene solución técnica: se detecta y se
// ofrece capturar el producto a mano.

const soloDigitos = (s) => /^\d+$/.test(s);

// Versiones antiguas del estándar permitían escribir /gtin/ en lugar de /01/.
// Se eliminaron, pero hay empaques ya impresos con esa forma, así que se aceptan.
const CLAVES_GTIN = ['01', 'gtin'];

export function interpretarLectura(crudo) {
  const texto = String(crudo || '').trim();
  if (!texto) return { tipo: 'vacio' };

  // Código de barras clásico, o un QR que sólo contiene el número.
  if (soloDigitos(texto)) {
    if (texto.length < 8 || texto.length > 14) return { tipo: 'digitos-raros', valor: texto };
    return { tipo: 'codigo', codigo: texto, origen: 'directo' };
  }

  // A partir de aquí se espera una URL.
  const pareceUrl = /^https?:\/\//i.test(texto);
  if (!pareceUrl) return { tipo: 'texto', valor: texto };

  let url;
  try { url = new URL(texto); } catch (e) { return { tipo: 'texto', valor: texto }; }

  // 1) Identificador en el camino: /01/{GTIN}
  const partes = url.pathname.split('/').filter(Boolean);
  for (let i = 0; i < partes.length - 1; i++) {
    if (CLAVES_GTIN.includes(partes[i].toLowerCase()) && soloDigitos(partes[i + 1])) {
      return { tipo: 'codigo', codigo: partes[i + 1], origen: 'gs1', url: texto };
    }
  }

  // 2) Identificador en la consulta: ?01=... o ?gtin=...
  for (const clave of CLAVES_GTIN) {
    const v = url.searchParams.get(clave);
    if (v && soloDigitos(v)) return { tipo: 'codigo', codigo: v, origen: 'gs1-consulta', url: texto };
  }

  // 3) Último recurso: un tramo del camino que parezca un código de producto.
  //    Se exige longitud típica para no confundirlo con un identificador
  //    interno de la página.
  const candidato = partes.find((p) => soloDigitos(p) && [8, 12, 13, 14].includes(p.length));
  if (candidato) return { tipo: 'codigo', codigo: candidato, origen: 'adivinado', url: texto };

  // Un QR de publicidad, sin nada que buscar.
  return { tipo: 'url-sin-codigo', url: texto, dominio: url.hostname };
}

// Quita el relleno de ceros para recuperar el código como está impreso.
export function normalizarCodigo(codigo) {
  let c = String(codigo).replace(/\D/g, '');
  while (c.length > 8 && c[0] === '0' && [14, 13].includes(c.length)) c = c.slice(1);
  return c;
}

// Variantes a consultar, en orden, hasta que una acierte. El GTIN-14 rellenado
// y el código impreso son el mismo producto, pero la base de datos puede tener
// registrada sólo una de las dos formas.
export function variantesDeCodigo(codigo) {
  const base = String(codigo).replace(/\D/g, '');
  if (!base) return [];
  const salida = [];
  const meter = (c) => { if (c && c.length >= 8 && c.length <= 14 && !salida.includes(c)) salida.push(c); };

  meter(normalizarCodigo(base));
  meter(base);
  // Sin ceros de relleno del todo.
  meter(base.replace(/^0+/, ''));
  // Rellenado a 13 y a 14, por si la base lo guardó así.
  if (base.length < 13) meter(base.padStart(13, '0'));
  if (base.length < 14) meter(base.padStart(14, '0'));
  return salida;
}

// Mensajes para cada resultado que no sea un código utilizable.
export const EXPLICACIONES = {
  'url-sin-codigo': 'Ese QR sólo lleva a una página web, no trae el código del producto dentro. Es muy común en empaques chicos: el QR es de publicidad, no de identificación. Captura el producto a mano y queda guardado para la próxima.',
  'texto': 'Ese QR contiene texto, no un código de producto ni una liga. Captura el producto a mano.',
  'digitos-raros': 'Ese número no tiene la forma de un código de producto. Los códigos de barras traen entre 8 y 14 dígitos.',
  'vacio': 'No se leyó nada. Vuelve a intentar o escribe el código a mano.',
};
