---
id: coaching-overlays
---

# Coaching-Overlay

Coaching Overlays ermöglichen es Ihnen, die Nutzer einzubinden und die beste Erfahrung zu gewährleisten.

## Absoluter Maßstab Coaching Overlay {#absolute-scale-coaching-overlay}

Das Coaching-Overlay für den absoluten Maßstab führt die Benutzer in die Erfahrungen mit dem absoluten Maßstab ein und stellt sicher, dass sie die
bestmöglichen Daten zur Bestimmung des Maßstabs sammeln. Wir haben das Coaching-Overlay so konzipiert, dass es von Entwicklern leicht
anpassbar ist, so dass Sie Ihre Zeit auf die Entwicklung Ihrer WebAR-Erfahrung konzentrieren können.

### Absolutes Skalen-Coaching-Overlay in Ihrem Projekt verwenden: {#use-absolute-scale-coaching-overlay-in-your-project}

1. Öffnen Sie Ihr Projekt
2. Fügen Sie den folgenden Tag in "head.html" ein

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Hinweis: Für selbst gehostete Projekte fügen Sie stattdessen den folgenden Tag "<script>" zu Ihrer Seite hinzu:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optional können Sie die Parameter Ihrer "Coaching-Overlay"-Komponente wie unten definiert anpassen. Für
   Nicht-AFrame-Projekte lesen Sie bitte die
   [CoachingOverlay.configure()](/legacy/api/coachingoverlay/configure) Dokumentation.

### Parameter der A-Frame-Komponente (alle optional) {#absolute-scale-coaching-overlay-parameters}

| Parameter      | Typ       | Standard                                               | Beschreibung                                                                                                                                                                                 |
| -------------- | --------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor | `String`  | 'weiß'                                                 | Farbe der Coaching-Overlay-Animation. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                 |
| promptColor    | `String`  | 'weiß'                                                 | Farbe des gesamten Coaching Overlay Textes. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                           |
| promptText     | `String`  | Gerät vorwärts und rückwärts bewegen". | Legt die Textzeichenfolge für den Erklärungstext der Animation fest, der die Benutzer über die Bewegung informiert, die sie ausführen müssen, um die Skalierung zu erzeugen. |
| disablePrompt  | `Boolean` | false                                                  | Auf true setzen, um das Standard-Coaching-Overlay auszublenden, um Coaching-Overlay-Ereignisse für ein benutzerdefiniertes Overlay zu verwenden.                             |

### Erstellen eines benutzerdefinierten Coaching-Overlays für Ihr Projekt {#custom-absolute-scale-coaching-overlay}

Coaching Overlay kann als Pipeline-Modul hinzugefügt und dann ausgeblendet werden (mit dem Parameter `disablePrompt`
), so dass Sie die Coaching Overlay-Ereignisse einfach verwenden können, um ein benutzerdefiniertes Overlay auszulösen.

Coaching Overlay-Ereignisse werden nur ausgelöst, wenn "scale" auf "absolut" eingestellt ist. Ereignisse werden von der
8th Wall-Kameraschleife ausgegeben und können von einem Pipeline-Modul abgehört werden.  Diese Veranstaltungen
umfassen:

- coaching-overlay.show": Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay angezeigt werden soll.
- coaching-overlay.hide": Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay ausgeblendet werden soll.

#### Beispiel - Coaching Overlay mit benutzerdefinierten Parametern {#example---coaching-overlay-with-user-specified-parameters}

![coachingoverlay-example](/images/coachingoverlay-example.jpg)

#### A-Frame Beispiel (Screenshot oben) {#a-frame-example-screenshot-above}

```jsx
<a-scene
  coaching-overlay="
    animationColor: #E86FFF;
    promptText: To generate scale push your phone forward and then pull back;"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb="scale: absolute;">
```

#### Non-AFrame Beispiel (Screenshot oben) {#non-aframe-example--screenshot-above}

```jsx
// Hier konfiguriert
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'To generate scale push your phone forward and then pull back',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  LandingPage.pipelineModule(),
  // Hier hinzugefügt
  CoachingOverlay.pipelineModule(),
  ...
])
```

#### AFrame Beispiel - Abhören von Coaching Overlay Ereignissen {#aframe-example---listening-for-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('coaching-overlay.show', () => {
  // Tu was
 })

this.el.sceneEl.addEventListener('coaching-overlay.hide', () => {
  // Tu was
})
```

#### Non-AFrame Beispiel - Abhören von Coaching Overlay Ereignissen {#non-aframe-example---listening-for-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXAMPLE: COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXAMPLE: COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name: 'my-coaching-overlay',
  listeners: [
    {event: 'coaching-overlay.show', process: myShow},
    {event: 'coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```

## VPS Coaching Overlay {#vps-coaching-overlay}

Das VPS-Coaching-Overlay führt die Benutzer in die VPS-Erfahrungen ein und stellt sicher, dass sie
an realen Orten richtig lokalisieren. Wir haben das Coaching Overlay so konzipiert, dass es von
Entwicklern leicht angepasst werden kann, so dass Sie sich auf die Entwicklung Ihrer WebAR-Erfahrung konzentrieren können.

### Verwenden Sie VPS Coaching Overlay in Ihrem Projekt: {#use-vps-coaching-overlay-in-your-project}

1. Öffnen Sie Ihr Projekt
2. Fügen Sie den folgenden Tag in "head.html" ein

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Hinweis: Für selbst gehostete Projekte fügen Sie stattdessen den folgenden Tag "<script>" zu Ihrer Seite hinzu:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optional können Sie die Parameter Ihrer "Coaching-Overlay"-Komponente wie unten definiert anpassen.  Für
   Nicht-AFrame-Projekte lesen Sie bitte die Dokumentation
   [VpsCoachingOverlay.configure()](/legacy/api/vpscoachingoverlay/vps-coachingoverlay-configure).

### Parameter der A-Frame-Komponente (alle optional) {#vps-coaching-overlay-parameters}

| Parameter          | Typ       | Standard                                                                       | Beschreibung                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------ | --------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| wayspot-name       | `String`  |                                                                                | Der Name des Ortes, an dem das Coaching-Overlay den Benutzer zur Lokalisierung anleitet. Wenn kein Standortname angegeben wird, wird der nächstgelegene Projektstandort verwendet. Wenn das Projekt keine Projektstandorte hat, wird der nächstgelegene Standort verwendet.                                                  |
| Hinweis-Bild       | `String`  |                                                                                | Bild, das dem Benutzer angezeigt wird, um ihn zum tatsächlichen Standort zu führen. Wenn kein Hinweisbild angegeben wird, wird das Standardbild für den Ort verwendet. Wenn für den Ort kein Standardbild vorhanden ist, wird kein Bild angezeigt. Akzeptierte Medienquellen sind img id oder statische URL. |
| Animation-Farbe    | `String`  | `'#ffffff'`                                                                    | Farbe der Coaching-Overlay-Animation. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                                                                                                                                                                                                 |
| animation-duration | Nummer    | `5000`                                                                         | Gesamtzeit, die das Hinweisbild vor dem Verkleinern angezeigt wird (in Millisekunden).                                                                                                                                                                                                                                                    |
| Souffleur-Farbe    | `String`  | `'#ffffff'`                                                                    | Farbe des gesamten Coaching Overlay Textes. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                                                                                                                                                                                           |
| Prompt-Präfix      | `String`  | Richten Sie Ihre Kamera auf... | Legt die Textzeichenfolge für die angezeigte Benutzeraktion über dem Namen des Standorts fest.                                                                                                                                                                                                                                                               |
| prompt-suffix      | `String`  | und bewegen Sie sich".                                         | Legt die Textzeichenfolge für die angezeigte Benutzeraktion unter dem Namen des Standorts fest.                                                                                                                                                                                                                                                              |
| status-text        | `String`  | "Scannen...                    | Legt die Textzeichenfolge fest, die unter dem Hinweisbild angezeigt wird, wenn es sich im geschrumpften Zustand befindet.                                                                                                                                                                                                                                    |
| disable-prompt     | `Boolean` | false                                                                          | Auf true setzen, um das Standard-Coaching-Overlay auszublenden, um Coaching-Overlay-Ereignisse für ein benutzerdefiniertes Overlay zu verwenden.                                                                                                                                                                                                             |

### Erstellen eines benutzerdefinierten Coaching-Overlays für Ihr Projekt {#custom-vps-coaching-overlay}

Coaching Overlay kann als Pipeline-Modul hinzugefügt und dann ausgeblendet werden (mit dem Parameter `disablePrompt`
), so dass Sie die Coaching Overlay-Ereignisse einfach verwenden können, um ein benutzerdefiniertes Overlay auszulösen.

VPS Coaching Overlay-Ereignisse werden nur ausgelöst, wenn `enableVps` auf `true` gesetzt ist. Die Ereignisse werden von der 8. Wandkamera-Laufschleife unter
ausgegeben und können von einem Pipeline-Modul aus abgehört werden.  Diese
Veranstaltungen umfassen:

- vps-coaching-overlay.show": Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay angezeigt werden soll.
- `vps-coaching-overlay.hide`: event is triggered when the Coaching Overlay should be hidden.

#### Beispiel - Coaching Overlay mit benutzerdefinierten Parametern {#example---coaching-overlay-with-user-specified-parameters}

![vps-coachingoverlay-example](/images/vps-coaching-overlay-example.jpg)

#### A-Frame Beispiel (Screenshot oben) {#a-frame-example-screenshot-above}

```html
<a-scene
  vps-coaching-overlay="
    prompt-color: #0000FF;
    prompt-prefix: Go look for;"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb="vpsEnabled: true;">
```

#### Non-AFrame Beispiel (Screenshot oben) {#non-aframe-example--screenshot-above}

```javascript
// Hier konfiguriert
VpsCoachingOverlay.configure({
    textColor: '#0000FF',
    promptPrefix: 'Go look for',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  LandingPage.pipelineModule(),
  // Hier hinzugefügt
  VpsCoachingOverlay.pipelineModule(),
  ...
])

```

#### AFrame Beispiel - Lauschen auf VPS Coaching Overlay Ereignisse {#aframe-example---listening-for-vps-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('vps-coaching-overlay.show', () => {
  // Tu etwas
 })

this.el.sceneEl.addEventListener('vps-coaching-overlay.hide', () => {
  // Tu etwas
})
```

#### Non-AFrame Beispiel - Abhören von VPS Coaching Overlay Ereignissen {#non-aframe-example---listening-for-vps-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXAMPLE: VPS COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXAMPLE: VPS COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name: 'my-coaching-overlay',
  listeners: [
    {event: 'vps-coaching-overlay.show', process: myShow},
    {event: 'vps-coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```

## Himmelseffekte Coaching Overlay {#sky-effects-coaching-overlay}

Das Sky-Effects-Coaching-Overlay führt die Nutzer in die Sky-Effects-Erfahrung ein und stellt sicher, dass sie ihr
Gerät auf den Himmel richten. Wir haben das Coaching Overlay so konzipiert, dass es von Entwicklern leicht angepasst werden kann,
damit Sie sich auf die Entwicklung Ihrer WebAR-Erfahrung konzentrieren können.

\*\*Hinweis: Die Himmelseffekte können derzeit nicht im
[Simulator] (/legacy/getting-started/quick-start-guide/#simulator ) angezeigt werden.

### Verwenden Sie den Himmelseffekt Coaching Overlay in Ihrem Projekt {#use-sky-effects-coaching-overlay-in-your-project}

1. Öffnen Sie Ihr Projekt
2. Fügen Sie den folgenden Tag in "head.html" ein

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Hinweis: Für selbst gehostete Projekte fügen Sie stattdessen den folgenden Tag "<script>" zu Ihrer Seite hinzu:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optional können Sie die Parameter der Komponente "Sky-Coaching-Overlay" wie unten definiert anpassen.
   Für Nicht-AFrame-Projekte lesen Sie bitte die Dokumentation SkyCoachingOverlay.configure().

### Parameter der A-Frame-Komponente (alle optional) {#sky-coaching-overlay-parameters}

| Parameter       | Typ       | Standard                                                | Beschreibung                                                                                                                                                     |
| --------------- | --------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor  | `String`  | 'weiß'                                                  | Farbe der Coaching-Overlay-Animation. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                     |
| promptColor     | `String`  | 'weiß'                                                  | Farbe des gesamten Coaching Overlay Textes. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                               |
| promptText      | `String`  | Richten Sie Ihr Telefon in den Himmel". | Legt die Textzeichenfolge für den Erklärungstext der Animation fest, der die Benutzer über die auszuführende Bewegung informiert.                |
| disablePrompt   | `Boolean` | false                                                   | Auf true setzen, um das Standard-Coaching-Overlay auszublenden, um Coaching-Overlay-Ereignisse für ein benutzerdefiniertes Overlay zu verwenden. |
| autoByThreshold | `Boolean` | `true`                                                  | Automatisches Ein-/Ausblenden des Overlays basierend auf dem Prozentsatz der Himmelspixel über/unter `hideThreshold` / `showThreshold`                           |
| showThreshold   | Nummer    | 0.1                                     | Zeigt ein derzeit verborgenes Overlay an, wenn der Prozentsatz der Himmelspixel unter diesem Schwellenwert liegt.                                |
| hideThreshold   | Nummer    | 0.05                                    | Blendet ein aktuell angezeigtes Overlay aus, wenn der Prozentsatz der Himmelspixel über diesem Schwellenwert liegt.                              |

### Erstellen eines benutzerdefinierten Coaching-Overlays für Ihr Projekt {#custom-sky-coaching-overlay}

Sky Coaching Overlay kann als Pipeline-Modul hinzugefügt und dann ausgeblendet werden (mit dem Parameter `disablePrompt`), so dass Sie die Coaching Overlay-Ereignisse einfach verwenden können, um ein benutzerdefiniertes Overlay auszulösen.

- sky-coaching-overlay.show": Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay angezeigt werden soll.
- sky-coaching-overlay.hide": Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay ausgeblendet werden soll.

**SkyCoachingOverlay.control**

Standardmäßig wird das Coaching-Overlay von Sky Effects automatisch ein- und ausgeblendet, je nachdem, ob der Benutzer gerade in den Himmel schaut oder nicht. Sie können die Kontrolle über dieses Verhalten übernehmen, indem Sie `SkyCoachingOverlay.control` verwenden.

```javascript
// Das Coaching-Overlay anzeigen
SkyCoachingOverlay.control.show()
// Das Coaching-Overlay ausblenden
SkyCoachingOverlay.control.hide()
// Das SkyCoaching-Overlay soll sich automatisch ein- und ausblenden lassen.
SkyCoachingOverlay.control.setAutoShowHide(true)
// Das Himmelscoaching-Overlay wird nicht automatisch ein- bzw. ausgeblendet.
SkyCoachingOverlay.control.setAutoShowHide(false)
// Blendet das Coaching-Overlay aus und räumt es auf
SkyCoachingOverlay.control.cleanup()
```

Zum Beispiel könnte ein Teil Ihrer Erfahrung nicht mehr erfordern, dass der Nutzer in den Himmel schaut. Wenn Sie nicht `setAutoShowHide(false)` aufrufen, wird das Coaching-Overlay oben auf Ihrer Benutzeroberfläche angezeigt. Rufen Sie in diesem Fall `setAutoShowHide(false)` auf und steuern Sie dann manuell das Ein- und Ausblenden mit `show()` und `hide()`. Oder wenn Sie den Benutzer auffordern wollen, sich den Himmel noch einmal anzusehen, setzen Sie `AutoShowHide(true)`.

#### Beispiel - Sky Coaching Overlay mit benutzerdefinierten Parametern {#example---sky-coaching-overlay-with-user-specified-parameters}

![sky-coachingoverlay-example](/images/sky-coachingoverlay-example.jpg)

#### A-Frame Beispiel (Screenshot oben) {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrlayers="cameraDirection: back;"
  sky-coaching-overlay="
    animationColor: #E86FFF;
    promptText: Look at the sky!;"
  ...
  renderer="colorManagement: true"
>
```

#### Non-AFrame Beispiel (Screenshot oben) {#non-aframe-example--screenshot-above}

```javascript
// Hier konfiguriert
SkyCoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Look at the sky!!',
})
XR8.addCameraPipelineModules([ // Kamerapipeline-Module hinzufügen.
    // Vorhandene Pipeline-Module.
    XR8.GlTextureRenderer.pipelineModule(), // Zeichnet den Kamera-Feed.
    XR8.Threejs.pipelineModule(), // Erzeugt eine ThreeJS AR-Szene sowie eine Sky-Szene.
    window.LandingPage.pipelineModule(), // Erkennt nicht unterstützte Browser und gibt Hinweise.
    XRExtras.FullWindowCanvas.pipelineModule(), // Ändert die Leinwand, um das Fenster zu füllen.
    XRExtras.Loading.pipelineModule(), // Verwaltet den Ladebildschirm beim Starten.
    XRExtras.RuntimeError.pipelineModule(), // Zeigt bei Laufzeitfehlern ein Fehlerbild an.

    // Aktiviert die Himmelssegmentierung.
    XR8.LayersController.pipelineModule(),
    SkyCoachingOverlay.pipelineModule(),

    ...
    mySkySampleScenePipelineModule(),
  ])

  XR8.LayersController.configure({layers: {sky: {invertLayerMask: false}}})
  XR8.Threejs.configure({layerScenes: ['sky']})

```

#### AFrame Beispiel - Abhören von Sky Coaching Overlay Ereignissen {#aframe-example---listening-for-sky-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('sky-coaching-overlay.show', () => {
  // Tu etwas
 })

this.el.sceneEl.addEventListener('sky-coaching-overlay.hide', () => {
  // Tu etwas
})
```

#### Non-AFrame Beispiel - Abhören von Sky Coaching Overlay Ereignissen {#non-aframe-example---listening-for-sky-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXAMPLE: SKY COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXAMPLE: SKY COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name: 'my-sky-coaching-overlay',
  listeners: [
    {event: 'sky-coaching-overlay.show', process: myShow},
    {event: 'sky-coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```

## Hand Tracking Coaching Overlay {#hand-tracking-coaching-overlay}

Das Hand-Tracking-Coaching-Overlay führt die Nutzer in die Hand-Tracking-Erfahrung ein und stellt sicher, dass sie ihr
Telefon auf eine Hand richten. Wir haben das Coaching Overlay so konzipiert, dass es von Entwicklern leicht angepasst werden kann,
damit Sie sich auf die Entwicklung Ihrer WebAR-Erfahrung konzentrieren können.

### Verwenden Sie Hand Tracking Coaching Overlay in Ihrem Projekt {#use-hand-tracking-coaching-overlay-in-your-project}

1. Öffnen Sie Ihr Projekt
2. Fügen Sie den folgenden Tag in "head.html" ein

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Hinweis: Für selbst gehostete Projekte fügen Sie stattdessen den folgenden Tag "<script>" zu Ihrer Seite hinzu:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optional können Sie die Parameter der Komponente "Hand-Coaching-Overlay" wie unten definiert anpassen.
   Für Nicht-AFrame-Projekte lesen Sie bitte die Dokumentation HandCoachingOverlay.configure().

### Parameter der A-Frame-Komponente (alle optional) {#hand-coaching-overlay-parameters}

| Parameter      | Typ       | Standard                                                | Beschreibung                                                                                                                                                     |
| -------------- | --------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor | `String`  | 'weiß'                                                  | Farbe der Coaching-Overlay-Animation. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                     |
| promptColor    | `String`  | 'weiß'                                                  | Farbe des gesamten Coaching Overlay Textes. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                               |
| promptText     | `String`  | Richten Sie Ihr Telefon auf Ihre Hand". | Legt die Textzeichenfolge für den Erklärungstext der Animation fest, der die Benutzer über die auszuführende Bewegung informiert.                |
| disablePrompt  | `Boolean` | false                                                   | Auf true setzen, um das Standard-Coaching-Overlay auszublenden, um Coaching-Overlay-Ereignisse für ein benutzerdefiniertes Overlay zu verwenden. |

### Erstellen eines benutzerdefinierten Coaching-Overlays für Ihr Projekt {#custom-hand-coaching-overlay}

Das Hand-Coaching-Overlay kann als Pipeline-Modul hinzugefügt und dann ausgeblendet werden (mit dem Parameter `disablePrompt`), so dass Sie die Coaching-Overlay-Ereignisse problemlos zum Auslösen eines benutzerdefinierten Overlays verwenden können.

- hand-coaching-overlay.show": Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay angezeigt werden soll.
- hand-coaching-overlay.hide": Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay ausgeblendet werden soll.

#### Beispiel - Hand Coaching Overlay mit benutzerdefinierten Parametern {#example---hand-coaching-overlay-with-user-specified-parameters}

![hand-coachingoverlay-example](/images/hand-coaching-overlay-example.jpeg)

#### A-Frame Beispiel (Screenshot oben) {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrhand="allowedDevices:any; cameraDirection:back;"
  hand-coaching-overlay="
    animationColor: #E86FFF;
    promptText: Richten Sie das Telefon auf Ihre linke Hand!;"
  ...
  renderer="colorManagement: true"
>
```

#### Non-AFrame Beispiel (Screenshot oben) {#non-aframe-example--screenshot-above}

```javascript
// Hier konfiguriert
HandCoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Richten Sie das Telefon auf Ihre linke Hand!',
})
XR8.addCameraPipelineModules([ // Kamera-Pipeline-Module hinzufügen.
    // Vorhandene Pipeline-Module.
    XR8.GlTextureRenderer.pipelineModule(), // Zeichnet den Kamera-Feed.
    XR8.Threejs.pipelineModule(), // Erzeugt eine ThreeJS AR-Szene sowie eine Sky-Szene.
    window.LandingPage.pipelineModule(), // Erkennt nicht unterstützte Browser und gibt Hinweise.
    XRExtras.FullWindowCanvas.pipelineModule(), // Ändert die Leinwand, um das Fenster zu füllen.
    XRExtras.Loading.pipelineModule(), // Verwaltet den Ladebildschirm beim Starten.
    XRExtras.RuntimeError.pipelineModule(), // Zeigt bei Laufzeitfehlern ein Fehlerbild an.

    // Aktiviert die Handverfolgung.
    XR8.HandController.pipelineModule(),
    HandCoachingOverlay.pipelineModule(),

    ...
    myHandSampleScenePipelineModule(),
  ])

```

#### AFrame Beispiel - Hören auf Hand Coaching Overlay Ereignisse {#aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('hand-coaching-overlay.show', () => {
  // Tu etwas
 })

this.el.sceneEl.addEventListener('hand-coaching-overlay.hide', () => {
  // Tu etwas
})
```

#### Non-AFrame-Beispiel - Abhören von Hand-Coaching-Overlay-Ereignissen {#non-aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXAMPLE: HAND COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXAMPLE: HAND COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name: 'my-hand-coaching-overlay',
  listeners: [
    {event: 'hand-coaching-overlay.show', process: myShow},
    {event: 'hand-coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```
