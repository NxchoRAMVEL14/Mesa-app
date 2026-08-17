// Catálogo de ejercicios y plantillas de rutina.
// Los valores MET provienen del Compendium of Physical Activities
// (Ainsworth y cols.), la referencia estándar para estimar el gasto
// energético de una actividad. Son promedios poblacionales: sirven para
// orientar, no para medir con precisión lo que gasta una persona concreta.

// patron: empuje · jalon · pierna · posterior · core · potencia · movilidad · cardio
// lugares: 'casa' y/o 'gym'
const e = (id, nombre, patron, lugares, equipo, series, reps, nota) =>
  ({ id, nombre, patron, lugares, equipo, series, reps, nota });

export const EJERCICIOS = [
  // ── Empuje ──
  e('em01', 'Lagartijas', 'empuje', ['casa', 'gym'], 'ninguno', 3, '8–15', 'Cuerpo en línea recta, codos a 45°'),
  e('em02', 'Lagartijas inclinadas en silla', 'empuje', ['casa'], 'ninguno', 3, '10–15', 'Manos elevadas: más fácil que en el piso'),
  e('em03', 'Lagartijas con pies elevados', 'empuje', ['casa', 'gym'], 'ninguno', 3, '8–12', 'Pies en una silla: carga más el hombro'),
  e('em04', 'Fondos entre sillas', 'empuje', ['casa'], 'ninguno', 3, '8–12', 'Baja hasta que el codo forme 90°'),
  e('em05', 'Press de banca con barra', 'empuje', ['gym'], 'barra', 4, '6–10', 'Omóplatos juntos y pies firmes'),
  e('em06', 'Press inclinado con mancuernas', 'empuje', ['gym'], 'mancuernas', 3, '8–12', 'Banco a 30–45°'),
  e('em07', 'Press militar de pie', 'empuje', ['gym'], 'barra', 3, '6–10', 'Aprieta glúteo y abdomen para no arquear'),
  e('em08', 'Press de hombro con mancuernas', 'empuje', ['casa', 'gym'], 'mancuernas', 3, '8–12', 'Sirve con dos garrafones de agua en casa'),
  e('em09', 'Fondos en paralelas', 'empuje', ['gym'], 'ninguno', 3, '6–12', 'Inclínate al frente para el pecho'),

  // ── Jalón ──
  e('ja01', 'Remo con mancuerna a una mano', 'jalon', ['casa', 'gym'], 'mancuernas', 3, '10–12', 'Apoya la mano libre, espalda plana'),
  e('ja02', 'Remo invertido bajo una mesa', 'jalon', ['casa'], 'ninguno', 3, '8–12', 'Mesa firme, cuerpo recto'),
  e('ja03', 'Dominadas', 'jalon', ['gym'], 'barra', 3, '4–10', 'Si no salen, usa liga de asistencia'),
  e('ja04', 'Jalón al pecho en polea', 'jalon', ['gym'], 'máquina', 3, '10–12', 'Lleva la barra al pecho, no a la nuca'),
  e('ja05', 'Remo sentado en polea', 'jalon', ['gym'], 'máquina', 3, '10–12', 'Junta los omóplatos al final'),
  e('ja06', 'Remo con liga', 'jalon', ['casa'], 'liga', 3, '12–15', 'Ancla la liga en una puerta'),
  e('ja07', 'Face pull con liga', 'jalon', ['casa', 'gym'], 'liga', 3, '15–20', 'Excelente para hombros de voleibolista'),
  e('ja08', 'Peso muerto con barra', 'jalon', ['gym'], 'barra', 4, '5–8', 'Espalda neutra, empuja el piso'),

  // ── Pierna ──
  e('pi01', 'Sentadilla libre', 'pierna', ['casa', 'gym'], 'ninguno', 3, '12–20', 'Rodillas siguen la dirección de los pies'),
  e('pi02', 'Sentadilla búlgara', 'pierna', ['casa', 'gym'], 'ninguno', 3, '8–12', 'Pie trasero en una silla. Una pierna a la vez'),
  e('pi03', 'Zancadas caminando', 'pierna', ['casa', 'gym'], 'ninguno', 3, '10–14', 'Paso largo, torso erguido'),
  e('pi04', 'Sentadilla con barra', 'pierna', ['gym'], 'barra', 4, '6–10', 'Baja hasta donde controles la espalda'),
  e('pi05', 'Prensa de piernas', 'pierna', ['gym'], 'máquina', 3, '10–15', 'No bloquees la rodilla al final'),
  e('pi06', 'Sentadilla goblet', 'pierna', ['casa', 'gym'], 'mancuernas', 3, '10–15', 'Peso al pecho, ayuda a mantener el torso'),
  e('pi07', 'Step-up en banco', 'pierna', ['casa', 'gym'], 'ninguno', 3, '10–12', 'Empuja con la pierna de arriba'),
  e('pi08', 'Sentadilla isométrica en pared', 'pierna', ['casa'], 'ninguno', 3, '30–45 s', 'Muslos paralelos al piso'),

  // ── Cadena posterior ──
  e('po01', 'Puente de glúteo', 'posterior', ['casa', 'gym'], 'ninguno', 3, '12–20', 'Aprieta arriba dos segundos'),
  e('po02', 'Puente a una pierna', 'posterior', ['casa'], 'ninguno', 3, '10–12', 'Cadera nivelada, sin girar'),
  e('po03', 'Peso muerto rumano con mancuernas', 'posterior', ['casa', 'gym'], 'mancuernas', 3, '10–12', 'Cadera atrás, rodilla casi recta'),
  e('po04', 'Curl femoral en máquina', 'posterior', ['gym'], 'máquina', 3, '10–15', 'Control en la bajada'),
  e('po05', 'Hip thrust con barra', 'posterior', ['gym'], 'barra', 3, '8–12', 'Espalda alta apoyada en banco'),
  e('po06', 'Elevación de talones', 'posterior', ['casa', 'gym'], 'ninguno', 3, '15–25', 'Clave para el tobillo del voleibolista'),

  // ── Core ──
  e('co01', 'Plancha frontal', 'core', ['casa', 'gym'], 'ninguno', 3, '30–60 s', 'Costillas abajo, glúteo apretado'),
  e('co02', 'Plancha lateral', 'core', ['casa', 'gym'], 'ninguno', 3, '20–40 s', 'Cada lado. Cadera alta'),
  e('co03', 'Dead bug', 'core', ['casa', 'gym'], 'ninguno', 3, '8–12', 'Espalda baja pegada al piso'),
  e('co04', 'Bird dog', 'core', ['casa', 'gym'], 'ninguno', 3, '8–12', 'Brazo y pierna opuestos, sin girar la cadera'),
  e('co05', 'Pallof press con liga', 'core', ['casa', 'gym'], 'liga', 3, '10–12', 'Resiste la rotación. Cada lado'),
  e('co06', 'Elevación de piernas colgado', 'core', ['gym'], 'barra', 3, '8–12', 'Sin balancearte'),
  e('co07', 'Rueda abdominal', 'core', ['casa', 'gym'], 'ninguno', 3, '6–10', 'Sólo hasta donde no se arquee la espalda'),

  // ── Potencia (específico de voleibol) ──
  e('pt01', 'Salto al cajón', 'potencia', ['casa', 'gym'], 'ninguno', 4, '5', 'Baja escalonado, no saltando'),
  e('pt02', 'Salto vertical con contramovimiento', 'potencia', ['casa', 'gym'], 'ninguno', 4, '5', 'Máxima altura, descanso completo entre series'),
  e('pt03', 'Salto en profundidad', 'potencia', ['gym'], 'ninguno', 3, '5', 'Avanzado. Contacto con el piso lo más corto posible'),
  e('pt04', 'Saltos laterales', 'potencia', ['casa', 'gym'], 'ninguno', 3, '8', 'Imita el desplazamiento en la red'),
  e('pt05', 'Sentadilla con salto', 'potencia', ['casa', 'gym'], 'ninguno', 3, '6–8', 'Aterriza suave, rodillas alineadas'),
  e('pt06', 'Lanzamiento de balón contra la pared', 'potencia', ['casa', 'gym'], 'ninguno', 3, '8–10', 'Trabaja la cadena del remate'),

  // ── Cardio ──
  e('ca01', 'Caminata rápida', 'cardio', ['casa', 'gym'], 'ninguno', 1, '20–40 min', 'Ritmo en que puedes hablar pero no cantar'),
  e('ca02', 'Cuerda para saltar', 'cardio', ['casa', 'gym'], 'ninguno', 5, '1–2 min', 'Descansa 1 min entre series'),
  e('ca03', 'Burpees', 'cardio', ['casa', 'gym'], 'ninguno', 4, '8–12', 'Baja el ritmo antes que la técnica'),
  e('ca04', 'Bicicleta estática', 'cardio', ['gym'], 'máquina', 1, '20–30 min', 'Resistencia moderada y constante'),
  e('ca05', 'Escaladores', 'cardio', ['casa', 'gym'], 'ninguno', 4, '20–30 s', 'Cadera baja, ritmo sostenido'),

  // ── Movilidad ──
  e('mo01', 'Movilidad de tobillo en pared', 'movilidad', ['casa', 'gym'], 'ninguno', 2, '10 por lado', 'Rodilla toca la pared sin despegar el talón'),
  e('mo02', 'Estiramiento de flexores de cadera', 'movilidad', ['casa', 'gym'], 'ninguno', 2, '30 s por lado', 'Mete la pelvis, no arquees la espalda'),
  e('mo03', 'Gato-camello', 'movilidad', ['casa', 'gym'], 'ninguno', 2, '10', 'Movimiento lento, vértebra por vértebra'),
  e('mo04', 'Rotación torácica de rodillas', 'movilidad', ['casa', 'gym'], 'ninguno', 2, '8 por lado', 'Sigue la mano con la mirada'),
  e('mo05', 'Dislocaciones de hombro con palo', 'movilidad', ['casa', 'gym'], 'ninguno', 2, '10', 'Agarre ancho, brazos rectos'),
  e('mo06', 'Estiramiento de isquiotibiales', 'movilidad', ['casa', 'gym'], 'ninguno', 2, '30 s por lado', 'Espalda recta, dobla desde la cadera'),
];

export const PATRONES = {
  empuje: 'Empuje', jalon: 'Jalón', pierna: 'Pierna', posterior: 'Cadena posterior',
  core: 'Core', potencia: 'Potencia', cardio: 'Cardio', movilidad: 'Movilidad',
};

export const LUGARES = [
  { k: 'casa', nombre: 'En casa', desc: 'Peso corporal, ligas y mancuernas' },
  { k: 'gym', nombre: 'En el gimnasio', desc: 'Barra, máquinas y peso libre' },
];

// Plantillas de sesión. Cada objetivo define qué patrones entrena cada día
// y cuántos ejercicios de cada uno, según el tiempo disponible.
export const OBJETIVOS = [
  {
    k: 'general', nombre: 'Salud general', desc: 'Cuerpo completo, equilibrado',
    sesiones: [
      { titulo: 'Cuerpo completo A', patrones: ['pierna', 'empuje', 'jalon', 'core'] },
      { titulo: 'Cuerpo completo B', patrones: ['posterior', 'jalon', 'empuje', 'core'] },
      { titulo: 'Cuerpo completo C', patrones: ['pierna', 'empuje', 'jalon', 'cardio'] },
    ],
  },
  {
    k: 'voleibol', nombre: 'Rendimiento en voleibol', desc: 'Salto, hombro y tobillo',
    sesiones: [
      { titulo: 'Potencia y pierna', patrones: ['potencia', 'pierna', 'posterior', 'core'] },
      { titulo: 'Hombro y estabilidad', patrones: ['jalon', 'empuje', 'core', 'movilidad'] },
      { titulo: 'Salto y tobillo', patrones: ['potencia', 'posterior', 'pierna', 'movilidad'] },
    ],
  },
  {
    k: 'fuerza', nombre: 'Fuerza', desc: 'Cargas más altas, menos repeticiones',
    sesiones: [
      { titulo: 'Tren inferior', patrones: ['pierna', 'posterior', 'pierna', 'core'] },
      { titulo: 'Empuje', patrones: ['empuje', 'empuje', 'core', 'core'] },
      { titulo: 'Jalón', patrones: ['jalon', 'jalon', 'posterior', 'core'] },
    ],
  },
  {
    k: 'movilidad', nombre: 'Movilidad y mantenimiento', desc: 'Sesiones cortas y suaves',
    sesiones: [
      { titulo: 'Movilidad general', patrones: ['movilidad', 'movilidad', 'core', 'movilidad'] },
      { titulo: 'Cadera y tobillo', patrones: ['movilidad', 'posterior', 'core', 'movilidad'] },
      { titulo: 'Espalda y hombro', patrones: ['movilidad', 'jalon', 'core', 'movilidad'] },
    ],
  },
];

// Cuántos ejercicios caben según el tiempo, y descanso sugerido.
export const DURACIONES = [
  { min: 30, ejercicios: 4, desc: 'Sesión corta' },
  { min: 45, ejercicios: 5, desc: 'Sesión estándar' },
  { min: 60, ejercicios: 7, desc: 'Sesión completa' },
];
