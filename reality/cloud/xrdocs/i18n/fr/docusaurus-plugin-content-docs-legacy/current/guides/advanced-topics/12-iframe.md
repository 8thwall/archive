---
id: ios-8th-wall-web-inside-an-iframe
---

# Travailler avec des iframes

## Configuration d'iframe pour Android et iOS 15+ {#iframe-setup-for-android-and-ios-15}

Pour autoriser la RA en ligne pour Android et iOS 15+, vous devez inclure un paramètre "allow" dans votre iframe avec
les directives suivantes [feature-policy directives](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives) :

```html
<iframe allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"></iframe>
```

NOTE : le microphone est optionnel.

## MÉTHODE LÉGÈRE : Prise en charge des versions d'iOS antérieures à iOS 15 {#legacy-method-supporting-ios-versions-prior-to-ios-15}

Les éléments suivants sont **UNIQUEMENT** requis pour la prise en charge de la RA en ligne dans les versions d'iOS antérieures à iOS 15. Étant donné
la forte adoption d'iOS 15+, nous ne recommandons \*\* PLUS\*\* d'utiliser cette approche.

Voir les dernières statistiques d'Apple sur l'adoption d'iOS : <https://developer.apple.com/support/app-store/>

En plus d'inclure le paramètre allow avec les directives
[feature-policy directives](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives)
correctes dans votre iframe comme expliqué ci-dessus, pour prendre en charge les projets de suivi du monde sur les versions iOS antérieures à iOS
15, vous devez également inclure du javascript supplémentaire sur les pages OUTER et INNER AR comme expliqué
ci-dessous.

Dans ces versions, Safari bloque l'accès aux événements d'orientation et d'émotion de l'appareil à partir des iframes
d'origine croisée. Pour y remédier, vous devez inclure deux scripts dans votre projet afin d'assurer la compatibilité
avec iOS lors du déploiement des projets World Tracking.

Ceci n'est **pas nécessaire pour les projets Face Effects ou Image Target** (avec `disableWorldTracking` fixé
à `true`).

Lorsqu'il est correctement mis en œuvre, ce processus permet au site web OUTER d'envoyer des événements de mouvement au site web
INNER AR, ce qui est nécessaire pour le suivi mondial.

#### Pour le site OUTER {#for-the-outer-website}

**iframe.js** doit être inclus dans le **HEAD** de la page **OUTER** via cette balise script :

```html
<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script>
```

Lors du démarrage de l'AR, enregistrer le XRIFrame par l'ID de l'iframe :

```js
window.XRIFrame.registerXRIFrame(IFRAME_ID)
```

Lors de l'arrêt de l'AR, désenregistrer le XRIFrame :

```js
window.XRIFrame.deregisterXRIFrame()
```

#### Pour le site web INNER {#for-the-inner-website}

**iframe-inner.js** doit être inclus dans le **HEAD** de votre site web **INNER AR** avec cette balise script :

```html
<script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
```

En permettant aux fenêtres intérieure et extérieure de communiquer, les données relatives à l'orientation et au mouvement de l'appareil peuvent être partagées.

Voir l'exemple de projet à <https://www.8thwall.com/8thwall/inline-ar>

#### Exemples {#examples}

##### Page extérieure {#outer-page}

```jsx
// Envoyer l'orientation/le mouvement du dispositif à l'iframe INNER
<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script>

...
const IFRAME_ID = 'my-iframe' // Iframe contenant le contenu AR.
const onLoad = () => {
  window.XRIFrame.registerXRIFrame(IFRAME_ID)
}
// Ajoutez des écouteurs d'événements et des rappels pour le corps du DOM.
window.addEventListener('load', onLoad, false)

...

<body>
  <iframe
    id="my-iframe"
    style="border : 0 ; width : 100% ; height : 100%"
    allow="camera;microphone;gyroscope;accéléromètre ;"
    src="https://www.other-domain.com/my-web-ar/">
  </iframe>
</body>
```

##### Page intérieure : Projets AFrame {#inner-page-aframe-projects}

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

##### Page intérieure : Projets non encadrés {#inner-page-non-aframe-projects}

```html
<head>
  <!-- Recieve deviceorientation/devicemotion from the OUTER window -->
  <script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
</head>

...

<!-- For non-AFrame projects, add iframeInnerPipelineModule to the custom pipeline module section,
typically located in "onxrloaded" like so: -->
XR8.addCameraPipelineModules([
  // Modules de pipeline personnalisés
  iframeInnerPipelineModule,
])
```
