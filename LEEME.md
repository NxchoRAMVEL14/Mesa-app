# Mesa · Menús de la casa

PWA para planear desayuno, almuerzo, comida, colación y cena de toda la familia,
con lista del súper automática y seguimiento de peso, medidas y agua.

## Subir a GitHub Pages

1. Crea un repositorio nuevo (por ejemplo `Mesa`).
2. Arrastra **todo el contenido de esta carpeta** a la interfaz web de GitHub.
   Van los archivos sueltos, no la carpeta: `index.html`, `app.js`, `estilos.css`,
   `manifest.json`, `sw.js`, `.nojekyll`, `icono-192.png`, `icono-512.png` y `src/`.
3. En **Settings → Pages**, elige la rama `main` y la carpeta `/ (root)`.
4. Espera 1–2 minutos y abre `https://TU-USUARIO.github.io/Mesa/`.

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
`const CACHE = 'mesa-v1'` para que los teléfonos tomen la versión nueva.

## Sobre las cifras nutricionales

El gasto energético se estima con la ecuación de **Mifflin-St Jeor (1990)**,
multiplicada por un factor de actividad. La proteína se fija en 1.4 g/kg, la
grasa en 27 % de la energía y el resto en hidratos. Los valores de cada
platillo son aproximaciones de tablas de composición de alimentos de uso común.

Son cifras **de referencia**, útiles para orientarse y llevar orden. No son una
prescripción y no sustituyen la valoración de un nutriólogo, sobre todo si
alguien en casa tiene alguna condición de salud.
