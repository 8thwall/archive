---
id: ios-8th-wall-web-inside-an-iframe
---

# Trabajar con iframes

## Configuración de iframe para Android e iOS 15+ {#iframe-setup-for-android-and-ios-15}

Para permitir Inline AR para Android e iOS 15+, debe incluir un parámetro allow en su iframe con
las siguientes [directivas feature-policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives):

```html
<iframe allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"></iframe>
```

NOTA: el micrófono es opcional.

## MÉTODO LEGACY: Compatible con versiones de iOS anteriores a iOS 15 {#legacy-method-supporting-ios-versions-prior-to-ios-15}

Lo siguiente es **ÚNICAMENTE** necesario para admitir RA en línea en versiones de iOS anteriores a iOS 15. Teniendo en cuenta
la alta adopción de iOS 15+, **NO RECOMENDAMOS** utilizar este enfoque.

Consulta las últimas estadísticas de adopción de iOS de Apple: <https://developer.apple.com/support/app-store/>

Además de incluir el parámetro allow con las directivas
[feature-policy directives](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives)
correctas en su iframe como se ha explicado anteriormente, para admitir proyectos de seguimiento mundial en versiones de iOS anteriores a iOS
15, también debe incluir javascript adicional en las páginas AR OUTER e INNER como se explica a continuación
.

En estas versiones, Safari bloquea el acceso a eventos de deviceorientation y devicemotion desde iframes cross-origin
. Para contrarrestar esto, debe incluir dos scripts en su proyecto para garantizar la compatibilidad cruzada
con iOS al desplegar proyectos de Seguimiento Mundial.

Esto **no es necesario para los proyectos de Efectos Faciales o de Objetivo Imagen** (con `disableWorldTracking` configurado
a `true`).

Cuando se implementa correctamente, este proceso permite que el sitio web OUTER envíe eventos de movimiento al sitio web
INNER AR, un requisito para World Tracking.

#### Para el sitio web OUTER {#for-the-outer-website}

**iframe.js** debe incluirse en el **HEAD** de la página **OUTER** a través de esta etiqueta script:

```html
<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script>
```

Al iniciar AR, registre el XRIFrame por ID de iframe:

```js
window.XRIFrame.registerXRIFrame(IFRAME_ID)
```

Al detener AR, anule el registro del XRIFrame:

```js
window.XRIFrame.deregisterXRIFrame()
```

#### Para el sitio web INTERIOR {#for-the-inner-website}

**iframe-inner.js** debe incluirse en el **HEAD** de su sitio web **INNER AR** con esta etiqueta script:

```html
<script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
```

Al permitir que las ventanas interior y exterior se comuniquen, se pueden compartir los datos de orientación/movimiento del dispositivo.

Véase el proyecto de ejemplo en <https://www.8thwall.com/8thwall/inline-ar>

#### Ejemplos {#examples}

##### Página exterior {#outer-page}

```jsx
// Enviar orientación del dispositivo/movimiento del dispositivo al iframe INNER
<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script>

...
const IFRAME_ID = 'my-iframe' // Iframe que contiene el contenido AR.
const onLoad = () => {
  window.XRIFrame.registerXRIFrame(IFRAME_ID)
}
// Añadir escuchadores de eventos y callbacks para el cuerpo DOM.
window.addEventListener('load', onLoad, false)

...

<body>
  <iframe
    id="mi-iframe"
    style="border: 0; width: 100%; height: 100%"
    allow="cámara;micrófono;giroscopio;acelerómetro;"
    src="https://www.other-domain.com/my-web-ar/">
  </iframe>
</body>
```

##### Página interior: Proyectos AFrame {#inner-page-aframe-projects}

```html
<head>
  <!-- Recieve deviceorientation/devicemotion from the OUTER window -->
  <script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
</head>

...

<body>
  <!-- For A-FRAME -->
  <!-- NOTE: The iframe-inner script must load after A-FRAME, and iframe-inner component must appear
  before xrweb. -->
  <a-scene iframe-inner xrweb>
    ... </a-scene> <a-scene iframe-inner xrweb>
  </a-scene>
```

##### Página interior: Proyectos sin marco {#inner-page-non-aframe-projects}

```html
<head>
  <!-- Recieve deviceorientation/devicemotion from the OUTER window -->
  <script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
</head>

...

<!-- For non-AFrame projects, add iframeInnerPipelineModule to the custom pipeline module section,
typically located in "onxrloaded" like so: -->
XR8.addCameraPipelineModules([
  // Módulos de canalización personalizados
  iframeInnerPipelineModule,
])
```
