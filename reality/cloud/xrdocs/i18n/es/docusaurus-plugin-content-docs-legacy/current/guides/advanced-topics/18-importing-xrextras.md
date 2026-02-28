---
id: importing-xrextras-into-cloud-editor
---

# Importación de XRExtras en Cloud Editor

Esta sección de la documentación está destinada a usuarios avanzados que utilicen el editor de 8th Wall Cloud
y necesiten crear una versión completamente personalizada de XRExtras. Este proceso implica:

- Clonación del código XRExtras desde GitHub
- Importación de archivos a su proyecto del Editor en nube
- Desactivación de la comprobación de tipos en los archivos de componentes de A-Frame
- Actualizar su código para utilizar su copia local personalizada de XRExtras en lugar de utilizar nuestra copia predeterminada de CDN (mediante metaetiqueta).

Si sólo necesita realizar personalizaciones básicas de la pantalla de carga de XRExtras, consulte
[esta sección](/legacy/guides/advanced-topics/load-screen) en su lugar.

Nota: Al importar una copia de XRExtras a su proyecto del Editor Cloud, dejará de recibir las
últimas actualizaciones y funcionalidades de XRExtras disponibles en desde CDN. Asegúrese de extraer siempre la última versión
del código XRExtras de GitHub cuando inicie nuevos proyectos.

Instrucciones:

1. Crea una carpeta `myxrextras` dentro de tu proyecto Cloud Editor

2. Clon <https://github.com/8thwall/web>

3. Añade el contenido del directorio `xrextras/src/` (<https://github.com/8thwall/web/tree/master/xrextras/src>)
   a tu proyecto, con la **excepción** de index.js

4. El contenido de tu proyecto tendrá este aspecto:

![xrextras files](/images/xrextras-import-files.jpg)

5. Para **cada** archivo de la carpeta `aframe/components`, elimine la sentencia `import` y sustitúyala por `// @ts-nocheck`.

![xrextras disable type-checking](/images/xrextras-disable-type-checking.jpg)

6. En head.html, elimine o comente la etiqueta `<meta>` para @8thwall.xrextras para que ya no se extraiga de nuestra CDN:

![xrextras head](/images/xrextras-import-head.jpg)

7. En app.js, importa tu biblioteca local de xrextras:

![xrextras appjs](/images/xrextras-import-appjs.jpg)

#### Modificar/añadir activos de imagen {#changingadding-image-assets}

En primer lugar, arrastra y suelta las nuevas imágenes en assets/ para cargarlas en tu proyecto:

![xrextras asset](/images/xrextras-import-asset.jpg)

En los archivos **html** con parámetros `src`, haga referencia a la imagen utilizando una ruta relativa:

`<img src="​../../assets/​my-logo.png" id="loadImage" class="spin" />`

En los archivos **javascript**, utilice una ruta relativa y `require()` para hacer referencia a los activos:

`img.src = require('../../assets/mi-logo.png')`
