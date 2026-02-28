---
id: ios-8th-wall-web-inside-an-iframe
---

# Arbeiten mit iframes

## iframe Einrichtung für Android und iOS 15+ {#iframe-setup-for-android-and-ios-15}

Um Inline AR für Android und iOS 15+ zuzulassen, müssen Sie einen allow-Parameter in Ihren iframe mit den folgenden [feature-policy-Direktiven](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives) aufnehmen:

```html
<iframe allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"></iframe>
```

HINWEIS: Das Mikrofon ist optional.

## LEGACY-METHODE: Unterstützt iOS-Versionen vor iOS 15 {#legacy-method-supporting-ios-versions-prior-to-ios-15}

Im Folgenden finden Sie **NUR** für die Unterstützung von Inline AR in iOS-Versionen vor iOS 15. Angesichts der hohen Akzeptanz von iOS 15+ empfehlen wir **NICHT MEHR** diesen Ansatz.

Sehen Sie sich die neuesten iOS-Statistiken von Apple an: <https://developer.apple.com/support/app-store/>

Um World Tracking-Projekte auf iOS-Versionen vor iOS 15 zu unterstützen, müssen Sie nicht nur den allow-Parameter mit den korrekten [feature-policy-Direktiven](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives) in Ihren iframe einfügen, sondern auch zusätzliches Javascript sowohl auf der OUTER- als auch auf der INNER AR-Seite, wie nachstehend erläutert.

In diesen Versionen blockiert Safari den Zugriff auf Geräteausrichtung und Gerätebewegungsereignisse von herkunftsübergreifenden iframes. Um dem entgegenzuwirken, müssen Sie zwei Skripte in Ihr Projekt aufnehmen, um die Kompatibilität mit iOS bei der Bereitstellung von World Tracking-Projekten zu gewährleisten.

Dies ist **nicht erforderlich für Face Effects oder Image Target Projekte** (mit `disableWorldTracking` setzen auf `true`).

Wenn dieser Prozess korrekt implementiert ist, kann die OUTER-Website Bewegungsereignisse an die INNER AR-Website senden, eine Voraussetzung für World Tracking.

#### Für die OUTER Website {#for-the-outer-website}

**iframe.js** muss über dieses Skript-Tag in den **HEAD** der **OUTER** Seite eingebunden werden:

```html
<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script>
```

Wenn Sie AR starten, registrieren Sie den XRIFrame über die iframe ID:

```js
window.XRIFrame.registerXRIFrame(IFRAME_ID)
```

Wenn Sie AR beenden, melden Sie den XRIFrame ab:

```js
window.XRIFrame.deregisterXRIFrame()
```

#### Für die INNERE Website {#for-the-inner-website}

**iframe-inner.js** muss in den **HEAD** Ihrer **INNER AR** Website mit diesem Skript-Tag eingebunden werden:

```html
<script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
```

Durch Ermöglichung der Kommunikation zwischen dem inneren und dem äußeren Fenster können Sie Daten zur Geräteausrichtung/Gerätebewegung gemeinsam nutzen.

Siehe Beispielprojekt unter <https://www.8thwall.com/8thwall/inline-ar>

#### Beispiele {#examples}

##### Äußere Seite {#outer-page}

```jsx
// Senden Sie Geräteausrichtung/Gerätebewegung an den INNEREN iframe


...
const IFRAME_ID = 'my-iframe' // Iframe mit AR-Inhalt.
const onLoad = () => {
  window.XRIFrame.registerXRIFrame(IFRAME_ID)
}
// Fügen Sie Event-Listener und Callbacks für das Body-DOM hinzu.
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

##### Innere Seite: AFrame Projekte {#inner-page-aframe-projects}

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
    ...
  </a-scene>
```

##### Innere Seite: Non-AFrame-Projekte {#inner-page-non-aframe-projects}

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
