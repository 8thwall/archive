---
id: ios-8th-wall-web-inside-an-iframe
---

# Travailler avec des iframes

## configuration de l'iframe pour Android et iOS 15+ {#iframe-setup-for-android-and-ios-15}

Pour autoriser la AR en ligne pour Android et iOS 15+, vous devez inclure un paramètre allow dans votre iframe avec les directives suivantes [feature-policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives):

```html
<iframe allow="caméra;gyroscope;accéléromètre;magnétomètre;xr-spatial-tracking;microphone ;"></iframe&gt ;
```

NOTE : le microphone est optionnel.

## MÉTHODE LÉGITIME : Prise en charge des versions d'iOS antérieures à iOS 15 {#legacy-method-supporting-ios-versions-prior-to-ios-15}

Ce qui est indiqué ci-dessous s’applique**UNIQUEMENT** à la prise en charge de la AR en ligne dans les versions d'iOS antérieures à iOS 15. Étant donné la forte adoption d'iOS 15+, nous **NE recommandons PLUS** l'utilisation de cette approche.

Consultez les dernières statistiques d'Apple sur l'adoption de l’iOS  <https://developer.apple.com/support/app-store/>

En plus d'inclure le paramètre permettre les directives [feature-policy correctes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives) dans votre iframe comme expliqué ci-dessus, pour prendre en charge les projets World Tracking sur les versions iOS antérieures à iOS 15, vous devez également inclure du javascript supplémentaire sur les pages OUTER et INNER AR comme expliqué ci-dessous.

Dans ces versions, Safari bloque l'accès aux événements d'orientation et de mouvement de l'appareil à partir des iframes d'origine croisée. Pour y remédier, vous devez inclure deux scripts dans votre projet afin d'assurer la compatibilité avec iOS lors du déploiement des projets World Tracking.

Ce**n'est pas nécessaire pour les projets Effets visages ou image cible** (avec `disableWorldTracking` définis comme `vrai`).

Lorsqu'il est correctement mis en œuvre, ce processus permet au site web OUTER d'envoyer des événements de mouvement au site web INNER AR, ce qui est nécessaire pour le suivi mondial.

#### Pour le site web OUTER {#for-the-outer-website}

**iframe.js** doit être inclus dans le **HEAD** de la page **OUTER** via cette balise script :

```html
<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script&gt ;
```

Lors du démarrage de l'AR, enregistrez le XRIFrame par l'ID de l’iframe :

```js
window.XRIFrame.registerXRIFrame(IFRAME_ID)
```

Lorsque vous arrêtez l'AR, désenregistrez le XRIFrame :

```js
window.XRIFrame.deregisterXRIFrame()
```

#### Pour le site web INNER {#for-the-inner-website}

**iframe-inner.js** doit être inclus dans le **HEAD** de votre site **INNER AR** avec cette balise de script :

```html
<script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
```

En permettant aux fenêtres intérieure et extérieure de communiquer, les données relatives à l'orientation et au mouvement de l'appareil peuvent être partagées.

Voir un exemple de projet à l'adresse suivante : <https://www.8thwall.com/8thwall/inline-ar>

#### Exemples {#examples}

##### Page extérieure {#outer-page}

```jsx
// Envoyez l'orientation du dispositif/le mouvement du dispositif à l'iframe INNER


...
const IFRAME_ID = 'my-iframe' // Iframe contenant le contenu AR.
const onLoad = () => {
  window.XRIFrame.registerXRIFrame(IFRAME_ID)
}
// Ajoutez des listers d'événements et des rappels pour le corps du DOM.
window.addEventListener('load', onLoad, false)

...


      id="my-iframe"
    style="border : 0 ; width : 100% ; height : 100%"
    allow="camera;microphone;gyroscope;accéléromètre ;"
    src="https://www.other-domain.com/my-web-ar/">
  

```

##### Page intérieure : Projets AFrame {#inner-page-aframe-projects}

```html
<head>
  <!-- Recieve deviceorientation/devicemotion from the OUTER window -->
  <script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
</head>

...

<body>
  <!-- For A-FRAME -->
  <!-- NOTE : Le iframe-inner script doit charger après A-FRAME, et l’iframe-inner component doit apparaître
    avant xrweb. -->
  <a-scene iframe-inner xrweb>
    ...
  </a-scene&gt ;
```

##### Page intérieure : Projets sans cadre {#inner-page-non-aframe-projects}

```html
<head>
  <!-- Recieve deviceorientation/devicemotion from the OUTER window -->
  <script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
</head>

...

<!-- For non-AFrame projects, add iframeInnerPipelineModule to the custom pipeline module section,
typically located in "onxrloaded" like so: -->
XR8.addCameraPipelineModules([
  // Custom pipeline modules
  iframeInnerPipelineModule,
])
```
