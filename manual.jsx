import React, { useState, useEffect, useRef } from 'react';
import { ALIMENTOS, CATEGORIAS_ALIMENTO, UNIDADES, buscarAlimentos } from './data/alimentos.js';
import { TIEMPOS } from './data/recetas.js';

const nid = () => Math.random().toString(36).slice(2, 10);
const red = (n) => Math.round((Number(n) || 0) * 10) / 10;

// ── Open Food Facts ────────────────────────────────────────────────────────
// Base abierta de productos alimenticios, sin llave de API. Los datos los
// aportan usuarios voluntarios, así que pueden estar incompletos o
// equivocados: siempre se muestran para que el usuario los revise antes de
// guardar. Cada producto consultado se guarda en caché local, así el segundo
// escaneo del mismo código funciona sin conexión.

const OFF_CAMPOS = 'product_name,product_name_es,brands,quantity,serving_size,nutriments';

export async function consultarProducto(codigo) {
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(codigo)}.json?fields=${OFF_CAMPOS}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('sin-respuesta');
  const datos = await res.json();
  if (!datos || datos.status === 0 || !datos.product) throw new Error('no-encontrado');

  const p = datos.product;
  const n = p.nutriments || {};
  const por100 = {
    kcal: n['energy-kcal_100g'] ?? (n.energy_100g ? n.energy_100g / 4.184 : null),
    prot: n.proteins_100g ?? null,
    carb: n.carbohydrates_100g ?? null,
    gras: n.fat_100g ?? null,
  };
  if (por100.kcal == null) throw new Error('sin-datos');

  return {
    codigo,
    nombre: (p.product_name_es || p.product_name || '').trim() || 'Producto sin nombre',
    marca: (p.brands || '').split(',')[0].trim(),
    porcion: p.serving_size || p.quantity || '',
    por100: {
      kcal: Math.round(por100.kcal),
      prot: red(por100.prot),
      carb: red(por100.carb),
      gras: red(por100.gras),
    },
  };
}

export const soportaEscaneo = () =>
  typeof window !== 'undefined' && 'BarcodeDetector' in window &&
  !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

// ── Cámara ────────────────────────────────────────────────────────────────
function Camara({ onCodigo, onError }) {
  const video = useRef(null);
  const vivo = useRef(true);

  useEffect(() => {
    let flujo, detector;
    vivo.current = true;

    (async () => {
      try {
        detector = new window.BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'],
        });
        flujo = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (!vivo.current) { flujo.getTracks().forEach((t) => t.stop()); return; }
        if (video.current) { video.current.srcObject = flujo; await video.current.play(); }

        const buscar = async () => {
          if (!vivo.current || !video.current) return;
          try {
            const hallados = await detector.detect(video.current);
            if (hallados && hallados.length) { onCodigo(hallados[0].rawValue); return; }
          } catch (e) { /* un cuadro fallido no importa, se sigue intentando */ }
          if (vivo.current) setTimeout(buscar, 320);
        };
        setTimeout(buscar, 500);
      } catch (e) {
        onError(e && e.name === 'NotAllowedError' ? 'permiso' : 'camara');
      }
    })();

    return () => {
      vivo.current = false;
      if (flujo) flujo.getTracks().forEach((t) => t.stop());
    };
  }, [onCodigo, onError]);

  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#000', marginBottom: 12 }}>
      <video ref={video} playsInline muted style={{ width: '100%', display: 'block', maxHeight: 260, objectFit: 'cover' }} />
      <div style={{
        position: 'absolute', inset: '22% 12%', border: '2.5px solid rgba(255,255,255,.85)',
        borderRadius: 10, boxShadow: '0 0 0 9999px rgba(0,0,0,.28)',
      }} />
    </div>
  );
}

// ── Escáner ───────────────────────────────────────────────────────────────
function Escaner({ productos, onProducto, onCerrar, onAtras, onGuardarCache, Hoja }) {
  const [modo, setModo] = useState(soportaEscaneo() ? 'camara' : 'teclado');
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState(null);
  const [error, setError] = useState(null);

  const resolver = async (valor) => {
    const limpio = String(valor).replace(/\D/g, '');
    if (limpio.length < 6) { setError('corto'); return; }
    setModo('espera'); setEstado('buscando'); setError(null);

    const enCache = productos[limpio];
    if (enCache) { onProducto(enCache, true); return; }

    try {
      const prod = await consultarProducto(limpio);
      onGuardarCache(prod);
      onProducto(prod, false);
    } catch (e) {
      setEstado(null);
      setError(e.message === 'no-encontrado' ? 'no-encontrado'
        : e.message === 'sin-datos' ? 'sin-datos' : 'red');
      setCodigo(limpio);
      setModo('teclado');
    }
  };

  const mensajes = {
    'no-encontrado': 'Ese código no está en la base de datos. Es normal con productos mexicanos poco comunes: captúralo a mano y queda guardado.',
    'sin-datos': 'El producto existe pero nadie ha subido su información nutrimental. Captúrala a mano leyendo la etiqueta.',
    red: 'No se pudo consultar la base de datos. Revisa tu conexión, o captura el producto a mano.',
    permiso: 'No diste permiso de cámara. Puedes escribir el código a mano.',
    camara: 'No se pudo abrir la cámara. Escribe el código a mano.',
    corto: 'Ese código parece incompleto. Los códigos de barras tienen entre 8 y 13 dígitos.',
  };

  return (
    <Hoja titulo="Escanear producto" onCerrar={onCerrar}>
      {modo === 'camara' && (<>
        <Camara onCodigo={resolver} onError={(e) => { setError(e); setModo('teclado'); }} />
        <p className="nota" style={{ marginTop: 0 }}>
          Apunta al código de barras. Si tarda, hay buena luz de por medio: también puedes escribirlo.
        </p>
        <div className="fila-btn">
          <button className="btn linea" onClick={onAtras}>Atrás</button>
          <button className="btn suave" onClick={() => setModo('teclado')}>Escribir el código</button>
        </div>
      </>)}

      {modo === 'espera' && (
        <div className="vacio"><span className="glifo">⟳</span>
          <p>{estado === 'buscando' ? 'Consultando la base de datos…' : 'Un momento…'}</p></div>
      )}

      {modo === 'teclado' && (<>
        {error && <div className="aviso" style={{ marginBottom: 12 }}>{mensajes[error]}</div>}
        <div className="campo">
          <label>Código de barras</label>
          <input type="tel" inputMode="numeric" autoFocus value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))} placeholder="7501234567890" />
        </div>
        <div className="fila-btn">
          {soportaEscaneo()
            ? <button className="btn linea" onClick={() => { setError(null); setModo('camara'); }}>Usar cámara</button>
            : <button className="btn linea" onClick={onAtras}>Atrás</button>}
          <button className="btn" disabled={codigo.length < 6} onClick={() => resolver(codigo)}>Buscar</button>
        </div>
        <p className="nota">
          Los datos vienen de Open Food Facts, una base abierta hecha por voluntarios. Siempre
          revisa las cifras contra la etiqueta antes de guardar.
        </p>
      </>)}
    </Hoja>
  );
}

// ── Ajuste de porción de un producto escaneado ────────────────────────────
function AjustarProducto({ producto, deCache, onListo, onAtras, onCerrar, Hoja }) {
  const [gramos, setGramos] = useState('100');
  const f = (Number(gramos) || 0) / 100;
  const p = producto.por100;
  const total = {
    kcal: Math.round(p.kcal * f), prot: red(p.prot * f),
    carb: red(p.carb * f), gras: red(p.gras * f),
  };

  return (
    <Hoja titulo={producto.nombre} sub={[producto.marca, producto.porcion].filter(Boolean).join(' · ')} onCerrar={onCerrar}>
      {deCache && <div className="aviso" style={{ marginBottom: 12 }}>
        Este producto ya lo habías escaneado antes, así que se tomó de la memoria del teléfono.
      </div>}
      <div className="tarjeta plana" style={{ background: 'var(--cal)', marginBottom: 14 }}>
        <div className="comida-tiempo" style={{ marginBottom: 6 }}>Por cada 100 g o ml</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="pildora">{p.kcal} kcal</span>
          <span className="pildora jade">{p.prot} g proteína</span>
          <span className="pildora maiz">{p.carb} g hidratos</span>
          <span className="pildora gris">{p.gras} g grasa</span>
        </div>
      </div>
      <div className="campo">
        <label>¿Cuánto comiste? (gramos o mililitros)</label>
        <input type="number" inputMode="decimal" value={gramos} onChange={(e) => setGramos(e.target.value)} />
      </div>
      <div className="chips" style={{ paddingBottom: 6 }}>
        {[30, 50, 100, 150, 250, 355].map((g) => (
          <button key={g} className={'chip' + (+gramos === g ? ' on' : '')} onClick={() => setGramos(String(g))}>{g}</button>
        ))}
      </div>
      <div className="tarjeta plana" style={{ background: 'var(--cobalto-lavado)', border: 0, marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: 'var(--cobalto)' }}>
          Se registrarán <b>{total.kcal} kcal</b> · {total.prot} P · {total.carb} H · {total.gras} G
        </div>
      </div>
      <div className="fila-btn">
        <button className="btn linea" onClick={onAtras}>Atrás</button>
        <button className="btn" disabled={!(Number(gramos) > 0)} onClick={() => onListo({
          nombre: producto.nombre + (producto.marca ? ` (${producto.marca})` : ''),
          cant: Number(gramos), unidad: 'g', ...total, fuente: 'codigo', codigo: producto.codigo,
        })}>Continuar</button>
      </div>
      <p className="nota">Fuente: Open Food Facts. Datos aportados por voluntarios, revísalos si algo no cuadra.</p>
    </Hoja>
  );
}

// ── Captura libre ─────────────────────────────────────────────────────────
function CapturaLibre({ inicial, onListo, onAtras, onCerrar, Hoja }) {
  const [f, setF] = useState(inicial || {
    nombre: '', cant: 1, unidad: 'porción', kcal: '', prot: '', carb: '', gras: '',
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const listo = f.nombre.trim() && f.kcal !== '' && Number(f.kcal) >= 0;

  return (
    <Hoja titulo="Escribir lo que comí" sub="Si no sabes las cifras exactas, un aproximado sirve." onCerrar={onCerrar}>
      <div className="campo"><label>¿Qué comiste?</label>
        <input autoFocus value={f.nombre} onChange={set('nombre')} placeholder="Gelatina de limón del hospital" /></div>
      <div className="rejilla2">
        <div className="campo"><label>Cantidad</label>
          <input type="number" inputMode="decimal" value={f.cant} onChange={set('cant')} /></div>
        <div className="campo"><label>Unidad</label>
          <select value={f.unidad} onChange={set('unidad')}>
            {UNIDADES.map((u) => <option key={u}>{u}</option>)}
          </select></div>
      </div>
      <div className="campo"><label>Calorías</label>
        <input type="number" inputMode="numeric" value={f.kcal} onChange={set('kcal')} placeholder="60" /></div>
      <div className="rejilla2">
        {[['prot', 'Proteína (g)'], ['carb', 'Hidratos (g)'], ['gras', 'Grasa (g)']].map(([k, etq]) => (
          <div className="campo" key={k}><label>{etq}</label>
            <input type="number" inputMode="decimal" value={f[k]} onChange={set(k)} placeholder="0" /></div>
        ))}
      </div>
      <div className="fila-btn">
        <button className="btn linea" onClick={onAtras}>Atrás</button>
        <button className="btn" disabled={!listo} onClick={() => onListo({
          nombre: f.nombre.trim(), cant: Number(f.cant) || 1, unidad: f.unidad,
          kcal: Math.round(Number(f.kcal) || 0), prot: red(f.prot), carb: red(f.carb), gras: red(f.gras),
          fuente: 'manual',
        })}>Continuar</button>
      </div>
      <p className="nota">
        Los tres campos de macronutrientes son opcionales: si los dejas vacíos sólo se
        cuentan las calorías.
      </p>
    </Hoja>
  );
}

// ── Elegir a qué tiempo pertenece ─────────────────────────────────────────
function ElegirTiempo({ item, tiempoSugerido, onGuardar, onAtras, onCerrar, Hoja }) {
  const [tiempo, setTiempo] = useState(tiempoSugerido || 'C');
  return (
    <Hoja titulo="¿En qué tiempo?" sub={`${item.nombre} · ${item.kcal} kcal`} onCerrar={onCerrar}>
      <div style={{ marginBottom: 14 }}>
        {TIEMPOS.map((t) => (
          <div className="linea-lista" key={t.k} onClick={() => setTiempo(t.k)} style={{ cursor: 'pointer' }}>
            <span className={'check' + (tiempo === t.k ? ' on' : '')}>{tiempo === t.k ? '✓' : ''}</span>
            <span className="nombre-item">{t.nombre}</span>
            <span className="cant">{t.hora}</span>
          </div>
        ))}
      </div>
      <div className="fila-btn">
        <button className="btn linea" onClick={onAtras}>Atrás</button>
        <button className="btn" onClick={() => onGuardar({ ...item, id: nid(), tiempo })}>Guardar</button>
      </div>
    </Hoja>
  );
}

// ── Hoja principal de registro ────────────────────────────────────────────
export function AgregarComida({ estado, tiempoSugerido, onGuardar, onCerrar, onGuardarCache, Hoja }) {
  const [paso, setPaso] = useState('buscar');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('todo');
  const [pendiente, setPendiente] = useState(null);
  const [producto, setProducto] = useState(null);
  const [deCache, setDeCache] = useState(false);

  const frecuentes = (estado.frecuentes || []).slice(0, 6);
  const resultados = buscarAlimentos(q, cat).slice(0, 40);

  const tomar = (al) => setPendiente({
    nombre: al.nombre, cant: al.cant, unidad: al.unidad,
    kcal: al.kcal, prot: al.prot, carb: al.carb, gras: al.gras, fuente: 'lista',
  });

  if (paso === 'escaner') {
    return <Escaner productos={estado.productos || {}} onCerrar={onCerrar} onAtras={() => setPaso('buscar')}
      onGuardarCache={onGuardarCache}
      onProducto={(p, cache) => { setProducto(p); setDeCache(cache); setPaso('producto'); }} Hoja={Hoja} />;
  }
  if (paso === 'producto' && producto) {
    return <AjustarProducto producto={producto} deCache={deCache} Hoja={Hoja} onCerrar={onCerrar}
      onAtras={() => setPaso('escaner')} onListo={(it) => { setPendiente(it); setPaso('buscar'); }} />;
  }
  if (paso === 'libre') {
    return <CapturaLibre Hoja={Hoja} onCerrar={onCerrar} onAtras={() => setPaso('buscar')}
      onListo={(it) => { setPendiente(it); setPaso('buscar'); }} />;
  }
  if (pendiente) {
    return <ElegirTiempo item={pendiente} tiempoSugerido={tiempoSugerido} Hoja={Hoja} onCerrar={onCerrar}
      onAtras={() => setPendiente(null)} onGuardar={onGuardar} />;
  }

  return (
    <Hoja titulo="Agregar lo que comí" sub="Para lo que comiste fuera del menú planeado." onCerrar={onCerrar}>
      <div className="fila-btn" style={{ marginBottom: 14 }}>
        <button className="btn suave" onClick={() => setPaso('escaner')}>Escanear código</button>
        <button className="btn suave" onClick={() => setPaso('libre')}>Escribir a mano</button>
      </div>

      {frecuentes.length > 0 && !q.trim() && (<>
        <h3>Lo que registras seguido</h3>
        {frecuentes.map((fr, i) => (
          <div className="linea-lista" key={i} onClick={() => setPendiente({ ...fr })} style={{ cursor: 'pointer' }}>
            <span className="nombre-item">{fr.nombre}</span>
            <span className="cant">{fr.kcal} kcal</span>
          </div>
        ))}
      </>)}

      <h3>Buscar en la lista</h3>
      <input className="buscador" value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Gelatina, jugo, té, taco…" />
      <div className="chips">
        <button className={'chip' + (cat === 'todo' ? ' on' : '')} onClick={() => setCat('todo')}>Todo</button>
        {CATEGORIAS_ALIMENTO.map((c) => (
          <button key={c.k} className={'chip' + (cat === c.k ? ' on' : '')} onClick={() => setCat(c.k)}>{c.nombre}</button>
        ))}
      </div>

      {!resultados.length ? (
        <p className="nota">
          Nada coincide. Puedes escanear el código del producto o escribirlo a mano.
        </p>
      ) : resultados.map((al) => (
        <div className="linea-lista" key={al.id} onClick={() => tomar(al)} style={{ cursor: 'pointer' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nombre-item">{al.nombre}</div>
            <div style={{ fontSize: 11.5, color: 'var(--tinta-suave)' }}>{al.cant} {al.unidad}</div>
          </div>
          <span className="cant">{al.kcal} kcal</span>
        </div>
      ))}
      <p className="nota">{ALIMENTOS.length} alimentos disponibles sin conexión.</p>
    </Hoja>
  );
}
