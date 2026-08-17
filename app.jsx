import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { RECETAS, TIEMPOS, REPARTO, PASILLOS } from './data/recetas.js';
import { PantallaEntreno } from './entreno.jsx';
import { IlustracionPlatillo } from './platillos.jsx';
import { PantallaAyuda, VERSION } from './ayuda.jsx';
import {
  almacen, FACTORES, energiaDiaria, macrosObjetivo, vasosObjetivo, edadDesde,
  factorPorcion, generarMenu, construirLista, iso, desdeIso, lunesDe, sumarDias,
  etiquetaFecha, DIAS_CORTO, MESES, claveIng, catalogoIngredientes, aplicarDelta, descontar, devolver,
  macrosDelDia, energiaDelDia, entrenosDelDia, gastoSesion, DIAS,
} from './nucleo.js';

const HOY = () => iso(new Date());
const nuevoId = () => Math.random().toString(36).slice(2, 10);

/* ══════════ Hoja modal ══════════ */
function Hoja({ titulo, sub, onCerrar, children }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onCerrar]);
  return (
    <div className="velo" onClick={onCerrar}>
      <div className="hoja" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="asa" />
        {titulo && <h2>{titulo}</h2>}
        {sub && <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--tinta-media)' }}>{sub}</p>}
        {children}
      </div>
    </div>
  );
}

/* ══════════ Medidor ══════════ */
function Medidor({ etq, valor, meta, unidad, tono }) {
  const pct = meta ? Math.min(100, (valor / meta) * 100) : 0;
  return (
    <div className="medidor">
      <div className="medidor-cab">
        <span style={{ color: 'var(--tinta-media)' }}>{etq}</span>
        <span><b>{Math.round(valor)}</b><span style={{ color: 'var(--tinta-suave)' }}> / {Math.round(meta)} {unidad}</span></span>
      </div>
      <div className="barra"><i className={tono} style={{ width: pct + '%' }} /></div>
    </div>
  );
}

/* ══════════ Gráfica de líneas ══════════ */
function Grafica({ datos, unidad }) {
  if (datos.length < 2) return <div className="vacio" style={{ padding: 26 }}><p>Registra al menos dos veces para ver la tendencia.</p></div>;
  const An = 320, Al = 170, mx = 34, my = 18;
  const vals = datos.map((d) => d.v);
  let min = Math.min(...vals), max = Math.max(...vals);
  const pad = (max - min) * 0.25 || 1;
  min -= pad; max += pad;
  const px = (i) => mx + (i / (datos.length - 1)) * (An - mx - 12);
  const py = (v) => my + (1 - (v - min) / (max - min)) * (Al - my * 2 - 14);
  const linea = datos.map((d, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(d.v).toFixed(1)}`).join(' ');
  const area = `${linea} L${px(datos.length - 1).toFixed(1)},${Al - my - 14} L${px(0).toFixed(1)},${(Al - my - 14).toFixed(1)} Z`;
  return (
    <svg className="grafica" viewBox={`0 0 ${An} ${Al}`} preserveAspectRatio="none" role="img" aria-label={`Tendencia en ${unidad}`}>
      {[0, 0.5, 1].map((f) => {
        const v = min + (max - min) * (1 - f);
        return (<g key={f}>
          <line className="rejilla" x1={mx} y1={my + f * (Al - my * 2 - 14)} x2={An - 12} y2={my + f * (Al - my * 2 - 14)} />
          <text x={2} y={my + f * (Al - my * 2 - 14) + 3.5}>{v.toFixed(1)}</text>
        </g>);
      })}
      <path className="area" d={area} />
      <path className="linea" d={linea} />
      {datos.map((d, i) => <circle key={i} className="punto-d" cx={px(i)} cy={py(d.v)} r={3.5} />)}
      <text x={mx} y={Al - 4}>{datos[0].etq}</text>
      <text x={An - 12} y={Al - 4} textAnchor="end">{datos[datos.length - 1].etq}</text>
    </svg>
  );
}

/* ══════════ Alta / edición de persona ══════════ */
function FormaPersona({ inicial, onGuardar, onCerrar, onBorrar }) {
  const [f, setF] = useState(inicial || {
    id: nuevoId(), nombre: '', sexo: 'M', fechaNac: '', peso: '', estatura: '', actividad: 'moderado', come: true,
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const listo = f.nombre.trim() && f.peso && f.estatura && f.fechaNac;
  const guardar = () => onGuardar({
    ...f, nombre: f.nombre.trim(), peso: parseFloat(f.peso), estatura: parseFloat(f.estatura),
    edad: edadDesde(f.fechaNac),
  });
  const prev = listo ? energiaDiaria({ ...f, peso: +f.peso, estatura: +f.estatura, edad: edadDesde(f.fechaNac) }) : null;

  return (
    <Hoja titulo={inicial ? 'Editar a ' + inicial.nombre : 'Agregar a la familia'} onCerrar={onCerrar}>
      <div className="campo"><label>Nombre</label>
        <input value={f.nombre} onChange={set('nombre')} placeholder="Nombre de pila" /></div>
      <div className="rejilla2">
        <div className="campo"><label>Sexo</label>
          <select value={f.sexo} onChange={set('sexo')}><option value="M">Hombre</option><option value="F">Mujer</option></select></div>
        <div className="campo"><label>Fecha de nacimiento</label>
          <input type="date" value={f.fechaNac} onChange={set('fechaNac')} /></div>
      </div>
      <div className="rejilla2">
        <div className="campo"><label>Peso (kg)</label>
          <input type="number" inputMode="decimal" value={f.peso} onChange={set('peso')} placeholder="70" /></div>
        <div className="campo"><label>Estatura (cm)</label>
          <input type="number" inputMode="decimal" value={f.estatura} onChange={set('estatura')} placeholder="172" /></div>
      </div>
      <div className="campo"><label>Actividad diaria (sin contar entrenamientos)</label>
        <select value={f.actividad} onChange={set('actividad')}>
          {FACTORES.map((x) => <option key={x.k} value={x.k}>{x.nombre} — {x.desc}</option>)}
        </select>
        <p className="nota" style={{ marginTop: 4 }}>
          Piensa sólo en tu día normal: trabajo, casa, traslados. Los entrenamientos se
          registran aparte en la pestaña Entreno y suman a la meta el día que toquen.
        </p></div>
      {prev && <div className="tarjeta plana" style={{ background: 'var(--cobalto-lavado)', border: 0, marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: 'var(--cobalto)' }}>
          Necesidad estimada: <b>{prev.toLocaleString('es-MX')} kcal</b> al día · porción ×{factorPorcion({ ...f, peso: +f.peso, estatura: +f.estatura, edad: edadDesde(f.fechaNac) })}
        </div>
      </div>}
      <button className="btn" disabled={!listo} onClick={guardar}>Guardar</button>
      {onBorrar && <button className="btn peligro" style={{ marginTop: 8 }} onClick={onBorrar}>Quitar de la familia</button>}
      <p className="nota">Las estimaciones usan la ecuación de Mifflin-St Jeor y son sólo una referencia general. No sustituyen la valoración de un nutriólogo.</p>
    </Hoja>
  );
}

/* ══════════ Detalle de receta ══════════ */
function DetalleReceta({ receta, porciones, onCerrar, onCambiar }) {
  const esc = (n) => Math.round(n * porciones * 10) / 10;
  return (
    <Hoja titulo={receta.nombre} sub={`${receta.min} min · ${receta.kcal} kcal por porción`} onCerrar={onCerrar}>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 14px' }}>
        <IlustracionPlatillo receta={receta} size={116} radio={16} />
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
        {receta.tags.map((t) => <span key={t} className="pildora gris">{t}</span>)}
      </div>
      <h3>Ingredientes para {porciones} {porciones === 1 ? 'porción' : 'porciones'}</h3>
      {receta.ing.map((g, i) => (
        <div className="linea-lista" key={i}>
          <span className="nombre-item">{g.item}</span>
          <span className="cant">{esc(g.cant)} {g.unidad}</span>
        </div>
      ))}
      <h3>Aporte por porción</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span className="pildora">{receta.kcal} kcal</span>
        <span className="pildora jade">{receta.prot} g proteína</span>
        <span className="pildora maiz">{receta.carb} g hidratos</span>
        <span className="pildora gris">{receta.gras} g grasa</span>
      </div>
      {onCambiar && <button className="btn linea" style={{ marginTop: 18 }} onClick={onCambiar}>Cambiar por otro platillo</button>}
    </Hoja>
  );
}

/* ══════════ PANTALLA: Hoy ══════════ */
function PantallaHoy({ estado, actualizar, recetas, abrirReceta }) {
  const [fecha, setFecha] = useState(HOY());
  const dia = estado.plan[fecha] || {};
  const reg = estado.bitacora[fecha] || { hechos: {}, agua: 0 };
  const indice = useMemo(() => Object.fromEntries(recetas.map((r) => [r.id, r])), [recetas]);
  const comensales = estado.personas.filter((p) => p.come);
  const porciones = comensales.reduce((s, p) => s + factorPorcion(p), 0) || 1;
  const yo = estado.personas[0];

  // Al marcar una comida como hecha se descuentan sus ingredientes de la
  // despensa. Se guarda el registro de lo consumido realmente, para que
  // desmarcarla devuelva justo eso y nunca más de lo que había.
  const alternar = (t) => {
    const activando = !reg.hechos[t];
    const hechos = { ...reg.hechos, [t]: activando };
    const gastos = { ...(reg.gasto || {}) };
    const receta = indice[dia[t]];
    let despensa = estado.despensa || {};

    if (receta) {
      if (activando) {
        const res = descontar(despensa, receta, porciones);
        despensa = res.despensa;
        gastos[t] = res.aplicado;
      } else {
        despensa = devolver(despensa, gastos[t]);
        delete gastos[t];
      }
    }
    actualizar({
      bitacora: { ...estado.bitacora, [fecha]: { ...reg, hechos, gasto: gastos } },
      despensa,
    });
  };

  const ponerAgua = (n) => actualizar({ bitacora: { ...estado.bitacora, [fecha]: { ...reg, agua: n === reg.agua ? n - 1 : n } } });

  const consumido = TIEMPOS.reduce((acc, t) => {
    if (!reg.hechos[t.k] || !dia[t.k]) return acc;
    const r = indice[dia[t.k]];
    if (!r) return acc;
    const f = yo ? factorPorcion(yo) : 1;
    return { kcal: acc.kcal + r.kcal * f, prot: acc.prot + r.prot * f, carb: acc.carb + r.carb * f, gras: acc.gras + r.gras * f };
  }, { kcal: 0, prot: 0, carb: 0, gras: 0 });

  const meta = yo ? macrosDelDia(yo, fecha) : null;
  const entrenosHoy = yo ? entrenosDelDia(yo, fecha) : [];
  const metaVasos = yo ? vasosObjetivo(yo) : 8;
  const hechosHoy = TIEMPOS.filter((t) => dia[t.k] && reg.hechos[t.k]).length;
  const totalHoy = TIEMPOS.filter((t) => dia[t.k]).length;
  const esHoy = fecha === HOY();

  return (<>
    <div className="tarjeta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px' }}>
      <button className="btn chico suave" onClick={() => setFecha(iso(sumarDias(desdeIso(fecha), -1)))} aria-label="Día anterior">←</button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{esHoy ? 'Hoy' : etiquetaFecha(fecha).split(' de ')[0]}</div>
        <div style={{ fontSize: 11.5, color: 'var(--tinta-suave)' }}>{desdeIso(fecha).getDate()} de {MESES[desdeIso(fecha).getMonth()]}</div>
      </div>
      <button className="btn chico suave" onClick={() => setFecha(iso(sumarDias(desdeIso(fecha), 1)))} aria-label="Día siguiente">→</button>
    </div>

    {totalHoy === 0 ? (
      <div className="tarjeta"><div className="vacio">
        <span className="glifo">🍽</span>
        <p>No hay menú para este día. Genera la semana desde la pestaña Semana.</p>
      </div></div>
    ) : (<>
      <div className="tarjeta">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span className="pildora">{hechosHoy} de {totalHoy} registrados</span>
          <span style={{ fontSize: 11.5, color: 'var(--tinta-suave)' }}>{comensales.length} en la mesa</span>
        </div>
        {TIEMPOS.map((t) => {
          const r = indice[dia[t.k]];
          if (!r) return null;
          const on = !!reg.hechos[t.k];
          return (
            <div className="comida" key={t.k}>
              <button className={'marca' + (on ? ' on' : '')} onClick={() => alternar(t.k)}
                aria-label={`Marcar ${t.nombre} como comido`} aria-pressed={on}>{on ? '✓' : ''}</button>
              <div onClick={() => abrirReceta(r, fecha, t.k)} style={{ cursor: 'pointer' }}>
                <IlustracionPlatillo receta={r} size={52} radio={9} />
              </div>
              <div className="comida-cuerpo" onClick={() => abrirReceta(r, fecha, t.k)} style={{ cursor: 'pointer' }}>
                <div className="comida-tiempo">{t.nombre} · {t.hora}</div>
                <div className={'comida-nombre' + (on ? ' tachado' : '')}>{r.nombre}</div>
                <div className="comida-meta">{r.min} min · rinde {Math.round(porciones * 10) / 10} porciones</div>
              </div>
            </div>
          );
        })}
      </div>

      {meta && (<div className="tarjeta">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div className="titulo-seccion" style={{ margin: 0 }}>Tu aporte del día</div>
          {meta.extra > 0 && <span className="pildora jade">+{meta.extra} por entreno</span>}
        </div>
        <Medidor etq="Energía" valor={consumido.kcal} meta={meta.kcal} unidad="kcal" />
        <Medidor etq="Proteína" valor={consumido.prot} meta={meta.prot} unidad="g" tono="jade" />
        <Medidor etq="Hidratos" valor={consumido.carb} meta={meta.carb} unidad="g" tono="maiz" />
        <Medidor etq="Grasa" valor={consumido.gras} meta={meta.gras} unidad="g" tono="achiote" />
        <p className="nota">
          Se suma sólo lo que marcas como comido, con tu tamaño de porción.
          {meta.extra > 0
            ? ` Hoy entrenas, así que la meta sube de ${meta.base.toLocaleString('es-MX')} a ${meta.kcal.toLocaleString('es-MX')} kcal.`
            : ' Son cifras aproximadas de referencia.'}
        </p>
      </div>)}
    </>)}

    {entrenosHoy.length > 0 && (
      <div className="tarjeta plana" style={{ background: 'var(--jade-lavado)', border: 0 }}>
        <div className="comida-tiempo" style={{ color: 'var(--jade)' }}>Hoy entrenas</div>
        {entrenosHoy.map((e) => (
          <div key={e.id} style={{ fontSize: 14, fontWeight: 500, marginTop: 3 }}>
            {e.nombre} · {e.min} min{e.hora ? ` a las ${e.hora}` : ''}
          </div>
        ))}
      </div>
    )}

    <div className="tarjeta">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="titulo-seccion" style={{ margin: 0 }}>Agua</div>
        <span style={{ fontSize: 13, color: 'var(--tinta-media)' }}>{reg.agua} de {metaVasos} vasos</span>
      </div>
      <div className="vasos">
        {Array.from({ length: metaVasos }, (_, i) => (
          <button key={i} className={'vaso' + (i < reg.agua ? ' lleno' : '')} onClick={() => ponerAgua(i + 1)}
            aria-label={`Marcar ${i + 1} vasos`} />
        ))}
      </div>
      <p className="nota">Un vaso son 250 ml. La meta se calcula con 35 ml por kilo de peso.</p>
    </div>
  </>);
}

/* ══════════ PANTALLA: Semana ══════════ */
function PantallaSemana({ estado, actualizar, recetas, abrirReceta }) {
  const [ancla, setAncla] = useState(lunesDe(new Date()));
  const [config, setConfig] = useState(false);
  const [descanso, setDescanso] = useState(10);
  const dias = Array.from({ length: 7 }, (_, i) => iso(sumarDias(ancla, i)));
  const indice = useMemo(() => Object.fromEntries(recetas.map((r) => [r.id, r])), [recetas]);
  const hoy = HOY();

  const generar = (cuantos) => {
    const nuevo = generarMenu({
      recetas, fechaInicio: ancla, dias: cuantos, tiempos: TIEMPOS.map((t) => t.k), descanso,
    });
    actualizar({ plan: { ...estado.plan, ...nuevo } });
    setConfig(false);
  };

  const limpiar = () => {
    const plan = { ...estado.plan };
    dias.forEach((d) => delete plan[d]);
    actualizar({ plan });
  };

  const hayPlan = dias.some((d) => estado.plan[d] && Object.keys(estado.plan[d]).length);
  const mesTexto = `${MESES[ancla.getMonth()]} ${ancla.getFullYear()}`;

  return (<>
    <div className="tarjeta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px' }}>
      <button className="btn chico suave" onClick={() => setAncla(sumarDias(ancla, -7))} aria-label="Semana anterior">←</button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{ancla.getDate()} – {sumarDias(ancla, 6).getDate()}</div>
        <div style={{ fontSize: 11.5, color: 'var(--tinta-suave)', textTransform: 'capitalize' }}>{mesTexto}</div>
      </div>
      <button className="btn chico suave" onClick={() => setAncla(sumarDias(ancla, 7))} aria-label="Semana siguiente">→</button>
    </div>

    <div className="tarjeta">
      <div className="titulo-seccion" style={{ marginTop: 0 }}>La tira de la semana</div>
      <div className="tira" style={{ marginBottom: 8 }}>
        <span />
        {dias.map((d) => (
          <div key={d} className={'tira-dia' + (d === hoy ? ' hoy' : '')}>
            {DIAS_CORTO[desdeIso(d).getDay()]}<br />{desdeIso(d).getDate()}
          </div>
        ))}
      </div>
      {TIEMPOS.map((t) => (
        <div className="tira" key={t.k} style={{ marginBottom: 4 }}>
          <span className="tira-etq">{t.nombre.slice(0, 3)}</span>
          {dias.map((d) => {
            const id = (estado.plan[d] || {})[t.k];
            const hecho = ((estado.bitacora[d] || {}).hechos || {})[t.k];
            const cls = !id ? 'vacio' : hecho ? 'hecho' : 'plan';
            const r = indice[id];
            return (
              <button key={d + t.k} className={'azulejo ' + cls}
                title={r ? `${t.nombre} · ${r.nombre}` : 'Sin asignar'}
                aria-label={r ? `${t.nombre} del día ${desdeIso(d).getDate()}: ${r.nombre}` : 'Sin asignar'}
                onClick={() => r && abrirReceta(r, d, t.k)} />
            );
          })}
        </div>
      ))}
      <div className="leyenda">
        <span><i className="punto" style={{ background: 'var(--cobalto)' }} />Ya comido</span>
        <span><i className="punto" style={{ background: 'var(--cobalto-lavado)' }} />Planeado</span>
        <span><i className="punto" style={{ border: '1.5px dashed var(--linea-fuerte)' }} />Sin asignar</span>
      </div>
    </div>

    <div className="fila-btn" style={{ marginBottom: 12 }}>
      <button className="btn" onClick={() => setConfig(true)}>{hayPlan ? 'Regenerar' : 'Generar menú'}</button>
      {hayPlan && <button className="btn linea" onClick={limpiar}>Vaciar semana</button>}
    </div>

    {hayPlan && dias.map((d) => {
      const dia = estado.plan[d];
      if (!dia || !Object.keys(dia).length) return null;
      return (
        <div className="tarjeta" key={d}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <b style={{ fontSize: 14.5 }}>{etiquetaFecha(d).split(' de ')[0]}</b>
            {d === hoy && <span className="pildora">Hoy</span>}
          </div>
          {TIEMPOS.map((t) => {
            const r = indice[dia[t.k]];
            if (!r) return null;
            return (
              <div className="linea-lista" key={t.k} onClick={() => abrirReceta(r, d, t.k)} style={{ cursor: 'pointer' }}>
                <IlustracionPlatillo receta={r} size={40} radio={8} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="comida-tiempo">{t.nombre}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{r.nombre}</div>
                </div>
                <span className="cant">{r.min}′</span>
              </div>
            );
          })}
        </div>
      );
    })}

    {config && (
      <Hoja titulo="Generar menú" sub="Elige cuánto quieres planear por adelantado." onCerrar={() => setConfig(false)}>
        <div className="campo">
          <label>Días sin repetir un mismo platillo</label>
          <select value={descanso} onChange={(e) => setDescanso(+e.target.value)}>
            <option value={5}>5 días — más repetición, menos compras</option>
            <option value={10}>10 días — equilibrado</option>
            <option value={20}>20 días — máxima variedad</option>
          </select>
        </div>
        <div className="fila-btn" style={{ marginBottom: 8 }}>
          <button className="btn" onClick={() => generar(7)}>Una semana</button>
          <button className="btn suave" onClick={() => generar(30)}>Un mes</button>
        </div>
        <button className="btn linea" onClick={() => generar(365)}>Un año completo</button>
        <p className="nota">Se planea a partir del lunes que estás viendo. Cualquier platillo se puede cambiar después tocándolo.</p>
      </Hoja>
    )}
  </>);
}

/* ══════════ PANTALLA: Recetario ══════════ */
function PantallaRecetario({ recetas, porciones, onNueva }) {
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState('todo');
  const [ver, setVer] = useState(null);

  const lista = recetas.filter((r) => {
    if (filtro !== 'todo' && !r.tiempos.includes(filtro)) return false;
    if (!q.trim()) return true;
    const t = q.toLowerCase();
    return r.nombre.toLowerCase().includes(t) || r.ing.some((g) => g.item.toLowerCase().includes(t)) || r.tags.some((g) => g.includes(t));
  });

  return (<>
    <input className="buscador" value={q} onChange={(e) => setQ(e.target.value)}
      placeholder="Buscar por platillo o ingrediente" />
    <div className="chips">
      <button className={'chip' + (filtro === 'todo' ? ' on' : '')} onClick={() => setFiltro('todo')}>Todo</button>
      {TIEMPOS.map((t) => (
        <button key={t.k} className={'chip' + (filtro === t.k ? ' on' : '')} onClick={() => setFiltro(t.k)}>{t.nombre}</button>
      ))}
    </div>

    <button className="btn suave" style={{ marginBottom: 12 }} onClick={onNueva}>+ Agregar mi propia receta</button>

    {!lista.length ? (
      <div className="tarjeta"><div className="vacio"><span className="glifo">🔍</span>
        <p>Ningún platillo coincide. Prueba con otro ingrediente o agrega tu propia receta.</p></div></div>
    ) : (
      <div className="tarjeta">
        {lista.map((r) => (
          <div className="linea-lista" key={r.id} onClick={() => setVer(r)} style={{ cursor: 'pointer' }}>
            <IlustracionPlatillo receta={r} size={46} radio={8} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 500 }}>{r.nombre}</div>
              <div style={{ fontSize: 11.5, color: 'var(--tinta-suave)', marginTop: 2 }}>
                {r.tiempos.map((k) => (TIEMPOS.find((t) => t.k === k) || {}).nombre).filter(Boolean).join(' · ')}
              </div>
            </div>
            <span className="cant">{r.min}′</span>
          </div>
        ))}
      </div>
    )}
    <p className="nota" style={{ marginBottom: 8 }}>{lista.length} de {recetas.length} platillos.</p>
    {ver && <DetalleReceta receta={ver} porciones={porciones} onCerrar={() => setVer(null)} />}
  </>);
}

/* ══════════ Alta de receta propia ══════════ */
function AltaReceta({ onGuardar, onCerrar }) {
  const [nombre, setNombre] = useState('');
  const [min, setMin] = useState(20);
  const [tiempos, setTiempos] = useState(['C']);
  const [macros, setMacros] = useState({ kcal: '', prot: '', carb: '', gras: '' });
  const [ing, setIng] = useState([{ item: '', cant: '', unidad: 'g' }]);

  const cambiarIng = (i, k, v) => setIng(ing.map((g, j) => (i === j ? { ...g, [k]: v } : g)));
  const altTiempo = (k) => setTiempos(tiempos.includes(k) ? tiempos.filter((x) => x !== k) : [...tiempos, k]);
  const listo = nombre.trim() && tiempos.length && macros.kcal && ing.some((g) => g.item.trim() && g.cant);

  const guardar = () => onGuardar({
    id: 'mi_' + nuevoId(), nombre: nombre.trim(), tiempos, min: +min || 20, tags: ['mía'],
    kcal: +macros.kcal || 0, prot: +macros.prot || 0, carb: +macros.carb || 0, gras: +macros.gras || 0,
    ing: ing.filter((g) => g.item.trim() && g.cant).map((g) => ({ item: g.item.trim(), cant: +g.cant, unidad: g.unidad })),
  });

  return (
    <Hoja titulo="Nueva receta" sub="Las cantidades y el aporte son por una porción." onCerrar={onCerrar}>
      <div className="campo"><label>Nombre del platillo</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Caldo de la abuela" /></div>
      <div className="campo"><label>Minutos de preparación</label>
        <input type="number" inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} /></div>
      <div className="campo"><label>¿En qué tiempos puede salir?</label>
        <div className="chips" style={{ paddingBottom: 0 }}>
          {TIEMPOS.map((t) => (
            <button key={t.k} className={'chip' + (tiempos.includes(t.k) ? ' on' : '')} onClick={() => altTiempo(t.k)}>{t.nombre}</button>
          ))}
        </div>
      </div>
      <h3>Ingredientes por porción</h3>
      {ing.map((g, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 64px 68px', gap: 6, marginBottom: 7 }}>
          <input value={g.item} onChange={(e) => cambiarIng(i, 'item', e.target.value)} placeholder="Ingrediente"
            style={{ padding: '9px 10px', border: '1.5px solid var(--linea)', borderRadius: 'var(--r-s)' }} />
          <input type="number" inputMode="decimal" value={g.cant} onChange={(e) => cambiarIng(i, 'cant', e.target.value)} placeholder="100"
            style={{ padding: '9px 8px', border: '1.5px solid var(--linea)', borderRadius: 'var(--r-s)' }} />
          <select value={g.unidad} onChange={(e) => cambiarIng(i, 'unidad', e.target.value)}
            style={{ padding: '9px 6px', border: '1.5px solid var(--linea)', borderRadius: 'var(--r-s)' }}>
            {['g', 'ml', 'pza', 'reb', 'diente', 'taza'].map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
      ))}
      <button className="btn linea chico" style={{ width: '100%', marginBottom: 6 }}
        onClick={() => setIng([...ing, { item: '', cant: '', unidad: 'g' }])}>+ Otro ingrediente</button>
      <h3>Aporte por porción</h3>
      <div className="rejilla2">
        {[['kcal', 'Energía (kcal)'], ['prot', 'Proteína (g)'], ['carb', 'Hidratos (g)'], ['gras', 'Grasa (g)']].map(([k, etq]) => (
          <div className="campo" key={k}><label>{etq}</label>
            <input type="number" inputMode="decimal" value={macros[k]} onChange={(e) => setMacros({ ...macros, [k]: e.target.value })} /></div>
        ))}
      </div>
      <button className="btn" disabled={!listo} onClick={guardar}>Guardar receta</button>
      <p className="nota">Si no sabes el aporte exacto, una aproximación sirve: la app usa estos números sólo para orientar tus totales del día.</p>
    </Hoja>
  );
}

/* ══════════ PANTALLA: Súper y Despensa ══════════ */
function PantallaSuper({ estado, actualizar, recetas }) {
  const [pestana, setPestana] = useState('comprar');
  const [ancla, setAncla] = useState(lunesDe(new Date()));
  const desde = iso(ancla), hasta = iso(sumarDias(ancla, 6));
  const claveSemana = 'sem:' + desde;
  const marcados = estado.compras[claveSemana] || {};
  const despensa = estado.despensa || {};
  const comensales = estado.personas.filter((p) => p.come);
  const porciones = comensales.reduce((s, p) => s + factorPorcion(p), 0) || 1;

  const lista = useMemo(
    () => construirLista({ plan: estado.plan, recetas, porciones, pasillos: PASILLOS, desde, hasta, despensa }),
    [estado.plan, recetas, porciones, desde, hasta, despensa]
  );

  const pasillos = Object.keys(lista);
  const todas = pasillos.flatMap((p) => lista[p]);
  const porComprar = todas.filter((l) => l.falta > 0);
  const yaCubiertas = todas.length - porComprar.length;
  const listos = porComprar.filter((l) => marcados[claveIng(l.item, l.unidad)]).length;

  const alternar = (clave) => actualizar({
    compras: { ...estado.compras, [claveSemana]: { ...marcados, [clave]: !marcados[clave] } },
  });

  const guardarCompra = () => {
    const delta = {};
    for (const l of porComprar) {
      const k = claveIng(l.item, l.unidad);
      if (marcados[k]) delta[k] = l.falta;
    }
    if (!Object.keys(delta).length) return;
    actualizar({
      despensa: aplicarDelta(despensa, delta),
      compras: { ...estado.compras, [claveSemana]: {} },
    });
  };

  const copiar = () => {
    const texto = pasillos
      .filter((p) => lista[p].some((l) => l.falta > 0))
      .map((p) => `${p.toUpperCase()}\n` + lista[p].filter((l) => l.falta > 0)
        .map((l) => `- ${l.item}: ${l.falta} ${l.unidad}`).join('\n')).join('\n\n');
    navigator.clipboard?.writeText(`Lista del súper · ${desde} al ${hasta}\n\n${texto}`);
  };

  return (<>
    <div className="chips" style={{ marginBottom: 8 }}>
      <button className={'chip' + (pestana === 'comprar' ? ' on' : '')} onClick={() => setPestana('comprar')}>
        Por comprar{porComprar.length ? ` · ${porComprar.length}` : ''}
      </button>
      <button className={'chip' + (pestana === 'despensa' ? ' on' : '')} onClick={() => setPestana('despensa')}>
        En despensa{Object.keys(despensa).length ? ` · ${Object.keys(despensa).length}` : ''}
      </button>
    </div>

    {pestana === 'despensa' ? <Despensa {...{ estado, actualizar, recetas }} /> : (<>
      <div className="tarjeta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px' }}>
        <button className="btn chico suave" onClick={() => setAncla(sumarDias(ancla, -7))} aria-label="Semana anterior">←</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{ancla.getDate()} – {sumarDias(ancla, 6).getDate()}</div>
          <div style={{ fontSize: 11.5, color: 'var(--tinta-suave)', textTransform: 'capitalize' }}>{MESES[ancla.getMonth()]}</div>
        </div>
        <button className="btn chico suave" onClick={() => setAncla(sumarDias(ancla, 7))} aria-label="Semana siguiente">→</button>
      </div>

      {!todas.length ? (
        <div className="tarjeta"><div className="vacio"><span className="glifo">🛒</span>
          <p>Esta semana no tiene menú, así que no hay nada que comprar. Genera el menú y la lista aparece sola.</p></div></div>
      ) : !porComprar.length ? (
        <div className="tarjeta"><div className="vacio"><span className="glifo">✓</span>
          <p>Ya tienes en despensa todo lo que pide el menú de esta semana. No hace falta ir al súper.</p></div></div>
      ) : (<>
        <div className="tarjeta plana" style={{ background: 'var(--cobalto-lavado)', border: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--cobalto)' }}>{listos} de {porComprar.length} en el carrito</div>
              <div style={{ fontSize: 12, color: 'var(--tinta-media)' }}>
                Para {Math.round(porciones * 10) / 10} porciones diarias
                {yaCubiertas > 0 && ` · ${yaCubiertas} ya en despensa`}
              </div>
            </div>
            <button className="btn chico linea" onClick={copiar}>Copiar</button>
          </div>
        </div>

        {listos > 0 && (
          <button className="btn" style={{ marginBottom: 12 }} onClick={guardarCompra}>
            Guardar {listos} {listos === 1 ? 'artículo' : 'artículos'} en la despensa
          </button>
        )}

        {pasillos.map((p) => {
          const faltantes = lista[p].filter((l) => l.falta > 0);
          if (!faltantes.length) return null;
          return (
            <div className="tarjeta" key={p}>
              <div className="comida-tiempo" style={{ marginBottom: 6 }}>{p}</div>
              {faltantes.map((l) => {
                const clave = claveIng(l.item, l.unidad);
                const on = !!marcados[clave];
                return (
                  <div className={'linea-lista' + (on ? ' tachada' : '')} key={clave}
                    onClick={() => alternar(clave)} style={{ cursor: 'pointer' }}>
                    <span className={'check' + (on ? ' on' : '')}>{on ? '✓' : ''}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="nombre-item">{l.item}</div>
                      {l.tengo > 0 && (
                        <div style={{ fontSize: 11, color: 'var(--jade)' }}>
                          ya tienes {l.tengo} de {l.cant} {l.unidad}
                        </div>
                      )}
                    </div>
                    <span className="cant">{l.falta} {l.unidad}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </>)}
    </>)}
  </>);
}

/* ══════════ Despensa ══════════ */
function Despensa({ estado, actualizar, recetas }) {
  const [alta, setAlta] = useState(false);
  const despensa = estado.despensa || {};
  const catalogo = useMemo(() => catalogoIngredientes(recetas), [recetas]);

  const entradas = Object.entries(despensa).map(([k, cant]) => {
    const [item, unidad] = k.split('|');
    return { k, item, unidad, cant };
  }).sort((a, b) => a.item.localeCompare(b.item));

  const buscarPasillo = (item) => {
    for (const [n, items] of Object.entries(PASILLOS)) if (items.includes(item)) return n;
    return 'Otros';
  };
  const porPasillo = {};
  for (const e of entradas) {
    const p = buscarPasillo(e.item);
    (porPasillo[p] = porPasillo[p] || []).push(e);
  }

  const ajustar = (k, delta) => actualizar({ despensa: aplicarDelta(despensa, { [k]: delta }) });
  const quitar = (k) => { const d = { ...despensa }; delete d[k]; actualizar({ despensa: d }); };

  return (<>
    <button className="btn" style={{ marginBottom: 12 }} onClick={() => setAlta(true)}>+ Agregar a la despensa</button>

    {!entradas.length ? (
      <div className="tarjeta"><div className="vacio"><span className="glifo">🫙</span>
        <p>La despensa está vacía. Registra lo que ya tienes en casa y la lista del súper dejará de pedírtelo.</p></div></div>
    ) : Object.keys(porPasillo).sort().map((p) => (
      <div className="tarjeta" key={p}>
        <div className="comida-tiempo" style={{ marginBottom: 6 }}>{p}</div>
        {porPasillo[p].map((e) => (
          <div className="linea-lista" key={e.k}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="nombre-item">{e.item}</div>
              <button onClick={() => quitar(e.k)}
                style={{ fontSize: 11, color: 'var(--achiote)', padding: '2px 0' }}>Quitar</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="btn chico suave" onClick={() => ajustar(e.k, -paso(e.unidad))} aria-label="Restar">−</button>
              <span className="cant" style={{ minWidth: 62, textAlign: 'center' }}>{e.cant} {e.unidad}</span>
              <button className="btn chico suave" onClick={() => ajustar(e.k, paso(e.unidad))} aria-label="Sumar">+</button>
            </div>
          </div>
        ))}
      </div>
    ))}

    <p className="nota">Cuando marcas una comida como hecha en la pantalla Hoy, sus ingredientes se descuentan solos de aquí. Si la desmarcas, regresan.</p>

    {alta && <AltaDespensa catalogo={catalogo} despensa={despensa} onCerrar={() => setAlta(false)}
      onGuardar={(k, cant) => { actualizar({ despensa: aplicarDelta(despensa, { [k]: cant }) }); setAlta(false); }} />}
  </>);
}

const paso = (u) => (u === 'g' || u === 'ml' ? 50 : 1);

function AltaDespensa({ catalogo, despensa, onGuardar, onCerrar }) {
  const [q, setQ] = useState('');
  const [elegido, setElegido] = useState(null);
  const [cant, setCant] = useState('');

  const sugerencias = q.trim()
    ? catalogo.filter((c) => c.item.toLowerCase().includes(q.toLowerCase())).slice(0, 12)
    : catalogo.slice(0, 12);

  if (elegido) {
    const k = claveIng(elegido.item, elegido.unidad);
    const ya = despensa[k] || 0;
    return (
      <Hoja titulo={elegido.item} sub={ya ? `Ya tienes ${ya} ${elegido.unidad} registrados.` : null} onCerrar={onCerrar}>
        <div className="campo">
          <label>¿Cuánto agregas? (en {elegido.unidad})</label>
          <input type="number" inputMode="decimal" autoFocus value={cant}
            onChange={(e) => setCant(e.target.value)} placeholder={String(paso(elegido.unidad) * 4)} />
        </div>
        <div className="fila-btn">
          <button className="btn linea" onClick={() => setElegido(null)}>Atrás</button>
          <button className="btn" disabled={!cant || +cant <= 0} onClick={() => onGuardar(k, +cant)}>Agregar</button>
        </div>
      </Hoja>
    );
  }

  return (
    <Hoja titulo="Agregar a la despensa" sub="Busca el ingrediente tal como lo usan las recetas." onCerrar={onCerrar}>
      <input className="buscador" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jitomate, arroz, huevo…" />
      {!sugerencias.length ? (
        <p className="nota">Ningún ingrediente coincide. Sólo se pueden guardar los que aparecen en alguna receta.</p>
      ) : sugerencias.map((c) => (
        <div className="linea-lista" key={claveIng(c.item, c.unidad)} onClick={() => setElegido(c)} style={{ cursor: 'pointer' }}>
          <span className="nombre-item">{c.item}</span>
          <span className="cant">{despensa[claveIng(c.item, c.unidad)] ? `${despensa[claveIng(c.item, c.unidad)]} ${c.unidad}` : c.unidad}</span>
        </div>
      ))}
    </Hoja>
  );
}

/* ══════════ PANTALLA: Progreso ══════════ */
function PantallaProgreso({ estado, actualizar }) {
  const [vista, setVista] = useState('medidas');
  const [quien, setQuien] = useState(estado.personas[0]?.id || '');
  const [alta, setAlta] = useState(false);
  const persona = estado.personas.find((p) => p.id === quien) || estado.personas[0];
  const [campo, setCampo] = useState('peso');

  const mias = estado.medidas.filter((m) => m.personaId === (persona || {}).id)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const CAMPOS = [['peso', 'Peso', 'kg'], ['cintura', 'Cintura', 'cm'], ['cadera', 'Cadera', 'cm'], ['pecho', 'Pecho', 'cm']];
  const unidad = (CAMPOS.find((c) => c[0] === campo) || [])[2];
  const datos = mias.filter((m) => m[campo]).map((m) => ({
    v: +m[campo], etq: `${desdeIso(m.fecha).getDate()}/${desdeIso(m.fecha).getMonth() + 1}`,
  }));

  const ultimo = mias[mias.length - 1];
  const previo = mias[mias.length - 2];
  const delta = ultimo && previo && ultimo[campo] && previo[campo] ? (+ultimo[campo] - +previo[campo]) : null;

  if (!persona) return <div className="tarjeta"><div className="vacio"><p>Primero agrega a alguien a la familia.</p></div></div>;

  return (<>
    <div className="chips">
      <button className={'chip' + (vista === 'medidas' ? ' on' : '')} onClick={() => setVista('medidas')}>Medidas</button>
      <button className={'chip' + (vista === 'familia' ? ' on' : '')} onClick={() => setVista('familia')}>Familia</button>
    </div>
    {vista === 'familia' ? <PantallaFamilia {...{ estado, actualizar }} /> : <>
    {estado.personas.length > 1 && (
      <div className="chips">
        {estado.personas.map((p) => (
          <button key={p.id} className={'chip' + (p.id === quien ? ' on' : '')} onClick={() => setQuien(p.id)}>{p.nombre}</button>
        ))}
      </div>
    )}

    <div className="chips">
      {CAMPOS.map(([k, etq]) => (
        <button key={k} className={'chip' + (campo === k ? ' on' : '')} onClick={() => setCampo(k)}>{etq}</button>
      ))}
    </div>

    <div className="tarjeta">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <div>
          <div className="comida-tiempo">{(CAMPOS.find((c) => c[0] === campo) || [])[1]}</div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 27, fontWeight: 600, lineHeight: 1.1 }}>
            {ultimo && ultimo[campo] ? `${ultimo[campo]} ${unidad}` : '—'}
          </div>
        </div>
        {delta !== null && Math.abs(delta) > 0.01 && (
          <span className={'pildora ' + (delta < 0 ? 'jade' : 'maiz')}>
            {delta > 0 ? '+' : ''}{delta.toFixed(1)} {unidad}
          </span>
        )}
      </div>
      <Grafica datos={datos} unidad={unidad} />
    </div>

    <button className="btn" onClick={() => setAlta(true)}>Registrar medidas de hoy</button>

    {mias.length > 0 && (<>
      <div className="titulo-seccion">Historial</div>
      <div className="tarjeta">
        {[...mias].reverse().slice(0, 15).map((m) => (
          <div className="linea-lista" key={m.id}>
            <span className="nombre-item" style={{ fontSize: 13.5 }}>{etiquetaFecha(m.fecha)}</span>
            <span className="cant">
              {CAMPOS.filter(([k]) => m[k]).map(([k, , u]) => `${m[k]}${u}`).join(' · ')}
            </span>
          </div>
        ))}
      </div>
    </>)}

    </>}
    {alta && <AltaMedida persona={persona} onCerrar={() => setAlta(false)} onGuardar={(m) => {
      const otras = estado.medidas.filter((x) => !(x.personaId === m.personaId && x.fecha === m.fecha));
      const personas = m.peso
        ? estado.personas.map((p) => (p.id === m.personaId ? { ...p, peso: +m.peso } : p))
        : estado.personas;
      actualizar({ medidas: [...otras, m], personas });
      setAlta(false);
    }} />}
  </>);
}

function AltaMedida({ persona, onGuardar, onCerrar }) {
  const [f, setF] = useState({ fecha: HOY(), peso: persona.peso || '', cintura: '', cadera: '', pecho: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Hoja titulo={'Medidas de ' + persona.nombre} sub="Deja en blanco lo que no midas hoy." onCerrar={onCerrar}>
      <div className="campo"><label>Fecha</label><input type="date" value={f.fecha} onChange={set('fecha')} /></div>
      <div className="rejilla2">
        <div className="campo"><label>Peso (kg)</label><input type="number" inputMode="decimal" value={f.peso} onChange={set('peso')} /></div>
        <div className="campo"><label>Cintura (cm)</label><input type="number" inputMode="decimal" value={f.cintura} onChange={set('cintura')} /></div>
        <div className="campo"><label>Cadera (cm)</label><input type="number" inputMode="decimal" value={f.cadera} onChange={set('cadera')} /></div>
        <div className="campo"><label>Pecho (cm)</label><input type="number" inputMode="decimal" value={f.pecho} onChange={set('pecho')} /></div>
      </div>
      <button className="btn" onClick={() => onGuardar({ id: nuevoId(), personaId: persona.id, ...f })}>Guardar</button>
      <p className="nota">Pesarte siempre a la misma hora y en las mismas condiciones hace que la tendencia sea más útil que el número de un solo día.</p>
    </Hoja>
  );
}

/* ══════════ PANTALLA: Familia ══════════ */
function PantallaFamilia({ estado, actualizar }) {
  const [edita, setEdita] = useState(null);
  const [alta, setAlta] = useState(false);

  const guardar = (p) => {
    const existe = estado.personas.some((x) => x.id === p.id);
    actualizar({ personas: existe ? estado.personas.map((x) => (x.id === p.id ? p : x)) : [...estado.personas, p] });
    setEdita(null); setAlta(false);
  };

  return (<>
    {estado.personas.map((p) => {
      const kcal = energiaDiaria(p);
      return (
        <div className="tarjeta" key={p.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 600 }}>{p.nombre}</div>
              <div style={{ fontSize: 12.5, color: 'var(--tinta-media)', marginTop: 2 }}>
                {edadDesde(p.fechaNac)} años · {p.peso} kg · {p.estatura} cm
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 9, flexWrap: 'wrap' }}>
                {kcal && <span className="pildora">{kcal.toLocaleString('es-MX')} kcal</span>}
                <span className="pildora gris">porción ×{factorPorcion(p)}</span>
                <span className={'pildora ' + (p.come ? 'jade' : 'gris')}>{p.come ? 'En la mesa' : 'Fuera esta semana'}</span>
              </div>
            </div>
            <button className="btn chico linea" onClick={() => setEdita(p)}>Editar</button>
          </div>
          <button className="btn linea chico" style={{ width: '100%', marginTop: 12 }}
            onClick={() => actualizar({ personas: estado.personas.map((x) => (x.id === p.id ? { ...x, come: !x.come } : x)) })}>
            {p.come ? 'Marcar que no come en casa' : 'Volver a contar en las porciones'}
          </button>
        </div>
      );
    })}

    <button className="btn" onClick={() => setAlta(true)}>+ Agregar a alguien</button>
    <p className="nota">El primero de la lista es quien ve sus totales en la pantalla Hoy. Las porciones de cada receta se multiplican según quién esté en la mesa.</p>

    <div className="aviso" style={{ marginTop: 14 }}>
      Todo se guarda en este dispositivo. Si borras los datos del navegador o desinstalas la app, se pierde. Exporta un respaldo de vez en cuando desde el botón de abajo.
    </div>
    <p className="nota" style={{ textAlign: 'center' }}>Mesa versión {VERSION}</p>
    <button className="btn linea" style={{ marginTop: 4 }} onClick={() => {
      const blob = new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `mesa-respaldo-${HOY()}.json`;
      a.click();
    }}>Descargar respaldo</button>

    {(edita || alta) && (
      <FormaPersona inicial={edita} onGuardar={guardar} onCerrar={() => { setEdita(null); setAlta(false); }}
        onBorrar={edita && estado.personas.length > 1 ? () => {
          actualizar({ personas: estado.personas.filter((x) => x.id !== edita.id) });
          setEdita(null);
        } : null} />
    )}
  </>);
}

/* ══════════ Cambiar platillo del plan ══════════ */
function Cambiador({ tiempo, recetas, onElegir, onCerrar }) {
  const [q, setQ] = useState('');
  const aptas = recetas.filter((r) => r.tiempos.includes(tiempo) &&
    (!q.trim() || r.nombre.toLowerCase().includes(q.toLowerCase())));
  const nombreTiempo = (TIEMPOS.find((t) => t.k === tiempo) || {}).nombre;
  return (
    <Hoja titulo={'Cambiar ' + (nombreTiempo || '').toLowerCase()} onCerrar={onCerrar}>
      <input className="buscador" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar platillo" />
      {aptas.map((r) => (
        <div className="linea-lista" key={r.id} onClick={() => onElegir(r.id)} style={{ cursor: 'pointer' }}>
          <IlustracionPlatillo receta={r} size={42} radio={8} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 500 }}>{r.nombre}</div>
            <div style={{ fontSize: 11.5, color: 'var(--tinta-suave)' }}>{r.kcal} kcal · {r.min} min</div>
          </div>
        </div>
      ))}
    </Hoja>
  );
}

/* ══════════ Bienvenida ══════════ */
function Bienvenida({ onListo }) {
  return (
    <div className="app">
      <div className="encabezado" style={{ paddingTop: 44 }}>
        <p className="eyebrow">Bienvenido</p>
        <h1>Mesa</h1>
        <p className="sub">Menús para toda la semana, la lista del súper hecha sola y el registro de lo que sí comiste. Empieza por decirme quién eres.</p>
      </div>
      <div className="lienzo">
        <FormaPersona onGuardar={onListo} onCerrar={() => {}} />
      </div>
    </div>
  );
}

/* ══════════ Raíz ══════════ */
const VACIO = { personas: [], plan: {}, bitacora: {}, medidas: [], misRecetas: [], compras: {}, despensa: {}, rutina: null };

function App() {
  const [estado, setEstado] = useState(null);
  const [pantalla, setPantallaRaw] = useState('hoy');
  const [previa, setPrevia] = useState('hoy');
  const setPantalla = useCallback((p) => {
    setPantallaRaw((actual) => { if (p === 'ayuda' && actual !== 'ayuda') setPrevia(actual); return p; });
  }, []);
  const [detalle, setDetalle] = useState(null);
  const [cambiar, setCambiar] = useState(null);
  const [nuevaReceta, setNuevaReceta] = useState(false);

  useEffect(() => {
    (async () => setEstado({ ...VACIO, ...(await almacen.leer('estado', VACIO)) }))();
  }, []);

  const actualizar = useCallback((parche) => {
    setEstado((prev) => {
      const sig = { ...prev, ...parche };
      almacen.guardar('estado', sig);
      return sig;
    });
  }, []);

  if (!estado) return <div className="app"><div className="lienzo" style={{ paddingTop: 60, textAlign: 'center', color: 'var(--tinta-suave)' }}>Abriendo Mesa…</div></div>;
  if (!estado.personas.length) return <Bienvenida onListo={(p) => actualizar({ personas: [p] })} />;

  const recetas = [...RECETAS, ...estado.misRecetas];
  const comensales = estado.personas.filter((p) => p.come);
  const porciones = Math.round((comensales.reduce((s, p) => s + factorPorcion(p), 0) || 1) * 10) / 10;

  const abrirReceta = (r, fecha, tiempo) => setDetalle({ receta: r, fecha, tiempo });

  const PANTALLAS = {
    hoy: { glifo: '☀', etq: 'Hoy', titulo: 'Hoy', sub: 'Marca cada tiempo conforme lo comas.' },
    semana: { glifo: '▦', etq: 'Semana', titulo: 'La semana', sub: 'Un azulejo por tiempo de comida.' },
    entreno: { glifo: '⚡', etq: 'Entreno', titulo: 'Entrenamiento', sub: 'Tus sesiones, tu rutina y cómo van con la comida.' },
    recetario: { glifo: '☰', etq: 'Recetario', titulo: 'Recetario', sub: `${recetas.length} platillos de casa.` },
    super: { glifo: '⛬', etq: 'Súper', titulo: 'Súper y despensa', sub: 'Lo que falta comprar y lo que ya hay en casa.' },
    progreso: { glifo: '◔', etq: 'Progreso', titulo: 'Progreso', sub: 'Medidas, tendencias y quién come en casa.' },
  };
  const p = PANTALLAS[pantalla] || PANTALLAS.hoy;

  return (
    <div className="app">
      <div className="encabezado">
        <div className="cabecera-fila">
          <div style={{ minWidth: 0 }}>
            <p className="eyebrow">Mesa</p>
            <h1>{pantalla === 'ayuda' ? 'Ayuda' : p.titulo}</h1>
            <p className="sub">{pantalla === 'ayuda' ? 'Cómo usar la app y qué cambió en cada versión.' : p.sub}</p>
          </div>
          <button className={'btn-ayuda' + (pantalla === 'ayuda' ? ' on' : '')}
            aria-label={pantalla === 'ayuda' ? 'Cerrar ayuda' : 'Abrir ayuda y manual'}
            onClick={() => setPantalla(pantalla === 'ayuda' ? previa : 'ayuda')}>
            {pantalla === 'ayuda' ? '✕' : '?'}
          </button>
        </div>
      </div>

      <div className="lienzo">
        {pantalla === 'hoy' && <PantallaHoy {...{ estado, actualizar, recetas, abrirReceta }} />}
        {pantalla === 'semana' && <PantallaSemana {...{ estado, actualizar, recetas, abrirReceta }} />}
        {pantalla === 'entreno' && <PantallaEntreno {...{ estado, actualizar, recetas, Hoja }} />}
        {pantalla === 'recetario' && <PantallaRecetario recetas={recetas} porciones={porciones} onNueva={() => setNuevaReceta(true)} />}
        {pantalla === 'super' && <PantallaSuper {...{ estado, actualizar, recetas }} />}
        {pantalla === 'progreso' && <PantallaProgreso {...{ estado, actualizar }} />}
        {pantalla === 'ayuda' && <PantallaAyuda Hoja={Hoja} />}
      </div>

      <nav className="nav"><div className="nav-int">
        {Object.entries(PANTALLAS).map(([k, v]) => (
          <button key={k} className={pantalla === k ? 'on' : ''} onClick={() => setPantalla(k)} aria-current={pantalla === k}>
            <span className="glifo">{v.glifo}</span>{v.etq}
          </button>
        ))}
      </div></nav>

      {detalle && (
        <DetalleReceta receta={detalle.receta} porciones={porciones} onCerrar={() => setDetalle(null)}
          onCambiar={detalle.fecha ? () => { setCambiar({ fecha: detalle.fecha, tiempo: detalle.tiempo }); setDetalle(null); } : null} />
      )}

      {cambiar && (
        <Cambiador tiempo={cambiar.tiempo} recetas={recetas} onCerrar={() => setCambiar(null)}
          onElegir={(id) => {
            actualizar({ plan: { ...estado.plan, [cambiar.fecha]: { ...(estado.plan[cambiar.fecha] || {}), [cambiar.tiempo]: id } } });
            setCambiar(null);
          }} />
      )}

      {nuevaReceta && (
        <AltaReceta onCerrar={() => setNuevaReceta(false)}
          onGuardar={(r) => { actualizar({ misRecetas: [...estado.misRecetas, r] }); setNuevaReceta(false); }} />
      )}
    </div>
  );
}

createRoot(document.getElementById('raiz')).render(<App />);
