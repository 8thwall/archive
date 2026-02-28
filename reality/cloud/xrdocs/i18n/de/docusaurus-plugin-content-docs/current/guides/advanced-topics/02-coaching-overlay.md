---
id: coaching-overlays
---

# Coaching Overlay

Mit Coaching Overlays können Sie die Benutzer einbinden und das beste Erlebnis gewährleisten.

## Absolutskala Coaching Overlay {#absolute-scale-coaching-overlay}

Das Coaching-Overlay für die Absolutskala führt die Benutzer in das Ereignis mit der Absolutskala ein und stellt sicher, dass sie die bestmöglichen Daten zur Bestimmung des Maßstabs erfassen. Wir haben das Coaching Overlay so konzipiert, dass es von Entwicklern leicht anpassbar ist, so dass Sie Ihre Zeit auf die Entwicklung Ihres WebAR-Erlebnisses konzentrieren können.

### Verwenden Sie das Coaching-Overlay mit Absolutskala in Ihrem Projekt: {#use-absolute-scale-coaching-overlay-in-your-project}

1. Öffnen Sie Ihr Projekt
2. Fügen Sie den folgenden Tag zu `head.html hinzu`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Hinweis: Bei selbst gehosteten Projekten fügen Sie stattdessen den folgenden `` Tag zu Ihrer Seite hinzu:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optional können Sie die Parameter Ihrer `coaching-overlay` Komponente wie unten beschrieben anpassen. Für Non-AFrame Projekte lesen Sie bitte die [CoachingOverlay.configure()](/api/coachingoverlay/configure) Dokumentation.

### Parameter der A-Frame-Komponente (alle optional) {#absolute-scale-coaching-overlay-parameters}

| Parameter      | Typ         | Standard                         | Beschreibung                                                                                                                                                            |
| -------------- | ----------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor | `String`    | `'weiß'`                         | Farbe der Coaching Overlay-Animation. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                            |
| promptColor    | `String`    | `'weiß'`                         | Farbe des gesamten Coaching Overlay-Textes. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                      |
| promptText     | `String`    | `"Gerät vor- und zurückbewegen'` | Legt den Textstring für den Erklärungstext der Animation fest, der den Benutzer über die Bewegung informiert, die er ausführen muss, um die Skalierung zu erzeugen.     |
| disablePrompt  | `Boolesche` | `false`                          | Setzen Sie diesen Wert auf Wahr, um das Standard-Coaching-Overlay auszublenden, um Coaching-Overlay-Ereignisse für ein benutzerdefiniertes Overlay verwenden zu können. |

### Erstellen eines benutzerdefinierten Coaching-Overlays für Ihr Projekt {#custom-absolute-scale-coaching-overlay}

Coaching Overlay kann als Pipeline-Modul hinzugefügt und dann ausgeblendet werden (mit dem Parameter `disablePrompt` ), so dass Sie die Coaching Overlay-Ereignisse problemlos zum Auslösen eines benutzerdefinierten Overlays verwenden können.

Coaching Overlay-Ereignisse werden nur ausgelöst, wenn `Skala` auf `Absolut` eingestellt ist. Ereignisse werden von der 8th Wall-Kameraschleife ausgegeben und können von einem Pipeline-Modul abgehört werden.  Diese Ereignisse umfassen:

* `coaching-overlay.show`: Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay angezeigt werden soll.
* `coaching-overlay.hide`: Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay ausgeblendet werden soll.

#### Beispiel - Coaching Overlay mit benutzerdefinierten Parametern {#example---coaching-overlay-with-user-specified-parameters}

![coaching-overlay-Beispiel](/images/coachingoverlay-example.jpg)

#### A-Frame Beispiel (Bildschirmfoto oben) {#a-frame-example-screenshot-above}

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
    promptText: 'Um eine Skalierung zu erzeugen, schieben Sie Ihr Telefon nach vorne und ziehen Sie es dann zurück',
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
  // Tu etwas
 })

this.el.sceneEl.addEventListener('coaching-overlay.hide', () => {
  // Tu etwas
})
```

#### Non-AFrame Beispiel - Abhören von Coaching Overlay Ereignissen {#non-aframe-example---listening-for-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('BEISPIEL: COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('BEISPIEL: COACHING OVERLAY - HIDE')
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

Das VPS-Coaching-Overlay führt die Benutzer in die VPS-Ereignisse ein und stellt sicher, dass sie an realen Orten richtig lokalisieren. Wir haben das Coaching Overlay so konzipiert, dass es von Entwicklern leicht angepasst werden kann, so dass Sie Ihre Zeit auf die Entwicklung Ihres WebAR-Erlebnisses konzentrieren können.

### Verwenden Sie VPS Coaching Overlay in Ihrem Projekt: {#use-vps-coaching-overlay-in-your-project}

1. Öffnen Sie Ihr Projekt
2. Fügen Sie den folgenden Tag zu `head.html hinzu`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Hinweis: Bei selbst gehosteten Projekten fügen Sie stattdessen den folgenden `` Tag zu Ihrer Seite hinzu:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optional können Sie die Parameter Ihrer `coaching-overlay` Komponente wie unten beschrieben anpassen.  Für Non-AFrame-Projekte lesen Sie bitte die Dokumentation [VpsCoachingOverlay.configure()](/api/vpscoachingoverlay/vps-coachingoverlay-configure) .

### Parameter der A-Frame-Komponente (alle optional) {#vps-coaching-overlay-parameters}

| Parameter          | Typ         | Standard                        | Beschreibung                                                                                                                                                                                                                                                                                                              |
| ------------------ | ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| wayspot-name       | `String`    |                                 | Der Name des Ortes, an dem das Coaching-Overlay den Benutzer zur Lokalisierung anleitet. Wenn kein Standortname angegeben wird, wird der nächstgelegene Projektstandort verwendet. Wenn das Projekt keine Projektstandorte hat, wird der nächstgelegene Standort verwendet.                                               |
| hint-image         | `String`    |                                 | Bild, das dem Benutzer angezeigt wird, um ihn zum Standort in der realen Welt zu führen. Wenn kein Hinweisbild angegeben wird, wird das Standardbild für den Ort verwendet. Wenn für den Ort kein Standardbild vorhanden ist, wird kein Bild angezeigt. Akzeptierte Medienquellen sind die img id oder die statische URL. |
| animation-color    | `String`    | `'#ffffff'`                     | Farbe der Coaching Overlay-Animation. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                                                                                                                                                                              |
| animation-duration | `Nummer`    | `5000`                          | Gesamtzeit, die das Hinweisbild vor dem Verkleinern angezeigt wird (in Millisekunden).                                                                                                                                                                                                                                    |
| souffleur-Farbe    | `String`    | `'#ffffff'`                     | Farbe des gesamten Coaching Overlay-Textes. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                                                                                                                                                                        |
| prompt-prefix      | `String`    | `'Richten Sie Ihre Kamera auf'` | Legt die Textzeichenfolge für die angezeigte Benutzeraktion über dem Namen des Standorts fest.                                                                                                                                                                                                                            |
| prompt-suffix      | `String`    | `'und bewegen Sie sie'`         | Legt die Textzeichenfolge für die angezeigte Benutzeraktion unter dem Namen des Standorts fest.                                                                                                                                                                                                                           |
| status-text        | `String`    | `'Scannen...'`                  | Legt den Textstring fest, die unter dem Hinweisbild angezeigt wird, wenn es sich im geschrumpften Zustand befindet.                                                                                                                                                                                                       |
| disable-prompt     | `Boolesche` | `false`                         | Setzen Sie diesen Wert auf Wahr, um das Standard-Coaching-Overlay auszublenden, um Coaching-Overlay-Ereignisse für ein benutzerdefiniertes Overlay verwenden zu können.                                                                                                                                                   |

### Erstellen eines benutzerdefinierten Coaching-Overlays für Ihr Projekt {#custom-vps-coaching-overlay}

Coaching Overlay kann als Pipeline-Modul hinzugefügt und dann ausgeblendet werden (mit dem Parameter `disablePrompt` ), so dass Sie die Coaching Overlay-Ereignisse problemlos zum Auslösen eines benutzerdefinierten Overlays verwenden können.

VPS Coaching Overlay-Ereignisse werden nur ausgelöst, wenn `enableVps` auf `true` gesetzt ist. Ereignisse werden von der 8th Wall-Kamera-Laufschleife ausgegeben und können von einem Pipeline-Modul aus abgehört werden.  Diese Ereignisse umfassen:

* `vps-coaching-overlay.show`: Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay angezeigt werden soll.
* `vps-coaching-overlay.hide`: Ereignis wird ausgelöst, wenn das Coaching-Overlay ausgeblendet werden soll.

#### Beispiel - Coaching Overlay mit benutzerdefinierten Parametern {#example---coaching-overlay-with-user-specified-parameters}

![vps-coachingoverlay-example](/images/vps-coaching-overlay-example.jpg)

#### A-Frame Beispiel (Bildschirmfoto oben) {#a-frame-example-screenshot-above}

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

#### AFrame Beispiel - Abhören von VPS Coaching Overlay Ereignissen {#aframe-example---listening-for-vps-coaching-overlay-events}

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
  console.log('BEISPIEL: VPS COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('BEISPIEL: VPS COACHING OVERLAY - HIDE')
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

## Coaching Overlay Himmelseffekte {#sky-effects-coaching-overlay}

Das Himmeleffekte-Coaching-Overlay führt die Nutzer in das Himmeleffekte-Ereignis ein und stellt sicher, dass sie ihr Gerät auf den Himmel ausrichten. Wir haben das Coaching Overlay so konzipiert, dass es von Entwicklern leicht angepasst werden kann, damit Sie sich auf die Entwicklung Ihres WebAR-Erlebnisses konzentrieren können.

**Hinweis: Die Himmelseffekte können derzeit nicht im [Simulator](/getting-started/quick-start-guide/#simulator)angezeigt werden.**

### Verwendung des Coaching Overlay Himmelseffekte in Ihrem Projekt {#use-sky-effects-coaching-overlay-in-your-project}

1. Öffnen Sie Ihr Projekt
2. Fügen Sie den folgenden Tag zu `head.html hinzu`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Hinweis: Bei selbst gehosteten Projekten fügen Sie stattdessen den folgenden `` Tag zu Ihrer Seite hinzu:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optional können Sie die Parameter Ihrer `sky-coaching-overlay` Komponente wie unten beschrieben anpassen. Für Non-AFrame-Projekte lesen Sie bitte die
<!-- TODO (tri) API link doesn't exist, remove/replace it -->
 [SkyCoachingOverlay.configure()](#skycoachingoverlayconfigure) Dokumentation.

### Parameter der A-Frame-Komponente (alle optional) {#sky-coaching-overlay-parameters}

| Parameter       | Typ         | Standard                                   | Beschreibung                                                                                                                                                            |
| --------------- | ----------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor  | `String`    | `'weiß'`                                   | Farbe der Coaching Overlay-Animation. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                            |
| promptColor     | `String`    | `'weiß'`                                   | Farbe des gesamten Coaching Overlay-Textes. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                      |
| promptText      | `String`    | `'Richten Sie Ihr Telefon auf den Himmel'` | Legt den Textstring für den Erklärungstext der Animation fest, der den Benutzer über die Bewegung informiert, die er ausführen muss.                                    |
| disablePrompt   | `Boolesche` | `false`                                    | Setzen Sie diesen Wert auf Wahr, um das Standard-Coaching-Overlay auszublenden, um Coaching-Overlay-Ereignisse für ein benutzerdefiniertes Overlay verwenden zu können. |
| autoByThreshold | `Boolesche` | `wahr`                                     | Automatisches Ein-/Ausblenden des Overlays basierend auf dem Prozentsatz der Himmelspixel oberhalb/unterhalb von `hideThreshold` / `showThreshold`                      |
| showThreshold   | `Nummer`    | 0.1                                        | Zeigt ein derzeit verborgenes Overlay an, wenn der Prozentsatz der Himmelspixel unter diesem Schwellenwert liegt.                                                       |
| hideThreshold   | `Nummer`    | 0.05                                       | Blendet ein aktuell angezeigtes Overlay aus, wenn der Prozentsatz der Himmelspixel über diesem Schwellenwert liegt.                                                     |

### Erstellen eines benutzerdefinierten Coaching-Overlays für Ihr Projekt {#custom-sky-coaching-overlay}

Sky Coaching Overlay kann als Pipeline-Modul hinzugefügt und dann ausgeblendet werden (mit dem Parameter `disablePrompt` ), so dass Sie die Coaching Overlay-Ereignisse problemlos zum Auslösen eines benutzerdefinierten Overlays verwenden können.

* `sky-coaching-overlay.show`: Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay angezeigt werden soll.
* `sky-coaching-overlay.hide`: Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay ausgeblendet werden soll.


**SkyCoachingOverlay.control**

Standardmäßig wird das Coaching-Overlay Himmelseffekte automatisch ein- und ausgeblendet, je nachdem, ob der Benutzer gerade in den Himmel schaut oder nicht. Sie können die Kontrolle über dieses Verhalten übernehmen, indem Sie `SkyCoachingOverlay.control` verwenden.

```javascript
// Zeigen Sie das Coaching-Overlay
SkyCoachingOverlay.control.show()
// Blenden Sie das Coaching-Overlay aus
SkyCoachingOverlay.control.hide()
// Sorgen Sie dafür, dass sich das SkyCoaching-Overlay automatisch ein-/ausblendet.
SkyCoachingOverlay.control.setAutoShowHide(true)
// Stellen Sie sicher, dass sich das SkyCoaching-Overlay nicht automatisch ein- und ausblendet.
SkyCoachingOverlay.control.setAutoShowHide(false)
// Blendet das Coaching-Overlay aus und räumt es auf
SkyCoachingOverlay.control.cleanup()
```

Zum Beispiel könnte ein Teil Ihres Erlebnisses nicht mehr erfordern, dass der Benutzer in den Himmel schaut. Wenn Sie `setAutoShowHide(false)` nicht aufrufen, wird das Coaching-Overlay oben auf Ihrer Benutzeroberfläche angezeigt. Rufen Sie in diesem Fall `setAutoShowHide(false)` auf und steuern Sie dann manuell das Ein- und Ausblenden mit `show()` und `hide()`. Oder wenn Sie bereit sind, den Benutzer aufzufordern, sich den Himmel erneut anzusehen, `setAutoShowHide(true)`.


#### Beispiel - Sky Coaching Overlay mit benutzerdefinierten Parametern {#example---sky-coaching-overlay-with-user-specified-parameters}

![sky-coachingoverlay-example](/images/sky-coachingoverlay-example.jpg)

#### A-Frame Beispiel (Bildschirmfoto oben) {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrlayers="cameraDirection: back;"
  sky-coaching-overlay="
    animationColor: #E86FFF;
    promptText: Sehen Sie sich den Himmel an!;"
  ...
  renderer="colorManagement: true"
>
```

#### Non-AFrame Beispiel (Screenshot oben) {#non-aframe-example--screenshot-above}

```javascript
// Hier konfiguriert
SkyCoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Sehen Sie sich den Himmel an!',
})
XR8.addCameraPipelineModules([ // Kamerapipeline-Module hinzufügen.
    // Vorhandene Pipeline-Module.
    XR8.GlTextureRenderer.pipelineModule(), // Zeichnet den Kamera-Feed.
    XR8.Threejs.pipelineModule(), // Erzeugt eine ThreeJS AR-Szene sowie eine Sky-Szene.
    window.LandingPage.pipelineModule(), // Erkennt nicht unterstützte Browser und gibt Hinweise.
    XRExtras.FullWindowCanvas.pipelineModule(), // Ändert die Leinwand, um das Fenster zu füllen.
    XRExtras.Loading.pipelineModule(), // Verwaltet den Ladebildschirm beim Starten.
    XRExtras.RuntimeError.pipelineModule(), // Zeigt ein Fehlerbild bei Laufzeitfehlern.

    // Ermöglicht die Segmentierung des Himmels.
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
  console.log('BEISPIEL: SKY COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('BEISPIEL: SKY COACHING OVERLAY - HIDE')
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

## Handverfolgung Coaching Overlay {#hand-tracking-coaching-overlay}

Das Handverfolgung-Coaching-Overlay führt die Nutzer in das Handverfolgung-Ereignis ein und stellt sicher, dass sie ihr Telefon auf eine Hand ausrichten. Wir haben das Coaching Overlay so konzipiert, dass es von Entwicklern leicht angepasst werden kann, damit Sie sich auf die Entwicklung Ihres WebAR-Erlebnisses konzentrieren können.

### Coaching Overlay Handverfolgung in Ihrem Projekt verwenden {#use-hand-tracking-coaching-overlay-in-your-project}

1. Öffnen Sie Ihr Projekt
2. Fügen Sie den folgenden Tag zu `head.html hinzu`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Hinweis: Bei selbst gehosteten Projekten fügen Sie stattdessen den folgenden `` Tag zu Ihrer Seite hinzu:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optional können Sie die Parameter Ihrer `Hand-Coaching-Overlay` Komponente wie unten beschrieben anpassen. Für Non-AFrame-Projekte lesen Sie bitte die
<!-- TODO (tri) API link doesn't exist, remove/replace it -->
 [HandCoachingOverlay.configure()](#handcoachingoverlayconfigure) Dokumentation.

### Parameter der A-Frame-Komponente (alle optional) {#hand-coaching-overlay-parameters}

| Parameter      | Typ         | Standard                                  | Beschreibung                                                                                                                                                            |
| -------------- | ----------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor | `String`    | `'weiß'`                                  | Farbe der Coaching Overlay-Animation. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                            |
| promptColor    | `String`    | `'weiß'`                                  | Farbe des gesamten Coaching Overlay-Textes. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                      |
| promptText     | `String`    | `'Richten Sie Ihr Telefon auf Ihre Hand'` | Legt den Textstring für den Erklärungstext der Animation fest, der den Benutzer über die Bewegung informiert, die er ausführen muss.                                    |
| disablePrompt  | `Boolesche` | `false`                                   | Setzen Sie diesen Wert auf Wahr, um das Standard-Coaching-Overlay auszublenden, um Coaching-Overlay-Ereignisse für ein benutzerdefiniertes Overlay verwenden zu können. |


### Erstellen eines benutzerdefinierten Coaching-Overlays für Ihr Projekt {#custom-hand-coaching-overlay}

Das Hand-Coaching-Overlay kann als Pipeline-Modul hinzugefügt und dann ausgeblendet werden (mit dem Parameter `disablePrompt` ), so dass Sie die Coaching-Overlay-Ereignisse problemlos zum Auslösen eines benutzerdefinierten Overlays verwenden können.

* `hand-coaching-overlay.show`: Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay angezeigt werden soll.
* `hand-coaching-overlay.hide`: Dieses Ereignis wird ausgelöst, wenn das Coaching-Overlay ausgeblendet werden soll.


#### Beispiel - Hand Coaching Overlay mit benutzerdefinierten Parametern {#example---hand-coaching-overlay-with-user-specified-parameters}

![hand-coachingoverlay-example](/images/hand-coaching-overlay-example.jpeg)

#### A-Frame Beispiel (Bildschirmfoto oben) {#a-frame-example-screenshot-above}

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
    XRExtras.RuntimeError.pipelineModule(), // Zeigt ein Fehlerbild bei Laufzeitfehlern.

    // Aktiviert die Handverfolgung.
    XR8.HandController.pipelineModule(),
    HandCoachingOverlay.pipelineModule(),

    ...
    myHandSampleScenePipelineModule(),
  ])

```

#### AFrame Beispiel - Abhören von Hand Coaching Overlay Ereignissen {#aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('hand-coaching-overlay.show', () => {
  // Tu etwas
 })

this.el.sceneEl.addEventListener('hand-coaching-overlay.hide', () => {
  // Tu etwas
})
```

#### Non-AFrame Beispiel - Abhören von Hand-Coaching-Overlay-Ereignissen {#non-aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('BEISPIEL: HAND COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('BEISPIEL: HAND COACHING OVERLAY - HIDE')
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
