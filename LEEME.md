# Mesa · Menús de la casa

PWA para planear desayuno, almuerzo, comida, colación y cena de toda la familia,
con despensa, lista del súper automática, entrenamiento y seguimiento de peso,
medidas y agua.

## Entrenamiento

La pestaña **Entreno** tiene tres partes.

- **Mi semana**: los días fijos en que entrenas. Al registrarlos, la meta de
  comida de esos días sube sola. Si juegas voleibol los martes, el martes la
  app te pide más comida que el lunes, sin que ajustes nada.
- **Rutina**: genera un plan según dónde entrenas (casa o gimnasio), tu
  objetivo, los días por semana y cuánto tiempo tienes. Cada ejercicio trae
  series, repeticiones y una nota de técnica. El botón *Otros ejercicios*
  vuelve a sortear sin cambiar la configuración.
- **Bitácora**: registro de lo que en realidad entrenaste, cruzado con lo que
  comiste ese día. La pregunta que responde no es "¿comí de más?" sino
  "¿comí suficiente para lo que hice?".

## Cómo funciona la despensa

La pantalla **Súper** tiene dos pestañas.

- **Por comprar**: la lista de la semana, ya descontando lo que hay en despensa.
  Cada renglón muestra sólo lo que falta, y si tienes una parte lo indica.
  Al tachar lo que echaste al carrito, el botón *Guardar en la despensa* pasa
  esas cantidades al inventario de un golpe.
- **En despensa**: lo que hay en casa, agrupado por pasillo, con botones para
  subir o bajar cantidades.

El ciclo se cierra solo: cuando marcas una comida como hecha en **Hoy**, sus
ingredientes se descuentan de la despensa. Si la desmarcas, regresan — y regresa
exactamente lo que se consumió, nunca más de lo que había.

## Subir a GitHub Pages

1. Crea un repositorio nuevo (por ejemplo `Mesa`).
2. Arrastra **todo el contenido de esta carpeta** a la interfaz web de GitHub.
   Van los archivos sueltos, no la carpeta.
3. GitHub te preguntará si quieres reemplazar los archivos que ya existen. Acepta.
4. En **Settings → Pages**, elige la rama `main` y la carpeta `/ (root)`.
5. Espera 1–2 minutos y abre `https://TU-USUARIO.github.io/Mesa/`.

El archivo `.nojekyll` es indispensable: sin él, GitHub Pages intenta procesar
el sitio con Jekyll y el despliegue se atora.

## Instalar en el teléfono

Abre la liga en Chrome → menú de tres puntos → **Agregar a pantalla de inicio**.
Queda como app independiente y funciona sin internet.

## Dónde viven los datos

Todo se guarda en el navegador del dispositivo (`localStorage`). No sale nada a
ningún servidor. Descarga un respaldo desde **Familia → Descargar respaldo** de
vez en cuando.

## Cuando quieras conectar Supabase

Toda la persistencia pasa por el objeto `almacen` en `src/nucleo.js`, con dos
métodos: `leer(clave, porDefecto)` y `guardar(clave, valor)`. Ya son asíncronos.
Para migrar a la nube basta reemplazar el cuerpo de esos dos métodos por
llamadas a Supabase; ningún componente cambia.

## Recompilar tras editar el código

```
npm install react react-dom esbuild
npx esbuild src/app.jsx --bundle --minify --format=iife --target=es2018 \
  --jsx=automatic --outfile=app.js --define:process.env.NODE_ENV='"production"'
```

Si cambias `sw.js` o los archivos en caché, sube el número de versión en
`const CACHE = 'mesa-v3'` para que los teléfonos tomen la versión nueva.

## Si la página no abre

- **Revisa mayúsculas en la URL.** Las rutas de GitHub Pages distinguen entre
  mayúsculas y minúsculas: si el repo es `Mesa-app`, la liga es
  `https://TU-USUARIO.github.io/Mesa-app/`, no `/mesa-app/`.
- **404** significa que Pages no está publicado todavía o la rama está mal.
  Revisa **Settings → Pages**.
- **ERR_CONNECTION_TIMED_OUT** no es problema del repo: la petición nunca llegó.
  Suele ser la red bloqueando el dominio `*.github.io`. Pruébalo con datos
  móviles para descartarlo.
- Si ya cargó antes y ves la versión vieja, es el service worker. Recarga con
  Ctrl+Shift+R, o desinstala y reinstala la PWA.

## Sobre las cifras nutricionales

El gasto energético se estima con la ecuación de **Mifflin-St Jeor (1990)**,
multiplicada por un factor de actividad. La proteína se fija en 1.4 g/kg, la
grasa en 27 % de la energía y el resto en hidratos. Los valores de cada
platillo son aproximaciones de tablas de composición de alimentos de uso común.

El gasto de cada entrenamiento se estima con **METs** del *Compendium of
Physical Activities* (Ainsworth y cols.), la referencia estándar del campo.
Un MET equivale aproximadamente a gastar 1 kcal por kilo de peso cada hora en
reposo. Al calcular la sesión se resta 1 MET, porque ese reposo ya viene
contado en el metabolismo basal; sin esa resta el día se sobreestima.

Por eso el nivel de actividad del perfil debe describir **sólo tu día normal**
sin los entrenamientos: si contaras el voleibol ahí y además lo registraras en
la pestaña Entreno, se contaría dos veces.

Son cifras **de referencia**, útiles para orientarse y llevar orden. No son una
prescripción y no sustituyen la valoración de un nutriólogo, sobre todo si
alguien en casa tiene alguna condición de salud. Lo mismo aplica a las rutinas:
si un ejercicio te causa dolor, no molestia de esfuerzo sino dolor, sáltalo y
consúltalo con un profesional.
