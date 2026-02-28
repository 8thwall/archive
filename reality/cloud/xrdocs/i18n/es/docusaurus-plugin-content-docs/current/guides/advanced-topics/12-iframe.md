---
id: ios-8th-wall-web-inside-an-iframe
---

# Trabajar con iframes

## configuración de iframe para Android e iOS 15+ {#iframe-setup-for-android-and-ios-15}

Para permitir AR en línea para Android e iOS 15+, debe incluir un parámetro permitir en su iframe con las siguientes [funciones directivas](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives)::

```html
<iframe allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"></iframe>
```

NOTA: el micrófono es opcional.

## MÉTODO LEGAL: compatible con versiones de iOS anteriores a iOS 15 {#legacy-method-supporting-ios-versions-prior-to-ios-15}

Lo siguiente es **ÚNICAMENTE** necesario para AR en línea compatible con versiones de iOS anteriores a iOS 15. Dada la alta adopción de iOS 15+, nosotros **YA NO** recomendamos utilizar este enfoque.

Consulte las últimas estadísticas de adopción de iOS de Apple: <https://developer.apple.com/support/app-store/>

Además de incluir el parámetro permitir con las directivas correctas [funcioones directivas](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives) en su iframe, como se ha explicado anteriormente, para admitir proyectos de seguimiento mundial en versiones de iOS anteriores a iOS 15, también debe incluir javascript adicional tanto en la página AR EXTERIOR como en la INTERIOR, como se explica a continuación.

En estas versiones, Safari bloquea el acceso a los eventos deviceorientation y devicemotion de los iframes de origen cruzado . Para contrarrestarlo, debe incluir dos códigos en su proyecto para garantizar la compatibilidad cruzada con iOS al desplegar proyectos de seguimiento mundial.

Esto **no es necesario para los proyectos de efectos faciales o de objetivo de imagen** (con `disableWorldTracking` configurado como `true`).

Cuando se implementa correctamente, este proceso permite que el sitio web EXTERIOR envíe eventos de movimiento al sitio web RA INTERIOR, un requisito para el seguimiento mundial.

#### Para el sitio web EXTERIOR {#for-the-outer-website}

**iframe.js** debe incluirse en el **HEAD** de la página **OUTER** mediante esta etiqueta de código:

```html
<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script>
```

Al iniciar AR, registre el XRIFrame con el ID de iframe:

```js
window.XRIFrame.registerXRIFrame(IFRAME_ID)
```

Al detener AR, dé de baja el XRIFrame:

```js
window.XRIFrame.deregisterXRIFrame()
```

#### Para el sitio web INTERIOR {#for-the-inner-website}

**iframe-inner.js** debe incluirse en el **HEAD** de tu sitio web **INNER AR** con esta etiqueta código:

```html
<script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
```

Al permitir que las ventanas interior y exterior se comuniquen, se pueden compartir los datos de orientación/movimiento del dispositivo.

Consulte el proyecto de muestra en <https://www.8thwall.com/8thwall/inline-ar>

#### Ejemplos {#examples}

##### Página exterior {#outer-page}

```jsx
// Envíe la orientación/movimiento del dispositivo al iframe INTERIOR
<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script>

...
const IFRAME_ID = 'my-iframe' // Iframe que contiene contenido AR.
const onLoad = () => {
  window.XRIFrame.registerXRIFrame(IFRAME_ID)
}
// Añadir listados de eventos y retrollamadas para el DOM del cuerpo.
window.addEventListener('load', onLoad, false)

...

<body>
  <iframe
    id="my-iframe"
    style="border: 0; width: 100%; height: 100%"
    allow="camera;microphone;gyroscope;accelerometer;"
    src="https://www.other-domain.com/my-web-ar/">
  </iframe>
</body>
```

##### Página interior: proyectos AFrame {#inner-page-aframe-projects}

```html
<head>
 <!-- Recibir la orientación/movimiento del dispositivo de la ventana EXTERIOR -->
  <script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
</head>

...

<body>
 <!-- Para A-FRAME -->
 <!-- NOTA: el código iframe-inner debe cargarse después del A-FRAME, y el componente iframe-inner debe aparecer
  antes que xrweb. -->
  <a-scene iframe-inner xrweb>
    ...
  </a-scene>
```

##### Página interior: proyectos sin AFrame {#inner-page-non-aframe-projects}

```html
<head>
 <!-- Recibir la orientación/movimiento del dispositivo de la ventana EXTERIOR -->
  <script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
</head>

...

<!-- Para proyectos que no sean de AFrame, añade iframeInnerPipelineModule a la sección de módulos de canalización personalizados,
situada normalmente en "onxrloaded", de la siguiente manera: -->
XR8.addCameraPipelineModules([
  // Módulos de canalización personalizada
  iframeInnerPipelineModule,
])
```
