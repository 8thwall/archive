---
id: landing-pages
---

# Landing Pages

Landing Pages sind eine Weiterentwicklung unserer beliebten "Almost There"-Seiten.

## Warum Landing Pages verwenden? {#why-use-landing-pages}

Wir haben diese Seiten so umgestaltet, dass sie für Sie und Ihre Kunden unter
zu einer leistungsstarken Marken- und Marketingmöglichkeit werden. Alle Landing Page-Vorlagen sind für Branding und Ausbildung mit verschiedenen
Layouts, einem verbesserten QR-Code-Design und Unterstützung für wichtige Medien optimiert.

Landing Pages sorgen dafür, dass Ihre Nutzer unabhängig vom verwendeten Gerät ein sinnvolles Erlebnis haben.
\- Sie erscheinen auf Geräten, die nicht direkt auf das Web AR-Erlebnis
zugreifen dürfen oder können. Sie setzen auch unsere Mission fort, AR zugänglich zu machen, indem sie den Nutzern helfen, das richtige
Ziel zu erreichen, um sich mit AR zu beschäftigen.

Wir haben die Landing Pages so gestaltet, dass es für Entwickler extrem einfach ist, die Seite
zu individualisieren. Wir möchten, dass Sie von einer optimierten Landing Page profitieren, während Sie Ihre
Zeit in den Aufbau Ihrer WebAR-Erfahrung investieren können.

## Landing Pages passen sich intelligent an Ihre Konfiguration an {#landing-pages-intelligently-adapt-to-your-configuration}

![loading-examples1](/images/landing-examples1.jpg)

![loading-examples2](/images/landing-examples2.jpg)

## Verwenden Sie Landing Pages in Ihrem Projekt {#use-landing-pages-in-your-project}

1. Öffnen Sie Ihr Projekt
2. Fügen Sie den folgenden Tag in "head.html" ein

`<meta name="8thwall:package" content="@8thwall.landing-page">`

Hinweis: Für selbst gehostete Projekte fügen Sie stattdessen den folgenden Tag "<script>" zu Ihrer Seite hinzu:

`<script src='https://cdn.8thwall.com/web/landing-page/landing-page.js'></script>`

3. **Entfernen** Sie `xrextras-almost-there` aus Ihrem A-Frame Projekt, oder
   `XRExtras.AlmostThere.pipelineModule()` aus Ihrem Non-AFrame Projekt. (Die Landing Pages enthalten zusätzlich zu den Aktualisierungen der QR-Code-Seite die Logik
   .)
4. Optional können Sie die Parameter Ihrer "Landing Page"-Komponente wie unten definiert anpassen. Für
   Nicht-AFrame-Projekte lesen Sie bitte die [LandingPage.configure()](/legacy/api/landingpage/configure)
   Dokumentation.

## Parameter der A-Frame-Komponente (alle fakultativ) {#a-frame-component-parameters}

| Parameter              | Typ       | Standard                                                                      | Beschreibung                                                                                                                                                                                                                                            |
| ---------------------- | --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logoSrc                | `String`  |                                                                               | Bildquelle für das Markenlogo.                                                                                                                                                                                                          |
| logoAlt                | `String`  | ''Logo''                                                                      | Alt-Text für das Markenlogo-Bild.                                                                                                                                                                                                       |
| promptPrefix           | `String`  | Scannen oder besuchen".                                       | Legt die Textzeichenfolge für die Aufforderung zum Handeln fest, bevor die URL für das Erlebnis angezeigt wird.                                                                                                                         |
| url                    | `String`  | 8th.io Link, wenn 8th Wall gehostet wird, oder aktuelle Seite | Legt die angezeigte URL und den QR-Code fest.                                                                                                                                                                                           |
| promptSuffix           | `String`  | weiter                                                                        | Legt die Textzeichenfolge für die Aufforderung zum Handeln fest, nachdem die URL für das Erlebnis angezeigt wurde.                                                                                                                      |
| textColor              | Hex-Farbe | `'#ffffff'`                                                                   | Farbe des gesamten Textes auf der Landing Page.                                                                                                                                                                                         |
| Schriftart             | `String`  | Nunito", sans-serif"                                                          | Schriftart des gesamten Textes auf der Landing Page. Dieser Parameter akzeptiert gültige CSS font-family Argumente.                                                                                                     |
| textSchatten           | `Boolean` | false                                                                         | Legt die Eigenschaft text-shadow für alle Texte auf der Landing Page fest.                                                                                                                                                              |
| backgroundSrc          | `String`  |                                                                               | Bildquelle für das Hintergrundbild.                                                                                                                                                                                                     |
| backgroundBlur         | Nummer    | `0`                                                                           | Wendet einen Unschärfeeffekt auf den `backgroundSrc` an, wenn einer angegeben ist. (Normalerweise liegen die Werte zwischen 0,0 und 1,0)                                                                             |
| backgroundColor        | `String`  | `'linear-gradient(#464766,#2D2E43)'`                                          | Hintergrundfarbe der Landing Page. Dieser Parameter akzeptiert gültige CSS-Hintergrundfarbenargumente. Die Hintergrundfarbe wird nicht angezeigt, wenn ein background-src oder sceneEnvMap gesetzt ist. |
| mediaSrc               | `String`  | Das Titelbild der App, falls vorhanden                                        | Medienquelle (3D-Modell, Bild oder Video) für den Hauptinhalt der Landing Page. Zu den akzeptierten Medienquellen gehören a-asset-item id oder eine statische URL.                                   |
| mediaAlt               | `String`  | ''Vorschau''                                                                  | Alt-Text für den Bildinhalt der Landing Page.                                                                                                                                                                                           |
| mediaAutoplay          | `Boolean` | `true`                                                                        | Wenn die `mediaSrc` ein Video ist, wird angegeben, ob das Video beim Laden mit stummgeschaltetem Ton abgespielt werden soll.                                                                                                            |
| mediaAnimation         | `String`  | Erster Animationsclip des Modells, falls vorhanden                            | Handelt es sich bei "mediaSrc" um ein 3D-Modell, geben Sie an, ob ein bestimmter Animationsclip, der mit dem Modell verbunden ist, abgespielt werden soll, oder "none".                                                                 |
| mediaControls          | `String`  | 'minimal'                                                                     | Wenn `mediaSrc` ein Video ist, geben Sie die Mediensteuerung an, die dem Benutzer angezeigt wird. Wählen Sie zwischen "Keine", "Mininal" oder "Browser" (Browser-Standardeinstellungen)                              |
| sceneEnvMap            | `String`  | Feld                                                                          | Bildquelle, die auf ein gleichwinkliges Bild zeigt. Oder eine der folgenden voreingestellten Umgebungen: "Feld", "Hügel", "Stadt", "Pastell" oder "Raum".                                               |
| sceneOrbitIdle         | `String`  | Spin".                                                        | Handelt es sich bei "mediaSrc" um ein 3D-Modell, geben Sie an, ob sich das Modell "drehen" oder "keine" soll.                                                                                                                           |
| sceneOrbitInteraction  | `String`  | ''ziehen''                                                                    | Wenn es sich bei der Quelle um ein 3D-Modell handelt, geben Sie an, ob der Benutzer mit den Orbit-Steuerungen interagieren kann, wählen Sie "ziehen" oder "keine".                                                                      |
| sceneLightingIntensity | Nummer    | `1`                                                                           | Handelt es sich bei der "Medienquelle" um ein 3D-Modell, geben Sie die Stärke des Lichts an, das den Modus beleuchtet.                                                                                                                  |
| vrPromptPrefix         | `String`  | oder besuchen".                                               | Legt den Textstring für die Aufforderung zum Handeln fest, bevor die URL für das Erlebnis auf VR-Headsets angezeigt wird.                                                                                                               |

## Beispiele {#examples}

#### 3D-Layout mit benutzerdefinierten Parametern {#3d-layout-with-user-specified-parameters}

![loading-example](/images/landingpage-example.jpg)

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

#### A-Frame-Beispiel mit lokalem Asset {#a-frame-local-asset example}

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
