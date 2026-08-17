import React from 'react';

// Ilustraciones de los ejercicios, dibujadas como figuras articuladas.
// Cada pose se define por las coordenadas de sus articulaciones en un lienzo
// de 100×100, y un mismo dibujo sirve para todos los ejercicios que comparten
// el patrón de movimiento. Son esquemas de referencia para reconocer la
// posición de un vistazo, no demostraciones de técnica.

// c: cabeza [cx, cy, r] · l: polilíneas del cuerpo · p: trazos de apoyo
// (barra, mancuerna, banco) · suelo: línea de piso · flecha: dirección
const POSES = {
  sentadilla: {
    c: [38, 24, 7],
    l: [[41, 31, 52, 60], [42, 34, 58, 30, 72, 33], [52, 60, 68, 63, 63, 84], [52, 60, 46, 72, 50, 84]],
    suelo: true,
  },
  zancada: {
    c: [46, 19, 7],
    l: [[46, 26, 48, 52], [46, 30, 39, 42, 41, 54], [46, 30, 55, 42, 53, 54],
        [48, 52, 68, 57, 68, 84], [48, 52, 32, 73, 41, 84], [30, 84, 43, 84]],
    suelo: true,
  },
  lagartija: {
    c: [26, 46, 7],
    l: [[33, 49, 76, 62], [34, 50, 32, 66, 30, 78], [76, 62, 82, 78]],
    p: [[26, 78, 88, 78]],
    suelo: true,
  },
  plancha: {
    c: [24, 52, 7],
    l: [[31, 55, 78, 66], [32, 56, 28, 78], [78, 66, 84, 78]],
    suelo: true,
  },
  planchaLateral: {
    c: [24, 50, 7],
    l: [[31, 56, 60, 68, 88, 80], [31, 57, 29, 80], [29, 80, 13, 84], [32, 55, 39, 26]],
    suelo: true,
  },
  press: {
    c: [50, 30, 7],
    l: [[50, 37, 50, 60], [50, 40, 36, 34, 34, 20], [50, 40, 64, 34, 66, 20],
        [50, 60, 43, 84], [50, 60, 57, 84]],
    p: [[24, 20, 76, 20], [24, 15, 24, 25], [76, 15, 76, 25]],
    suelo: true,
  },
  pressBanca: {
    c: [24, 50, 7],
    l: [[31, 52, 72, 54], [36, 52, 38, 36, 36, 26], [36, 52, 52, 36, 54, 26],
        [72, 54, 76, 68, 70, 78]],
    p: [[22, 26, 68, 26], [22, 21, 22, 31], [68, 21, 68, 31], [28, 58, 78, 58]],
    suelo: true,
  },
  remo: {
    c: [30, 32, 7],
    l: [[36, 35, 70, 46], [40, 37, 38, 54, 40, 66], [70, 46, 74, 62, 72, 82], [40, 66, 38, 84]],
    p: [[36, 60, 44, 60], [34, 56, 34, 64], [46, 56, 46, 64]],
    suelo: true,
  },
  jalon: {
    c: [50, 33, 7],
    l: [[50, 40, 50, 60], [50, 42, 39, 27, 36, 15], [50, 42, 61, 27, 64, 15],
        [50, 60, 44, 74, 58, 80], [50, 60, 56, 74, 66, 76]],
    p: [[22, 15, 78, 15], [22, 10, 22, 20], [78, 10, 78, 20]],
  },
  bisagra: {
    c: [28, 31, 7],
    l: [[34, 35, 62, 45], [38, 37, 40, 62], [62, 45, 67, 64, 64, 84]],
    p: [[31, 62, 49, 62], [31, 57, 31, 67], [49, 57, 49, 67]],
    suelo: true,
  },
  puente: {
    c: [22, 62, 7],
    l: [[29, 62, 48, 50, 64, 62], [64, 62, 66, 80], [29, 62, 26, 78]],
    suelo: true,
  },
  salto: {
    c: [50, 16, 7],
    l: [[50, 23, 50, 44], [50, 26, 36, 18, 32, 8], [50, 26, 64, 18, 68, 8],
        [50, 44, 42, 58, 44, 70], [50, 44, 58, 58, 56, 70]],
    p: [[36, 78, 64, 78]],
    suelo: true,
    flecha: [50, 74, 50, 56],
  },
  cuadrupedia: {
    c: [26, 44, 7],
    l: [[32, 47, 68, 50], [36, 48, 34, 76], [68, 50, 70, 76], [32, 46, 12, 34], [68, 50, 86, 36]],
    suelo: true,
  },
  bocaArriba: {
    c: [22, 70, 7],
    l: [[29, 71, 62, 71], [36, 70, 33, 47], [62, 71, 61, 52, 71, 47], [62, 71, 85, 75], [36, 70, 17, 63]],
    suelo: true,
  },
  talones: {
    c: [50, 22, 7],
    l: [[50, 29, 50, 54], [50, 32, 40, 44, 38, 54], [50, 32, 60, 44, 62, 54],
        [50, 54, 46, 70, 46, 80], [50, 54, 54, 70, 54, 80]],
    p: [[40, 80, 60, 80]],
    suelo: true,
    flecha: [72, 74, 72, 58],
  },
  fondos: {
    c: [40, 31, 7],
    l: [[40, 38, 47, 58], [40, 40, 31, 51, 33, 62], [47, 58, 70, 62, 77, 82]],
    p: [[22, 62, 44, 62], [24, 62, 24, 80], [42, 62, 42, 80]],
    suelo: true,
  },
  escalador: {
    c: [24, 46, 7],
    l: [[31, 49, 74, 62], [32, 50, 30, 76], [74, 62, 80, 78], [56, 57, 46, 74]],
    suelo: true,
  },
  rotacion: {
    c: [46, 24, 7],
    l: [[46, 31, 46, 58], [46, 34, 58, 35, 69, 40], [46, 35, 57, 43, 69, 40],
        [46, 58, 38, 82], [46, 58, 54, 82]],
    p: [[69, 40, 87, 33], [88, 20, 88, 50]],
    suelo: true,
    flecha: [80, 47, 68, 47],
  },
  hombroPalo: {
    c: [50, 26, 7],
    l: [[50, 33, 50, 58], [50, 36, 32, 22, 26, 16], [50, 36, 68, 22, 74, 16],
        [50, 58, 44, 82], [50, 58, 56, 82]],
    p: [[20, 16, 80, 16]],
    suelo: true,
  },
  estiraPie: {
    c: [34, 34, 7],
    l: [[40, 37, 56, 48], [42, 39, 46, 62, 44, 74], [56, 48, 62, 66, 60, 82], [44, 74, 42, 82]],
    suelo: true,
  },
  estiraPiso: {
    c: [20, 58, 7],
    l: [[27, 60, 54, 64], [54, 64, 78, 60], [30, 62, 44, 78], [54, 64, 56, 80]],
    suelo: true,
  },
  caminar: {
    c: [50, 22, 7],
    l: [[50, 29, 50, 52], [50, 32, 38, 42, 34, 32], [50, 32, 62, 42, 66, 52],
        [50, 52, 38, 66, 34, 82], [50, 52, 62, 68, 66, 82]],
    suelo: true,
    flecha: [22, 46, 34, 46],
  },
  cuerda: {
    c: [50, 22, 7],
    l: [[50, 29, 50, 52], [50, 32, 34, 40, 30, 48], [50, 32, 66, 40, 70, 48],
        [50, 52, 44, 66, 46, 76], [50, 52, 56, 66, 54, 76]],
    p: [[30, 48, 18, 66, 50, 84, 82, 66, 70, 48]],
    suelo: true,
  },
  bicicleta: {
    c: [42, 22, 7],
    l: [[42, 29, 48, 48], [42, 32, 56, 38, 66, 42], [48, 48, 40, 58, 44, 68], [48, 48, 54, 60, 52, 70]],
    p: [[30, 70, 44, 70, 44, 84], [66, 42, 66, 56]],
    circulos: [[30, 74, 10], [66, 74, 10]],
    suelo: true,
  },
  step: {
    c: [46, 20, 7],
    l: [[46, 27, 48, 50], [46, 30, 34, 40, 32, 50], [46, 30, 58, 40, 60, 50],
        [48, 50, 64, 58, 66, 70], [48, 50, 40, 66, 38, 84]],
    p: [[58, 70, 88, 70], [58, 70, 58, 84], [88, 70, 88, 84]],
    suelo: true,
  },
  pared: {
    c: [40, 28, 7],
    l: [[38, 35, 35, 58], [35, 58, 66, 59], [66, 59, 66, 84], [39, 40, 54, 45]],
    p: [[29, 12, 29, 86]],
    suelo: true,
  },
  balon: {
    c: [46, 24, 7],
    l: [[46, 31, 46, 56], [46, 34, 58, 26, 68, 22], [46, 34, 36, 30, 30, 26],
        [46, 56, 38, 80], [46, 56, 56, 80]],
    circulos: [[76, 18, 8]],
    suelo: true,
    flecha: [64, 14, 78, 8],
  },
};

// Cada ejercicio apunta a la pose que mejor representa su movimiento.
const MAPA = {
  em01: 'lagartija', em02: 'lagartija', em03: 'lagartija', em04: 'fondos',
  em05: 'pressBanca', em06: 'pressBanca', em07: 'press', em08: 'press', em09: 'fondos',
  ja01: 'remo', ja02: 'remo', ja03: 'jalon', ja04: 'jalon', ja05: 'remo',
  ja06: 'remo', ja07: 'rotacion', ja08: 'bisagra',
  pi01: 'sentadilla', pi02: 'zancada', pi03: 'zancada', pi04: 'sentadilla',
  pi05: 'sentadilla', pi06: 'sentadilla', pi07: 'step', pi08: 'pared',
  po01: 'puente', po02: 'puente', po03: 'bisagra', po04: 'puente',
  po05: 'puente', po06: 'talones',
  co01: 'plancha', co02: 'planchaLateral', co03: 'bocaArriba', co04: 'cuadrupedia',
  co05: 'rotacion', co06: 'jalon', co07: 'cuadrupedia',
  pt01: 'step', pt02: 'salto', pt03: 'salto', pt04: 'salto', pt05: 'salto', pt06: 'balon',
  ca01: 'caminar', ca02: 'cuerda', ca03: 'salto', ca04: 'bicicleta', ca05: 'escalador',
  mo01: 'pared', mo02: 'zancada', mo03: 'cuadrupedia', mo04: 'estiraPiso',
  mo05: 'hombroPalo', mo06: 'estiraPie',
};

const polilinea = (nums) => nums.reduce((s, n, i) => s + (i % 2 ? ',' + n : (i ? ' ' : '') + n), '');

export function FiguraEjercicio({ id, size = 76, tono = 'var(--cobalto)', fondo = 'var(--cobalto-lavado)' }) {
  const pose = POSES[MAPA[id]] || POSES.sentadilla;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true"
      style={{ display: 'block', borderRadius: 10, background: fondo, flexShrink: 0 }}>
      {pose.suelo && <line x1="10" y1="88" x2="90" y2="88" stroke={tono} strokeWidth="2.5"
        strokeLinecap="round" opacity=".28" />}
      {(pose.p || []).map((n, i) => (
        <polyline key={'p' + i} points={polilinea(n)} fill="none" stroke={tono}
          strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity=".42" />
      ))}
      {(pose.circulos || []).map(([cx, cy, r], i) => (
        <circle key={'o' + i} cx={cx} cy={cy} r={r} fill="none" stroke={tono}
          strokeWidth="3" opacity=".42" />
      ))}
      <circle cx={pose.c[0]} cy={pose.c[1]} r={pose.c[2]} fill={tono} />
      {pose.l.map((n, i) => (
        <polyline key={'l' + i} points={polilinea(n)} fill="none" stroke={tono}
          strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {pose.flecha && (() => {
        const [x1, y1, x2, y2] = pose.flecha;
        const a = Math.atan2(y2 - y1, x2 - x1);
        const p = (ang) => `${x2 - 8 * Math.cos(a + ang)},${y2 - 8 * Math.sin(a + ang)}`;
        return (<g stroke={tono} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".75">
          <line x1={x1} y1={y1} x2={x2} y2={y2} />
          <polyline points={`${p(0.5)} ${x2},${y2} ${p(-0.5)}`} />
        </g>);
      })()}
    </svg>
  );
}

export const posesDisponibles = () => Object.keys(POSES);
export const poseDe = (id) => MAPA[id];
