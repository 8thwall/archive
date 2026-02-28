---
id: landing-pages
---

# Landing Pages

Landing Pages sind eine Weiterentwicklung unserer beliebten "Fast geschafft"-Seiten.

## Warum Landing Pages verwenden? {#why-use-landing-pages}

Wir haben diese Seiten so umgestaltet, dass sie für Sie und Ihre Kunden unter zu einer leistungsstarken Marken- und Marketingmöglichkeit werden. Alle Landing Page-Vorlagen sind für Branding und Bildung mit verschiedenen Layouts, einem verbesserten QR-Code-Design und Unterstützung für wichtige Medien optimiert.

Landing Pages sorgen dafür, dass Ihre Nutzer unabhängig vom verwendeten Gerät ein sinnvolles Erlebnis haben. \- Sie erscheinen auf Geräten, die nicht direkt auf das WebAR-Erlebnis zugreifen dürfen oder können. Sie setzen auch unsere Mission fort, AR zugänglich zu machen, indem sie den Nutzern helfen, das richtige Ziel zu erreichen, um sich mit AR zu beschäftigen.

Wir haben die Landing Pages so gestaltet, dass es für Entwickler extrem einfach ist, die Seite anzupassen. Wir möchten, dass Sie von einer optimierten Landing Page profitieren, während Sie Ihre Zeit in den Aufbau Ihres WebAR-Erlebnisses investieren können.

## Landing Pages passen sich intelligent an Ihre Konfiguration an {#landing-pages-intelligently-adapt-to-your-configuration}

![loading-examples1](/images/landing-examples1.jpg)

![loading-examples2](/images/landing-examples2.jpg)

## Verwenden Sie Landing Pages in Ihrem Projekt {#use-landing-pages-in-your-project}

1. Öffnen Sie Ihr Projekt
2. Fügen Sie den folgenden Tag zu `head.html hinzu`

`<meta name="8thwall:package" content="@8thwall.landing-page">`

Hinweis: Bei selbst gehosteten Projekten fügen Sie stattdessen den folgenden `` Tag zu Ihrer Seite hinzu:

`<script src='https://cdn.8thwall.com/web/landing-page/landing-page.js'></script>`

3. **Entfernen Sie** `xrextras-almost-there` aus Ihrem A-Frame Projekt, oder `XRExtras.AlmostThere.pipelineModule()` aus Ihrem Non-AFrame Projekt. (Die Landing Pages enthalten zusätzlich zu den Aktualisierungen der QR-Code-Seite die Logik .)
4. Optional können Sie die Parameter Ihrer `Landing-Page` Komponente wie unten beschrieben anpassen. Für Non-AFrame-Projekte lesen Sie bitte die [LandingPage.configure()](/api/landingpage/configure) Dokumentation.

## Parameter der A-Frame Komponente (alle optional) {#a-frame-component-parameters}

| Parameter              | Typ         | Standard                                                      | Beschreibung                                                                                                                                                                                                 |
| ---------------------- | ----------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| logoSrc                | `String`    |                                                               | Bildquelle für das Markenlogo-Bild.                                                                                                                                                                          |
| logoAlt                | `String`    | `'Logo'`                                                      | Alt-Text für das Markenlogo-Bild.                                                                                                                                                                            |
| promptPrefix           | `String`    | `'Scannen oder besuchen'`                                     | Legt den Textstring für den Aufruf zur Aktion fest, bevor die URL für das Erlebnis angezeigt wird.                                                                                                           |
| url                    | `String`    | 8th.io Link, wenn 8th Wall gehostet wird, oder aktuelle Seite | Legt die angezeigte URL und den QR-Code fest.                                                                                                                                                                |
| promptSuffix           | `String`    | `'fortfahren'`                                                | Legt den Textstring für den Aufruf zur Aktion fest, nachdem die URL für das Erlebnis angezeigt wurde.                                                                                                        |
| textColor              | Hex-Farbe   | `'#ffffff'`                                                   | Farbe des gesamten Textes auf der Landing Page.                                                                                                                                                              |
| Schriftart             | `String`    | `"'Nunito', sans-serif"`                                      | Schriftart des gesamten Textes auf der Landing Page. Dieser Parameter akzeptiert gültige CSS font-family Argumente.                                                                                          |
| textShadow             | `Boolesche` | `false`                                                       | Legt die Eigenschaft text-shadow für alle Texte auf der Landing Page fest.                                                                                                                                   |
| backgroundSrc          | `String`    |                                                               | Bildquelle für das Hintergrundbild.                                                                                                                                                                          |
| backgroundBlur         | `Nummer`    | `0`                                                           | Wendet einen Unschärfe-Effekt auf `backgroundSrc` an, wenn einer angegeben ist. (Normalerweise liegen die Werte zwischen 0.0 und 1.0)                                                                        |
| backgroundColor        | `String`    | `'linear-gradient(#464766,#2D2E43)'`                          | Hintergrundfarbe der Landing Page. Dieser Parameter akzeptiert gültige CSS-Hintergrundfarbenargumente. Die Hintergrundfarbe wird nicht angezeigt, wenn eine background-src oder sceneEnvMap eingestellt ist. |
| mediaSrc               | `String`    | Das Titelbild der App, falls vorhanden                        | Medienquelle (3D-Modell, Bild oder Video) für den Held-Inhalt der Landing Page. Akzeptierte Medienquellen sind a-asset-item id oder eine statische URL.                                                      |
| mediaAlt               | `String`    | `Vorschau`                                                    | Alt-Text für Landing Page Bildinhalte.                                                                                                                                                                       |
| mediaAutoplay          | `Boolesche` | `wahr`                                                        | Wenn die `mediaSrc` ein Video ist, gibt sie an, ob das Video beim Laden mit stummgeschaltetem Ton abgespielt werden soll.                                                                                    |
| mediaAnimation         | `String`    | Erster Animationsclip des Modells, falls vorhanden            | Wenn es sich bei `mediaSrc` um ein 3D-Modell handelt, geben Sie an, ob ein bestimmter Animationsclip, der mit dem Modell verknüpft ist, abgespielt werden soll, oder "keiner".                               |
| mediaControls          | `String`    | `'minimal'`                                                   | Wenn `mediaSrc` ein Video ist, geben Sie die Mediensteuerung an, die dem Benutzer angezeigt wird. Wählen Sie aus "keine", "mininal" oder "Browser" (Browser-Standardeinstellungen)                           |
| sceneEnvMap            | `String`    | `'Feld'`                                                      | Bildquelle, die auf ein gleichwinkliges Bild zeigt. Oder eine der folgenden voreingestellten Umgebungen: "Feld", "Hügel", "Stadt", "Pastell", oder "Weltraum".                                               |
| sceneOrbitIdle         | `String`    | `'Spin'`                                                      | Wenn es sich bei `mediaSrc` um ein 3D-Modell handelt, geben Sie an, ob sich das Modell "drehen" soll oder "nicht".                                                                                           |
| sceneOrbitInteraction  | `String`    | `'ziehen'`                                                    | Wenn die `mediaSrc` ein 3D-Modell ist, geben Sie an, ob der Benutzer mit den Orbit-Steuerelementen interagieren kann, wählen Sie "ziehen" oder "keine".                                                      |
| sceneLightingIntensity | `Nummer`    | `1`                                                           | Wenn die `mediaSrc` ein 3D-Modell ist, geben Sie die Stärke des Lichts an, das den Modus beleuchtet.                                                                                                         |
| vrPromptPrefix         | `String`    | `'oder besuchen'`                                             | Legt den Textstring für den Aufruf zur Aktion fest, bevor die URL für das Erlebnis auf VR-Headsets angezeigt wird.                                                                                           |

## Beispiele {#examples}

#### 3D-Layout mit benutzerdefinierten Parametern {#3d-layout-with-user-specified-parameters}

![lade-Beispiel](/images/landingpage-example.jpg)

#### A-Frame Beispiel mit externer URL (Screenshot oben) {#a-frame-example}

```html
<a-scene
  landing-page="
    mediaSrc: https://www.mydomain.com/helmet.glb;
    sceneEnvMap: hill"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb>
```

#### A-Frame Beispiel mit lokalem Asset {#a-frame-local-asset example}
```html
<a-scene
  xrextras-gesture-detector
  landing-page="mediaSrc: #myModel"
  xrextras-loading
  xrextras-runtime-error
  renderer="colorManagement: true"
  xrweb>

  <!-- We can define assets here to be loaded when A-Frame initializes -->
  <a-assets>
    <a-asset-item id="myModel" src="assets/my-model.glb"></a-asset-item>
  </a-assets>
```

#### Non-AFrame Beispiel (Screenshot oben) {#non-aframe-example--screenshot-above}

```js
// Hier konfiguriert
LandingPage.configure({
    mediaSrc: 'https://www.mydomain.com/bat.glb',
    sceneEnvMap: 'hill',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  // Hier hinzugefügt
  LandingPage.pipelineModule(),
  ...
])
```
