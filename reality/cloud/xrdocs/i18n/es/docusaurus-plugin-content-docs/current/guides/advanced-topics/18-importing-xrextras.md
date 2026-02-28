---
id: importing-xrextras-into-cloud-editor
---

# Importar XRExtras al editor de la nube

Esta sección de la documentación está destinada a usuarios avanzados que utilicen el editor de la nube de 8th Wall y necesiten crear una versión completamente personalizada de XRExtras. Este proceso implica:

* Clonar el código XRExtras desde GitHub
* Importar archivos a su proyecto del editor de la nube
* Desactivación de la comprobación de tipos en los archivos de componentes de A-Frame
* Actualizar su código para utilizar tu copia local y personalizada de XRExtras en lugar de extraer nuestra copia predeterminada de la CDN (mediante metaetiqueta)

Si solo necesita hacer personalizaciones básicas de la pantalla de carga de XRExtras, consulte en su lugar [esta sección](/guides/advanced-topics/load-screen).

Nota: al importar una copia de XRExtras a su proyecto del editor de la nube, dejará de recibir las últimas actualizaciones y funcionalidades de XRExtras disponibles en de CDN. Asegúrese de extraer siempre la última versión del código XRExtras de GitHub cuando inicie nuevos proyectos.

Instrucciones:

1. Cree una carpeta `myxrextras` dentro de su proyecto del editor de la nube

2. Clone <https://github.com/8thwall/web>

3. Añada el contenido del directorio `xrextras/src/` (<https://github.com/8thwall/web/tree/master/xrextras/src>) a su proyecto, con la excepción **** de index.js

4. El contenido de su proyecto tendrá este aspecto:

![xrextras files](/images/xrextras-import-files.jpg)

5. Para **cada** archivo de la carpeta `aframe/components`, elimine la sentencia `import` y sustitúyala por `// @ts-nocheck`

![xrextras desactivar la comprobación de tipos](/images/xrextras-disable-type-checking.jpg)

6. En head.html, elimine o comente la etiqueta `<meta>` de @8thwall.xrextras para que ya no se extraiga de nuestra CDN:

![xrextras head](/images/xrextras-import-head.jpg)

7. En app.js, importe su biblioteca local de xrextras:

![xrextras appjs](/images/xrextras-import-appjs.jpg)

#### Cambiar/Añadir activos de imagen {#changingadding-image-assets}

Primero, arrastre y suelte las nuevas imágenes en activos/ para subirlas a eu proyecto:

![xrextras asset](/images/xrextras-import-asset.jpg)

En los archivos **html** con parámetros `src`, haga referencia al activo de imagen utilizando una ruta relativa:

`<img src="​../../assets/​my-logo.png" id="loadImage" class="spin" />`

En los archivos **javascript**, utilice una ruta relativa y `require()` para hacer referencia a los activos:

`img.src = ​require​('​../../assets/​my-logo.png')`
