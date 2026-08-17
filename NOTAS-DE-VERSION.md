# Mesa · Notas de versión

Estas notas también están dentro de la app, en el botón **?** del encabezado,
pestaña *Novedades*.

## 1.3.0 — 17 de agosto de 2026 · Registrar fuera del menú

**Nuevo**
- Botón para agregar en Hoy cualquier comida que no estuviera en el plan, con
  su propio tiempo del día.
- Lista de 140 alimentos comunes con su aporte, disponible sin conexión,
  incluyendo los de dieta líquida y de recuperación.
- Escáner de código de barras con la cámara, conectado a Open Food Facts, con
  captura del código a mano si la cámara no está disponible.
- Memoria de los alimentos que registras seguido.
- Modo recuperación: pausa los entrenamientos y silencia los avisos de comer
  poco.

**Arreglado**
- Al tocar fuera de la hoja durante el escaneo, la app daba un paso atrás en
  lugar de cerrar. Ahora el fondo siempre cierra y cada paso tiene su Atrás.

**Detalles**
- Los productos escaneados se guardan en el teléfono, así que volver a escanear
  el mismo código funciona sin internet. Los datos de Open Food Facts los
  aportan voluntarios y pueden estar incompletos o equivocados: por eso siempre
  se muestran para revisarlos antes de guardar. Se acredita la fuente en la
  propia pantalla, como pide su licencia.
- El escáner usa la API `BarcodeDetector` del navegador, disponible en Chrome
  para Android. Donde no exista, la app cae al modo de teclear el código sin
  avisar de nada raro.
- El modo recuperación existe porque sin él la app señalaría a alguien
  convaleciente por comer poco, que es justo lo contrario de lo que necesita
  leer. Mientras está activo, las metas siguen visibles como referencia pero la
  app no compara nada contra ellas.

## 1.2.0 — 17 de agosto de 2026 · Ilustraciones y manual

**Nuevo**
- Dibujo de referencia en cada uno de los 73 platillos, visible en Hoy, en la
  Semana, en el Recetario y al sustituir una comida.
- Figura de la posición en cada uno de los 55 ejercicios, con vista ampliada al
  abrir el detalle.
- Manual de usuario completo dentro de la app, con ocho secciones.
- Pantalla de notas de versión.

**Por qué así**
Las ilustraciones se dibujan con código dentro de la app; no son imágenes
descargadas de internet. La decisión tiene tres razones: siguen funcionando sin
conexión, que es media gracia de una PWA; se ven nítidas en cualquier densidad
de pantalla; y no dependen de enlaces externos que se caen ni plantean dudas de
derechos de autor. El costo es que son esquemas, no fotografías.

Un dibujo por *familia* de platillo, no uno por receta: los 73 platillos
comparten 39 dibujos según su forma de servirse, y los 55 ejercicios comparten
27 poses según su patrón de movimiento. Las recetas que agregues tú reciben
dibujo automáticamente, adivinando la familia por el nombre.

## 1.1.0 — 17 de agosto de 2026 · Entrenamiento

**Nuevo**
- Días fijos de entrenamiento: al registrarlos, la meta de comida de esos días
  sube sola.
- Generador de rutinas para casa o gimnasio, con 55 ejercicios, cuatro
  objetivos y tres duraciones.
- Objetivo específico de rendimiento en voleibol: salto, hombro y tobillo.
- Bitácora de entrenamiento cruzada con la alimentación del día.

**Detalles**
- El gasto de cada sesión se calcula con METs y se le resta un MET, porque ese
  reposo ya lo cuenta el metabolismo basal. Sin esa resta se sobreestima el día.
- El campo de actividad del perfil ahora aclara que describe sólo el día normal,
  sin los entrenamientos, para no contarlos dos veces.
- Familia se movió dentro de Progreso como pestaña, para que la barra inferior
  no se saturara con siete botones.

## 1.0.1 — 17 de agosto de 2026 · Control de despensa

**Nuevo**
- Inventario de lo que hay en casa, agrupado por pasillo.
- La lista del súper descuenta la despensa y pide sólo lo que falta.
- Botón para pasar de una vez al inventario todo lo tachado en el carrito.
- Al marcar una comida como hecha, sus ingredientes se descuentan solos.

**Arreglado**
- Un error que inventaba comida: si había 2 tortillas y la receta pedía 4, la
  despensa bajaba a cero pero al desmarcar la comida devolvía 4. Ahora se
  registra lo que en realidad se consumió y se devuelve exactamente eso.

## 1.0.0 — 17 de agosto de 2026 · Primera versión

- Menús de cinco tiempos para toda la familia, con porciones proporcionales.
- Recetario de 73 platillos caseros del Bajío, con alta de recetas propias.
- Generador de menús para una semana, un mes o un año, con control de
  repetición.
- Lista del súper automática, agrupada por pasillo.
- Registro diario de comidas y agua.
- Seguimiento de peso, cintura, cadera y pecho con gráfica de tendencia.
- Funciona sin internet e instalable como app.
