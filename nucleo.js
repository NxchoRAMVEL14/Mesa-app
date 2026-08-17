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

// Actividad de FONDO: la vida diaria sin contar los entrenamientos, que se
// suman aparte. Separarlos evita contar dos veces el mismo esfuerzo.
export const FACTORES = [
  { k: 'sedentario', nombre: 'Sedentario', desc: 'Escritorio casi todo el día', f: 1.2 },
  { k: 'ligero', nombre: 'Ligero', desc: 'De pie o caminando a ratos', f: 1.375 },
  { k: 'moderado', nombre: 'Moderado', desc: 'En movimiento buena parte del día', f: 1.55 },
  { k: 'alto', nombre: 'Alto', desc: 'Trabajo físico la mayor parte del día', f: 1.725 },
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

// ── Gasto por entrenamiento ────────────────────────────────────────────────
// Se estima con METs: 1 MET equivale a consumir cerca de 1 kcal por kilo de
// peso cada hora en reposo. Los valores vienen del Compendium of Physical
// Activities (Ainsworth y cols.), la referencia estándar del campo.
// Son promedios poblacionales: orientan, no miden.

export const TIPOS_ENTRENO = [
  { k: 'voleibol', nombre: 'Voleibol', met: 6.0 },
  { k: 'fuerza', nombre: 'Pesas o fuerza', met: 5.0 },
  { k: 'funcional', nombre: 'Funcional o HIIT', met: 8.0 },
  { k: 'carrera', nombre: 'Correr', met: 9.0 },
  { k: 'ciclismo', nombre: 'Bicicleta', met: 7.5 },
  { k: 'caminata', nombre: 'Caminata', met: 3.5 },
  { k: 'futbol', nombre: 'Futbol', met: 7.0 },
  { k: 'movilidad', nombre: 'Movilidad o estiramiento', met: 2.5 },
];

export const metDe = (tipo) => (TIPOS_ENTRENO.find((t) => t.k === tipo) || { met: 4 }).met;

// El gasto NETO de la sesión: se resta 1 MET porque ese reposo ya viene
// contado en el metabolismo basal. Sin esta resta, se sobreestima el día.
export function gastoSesion({ tipo, min }, peso) {
  if (!peso || !min) return 0;
  return Math.round(Math.max(0, metDe(tipo) - 1) * peso * (min / 60));
}

// Entrenos que una persona tiene programados para un día de la semana.
export const entrenosDelDia = (persona, fecha) => {
  const d = desdeIso(fecha).getDay();
  return (persona.entrenos || []).filter((e) => e.dia === d);
};

// Energía objetivo de un día concreto: la base de la vida diaria más lo que
// sumen los entrenos programados. Así un martes de voleibol pide más comida
// que un lunes de descanso, sin que tengas que ajustar nada a mano.
export function energiaDelDia(persona, fecha) {
  const base = energiaDiaria(persona);
  if (!base) return null;
  // En recuperación los entrenamientos programados no suman: se da por hecho
  // que no se están haciendo, y subir la meta sólo daría una cifra irreal.
  const extra = persona.recuperacion ? 0 : entrenosDelDia(persona, fecha)
    .reduce((s, e) => s + gastoSesion(e, persona.peso), 0);
  return { base, extra, total: base + extra };
}

export function macrosDelDia(persona, fecha) {
  const en = energiaDelDia(persona, fecha);
  if (!en || !persona.peso) return null;
  const prot = Math.round(persona.peso * 1.4);
  const gras = Math.round((en.total * 0.27) / 9);
  const carb = Math.round(Math.max(0, en.total - prot * 4 - gras * 9) / 4);
  return { kcal: en.total, base: en.base, extra: en.extra, prot, carb, gras };
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
export const claveIng = (item, unidad) => `${item}|${unidad}`;

// Todos los ingredientes que conoce el recetario, para el autocompletado.
export function catalogoIngredientes(recetas) {
  const m = {};
  for (const r of recetas) for (const g of r.ing) m[claveIng(g.item, g.unidad)] = { item: g.item, unidad: g.unidad };
  return Object.values(m).sort((a, b) => a.item.localeCompare(b.item));
}

// Suma los ingredientes que consume una receta para un número de porciones.
// Se usa al marcar una comida como hecha, para descontarla de la despensa.
export function consumoDe(receta, porciones, signo = -1) {
  const delta = {};
  if (!receta) return delta;
  for (const g of receta.ing) {
    const k = claveIng(g.item, g.unidad);
    delta[k] = (delta[k] || 0) + signo * g.cant * porciones;
  }
  return delta;
}

// Descuenta lo que pide una receta, pero nunca más de lo que hay en existencia,
// y devuelve el registro exacto de lo consumido. Ese registro es lo que permite
// deshacer sin inventar comida: si sólo había 100 g de 300, sólo se regresan 100.
export function descontar(despensa, receta, porciones) {
  const sig = { ...despensa };
  const aplicado = {};
  if (!receta) return { despensa: sig, aplicado };
  for (const g of receta.ing) {
    const k = claveIng(g.item, g.unidad);
    const hay = sig[k] || 0;
    if (hay <= 0) continue;
    const usado = Math.min(hay, Math.round(g.cant * porciones * 100) / 100);
    const resto = Math.round((hay - usado) * 100) / 100;
    if (resto > 0.001) sig[k] = resto; else delete sig[k];
    aplicado[k] = Math.round(usado * 100) / 100;
  }
  return { despensa: sig, aplicado };
}

export function devolver(despensa, aplicado) {
  const sig = { ...despensa };
  for (const [k, v] of Object.entries(aplicado || {})) {
    sig[k] = Math.round(((sig[k] || 0) + v) * 100) / 100;
  }
  return sig;
}

export function aplicarDelta(despensa, delta) {
  const sig = { ...despensa };
  for (const [k, v] of Object.entries(delta)) {
    const nuevo = Math.round(((sig[k] || 0) + v) * 100) / 100;
    if (nuevo > 0.001) sig[k] = nuevo; else delete sig[k];
  }
  return sig;
}

export function construirLista({ plan, recetas, porciones, pasillos, desde, hasta, despensa = {} }) {
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
    const necesario = Math.round(linea.cant * 10) / 10;
    const tengo = Math.round((despensa[claveIng(linea.item, linea.unidad)] || 0) * 10) / 10;
    agrupado[p].push({
      ...linea,
      cant: necesario,
      tengo: Math.min(tengo, necesario),
      falta: Math.round(Math.max(0, necesario - tengo) * 10) / 10,
    });
  }
  for (const p of Object.keys(agrupado)) agrupado[p].sort((a, b) => a.item.localeCompare(b.item));
  return agrupado;
}


// ── Generador de rutinas ──────────────────────────────────────────────────
// Arma una rutina eligiendo, para cada sesión de la plantilla, ejercicios que
// existan en el lugar disponible. Evita repetir el mismo ejercicio dentro de
// una sesión y reparte los que se repiten entre días distintos.

export function generarRutina({ ejercicios, objetivo, lugar, dias, ejerciciosPorSesion, semilla = 7 }) {
  const disponibles = ejercicios.filter((x) => x.lugares.includes(lugar));
  const usoGlobal = {};
  const rutina = [];
  let paso = 0;

  const revuelto = (lista) => {
    const a = [...lista];
    let s = semilla + paso++ * 104729;
    const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  for (let d = 0; d < dias; d++) {
    const plantilla = objetivo.sesiones[d % objetivo.sesiones.length];
    const elegidos = [];
    const usadosHoy = new Set();

    // Se recorre la lista de patrones tantas veces como haga falta para
    // llenar la sesión al tamaño pedido por la duración.
    let i = 0;
    while (elegidos.length < ejerciciosPorSesion && i < ejerciciosPorSesion * 4) {
      const patron = plantilla.patrones[i % plantilla.patrones.length];
      i++;
      const aptos = disponibles.filter((x) => x.patron === patron && !usadosHoy.has(x.id));
      if (!aptos.length) continue;
      const menosUsados = aptos.sort((a, b) => (usoGlobal[a.id] || 0) - (usoGlobal[b.id] || 0));
      const tope = Math.max(1, Math.ceil(menosUsados.length / 2));
      const elegido = revuelto(menosUsados.slice(0, tope))[0];
      elegidos.push(elegido);
      usadosHoy.add(elegido.id);
      usoGlobal[elegido.id] = (usoGlobal[elegido.id] || 0) + 1;
    }

    rutina.push({ dia: d + 1, titulo: plantilla.titulo, ejercicios: elegidos });
  }
  return rutina;
}

// ── Cruce entre entrenamiento y alimentación ──────────────────────────────
// Para cada día devuelve lo que se comió (de lo marcado como hecho) frente a
// lo que ese día pedía, y si hubo entreno. La pregunta que responde no es
// "¿comí de más?" sino "¿comí suficiente para lo que hice?".

export function cruzarDias({ persona, fechas, plan, bitacora, indiceRecetas }) {
  const f = factorPorcion(persona);
  return fechas.map((fecha) => {
    const reg = bitacora[fecha] || { hechos: {} };
    const dia = plan[fecha] || {};
    let consumido = 0, tiemposHechos = 0, tiemposPlan = 0;

    for (const [t, id] of Object.entries(dia)) {
      tiemposPlan++;
      if (!reg.hechos[t]) continue;
      tiemposHechos++;
      const r = indiceRecetas[id];
      if (r) consumido += r.kcal * f;
    }
    // Lo registrado a mano cuenta igual que el menú planeado.
    const extras = reg.extras || [];
    consumido += extras.reduce((s, x) => s + (x.kcal || 0), 0);

    const meta = macrosDelDia(persona, fecha);
    const sesiones = (reg.entrenos || []).length
      ? reg.entrenos
      : persona.recuperacion ? []
        : entrenosDelDia(persona, fecha).map((e) => ({ ...e, programado: true }));
    const gastado = sesiones.reduce((s, e) => s + gastoSesion(e, persona.peso), 0);

    return {
      fecha,
      consumido: Math.round(consumido),
      meta: meta ? meta.kcal : null,
      base: meta ? meta.base : null,
      gastado,
      entreno: sesiones.length > 0,
      registrado: (reg.entrenos || []).length > 0,
      sesiones,
      tiemposHechos,
      tiemposPlan,
      extras: extras.length,
      recuperacion: !!persona.recuperacion,
    };
  });
}
