import React, { useState } from 'react';

// Buzón de mejoras. Las ideas se le ocurren a uno usando la app —en el súper,
// en el entrenamiento, cocinando— y se olvidan antes de llegar a la
// computadora. Aquí se anotan en el momento y luego se exportan como texto
// listo para pegar donde se vaya a pedir el cambio.

const nid = () => Math.random().toString(36).slice(2, 10);
const hoy = () => new Date().toISOString().slice(0, 10);

export const PANTALLAS_APP = [
  { k: 'hoy', nombre: 'Hoy' },
  { k: 'semana', nombre: 'La semana' },
  { k: 'entreno', nombre: 'Entrenamiento' },
  { k: 'recetario', nombre: 'Recetario' },
  { k: 'super', nombre: 'Súper y despensa' },
  { k: 'progreso', nombre: 'Progreso' },
  { k: 'general', nombre: 'Toda la app' },
];

const PRIORIDADES = [
  { k: 'alta', nombre: 'Me estorba', desc: 'Molesta cada vez que uso la app', tono: 'achiote' },
  { k: 'media', nombre: 'Me ayudaría', desc: 'Mejoraría el uso diario', tono: 'maiz' },
  { k: 'baja', nombre: 'Algún día', desc: 'Estaría bien tenerlo', tono: 'gris' },
];

const ESTADOS = [
  { k: 'idea', nombre: 'Por pedir' },
  { k: 'pedida', nombre: 'Ya la pedí' },
  { k: 'lista', nombre: 'Ya está' },
];

const dato = (lista, k) => lista.find((x) => x.k === k) || lista[0];

export function PantallaMejoras({ estado, actualizar, pantallaPrevia, Hoja }) {
  const [alta, setAlta] = useState(false);
  const [edita, setEdita] = useState(null);
  const [filtro, setFiltro] = useState('idea');
  const [copiado, setCopiado] = useState(false);

  const mejoras = estado.mejoras || [];
  const visibles = mejoras.filter((m) => (filtro === 'todo' ? true : m.estado === filtro));
  const porEstado = (k) => mejoras.filter((m) => m.estado === k).length;

  const guardar = (m) => {
    const existe = mejoras.some((x) => x.id === m.id);
    actualizar({ mejoras: existe ? mejoras.map((x) => (x.id === m.id ? m : x)) : [m, ...mejoras] });
    setAlta(false); setEdita(null);
  };
  const borrar = (id) => { actualizar({ mejoras: mejoras.filter((x) => x.id !== id) }); setEdita(null); };
  const cambiarEstado = (m) => {
    const orden = ['idea', 'pedida', 'lista'];
    const sig = orden[(orden.indexOf(m.estado) + 1) % orden.length];
    actualizar({ mejoras: mejoras.map((x) => (x.id === m.id ? { ...x, estado: sig } : x)) });
  };

  // Se exporta agrupado por prioridad, que es el orden en que conviene pedirlas.
  const exportar = () => {
    const pendientes = mejoras.filter((m) => m.estado !== 'lista');
    if (!pendientes.length) return;
    let texto = `Mejoras para Mesa\n${'='.repeat(17)}\n`;
    for (const pr of PRIORIDADES) {
      const grupo = pendientes.filter((m) => m.prioridad === pr.k);
      if (!grupo.length) continue;
      texto += `\n${pr.nombre.toUpperCase()} (${pr.desc.toLowerCase()})\n`;
      for (const m of grupo) {
        texto += `\n- ${m.titulo}\n  Pantalla: ${dato(PANTALLAS_APP, m.pantalla).nombre}\n`;
        if (m.detalle) texto += `  ${m.detalle.replace(/\n/g, '\n  ')}\n`;
      }
    }
    navigator.clipboard?.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2600);
  };

  return (<>
    <div className="chips">
      {ESTADOS.map((e) => (
        <button key={e.k} className={'chip' + (filtro === e.k ? ' on' : '')} onClick={() => setFiltro(e.k)}>
          {e.nombre}{porEstado(e.k) ? ` · ${porEstado(e.k)}` : ''}
        </button>
      ))}
      <button className={'chip' + (filtro === 'todo' ? ' on' : '')} onClick={() => setFiltro('todo')}>Todas</button>
    </div>

    <button className="btn" style={{ marginBottom: 12 }} onClick={() => setAlta(true)}>+ Anotar una idea</button>

    {!mejoras.length ? (
      <div className="tarjeta"><div className="vacio">
        <span className="glifo">✎</span>
        <p>Aquí se anotan las mejoras que se te ocurran usando la app, para no perderlas. Después las exportas todas juntas y las pides de una vez.</p>
      </div></div>
    ) : !visibles.length ? (
      <div className="tarjeta"><div className="vacio">
        <p>Nada en esta categoría. Toca «Todas» para ver el resto.</p>
      </div></div>
    ) : visibles.map((m) => {
      const pr = dato(PRIORIDADES, m.prioridad);
      return (
        <div className="tarjeta" key={m.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 600, fontSize: 14.5,
                textDecoration: m.estado === 'lista' ? 'line-through' : 'none',
                color: m.estado === 'lista' ? 'var(--tinta-suave)' : 'inherit',
              }}>{m.titulo}</div>
              {m.detalle && (
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--tinta-media)', lineHeight: 1.45 }}>{m.detalle}</p>
              )}
              <div style={{ display: 'flex', gap: 6, marginTop: 9, flexWrap: 'wrap' }}>
                <span className={'pildora ' + pr.tono}>{pr.nombre}</span>
                <span className="pildora gris">{dato(PANTALLAS_APP, m.pantalla).nombre}</span>
                {m.estado === 'pedida' && <span className="pildora">Ya la pedí</span>}
                {m.estado === 'lista' && <span className="pildora jade">Ya está</span>}
              </div>
            </div>
            <button className="btn chico linea" onClick={() => setEdita(m)}>Editar</button>
          </div>
          <button className="btn linea chico" style={{ width: '100%', marginTop: 11 }} onClick={() => cambiarEstado(m)}>
            {m.estado === 'idea' ? 'Marcar como ya pedida'
              : m.estado === 'pedida' ? 'Marcar como ya está'
                : 'Volver a por pedir'}
          </button>
        </div>
      );
    })}

    {mejoras.some((m) => m.estado !== 'lista') && (<>
      <button className="btn suave" onClick={exportar}>
        {copiado ? '✓ Copiado, ya puedes pegarlo' : 'Copiar todas las pendientes'}
      </button>
      <p className="nota">
        Se copian agrupadas por prioridad y con la pantalla de cada una, listas para pegar
        donde vayas a pedir los cambios.
      </p>
    </>)}

    {(alta || edita) && (
      <FormaMejora inicial={edita} pantallaPrevia={pantallaPrevia} Hoja={Hoja}
        onGuardar={guardar} onCerrar={() => { setAlta(false); setEdita(null); }}
        onBorrar={edita ? () => borrar(edita.id) : null} />
    )}
  </>);
}

function FormaMejora({ inicial, pantallaPrevia, onGuardar, onCerrar, onBorrar, Hoja }) {
  const [f, setF] = useState(inicial || {
    id: nid(), titulo: '', detalle: '',
    // Se propone la pantalla en la que estabas: casi siempre es la correcta.
    pantalla: PANTALLAS_APP.some((p) => p.k === pantallaPrevia) ? pantallaPrevia : 'general',
    prioridad: 'media', estado: 'idea', fecha: hoy(),
  });
  const listo = f.titulo.trim().length > 2;

  return (
    <Hoja titulo={inicial ? 'Editar idea' : 'Anotar una idea'}
      sub={inicial ? null : 'Anótala aunque sea a medias. Ya la afinas luego.'} onCerrar={onCerrar}>
      <div className="campo"><label>¿Qué mejorarías?</label>
        <input autoFocus value={f.titulo} onChange={(e) => setF({ ...f, titulo: e.target.value })}
          placeholder="Poder duplicar el menú de una semana" /></div>
      <div className="campo"><label>Detalle (opcional)</label>
        <textarea rows={3} value={f.detalle} onChange={(e) => setF({ ...f, detalle: e.target.value })}
          placeholder="Cuándo te estorba, qué esperabas que pasara…" /></div>
      <div className="campo"><label>¿En qué parte de la app?</label>
        <select value={f.pantalla} onChange={(e) => setF({ ...f, pantalla: e.target.value })}>
          {PANTALLAS_APP.map((p) => <option key={p.k} value={p.k}>{p.nombre}</option>)}
        </select></div>
      <div className="campo"><label>¿Qué tanto te urge?</label>
        <div className="chips" style={{ paddingBottom: 0 }}>
          {PRIORIDADES.map((p) => (
            <button key={p.k} className={'chip' + (f.prioridad === p.k ? ' on' : '')}
              onClick={() => setF({ ...f, prioridad: p.k })}>{p.nombre}</button>
          ))}
        </div>
        <p className="nota" style={{ marginTop: 4 }}>{dato(PRIORIDADES, f.prioridad).desc}</p>
      </div>
      <button className="btn" disabled={!listo}
        onClick={() => onGuardar({ ...f, titulo: f.titulo.trim(), detalle: f.detalle.trim() })}>Guardar</button>
      {onBorrar && <button className="btn peligro" style={{ marginTop: 8 }} onClick={onBorrar}>Borrar esta idea</button>}
    </Hoja>
  );
}
