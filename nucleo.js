// ── Almacenamiento ────────────────────────────────────────────────────────
// Guarda todo en el dispositivo. La interfaz es asíncrona a propósito:
// cuando conectes Supabase, sólo se reemplaza el cuerpo de estas funciones
// y ningún componente cambia.

const PREFIJO = 'mesa:';
const tieneStorageHost = typeof window !== 'undefined' && window.storage && typeof window.storage.get === 'function';

export const almacen = {
  async leer(clave, porDefecto) {
    try {
      if (tieneStorageHost) {
        const r = await window.storage.get(PREFIJO + clave);
        return r && r.value ? JSON.parse(r.value) : porDefecto;
      }
      const crudo = localStorage.getItem(PREFIJO + clave);
      return crudo ? JSON.parse(crudo) : porDefecto;
    } catch (e) {
      return porDefecto;
    }
  },
  async guardar(clave, valor) {
    try {
      const texto = JSON.stringify(valor);
      if (tieneStorageHost) { await window.storage.set(PREFIJO + clave, texto); return true; }
      localStorage.setItem(PREFIJO + clave, texto);
      return true;
    } catch (e) {
      return false;
    }
  },
};

// ── Cálculos nutricionales ────────────────────────────────────────────────
// Gasto energético en reposo por la ecuación de Mifflin-St Jeor (1990),
// la más usada en la práctica clínica para adultos sanos.
// El resultado es una ESTIMACIÓN de referencia, no una prescripción.

export const FACTORES = [
  { k: 'sedentario', nombre: 'Sedentario', desc: 'Escritorio, poco movimiento', f: 1.2 },
  { k: 'ligero', nombre: 'Ligero', desc: 'Camina o entrena 1–3 días', f: 1.375 },
  { k: 'moderado', nombre: 'Moderado', desc: 'Entrena 3–5 días', f: 1.55 },
  { k: 'alto', nombre: 'Alto', desc: 'Entrena 6–7 días', f: 1.725 },
];

export function gastoBasal({ sexo, peso, estatura, edad }) {
  if (!peso || !estatura || !edad) return null;
  const base = 10 * peso + 6.25 * estatura - 5 * edad;
  return Math.round(sexo === 'M' ? base + 5 : base - 161);
}

export function energiaDiaria(persona) {
  const basal = gastoBasal(persona);
  if (!basal) return null;
  const factor = (FACTORES.find((x) => x.k === persona.actividad) || FACTORES[1]).f;
  return Math.round(basal * factor);
}

// Reparto de macronutrientes orientativo para salud general y variedad:
// proteína 1.4 g/kg, grasa 27 % de la energía, el resto hidratos.
export function macrosObjetivo(persona) {
  const kcal = energiaDiaria(persona);
  if (!kcal || !persona.peso) return null;
  const prot = Math.round(persona.peso * 1.4);
  const gras = Math.round((kcal * 0.27) / 9);
  const carb = Math.round(Math.max(0, kcal - prot * 4 - gras * 9) / 4);
  return { kcal, prot, carb, gras };
}

// Agua: 35 ml por kg de peso, redondeado a vasos de 250 ml.
export function vasosObjetivo(persona) {
  if (!persona.peso) return 8;
  return Math.max(6, Math.min(16, Math.round((persona.peso * 35) / 250)));
}

export function edadDesde(fechaNac) {
  if (!fechaNac) return null;
  const n = new Date(fechaNac + 'T12:00:00');
  const hoy = new Date();
  let e = hoy.getFullYear() - n.getFullYear();
  const m = hoy.getMonth() - n.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < n.getDate())) e--;
  return e;
}

// Factor de porción por persona: la app sirve más a quien más energía gasta.
// Se calcula contra una referencia de 2000 kcal.
export function factorPorcion(persona) {
  const kcal = energiaDiaria(persona);
  if (!kcal) return 1;
  return Math.round((kcal / 2000) * 100) / 100;
}

// ── Fechas ────────────────────────────────────────────────────────────────
export const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const DIAS_CORTO = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const iso = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};

export const desdeIso = (s) => new Date(s + 'T12:00:00');

export function lunesDe(fecha) {
  const d = new Date(fecha);
  const dia = d.getDay();
  d.setDate(d.getDate() - (dia === 0 ? 6 : dia - 1));
  d.setHours(12, 0, 0, 0);
  return d;
}

export function sumarDias(fecha, n) {
  const d = new Date(fecha);
  d.setDate(d.getDate() + n);
  return d;
}

export function etiquetaFecha(s) {
  const d = desdeIso(s);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

// ── Generador de menús ────────────────────────────────────────────────────
// Regla de no repetición: una receta no vuelve a salir hasta que hayan pasado
// `descanso` días, y nunca dos veces el mismo día. Si un tiempo se queda sin
// candidatos frescos, se relaja el descanso en lugar de dejar el hueco vacío.

function mezclar(lista, semilla) {
  const a = [...lista];
  let s = semilla;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generarMenu({ recetas, fechaInicio, dias, tiempos, descanso = 10, excluir = [], historial = {} }) {
  const plan = {};
  const ultimoUso = { ...historial };
  const semilla = desdeIso(iso(fechaInicio)).getTime() % 100000;
  let paso = 0;

  for (let d = 0; d < dias; d++) {
    const fecha = iso(sumarDias(fechaInicio, d));
    plan[fecha] = {};
    const usadasHoy = new Set();

    for (const t of tiempos) {
      const aptas = recetas.filter(
        (r) => r.tiempos.includes(t) && !usadasHoy.has(r.id) && !r.tags.some((g) => excluir.includes(g))
      );
      if (!aptas.length) continue;

      const frescas = aptas.filter((r) => ultimoUso[r.id] === undefined || d - ultimoUso[r.id] >= descanso);
      let pool;
      if (frescas.length) {
        pool = frescas;
      } else {
        // Sin candidatos frescos: en vez de tomar cualquiera, se eligen las
        // que llevan más tiempo sin salir, para estirar al máximo la variedad.
        const porAntiguedad = [...aptas].sort(
          (a, b) => (ultimoUso[a.id] ?? -9999) - (ultimoUso[b.id] ?? -9999)
        );
        pool = porAntiguedad.slice(0, Math.max(1, Math.ceil(porAntiguedad.length / 3)));
      }
      const elegida = mezclar(pool, semilla + paso++ * 7919)[0];

      plan[fecha][t] = elegida.id;
      ultimoUso[elegida.id] = d;
      usadasHoy.add(elegida.id);
    }
  }
  return plan;
}

// ── Lista del súper ───────────────────────────────────────────────────────
export function construirLista({ plan, recetas, porciones, pasillos, desde, hasta }) {
  const porIngrediente = {};
  const indice = Object.fromEntries(recetas.map((r) => [r.id, r]));

  for (const [fecha, tiemposDia] of Object.entries(plan)) {
    if (fecha < desde || fecha > hasta) continue;
    for (const id of Object.values(tiemposDia)) {
      const receta = indice[id];
      if (!receta) continue;
      for (const ing of receta.ing) {
        const clave = `${ing.item}|${ing.unidad}`;
        if (!porIngrediente[clave]) porIngrediente[clave] = { item: ing.item, unidad: ing.unidad, cant: 0 };
        porIngrediente[clave].cant += ing.cant * porciones;
      }
    }
  }

  const buscarPasillo = (item) => {
    for (const [nombre, items] of Object.entries(pasillos)) if (items.includes(item)) return nombre;
    return 'Otros';
  };

  const agrupado = {};
  for (const linea of Object.values(porIngrediente)) {
    const p = buscarPasillo(linea.item);
    if (!agrupado[p]) agrupado[p] = [];
    agrupado[p].push({ ...linea, cant: Math.round(linea.cant * 10) / 10 });
  }
  for (const p of Object.keys(agrupado)) agrupado[p].sort((a, b) => a.item.localeCompare(b.item));
  return agrupado;
}
