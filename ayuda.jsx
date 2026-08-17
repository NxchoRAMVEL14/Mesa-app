import React, { useState } from 'react';

export const VERSION = '1.2.0';

// ── Manual de usuario ─────────────────────────────────────────────────────
// Se guarda dentro de la app a propósito: un manual en un archivo aparte no
// se consulta nunca. Aquí está a dos toques desde cualquier pantalla.

const MANUAL = [
  {
    t: 'Primeros pasos',
    icono: '◈',
    p: [
      ['Registra a tu familia', 'Entra a **Progreso → Familia** y agrega a cada persona que come en casa. Necesitas nombre, sexo, fecha de nacimiento, peso y estatura. Con esos datos la app calcula cuánta comida necesita cada uno y ajusta el tamaño de las porciones.'],
      ['Quién ve sus números', 'La primera persona de la lista es la dueña de la app: sus metas son las que aparecen en la pantalla Hoy. Las demás cuentan para las porciones y tienen su propio registro de medidas.'],
      ['Genera tu primer menú', 'Ve a **Semana** y toca *Generar menú*. Puedes planear una semana, un mes o un año completo. Todo se puede cambiar después.'],
      ['Instálala en el teléfono', 'Abre la liga en Chrome, menú de tres puntos, *Agregar a pantalla de inicio*. Queda como app independiente y funciona sin internet.'],
    ],
  },
  {
    t: 'El día a día',
    icono: '☀',
    p: [
      ['Marca lo que comes', 'En **Hoy** aparecen los cinco tiempos. Toca el cuadro de la izquierda cuando termines de comer algo. Sólo lo que marcas cuenta para tus totales del día.'],
      ['Toca el platillo para verlo', 'Al tocar el nombre se abre la receta con los ingredientes ya multiplicados por el número de personas que comen. Desde ahí también puedes cambiarlo por otro platillo.'],
      ['Los vasos de agua', 'Toca el vaso número que llevas y se llenan todos los anteriores. Si te equivocas, toca el mismo vaso otra vez para bajar uno. La meta se calcula con 35 ml por kilo de peso.'],
      ['Días pasados y futuros', 'Las flechas de arriba te mueven de día. Puedes registrar algo que olvidaste ayer o revisar qué toca mañana.'],
    ],
  },
  {
    t: 'La tira de la semana',
    icono: '▦',
    p: [
      ['Cómo leerla', 'Siete columnas, una por día. Cinco filas, una por tiempo de comida. Cada cuadrito es una comida: **azul fuerte** significa que ya la comiste, **azul claro** que está planeada y **punteado** que no hay nada asignado.'],
      ['Para qué sirve', 'De un vistazo ves cómo va tu semana sin leer un solo número. Los huecos y los días incompletos saltan a la vista.'],
      ['Cambiar un platillo', 'Toca cualquier cuadrito para abrir esa comida y sustituirla.'],
      ['Variedad', 'Al generar el menú eliges cada cuántos días puede repetirse un platillo: 5 días repite más y simplifica las compras, 20 días da máxima variedad.'],
    ],
  },
  {
    t: 'Súper y despensa',
    icono: '⛬',
    p: [
      ['Las dos pestañas', '**Por comprar** es la lista de la semana. **En despensa** es lo que ya tienes en casa. La lista siempre descuenta la despensa: si tienes la mitad del arroz que pide el menú, sólo te pide la otra mitad.'],
      ['Del carrito a la despensa', 'Ve tachando lo que echas al carrito. Al terminar, el botón *Guardar en la despensa* pasa todas esas cantidades al inventario de una vez.'],
      ['Se descuenta solo', 'Cuando marcas una comida como hecha en Hoy, sus ingredientes bajan de la despensa. Si desmarcas la comida, regresan exactamente lo que se había consumido.'],
      ['Copiar la lista', 'El botón *Copiar* pone la lista completa en el portapapeles, agrupada por pasillo, para pegarla en WhatsApp o donde la necesites.'],
    ],
  },
  {
    t: 'Entrenamiento',
    icono: '⚡',
    p: [
      ['Mi semana', 'Registra los días fijos en que entrenas. Esos días la app **sube tu meta de comida automáticamente**. Si juegas voleibol los martes, el martes te pide más comida que el lunes sin que ajustes nada.'],
      ['Ojo con la actividad del perfil', 'El nivel de actividad de tu perfil debe describir **sólo tu día normal**: trabajo, casa, traslados. Los entrenamientos se suman aparte. Si los cuentas en los dos lados, se contarían doble.'],
      ['Rutina', 'Elige dónde entrenas (casa o gimnasio), tu objetivo, cuántos días y cuánto tiempo tienes. La app arma las sesiones con ejercicios que existan en ese lugar: si eliges casa, nunca te va a pedir una polea. Cada ejercicio trae dibujo, series, repeticiones y una nota de técnica.'],
      ['Bitácora', 'Registra lo que en realidad entrenaste y cómo te sentiste. La app lo cruza con lo que comiste ese día y te avisa si te quedaste corto de comida en un día que entrenaste.'],
    ],
  },
  {
    t: 'Recetario',
    icono: '☰',
    p: [
      ['Busca por ingrediente', 'El buscador encuentra platillos por nombre y también por lo que llevan. Escribe *nopal* y salen todos los que lo usan.'],
      ['Filtra por tiempo', 'Los botones de arriba muestran sólo los platillos aptos para desayuno, almuerzo, comida, colación o cena.'],
      ['Agrega tus recetas', 'El botón *Agregar mi propia receta* guarda las de casa. Anota los ingredientes **por una porción**: la app multiplica según quién coma. Si no conoces el aporte exacto, una aproximación sirve.'],
      ['Sobre los dibujos', 'Las ilustraciones son referencias de la forma del platillo, no fotos del resultado. Sirven para reconocerlo rápido en una lista larga.'],
    ],
  },
  {
    t: 'Progreso y respaldos',
    icono: '◔',
    p: [
      ['Medidas', 'Registra peso, cintura, cadera y pecho cuando quieras. Deja en blanco lo que no midas ese día. La gráfica necesita al menos dos registros para dibujar la tendencia.'],
      ['La tendencia importa más que el número', 'Pesarte siempre a la misma hora y en las mismas condiciones hace que la línea sea útil. El número de un solo día varía por cosas que no tienen que ver con tu progreso.'],
      ['Dónde viven tus datos', 'Todo se guarda **en este dispositivo**, no en un servidor. Nada sale de tu teléfono. Eso también significa que si borras los datos del navegador o desinstalas la app, se pierde.'],
      ['Haz respaldos', 'En **Progreso → Familia** está el botón *Descargar respaldo*. Genera un archivo con todo. Hazlo de vez en cuando y guárdalo en Drive o donde acostumbres.'],
      ['Cada dispositivo es independiente', 'Si usas la app en el teléfono y en la computadora, cada uno tiene sus propios datos. Elige uno como el principal.'],
    ],
  },
  {
    t: 'Sobre los números',
    icono: '⚖',
    p: [
      ['De dónde salen', 'El gasto en reposo se estima con la ecuación de **Mifflin-St Jeor (1990)**, la más usada en la práctica clínica para adultos sanos, multiplicada por tu factor de actividad. El gasto de cada entrenamiento se calcula con **METs** del *Compendium of Physical Activities* (Ainsworth y cols.).'],
      ['Cómo se reparten', 'La proteína se fija en 1.4 g por kilo de peso, la grasa en 27 % de la energía del día y el resto va a hidratos. Es un reparto orientado a salud general y variedad.'],
      ['Qué tan exactos son', 'Son **estimaciones de referencia**. Las ecuaciones son promedios poblacionales y los valores de cada platillo son aproximaciones de tablas de composición de alimentos. Sirven para llevar orden y notar tendencias, no para medir con precisión.'],
      ['Lo que no son', 'No son una prescripción y no sustituyen la valoración de un nutriólogo, sobre todo si alguien en casa tiene alguna condición de salud. Con las rutinas aplica lo mismo: si un ejercicio te causa dolor, no molestia de esfuerzo sino dolor, sáltalo y consúltalo con un profesional.'],
    ],
  },
];

// ── Notas de versión ──────────────────────────────────────────────────────
const NOTAS = [
  {
    v: '1.2.0', fecha: '17 de agosto de 2026', titulo: 'Ilustraciones y manual',
    nuevo: [
      'Dibujo de referencia en cada uno de los 73 platillos, visible en Hoy, en la Semana, en el Recetario y al sustituir una comida.',
      'Figura de la posición en cada uno de los 55 ejercicios, con vista ampliada al abrir el detalle.',
      'Manual de usuario completo dentro de la app, con ocho secciones.',
      'Esta pantalla de notas de versión.',
    ],
    detalles: [
      'Las ilustraciones se dibujan con código dentro de la app, no son imágenes descargadas. Por eso siguen funcionando sin internet, se ven nítidas en cualquier pantalla y casi no ocupan espacio.',
    ],
  },
  {
    v: '1.1.0', fecha: '17 de agosto de 2026', titulo: 'Entrenamiento',
    nuevo: [
      'Días fijos de entrenamiento: al registrarlos, la meta de comida de esos días sube sola.',
      'Generador de rutinas para casa o gimnasio, con 55 ejercicios, cuatro objetivos y tres duraciones.',
      'Objetivo específico de rendimiento en voleibol: salto, hombro y tobillo.',
      'Bitácora de entrenamiento cruzada con la alimentación del día.',
    ],
    detalles: [
      'El gasto de cada sesión se calcula con METs y se le resta un MET, porque ese reposo ya lo cuenta el metabolismo basal. Sin esa resta, la app sobreestimaría el día.',
      'El campo de actividad del perfil ahora aclara que debe describir sólo el día normal, sin los entrenamientos, para no contarlos dos veces.',
      'Familia se movió dentro de Progreso como pestaña, para que la barra de abajo no se saturara.',
    ],
  },
  {
    v: '1.0.1', fecha: '17 de agosto de 2026', titulo: 'Control de despensa',
    nuevo: [
      'Inventario de lo que hay en casa, agrupado por pasillo.',
      'La lista del súper descuenta la despensa y pide sólo lo que falta.',
      'Botón para pasar de una vez al inventario todo lo que tachaste en el carrito.',
      'Al marcar una comida como hecha, sus ingredientes se descuentan solos.',
    ],
    arreglos: [
      'Corregido un error que inventaba comida: si tenías 2 tortillas y la receta pedía 4, la despensa bajaba a cero pero al desmarcar la comida te devolvía 4. Ahora se registra lo que en realidad se consumió y se devuelve exactamente eso.',
    ],
  },
  {
    v: '1.0.0', fecha: '17 de agosto de 2026', titulo: 'Primera versión',
    nuevo: [
      'Menús de cinco tiempos para toda la familia, con porciones proporcionales a cada persona.',
      'Recetario de 73 platillos caseros del Bajío, con alta de recetas propias.',
      'Generador de menús para una semana, un mes o un año, con control de repetición.',
      'Lista del súper automática, agrupada por pasillo.',
      'Registro diario de comidas y agua.',
      'Seguimiento de peso, cintura, cadera y pecho con gráfica de tendencia.',
      'Funciona sin internet e instalable como app.',
    ],
  },
];

// Negritas con **texto**, sin dependencias externas.
function Texto({ children }) {
  const partes = String(children).split(/(\*\*[^*]+\*\*)/g);
  return <>{partes.map((x, i) => x.startsWith('**') && x.endsWith('**')
    ? <b key={i}>{x.slice(2, -2)}</b> : <React.Fragment key={i}>{x}</React.Fragment>)}</>;
}

export function PantallaAyuda({ Hoja }) {
  const [vista, setVista] = useState('manual');
  const [abierta, setAbierta] = useState(null);

  return (<>
    <div className="chips">
      <button className={'chip' + (vista === 'manual' ? ' on' : '')} onClick={() => setVista('manual')}>Manual</button>
      <button className={'chip' + (vista === 'notas' ? ' on' : '')} onClick={() => setVista('notas')}>Novedades</button>
    </div>

    {vista === 'manual' ? (<>
      {MANUAL.map((sec) => (
        <div className="tarjeta" key={sec.t} style={{ cursor: 'pointer' }} onClick={() => setAbierta(sec)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11, background: 'var(--cobalto-lavado)',
              display: 'grid', placeItems: 'center', fontSize: 19, color: 'var(--cobalto)', flexShrink: 0,
            }}>{sec.icono}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 16.5, fontWeight: 600 }}>{sec.t}</div>
              <div style={{ fontSize: 12, color: 'var(--tinta-suave)' }}>
                {sec.p.length} {sec.p.length === 1 ? 'punto' : 'puntos'}
              </div>
            </div>
            <span style={{ color: 'var(--tinta-suave)', fontSize: 17 }}>›</span>
          </div>
        </div>
      ))}
      <p className="nota">Mesa versión {VERSION}. Toda la información se guarda en este dispositivo.</p>
    </>) : (<>
      {NOTAS.map((n, i) => (
        <div className="tarjeta" key={n.v}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 600 }}>{n.titulo}</div>
            <span className={'pildora' + (i === 0 ? '' : ' gris')}>v{n.v}</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--tinta-suave)', marginBottom: 11 }}>{n.fecha}</div>

          {n.nuevo && (<>
            <div className="comida-tiempo" style={{ marginBottom: 5 }}>Nuevo</div>
            {n.nuevo.map((x, j) => (
              <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13.5, lineHeight: 1.45 }}>
                <span style={{ color: 'var(--jade)', flexShrink: 0 }}>+</span><span>{x}</span>
              </div>
            ))}
          </>)}

          {n.arreglos && (<>
            <div className="comida-tiempo" style={{ margin: '12px 0 5px' }}>Arreglado</div>
            {n.arreglos.map((x, j) => (
              <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13.5, lineHeight: 1.45 }}>
                <span style={{ color: 'var(--achiote)', flexShrink: 0 }}>✓</span><span>{x}</span>
              </div>
            ))}
          </>)}

          {n.detalles && (<>
            <div className="comida-tiempo" style={{ margin: '12px 0 5px' }}>Por qué</div>
            {n.detalles.map((x, j) => (
              <p key={j} className="nota" style={{ marginTop: 0, marginBottom: 6 }}>{x}</p>
            ))}
          </>)}
        </div>
      ))}
    </>)}

    {abierta && (
      <Hoja titulo={abierta.t} onCerrar={() => setAbierta(null)}>
        {abierta.p.map(([titulo, cuerpo], i) => (
          <div key={i} style={{ marginBottom: 17 }}>
            <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 3 }}>{titulo}</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--tinta-media)' }}>
              <Texto>{cuerpo}</Texto>
            </p>
          </div>
        ))}
      </Hoja>
    )}
  </>);
}
