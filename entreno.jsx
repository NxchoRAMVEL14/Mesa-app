import React, { useState, useMemo } from 'react';
import { EJERCICIOS, PATRONES, LUGARES, OBJETIVOS, DURACIONES } from './data/ejercicios.js';
import {
  TIPOS_ENTRENO, gastoSesion, generarRutina, cruzarDias, energiaDelDia,
  iso, desdeIso, lunesDe, sumarDias, etiquetaFecha, DIAS, DIAS_CORTO, MESES,
} from './nucleo.js';

const HOY = () => iso(new Date());
const nid = () => Math.random().toString(36).slice(2, 10);

/* ══════════ Pantalla principal ══════════ */
export function PantallaEntreno({ estado, actualizar, recetas, Hoja }) {
  const [pestana, setPestana] = useState('semana');
  const persona = estado.personas[0];
  if (!persona) return <div className="tarjeta"><div className="vacio"><p>Primero agrega a alguien a la familia.</p></div></div>;

  return (<>
    <div className="chips">
      {[['semana', 'Mi semana'], ['plan', 'Rutina'], ['bitacora', 'Bitácora']].map(([k, etq]) => (
        <button key={k} className={'chip' + (pestana === k ? ' on' : '')} onClick={() => setPestana(k)}>{etq}</button>
      ))}
    </div>
    {pestana === 'semana' && <SemanaEntreno {...{ estado, actualizar, persona, Hoja }} />}
    {pestana === 'plan' && <PlanRutina {...{ estado, actualizar, persona, Hoja }} />}
    {pestana === 'bitacora' && <Bitacora {...{ estado, actualizar, persona, recetas, Hoja }} />}
  </>);
}

/* ══════════ Mi semana: entrenos fijos ══════════ */
function SemanaEntreno({ estado, actualizar, persona, Hoja }) {
  const [edita, setEdita] = useState(null);
  const [alta, setAlta] = useState(false);
  const entrenos = persona.entrenos || [];

  const guardar = (s) => {
    const existe = entrenos.some((x) => x.id === s.id);
    const lista = existe ? entrenos.map((x) => (x.id === s.id ? s : x)) : [...entrenos, s];
    actualizar({ personas: estado.personas.map((p) => (p.id === persona.id ? { ...p, entrenos: lista } : p)) });
    setEdita(null); setAlta(false);
  };
  const borrar = (id) => {
    actualizar({ personas: estado.personas.map((p) => (p.id === persona.id ? { ...p, entrenos: entrenos.filter((x) => x.id !== id) } : p)) });
    setEdita(null);
  };

  const porDia = {};
  for (const e of entrenos) (porDia[e.dia] = porDia[e.dia] || []).push(e);
  const totalSemana = entrenos.reduce((s, e) => s + gastoSesion(e, persona.peso), 0);

  return (<>
    {!entrenos.length ? (
      <div className="tarjeta"><div className="vacio"><span className="glifo">🏐</span>
        <p>Registra los días que entrenas y la app subirá tus metas de comida esos días automáticamente.</p></div></div>
    ) : (<>
      <div className="tarjeta plana" style={{ background: 'var(--jade-lavado)', border: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--jade)' }}>
          <b>{entrenos.length} {entrenos.length === 1 ? 'sesión' : 'sesiones'}</b> a la semana ·
          alrededor de <b>{totalSemana.toLocaleString('es-MX')} kcal</b> extra
        </div>
      </div>

      {[1, 2, 3, 4, 5, 6, 0].filter((d) => porDia[d]).map((d) => (
        <div className="tarjeta" key={d}>
          <div className="comida-tiempo" style={{ marginBottom: 8 }}>{DIAS[d]}</div>
          {porDia[d].map((e) => (
            <div className="linea-lista" key={e.id} onClick={() => setEdita(e)} style={{ cursor: 'pointer' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{e.nombre}</div>
                <div style={{ fontSize: 11.5, color: 'var(--tinta-suave)' }}>
                  {e.min} min{e.hora ? ` · ${e.hora}` : ''}
                </div>
              </div>
              <span className="pildora jade">+{gastoSesion(e, persona.peso)} kcal</span>
            </div>
          ))}
        </div>
      ))}
    </>)}

    <button className="btn" onClick={() => setAlta(true)}>+ Agregar día de entrenamiento</button>
    <p className="nota">
      El gasto se estima con METs del Compendium of Physical Activities, restando el reposo
      que ya cuenta tu metabolismo basal. Son promedios: sirven para orientar, no para medir.
    </p>

    {(alta || edita) && (
      <FormaEntreno inicial={edita} peso={persona.peso} Hoja={Hoja}
        onGuardar={guardar} onCerrar={() => { setAlta(false); setEdita(null); }}
        onBorrar={edita ? () => borrar(edita.id) : null} />
    )}
  </>);
}

function FormaEntreno({ inicial, peso, onGuardar, onCerrar, onBorrar, Hoja }) {
  const [f, setF] = useState(inicial || { id: nid(), nombre: '', tipo: 'voleibol', dia: 2, min: 90, hora: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const nombreTipo = (TIPOS_ENTRENO.find((t) => t.k === f.tipo) || {}).nombre || '';
  const listo = f.min > 0;
  const gasto = gastoSesion({ tipo: f.tipo, min: +f.min }, peso);

  return (
    <Hoja titulo={inicial ? 'Editar sesión' : 'Nueva sesión'} onCerrar={onCerrar}>
      <div className="campo"><label>Tipo de entrenamiento</label>
        <select value={f.tipo} onChange={set('tipo')}>
          {TIPOS_ENTRENO.map((t) => <option key={t.k} value={t.k}>{t.nombre}</option>)}
        </select></div>
      <div className="campo"><label>Nombre (opcional)</label>
        <input value={f.nombre} onChange={set('nombre')} placeholder={nombreTipo} /></div>
      <div className="campo"><label>Día de la semana</label>
        <select value={f.dia} onChange={(e) => setF({ ...f, dia: +e.target.value })}>
          {[1, 2, 3, 4, 5, 6, 0].map((d) => <option key={d} value={d}>{DIAS[d]}</option>)}
        </select></div>
      <div className="rejilla2">
        <div className="campo"><label>Duración (min)</label>
          <input type="number" inputMode="numeric" value={f.min} onChange={(e) => setF({ ...f, min: +e.target.value })} /></div>
        <div className="campo"><label>Hora (opcional)</label>
          <input type="time" value={f.hora} onChange={set('hora')} /></div>
      </div>
      {gasto > 0 && (
        <div className="tarjeta plana" style={{ background: 'var(--jade-lavado)', border: 0, marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, color: 'var(--jade)' }}>
            Ese día tu meta subirá alrededor de <b>{gasto} kcal</b>
          </div>
        </div>
      )}
      <button className="btn" disabled={!listo}
        onClick={() => onGuardar({ ...f, min: +f.min, nombre: f.nombre.trim() || nombreTipo })}>Guardar</button>
      {onBorrar && <button className="btn peligro" style={{ marginTop: 8 }} onClick={onBorrar}>Quitar esta sesión</button>}
    </Hoja>
  );
}

/* ══════════ Rutina generada ══════════ */
function PlanRutina({ estado, actualizar, persona, Hoja }) {
  const [config, setConfig] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const rutina = estado.rutina;

  const crear = ({ objetivo, lugar, dias, duracion }) => {
    const obj = OBJETIVOS.find((o) => o.k === objetivo);
    const dur = DURACIONES.find((d) => d.min === duracion);
    const sesiones = generarRutina({
      ejercicios: EJERCICIOS, objetivo: obj, lugar, dias,
      ejerciciosPorSesion: dur.ejercicios, semilla: Date.now() % 100000,
    });
    actualizar({ rutina: { objetivo, lugar, dias, duracion, sesiones, creada: HOY() } });
    setConfig(false);
  };

  if (!rutina) return (<>
    <div className="tarjeta"><div className="vacio"><span className="glifo">💪</span>
      <p>Genera una rutina a tu medida. Elige si entrenas en casa o en el gimnasio y la app arma las sesiones con lo que tengas disponible.</p></div></div>
    <button className="btn" onClick={() => setConfig(true)}>Crear mi rutina</button>
    {config && <FormaRutina onCrear={crear} onCerrar={() => setConfig(false)} Hoja={Hoja} />}
  </>);

  const obj = OBJETIVOS.find((o) => o.k === rutina.objetivo) || OBJETIVOS[0];
  const lugar = LUGARES.find((l) => l.k === rutina.lugar) || LUGARES[0];

  return (<>
    <div className="tarjeta plana" style={{ background: 'var(--cobalto-lavado)', border: 0 }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--cobalto)' }}>{obj.nombre}</div>
      <div style={{ fontSize: 12, color: 'var(--tinta-media)' }}>
        {lugar.nombre} · {rutina.dias} {rutina.dias === 1 ? 'día' : 'días'} · {rutina.duracion} min por sesión
      </div>
    </div>

    {rutina.sesiones.map((s) => (
      <div className="tarjeta" key={s.dia}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <b style={{ fontSize: 14.5 }}>Día {s.dia} · {s.titulo}</b>
          <span className="pildora gris">{s.ejercicios.length} ejercicios</span>
        </div>
        {s.ejercicios.map((x) => (
          <div className="linea-lista" key={x.id} onClick={() => setDetalle(x)} style={{ cursor: 'pointer' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="comida-tiempo">{PATRONES[x.patron]}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{x.nombre}</div>
            </div>
            <span className="cant">{x.series} × {x.reps}</span>
          </div>
        ))}
      </div>
    ))}

    <div className="fila-btn">
      <button className="btn linea" onClick={() => setConfig(true)}>Cambiar rutina</button>
      <button className="btn suave" onClick={() => crear(rutina)}>Otros ejercicios</button>
    </div>
    <p className="nota">
      Empieza con el extremo bajo de las repeticiones y con peso que te deje dos o tres
      repeticiones de margen. Si algún ejercicio te causa dolor —no molestia de esfuerzo,
      dolor— sáltalo y consúltalo con un profesional.
    </p>

    {config && <FormaRutina inicial={rutina} onCrear={crear} onCerrar={() => setConfig(false)} Hoja={Hoja} />}
    {detalle && (
      <Hoja titulo={detalle.nombre} sub={`${PATRONES[detalle.patron]} · ${detalle.series} series de ${detalle.reps}`}
        onCerrar={() => setDetalle(null)}>
        <p style={{ fontSize: 14.5, margin: '4px 0 14px' }}>{detalle.nota}</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="pildora gris">{detalle.equipo === 'ninguno' ? 'Sin equipo' : detalle.equipo}</span>
          {detalle.lugares.map((l) => (
            <span key={l} className="pildora">{(LUGARES.find((x) => x.k === l) || {}).nombre}</span>
          ))}
        </div>
      </Hoja>
    )}
  </>);
}

function FormaRutina({ inicial, onCrear, onCerrar, Hoja }) {
  const [f, setF] = useState(inicial || { objetivo: 'general', lugar: 'casa', dias: 3, duracion: 45 });
  return (
    <Hoja titulo="Armar rutina" sub="La app elige los ejercicios según lo que tengas a la mano." onCerrar={onCerrar}>
      <div className="campo"><label>¿Dónde entrenas?</label>
        <div className="chips" style={{ paddingBottom: 0 }}>
          {LUGARES.map((l) => (
            <button key={l.k} className={'chip' + (f.lugar === l.k ? ' on' : '')}
              onClick={() => setF({ ...f, lugar: l.k })}>{l.nombre}</button>
          ))}
        </div>
        <p className="nota" style={{ marginTop: 4 }}>{(LUGARES.find((l) => l.k === f.lugar) || {}).desc}</p>
      </div>
      <div className="campo"><label>Objetivo</label>
        <select value={f.objetivo} onChange={(e) => setF({ ...f, objetivo: e.target.value })}>
          {OBJETIVOS.map((o) => <option key={o.k} value={o.k}>{o.nombre} — {o.desc}</option>)}
        </select></div>
      <div className="campo"><label>Días por semana</label>
        <div className="chips" style={{ paddingBottom: 0 }}>
          {[2, 3, 4, 5].map((d) => (
            <button key={d} className={'chip' + (f.dias === d ? ' on' : '')} onClick={() => setF({ ...f, dias: d })}>{d}</button>
          ))}
        </div></div>
      <div className="campo"><label>Duración por sesión</label>
        <select value={f.duracion} onChange={(e) => setF({ ...f, duracion: +e.target.value })}>
          {DURACIONES.map((d) => <option key={d.min} value={d.min}>{d.min} min — {d.desc}</option>)}
        </select></div>
      <button className="btn" onClick={() => onCrear(f)}>Generar rutina</button>
    </Hoja>
  );
}

/* ══════════ Bitácora cruzada con alimentación ══════════ */
function Bitacora({ estado, actualizar, persona, recetas, Hoja }) {
  const [ancla, setAncla] = useState(lunesDe(new Date()));
  const [alta, setAlta] = useState(null);
  const indice = useMemo(() => Object.fromEntries(recetas.map((r) => [r.id, r])), [recetas]);
  const fechas = Array.from({ length: 7 }, (_, i) => iso(sumarDias(ancla, i)));

  const filas = useMemo(() => cruzarDias({
    persona, fechas, plan: estado.plan, bitacora: estado.bitacora, indiceRecetas: indice,
  }), [persona, fechas.join(), estado.plan, estado.bitacora, indice]);

  const guardarSesion = (fecha, sesion) => {
    const reg = estado.bitacora[fecha] || { hechos: {} };
    const lista = [...(reg.entrenos || []), sesion];
    actualizar({ bitacora: { ...estado.bitacora, [fecha]: { ...reg, entrenos: lista } } });
    setAlta(null);
  };
  const quitarSesion = (fecha, id) => {
    const reg = estado.bitacora[fecha] || { hechos: {} };
    actualizar({ bitacora: { ...estado.bitacora, [fecha]: { ...reg, entrenos: (reg.entrenos || []).filter((s) => s.id !== id) } } });
  };

  const conEntreno = filas.filter((f) => f.registrado);
  const sesionesSemana = conEntreno.reduce((s, f) => s + f.sesiones.length, 0);
  const gastoSemana = filas.reduce((s, f) => s + (f.registrado ? f.gastado : 0), 0);

  return (<>
    <div className="tarjeta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px' }}>
      <button className="btn chico suave" onClick={() => setAncla(sumarDias(ancla, -7))} aria-label="Semana anterior">←</button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{ancla.getDate()} – {sumarDias(ancla, 6).getDate()}</div>
        <div style={{ fontSize: 11.5, color: 'var(--tinta-suave)', textTransform: 'capitalize' }}>{MESES[ancla.getMonth()]}</div>
      </div>
      <button className="btn chico suave" onClick={() => setAncla(sumarDias(ancla, 7))} aria-label="Semana siguiente">→</button>
    </div>

    {sesionesSemana > 0 && (
      <div className="tarjeta plana" style={{ background: 'var(--jade-lavado)', border: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--jade)' }}>
          <b>{sesionesSemana} {sesionesSemana === 1 ? 'sesión' : 'sesiones'}</b> esta semana ·
          cerca de <b>{gastoSemana.toLocaleString('es-MX')} kcal</b> de gasto extra
        </div>
      </div>
    )}

    {filas.map((f) => {
      const hoy = f.fecha === HOY();
      const d = desdeIso(f.fecha);
      // Sólo se compara comida contra meta si el día ya se registró completo.
      const completo = f.tiemposPlan > 0 && f.tiemposHechos === f.tiemposPlan;
      const corto = completo && f.meta && f.consumido < f.meta * 0.8;
      return (
        <div className="tarjeta" key={f.fecha}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <b style={{ fontSize: 14.5 }}>{DIAS[d.getDay()]} {d.getDate()}</b>
            <div style={{ display: 'flex', gap: 6 }}>
              {hoy && <span className="pildora">Hoy</span>}
              {f.entreno && <span className={'pildora ' + (f.registrado ? 'jade' : 'gris')}>
                {f.registrado ? 'Entrenado' : 'Programado'}
              </span>}
            </div>
          </div>

          {f.sesiones.map((s, i) => (
            <div className="linea-lista" key={s.id || i}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{s.nombre}</div>
                <div style={{ fontSize: 11.5, color: 'var(--tinta-suave)' }}>
                  {s.min} min{s.sensacion ? ` · ${s.sensacion}` : ''}{s.programado ? ' · sin registrar' : ''}
                </div>
              </div>
              {s.programado
                ? <span className="cant" style={{ color: 'var(--tinta-suave)' }}>+{gastoSesion(s, persona.peso)}</span>
                : <button className="btn chico linea" onClick={() => quitarSesion(f.fecha, s.id)}>Quitar</button>}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', margin: '10px 0 0' }}>
            <span className="pildora gris">{f.tiemposHechos} de {f.tiemposPlan} comidas</span>
            {f.consumido > 0 && <span className="pildora">{f.consumido.toLocaleString('es-MX')} kcal</span>}
            {f.meta && <span className="pildora gris">meta {f.meta.toLocaleString('es-MX')}</span>}
            {f.gastado > 0 && <span className="pildora jade">+{f.gastado} por entreno</span>}
          </div>

          {corto && (
            <div className="aviso" style={{ marginTop: 10 }}>
              Registraste todas tus comidas pero quedaste bastante por debajo de lo que pedía
              este día{f.entreno ? ', y entrenaste' : ''}. Comer suficiente es parte del entrenamiento:
              vale la pena agregar una colación.
            </div>
          )}

          <button className="btn linea chico" style={{ width: '100%', marginTop: 10 }}
            onClick={() => setAlta(f.fecha)}>+ Registrar entrenamiento</button>
        </div>
      );
    })}

    <p className="nota">
      Las cifras de comida sólo cuentan los tiempos que marcaste como hechos en la pantalla
      Hoy. Si un día comiste fuera del plan, el número quedará corto.
    </p>

    {alta && (
      <FormaSesion fecha={alta} peso={persona.peso} Hoja={Hoja}
        onCerrar={() => setAlta(null)}
        onGuardar={(s) => guardarSesion(alta, s)} />
    )}
  </>);
}

function FormaSesion({ fecha, peso, onGuardar, onCerrar, Hoja }) {
  const [f, setF] = useState({ id: nid(), tipo: 'voleibol', min: 90, sensacion: '', notas: '' });
  const nombreTipo = (TIPOS_ENTRENO.find((t) => t.k === f.tipo) || {}).nombre || '';
  const gasto = gastoSesion({ tipo: f.tipo, min: +f.min }, peso);
  const SENSACIONES = ['Con energía', 'Normal', 'Pesado', 'Agotado'];

  return (
    <Hoja titulo="Registrar entrenamiento" sub={etiquetaFecha(fecha)} onCerrar={onCerrar}>
      <div className="campo"><label>Tipo</label>
        <select value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>
          {TIPOS_ENTRENO.map((t) => <option key={t.k} value={t.k}>{t.nombre}</option>)}
        </select></div>
      <div className="campo"><label>Duración (min)</label>
        <input type="number" inputMode="numeric" value={f.min} onChange={(e) => setF({ ...f, min: +e.target.value })} /></div>
      <div className="campo"><label>¿Cómo te sentiste?</label>
        <div className="chips" style={{ paddingBottom: 0 }}>
          {SENSACIONES.map((s) => (
            <button key={s} className={'chip' + (f.sensacion === s ? ' on' : '')}
              onClick={() => setF({ ...f, sensacion: f.sensacion === s ? '' : s })}>{s}</button>
          ))}
        </div></div>
      <div className="campo"><label>Notas (opcional)</label>
        <textarea rows={2} value={f.notas} onChange={(e) => setF({ ...f, notas: e.target.value })}
          placeholder="Qué salió bien, qué molestó…" /></div>
      {gasto > 0 && (
        <div className="tarjeta plana" style={{ background: 'var(--jade-lavado)', border: 0, marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, color: 'var(--jade)' }}>Gasto estimado: <b>{gasto} kcal</b></div>
        </div>
      )}
      <button className="btn" disabled={!f.min}
        onClick={() => onGuardar({ ...f, min: +f.min, nombre: nombreTipo })}>Guardar</button>
    </Hoja>
  );
}
