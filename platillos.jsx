import React from 'react';

// Ilustraciones de los platillos. Un dibujo por familia de platillo, no uno
// por receta: los 73 platillos del recetario comparten 38 dibujos según su
// forma de servirse. Son referencias visuales para reconocer el platillo de un
// vistazo, no fotografías del resultado.

const C = {
  maiz: '#E8C170', masa: '#D9A05B', pan: '#C98B4B', rojo: '#C0453A',
  verde: '#4E9A6A', verdeClaro: '#7CBF92', queso: '#F2E3A8', frijol: '#7A4A3A',
  carne: '#A85A44', yema: '#E9AF34', claro: '#FBF7EE', caldo: '#D98E3C',
  agua: '#7FA8DC', plato: '#FFFFFF', linea: '#B9C0D4', morado: '#8E5B8E',
  naranja: '#E08A3C', crema: '#F5EBD8', gris: '#9AA3B8',
};

// Los helpers separan la key del resto de los atributos: React exige que la
// key se pase directo al elemento y no dentro de un objeto esparcido.
const partir = (extra) => { const { key, ...resto } = extra || {}; return [key, resto]; };
const c = (cx, cy, r, fill, extra) => { const [k, x] = partir(extra); return <circle key={k} cx={cx} cy={cy} r={r} fill={fill} {...x} />; };
const el = (cx, cy, rx, ry, fill, extra) => { const [k, x] = partir(extra); return <ellipse key={k} cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} {...x} />; };
const rc = (x0, y, w, h, r, fill, extra) => { const [k, x] = partir(extra); return <rect key={k} x={x0} y={y} width={w} height={h} rx={r} fill={fill} {...x} />; };
const pa = (d, fill, extra) => { const [k, x] = partir(extra); return <path key={k} d={d} fill={fill} {...x} />; };
const ln = (x1, y1, x2, y2, stroke, sw = 3, k) =>
  <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />;

// Plato redondo visto desde arriba, base de muchos dibujos.
const platoBase = (r = 40) => [
  c(50, 52, r, C.plato, { key: 'p1', stroke: C.linea, strokeWidth: 2 }),
  c(50, 52, r - 7, 'none', { key: 'p2', stroke: C.linea, strokeWidth: 1.4, opacity: 0.6 }),
];

// Tazón visto de frente.
const tazon = (fill) => [
  pa('M18 44 Q18 82 50 82 Q82 82 82 44 Z', C.plato, { key: 't1', stroke: C.linea, strokeWidth: 2 }),
  pa('M22 48 Q24 76 50 76 Q76 76 78 48 Z', fill, { key: 't2' }),
];

// Vapor para platillos calientes.
const vapor = (xs = [38, 50, 62]) => xs.map((x, i) => (
  <path key={'v' + i} d={`M${x} ${20 + (i % 2) * 4} q5 -7 0 -13`} fill="none"
    stroke={C.gris} strokeWidth="2.6" strokeLinecap="round" opacity=".5" />
));

const D = {
  huevos: () => [...platoBase(), c(38, 50, 13, C.claro), c(38, 50, 5.5, C.yema),
    c(60, 56, 13, C.claro), c(60, 56, 5.5, C.yema),
    ln(30, 72, 44, 70, C.verde, 3.4), ln(52, 74, 66, 72, C.rojo, 3.4)],

  omelette: () => [...platoBase(), pa('M24 58 Q28 34 50 34 Q72 34 76 58 Q50 68 24 58 Z', C.yema),
    ln(36, 46, 46, 44, C.verde, 3.4), ln(54, 48, 64, 46, C.verde, 3.4)],

  bowlAvena: () => [...tazon(C.crema), c(40, 58, 5, C.masa), c(56, 62, 5, C.masa),
    el(48, 54, 8, 3.5, C.yema), ...vapor([42, 54])],

  yogur: () => [rc(32, 26, 36, 56, 5, C.plato, { stroke: C.linea, strokeWidth: 2 }),
    rc(35, 56, 30, 23, 3, C.claro), rc(35, 44, 30, 13, 0, C.masa),
    c(43, 37, 5, C.rojo), c(56, 34, 5, C.rojo), c(50, 42, 4, C.verdeClaro)],

  chilaquiles: () => [...platoBase(), el(50, 54, 27, 20, C.verde, { opacity: 0.4 }),
    pa('M28 46 L46 41 L38 60 Z', C.maiz, { stroke: C.masa, strokeWidth: 1.6 }),
    pa('M45 39 L65 45 L53 58 Z', C.maiz, { stroke: C.masa, strokeWidth: 1.6 }),
    pa('M36 60 L58 61 L46 74 Z', C.maiz, { stroke: C.masa, strokeWidth: 1.6 }),
    c(62, 66, 5, C.crema), c(30, 62, 4, C.crema)],

  molletes: () => [rc(16, 40, 32, 30, 8, C.pan), rc(52, 40, 32, 30, 8, C.pan),
    rc(20, 44, 24, 20, 6, C.frijol), rc(56, 44, 24, 20, 6, C.frijol),
    rc(23, 46, 18, 14, 4, C.queso), rc(59, 46, 18, 14, 4, C.queso),
    c(30, 52, 3, C.rojo), c(66, 54, 3, C.rojo), c(36, 56, 3, C.verde)],

  quesadilla: () => [pa('M18 68 A34 34 0 0 1 82 68 Z', C.maiz),
    pa('M18 68 A34 34 0 0 1 82 68 Z', 'none', { stroke: C.masa, strokeWidth: 2 }),
    pa('M32 66 q8 -14 18 -4 q10 -10 18 4 Z', C.queso), ln(28, 58, 36, 52, C.masa, 2.4),
    ln(64, 58, 72, 52, C.masa, 2.4)],

  licuado: () => [pa('M32 22 L36 82 L64 82 L68 22 Z', C.plato, { stroke: C.linea, strokeWidth: 2 }),
    pa('M34 34 L37 78 L63 78 L66 34 Z', C.masa),
    rc(56, 12, 5, 26, 2.5, C.rojo, { transform: 'rotate(12 58 25)' }),
    el(50, 34, 16, 4, C.crema)],

  tostada: () => [...platoBase(), c(50, 52, 27, C.maiz), c(50, 52, 27, 'none', { stroke: C.masa, strokeWidth: 2 }),
    c(50, 52, 20, C.frijol), el(50, 48, 16, 7, C.verdeClaro), c(44, 56, 5, C.claro),
    c(58, 58, 4.5, C.rojo), c(50, 62, 4, C.queso)],

  enrollado: () => [...platoBase(), rc(24, 38, 52, 12, 6, C.maiz), rc(24, 54, 52, 12, 6, C.maiz),
    el(50, 44, 24, 5, C.verde, { opacity: 0.5 }), el(50, 60, 24, 5, C.verde, { opacity: 0.5 }),
    c(36, 44, 3.4, C.crema), c(62, 60, 3.4, C.crema)],

  hotcakes: () => [...platoBase(34), el(50, 66, 26, 8, C.masa), el(50, 56, 26, 8, C.maiz),
    el(50, 46, 26, 8, C.masa), el(50, 38, 26, 8, C.maiz), c(50, 34, 6, C.yema),
    pa('M40 36 q10 8 20 0', 'none', { stroke: C.caldo, strokeWidth: 3, strokeLinecap: 'round' })],

  torta: () => [pa('M14 46 Q50 24 86 46 L86 54 Q50 62 14 54 Z', C.pan),
    rc(14, 54, 72, 8, 3, C.claro), pa('M14 62 Q50 78 86 62 L86 66 Q50 82 14 66 Z', C.pan),
    ln(20, 58, 80, 58, C.verde, 3.4), c(34, 58, 4, C.rojo), c(58, 58, 4, C.carne)],

  sandwich: () => [pa('M16 72 L50 26 L84 72 Z', C.pan),
    pa('M26 66 L50 34 L74 66 Z', C.claro), ln(32, 60, 68, 60, C.verde, 4),
    ln(36, 52, 64, 52, C.carne, 4), ln(42, 44, 58, 44, C.queso, 4)],

  tacos: () => [[16, 37, 58].map((x, i) => (
    <g key={'t' + i} transform={`translate(0,${i === 1 ? -7 : 0})`}>
      <path d={`M${x} 76 A13 13 0 0 1 ${x + 26} 76 Z`} fill={C.maiz} />
      <path d={`M${x + 4} 74 q9 -11 18 0 Z`} fill={C.carne} />
      <circle cx={x + 13} cy={70} r="2.6" fill={C.verde} />
    </g>
  )), ln(12, 82, 88, 82, C.linea, 2.4, 'suelo')].flat(),

  gordita: () => [...platoBase(), el(50, 52, 28, 22, C.masa), el(50, 52, 28, 22, 'none', { stroke: C.pan, strokeWidth: 2 }),
    pa('M30 52 q20 -12 40 0 q-20 8 -40 0 Z', C.frijol), el(50, 44, 14, 4, C.verdeClaro),
    c(50, 60, 5, C.queso)],

  burrito: () => [pa('M22 70 Q26 34 50 32 Q74 34 78 70 Q50 80 22 70 Z', C.crema),
    pa('M30 66 Q34 42 50 40 Q66 42 70 66 Q50 74 30 66 Z', 'none', { stroke: C.masa, strokeWidth: 2, opacity: 0.7 }),
    pa('M34 38 q16 -8 32 0', 'none', { stroke: C.masa, strokeWidth: 2.4 }),
    c(44, 54, 4, C.verde, { opacity: 0.55 }), c(58, 60, 4, C.rojo, { opacity: 0.55 })],

  plato: () => [...platoBase(), el(35, 52, 16, 21, C.crema),
    ...[[30, 44], [38, 48], [32, 58], [40, 62], [35, 52]].map(([x, y], i) => c(x, y, 2.2, C.maiz, { key: 'ar' + i })),
    el(65, 52, 16, 20, C.carne), c(62, 46, 3.6, C.rojo), c(70, 56, 3.4, C.verde),
    c(60, 58, 3.2, C.naranja), ...vapor([44, 58])],

  caldo: () => [...tazon(C.caldo), c(40, 60, 5, C.carne), c(56, 64, 5, C.carne),
    c(60, 54, 4, C.verde), c(44, 70, 4, C.naranja), el(50, 50, 26, 4, C.caldo, { opacity: 0.5 }),
    ...vapor()],

  milanesa: () => [...platoBase(), pa('M22 44 Q34 30 52 34 Q76 38 72 56 Q66 72 44 70 Q22 64 22 44 Z', C.masa),
    ...[[32, 44], [42, 40], [52, 40], [62, 48], [38, 54], [50, 52], [60, 58], [42, 64]]
      .map(([x, y], i) => c(x, y, 2.4, C.pan, { key: 'm' + i })),
    ln(24, 74, 40, 72, C.verde, 3.4), c(64, 72, 6, C.claro)],

  pescado: () => [...platoBase(), pa('M24 52 Q40 33 62 52 Q40 71 24 52 Z', C.crema, { stroke: C.caldo, strokeWidth: 2.6 }),
    pa('M62 52 L79 41 L79 63 Z', C.crema, { stroke: C.caldo, strokeWidth: 2.6 }),
    c(33, 48, 2.8, C.frijol), ln(38, 46, 56, 50, C.caldo, 2),
    ln(38, 58, 56, 54, C.caldo, 2), c(48, 70, 5, C.rojo), ln(27, 67, 39, 70, C.verde, 3.4)],

  albondigas: () => [...tazon(C.rojo),
    ...[[40, 58], [59, 62], [49, 71]].map(([x, y], i) =>
      c(x, y, 8, C.frijol, { key: 'ab' + i, stroke: C.crema, strokeWidth: 1.8 })),
    c(37, 71, 4, C.verde), ...vapor([44, 56])],

  plancha: () => [...platoBase(), pa('M22 40 Q40 32 56 40 Q60 56 46 62 Q26 60 22 40 Z', C.carne),
    ...[[28, 44], [34, 50], [40, 56]].map(([x, y], i) =>
      <line key={'g' + i} x1={x} y1={y} x2={x + 20} y2={y - 6} stroke={C.frijol} strokeWidth="2.4" strokeLinecap="round" />),
    el(66, 62, 12, 8, C.verde), el(64, 46, 9, 6, C.naranja), c(72, 72, 5, C.verdeClaro)],

  chile: () => [...platoBase(), pa('M32 30 Q28 62 48 74 Q68 62 66 34 Q50 26 32 30 Z', C.verde),
    pa('M36 34 Q34 58 48 68 Q62 58 62 36 Q50 32 36 34 Z', C.queso, { opacity: 0.55 }),
    pa('M44 28 q6 -10 12 -2', 'none', { stroke: C.verde, strokeWidth: 4, strokeLinecap: 'round' }),
    el(50, 76, 24, 6, C.rojo, { opacity: 0.6 })],

  camaron: () => [...platoBase(),
    ...[[36, 45], [58, 43], [46, 63]].map(([x, y], i) => (
      <g key={'cm' + i}>
        <path d={`M${x + 9} ${y - 6} a9 9 0 1 0 -1 15`} fill="none" stroke={C.naranja}
          strokeWidth="6.5" strokeLinecap="round" />
        <circle cx={x + 9} cy={y - 6} r="2" fill={C.rojo} />
      </g>)),
    el(70, 66, 11, 7, C.verdeClaro), ln(27, 69, 39, 72, C.verde, 3.4)],

  sopa: () => [...tazon(C.caldo), ...[[34, 58], [46, 62], [58, 58], [40, 70], [56, 70]].map(([x, y], i) =>
    <path key={'f' + i} d={`M${x} ${y} q7 -5 13 1`} fill="none" stroke={C.crema} strokeWidth="3" strokeLinecap="round" />),
    ...vapor()],

  horno: () => [...platoBase(), pa('M24 42 Q38 30 54 38 Q62 52 50 62 Q28 62 24 42 Z', C.masa),
    ln(30, 40, 44, 36, C.pan, 3), c(66, 44, 8, C.crema), c(74, 58, 7, C.crema), c(62, 62, 7, C.crema),
    ln(58, 34, 68, 30, C.verde, 3), ...vapor([40, 52])],

  pasta: () => [...platoBase(), ...[[38, 44], [54, 42], [46, 54], [60, 56], [40, 62]].map(([x, y], i) =>
    <circle key={'e' + i} cx={x} cy={y} r="7" fill="none" stroke={C.maiz} strokeWidth="4" />),
    el(50, 52, 28, 20, C.verde, { opacity: 0.22 }), c(64, 44, 5, C.crema), c(34, 56, 4.5, C.crema)],

  crema: () => [...tazon(C.crema), el(50, 58, 22, 10, C.verdeClaro, { opacity: 0.5 }),
    pa('M34 62 q16 -8 32 0', 'none', { stroke: C.plato, strokeWidth: 3, strokeLinecap: 'round' }),
    c(44, 54, 3, C.verde), c(58, 56, 3, C.verde), ...vapor()],

  manzana: () => [c(38, 56, 22, C.rojo), pa('M38 34 q3 -12 8 -14', 'none', { stroke: C.frijol, strokeWidth: 3, strokeLinecap: 'round' }),
    pa('M40 32 q10 -6 14 2 q-10 5 -14 -2 Z', C.verde),
    rc(62, 44, 26, 26, 5, C.masa), pa('M66 52 q9 -6 18 0 q-9 8 -18 0 Z', C.pan)],

  nueces: () => [...[[36, 58, 10], [56, 54, 9], [46, 68, 9], [64, 68, 8], [30, 70, 7]].map(([x, y, r], i) => (
    <g key={'n' + i}>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.8} fill={i % 2 ? C.masa : C.pan} />
      <path d={`M${x - r * 0.6} ${y} q${r * 0.6} -${r * 0.5} ${r * 1.2} 0`} fill="none" stroke={C.frijol} strokeWidth="1.8" opacity=".6" />
    </g>)),
  ],

  bastones: () => [rc(20, 34, 9, 44, 4, C.naranja), rc(33, 30, 9, 48, 4, C.naranja),
    rc(46, 36, 9, 42, 4, C.verdeClaro), rc(59, 32, 9, 46, 4, C.verdeClaro),
    pa('M70 50 Q70 78 79 78 Q88 78 88 50 Z', C.plato, { stroke: C.linea, strokeWidth: 1.8 }),
    pa('M73 54 Q73 74 79 74 Q85 74 85 54 Z', C.crema)],

  huevoCocido: () => [...platoBase(), el(36, 50, 15, 18, C.claro), c(36, 52, 7, C.yema),
    el(60, 58, 13, 16, C.claro), c(60, 60, 6, C.yema),
    c(64, 40, 5, C.rojo), c(74, 48, 4.5, C.rojo)],

  elote: () => [el(50, 50, 15, 30, C.maiz),
    ...Array.from({ length: 5 }, (_, r) => Array.from({ length: 3 }, (_, k) =>
      c(42 + k * 8, 30 + r * 11, 3, C.yema, { key: `k${r}${k}` }))).flat(),
    pa('M50 80 L44 92 L56 92 Z', C.verde), ln(64, 34, 74, 28, C.verdeClaro, 4)],

  palomitas: () => [pa('M30 42 L36 84 L64 84 L70 42 Z', C.plato, { stroke: C.rojo, strokeWidth: 2.4 }),
    ln(40, 46, 44, 82, C.rojo, 2.4), ln(52, 44, 52, 84, C.rojo, 2.4), ln(62, 46, 58, 82, C.rojo, 2.4),
    ...[[38, 34], [50, 28], [62, 34], [44, 40], [56, 40], [32, 44], [68, 42]].map(([x, y], i) => (
      <g key={'p' + i}>
        <circle cx={x} cy={y} r="6" fill={C.claro} /><circle cx={x - 3} cy={y - 3} r="4" fill={C.crema} />
        <circle cx={x + 3} cy={y - 2} r="3.5" fill={C.claro} />
      </g>))],

  bebida: () => [pa('M32 24 L36 82 L64 82 L68 24 Z', C.plato, { stroke: C.linea, strokeWidth: 2 }),
    pa('M34 40 L37 78 L63 78 L66 40 Z', C.morado, { opacity: 0.75 }),
    el(50, 40, 16, 4, C.morado, { opacity: 0.4 }),
    c(44, 52, 2.4, C.plato, { opacity: 0.7 }), c(56, 62, 2, C.plato, { opacity: 0.7 }),
    rc(54, 14, 5, 28, 2.5, C.verde, { transform: 'rotate(10 56 28)' })],

  pizza: () => [...platoBase(), c(50, 52, 28, C.maiz), c(50, 52, 23, C.rojo, { opacity: 0.7 }),
    c(42, 46, 5, C.queso), c(58, 48, 5, C.queso), c(50, 60, 5, C.queso),
    c(60, 60, 4, C.verde), c(40, 58, 4, C.verde),
    ln(50, 24, 50, 80, C.masa, 1.8), ln(22, 52, 78, 52, C.masa, 1.8)],

  ensalada: () => [...tazon(C.verdeClaro),
    ...[[36, 56], [50, 52], [62, 58], [42, 66], [58, 68]].map(([x, y], i) =>
      pa(`M${x} ${y} q7 -8 13 0 q-6 7 -13 0 Z`, i % 2 ? C.verde : C.verdeClaro, { key: 'h' + i })),
    c(46, 60, 3.4, C.rojo), c(58, 63, 3.4, C.rojo), c(38, 68, 3, C.naranja)],

  fruta: () => [...platoBase(), pa('M28 46 A12 12 0 0 1 52 46 L52 58 A12 12 0 0 1 28 58 Z', C.naranja),
    c(64, 46, 10, C.rojo), c(44, 66, 9, C.verdeClaro), c(66, 64, 8, C.yema),
    ln(64, 34, 64, 38, C.verde, 3)],

  croquetas: () => [...platoBase(), el(38, 46, 14, 10, C.masa), el(60, 50, 13, 9, C.masa),
    el(46, 64, 13, 9, C.masa), el(38, 46, 14, 10, 'none', { stroke: C.pan, strokeWidth: 2 }),
    el(60, 50, 13, 9, 'none', { stroke: C.pan, strokeWidth: 2 }),
    el(46, 64, 13, 9, 'none', { stroke: C.pan, strokeWidth: 2 }),
    el(66, 68, 11, 6, C.verde, { opacity: 0.6 })],
};

// Cada receta apunta a la familia de platillo que le corresponde.
const MAPA = {
  d01: 'huevos', d02: 'bowlAvena', d03: 'chilaquiles', d04: 'molletes', d05: 'omelette',
  d06: 'yogur', d07: 'quesadilla', d08: 'huevos', d09: 'licuado', d10: 'tostada',
  d11: 'enrollado', d12: 'hotcakes',
  a01: 'torta', a02: 'ensalada', a03: 'quesadilla', a04: 'fruta', a05: 'sandwich',
  a06: 'tacos', a07: 'molletes', a08: 'fruta', a09: 'gordita', a10: 'torta',
  a11: 'ensalada', a12: 'croquetas', a13: 'burrito', a14: 'licuado', a15: 'tostada',
  c01: 'plato', c02: 'plato', c03: 'caldo', c04: 'milanesa', c05: 'pescado',
  c06: 'albondigas', c07: 'caldo', c08: 'plancha', c09: 'chile', c10: 'plato',
  c11: 'tacos', c12: 'plato', c13: 'camaron', c14: 'tacos', c15: 'sopa',
  c16: 'horno', c17: 'plancha', c18: 'ensalada', c19: 'caldo', c20: 'pasta',
  c21: 'pescado', c22: 'plato', c23: 'crema', c24: 'plancha',
  k01: 'manzana', k02: 'nueces', k03: 'bastones', k04: 'yogur', k05: 'huevoCocido',
  k06: 'elote', k07: 'palomitas', k08: 'bastones', k09: 'bebida', k10: 'bowlAvena',
  n01: 'sopa', n02: 'tacos', n03: 'ensalada', n04: 'tostada', n05: 'huevos',
  n06: 'caldo', n07: 'pizza', n08: 'plancha', n09: 'gordita', n10: 'burrito',
  n11: 'crema', n12: 'tacos',
};

// Para recetas propias: se adivina la familia por el nombre, y si no coincide
// nada se usa un plato genérico en lugar de dejar el hueco vacío.
const PISTAS = [
  ['taco', 'tacos'], ['quesadilla', 'quesadilla'], ['sincronizada', 'quesadilla'],
  ['caldo', 'caldo'], ['sopa', 'sopa'], ['pozole', 'caldo'], ['mole de olla', 'caldo'],
  ['crema', 'crema'], ['ensalada', 'ensalada'], ['huevo', 'huevos'], ['omelette', 'omelette'],
  ['avena', 'bowlAvena'], ['yogur', 'yogur'], ['licuado', 'licuado'], ['smoothie', 'licuado'],
  ['agua', 'bebida'], ['torta', 'torta'], ['baguette', 'torta'], ['sándwich', 'sandwich'],
  ['sandwich', 'sandwich'], ['tostada', 'tostada'], ['mollete', 'molletes'],
  ['hot cake', 'hotcakes'], ['pescado', 'pescado'], ['atún', 'pescado'], ['camarón', 'camaron'],
  ['pizza', 'pizza'], ['espagueti', 'pasta'], ['pasta', 'pasta'], ['fideo', 'sopa'],
  ['milanesa', 'milanesa'], ['albóndiga', 'albondigas'], ['chile relleno', 'chile'],
  ['gordita', 'gordita'], ['sope', 'gordita'], ['burrito', 'burrito'], ['wrap', 'burrito'],
  ['elote', 'elote'], ['palomita', 'palomitas'], ['fruta', 'fruta'], ['manzana', 'manzana'],
  ['nuez', 'nueces'], ['almendra', 'nueces'], ['plancha', 'plancha'], ['asado', 'plancha'],
  ['horno', 'horno'], ['enfrijolada', 'enrollado'], ['enchilada', 'enrollado'],
  ['chilaquil', 'chilaquiles'], ['arroz', 'plato'], ['guisad', 'plato'],
];

export const familiaDe = (receta) => {
  if (MAPA[receta.id]) return MAPA[receta.id];
  const n = (receta.nombre || '').toLowerCase();
  const pista = PISTAS.find(([clave]) => n.includes(clave));
  return pista ? pista[1] : 'plato';
};

export function IlustracionPlatillo({ receta, size = 60, radio = 10 }) {
  const familia = familiaDe(receta);
  const dibujo = D[familia] || D.plato;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true"
      style={{ display: 'block', borderRadius: radio, background: 'var(--cal)', flexShrink: 0 }}>
      {dibujo().flat().map((nodo, i) =>
        React.isValidElement(nodo) ? React.cloneElement(nodo, { key: nodo.key ?? 'e' + i }) : nodo)}
    </svg>
  );
}

export const familiasDisponibles = () => Object.keys(D);
