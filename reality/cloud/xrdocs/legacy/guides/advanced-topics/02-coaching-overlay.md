---
id: coaching-overlays
---

# Coaching Overlay

Coaching Overlays allow you onboard users and ensure the best experience.

## Absolute Scale Coaching Overlay {#absolute-scale-coaching-overlay}

The Absolute Scale Coaching Overlay onboards users to absolute scale experiences ensuring that they collect the
best possible data to determine scale. We designed the Coaching Overlay to make it easily
customizable by developers, enabling you to focus your time on building your WebAR experience.

### Use Absolute Scale Coaching Overlay in Your Project: {#use-absolute-scale-coaching-overlay-in-your-project}

1. Open your Project
2. Add the following tag to `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Note: For Self-Hosted projects, you would add the following `<script>` tag to your page instead:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optionally, customize the parameters of your `coaching-overlay` component as defined below. For
Non-AFrame projects, please refer to the
[CoachingOverlay.configure()](/legacy/api/coachingoverlay/configure) documentation.

### A-Frame component parameters (all optional) {#absolute-scale-coaching-overlay-parameters}

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
animationColor | `String` | `'white'` | Color of the Coaching Overlay animation. This parameter accepts valid CSS color arguments.
promptColor | `String` | `'white'` | Color of all the Coaching Overlay text. This parameter accepts valid CSS color arguments.
promptText | `String` | `'Move device forward and back'` | Sets the text string for the animation explainer text that informs users of the motion they need to make to generate scale.
disablePrompt | `Boolean` | `false` | Set to true to hide default Coaching Overlay in order to use Coaching Overlay events for a custom overlay.

### Creating a custom Coaching Overlay for your project {#custom-absolute-scale-coaching-overlay}

Coaching Overlay can be added as a pipeline module and then hidden (using the `disablePrompt`
parameter) so that you can easily use the Coaching Overlay events to trigger a custom overlay.

Coaching Overlay events are only fired when `scale` is set to `absolute`. Events are emitted by the
8th Wall camera run loop and can be listened to from within a pipeline module.  These events
include:

* `coaching-overlay.show`: event is triggered when the Coaching Overlay should be shown.
* `coaching-overlay.hide`: event is triggered when the Coaching Overlay should be hidden.

#### Example - Coaching Overlay with user specified parameters {#example---coaching-overlay-with-user-specified-parameters}

![coachingoverlay-example](/images/coachingoverlay-example.jpg)

#### A-Frame Example (screenshot above) {#a-frame-example-screenshot-above}

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

#### Non-AFrame Example  (screenshot above) {#non-aframe-example--screenshot-above}

```jsx
// Configured here
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
  // Added here
  CoachingOverlay.pipelineModule(),
  ...
])
```

#### AFrame Example - Listening for Coaching Overlay events {#aframe-example---listening-for-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('coaching-overlay.show', () => {
  // Do something
 })

this.el.sceneEl.addEventListener('coaching-overlay.hide', () => {
  // Do something
})
```

#### Non-AFrame Example - Listening for Coaching Overlay events {#non-aframe-example---listening-for-coaching-overlay-events}

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

The VPS Coaching Overlay onboards users to VPS experiences ensuring that they properly
localize at real-world locations. We designed the Coaching Overlay to make it easily customizable by
developers, enabling you to focus your time on building your WebAR experience.

### Use VPS Coaching Overlay in Your Project: {#use-vps-coaching-overlay-in-your-project}

1. Open your Project
2. Add the following tag to `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Note: For Self-Hosted projects, you would add the following `<script>` tag to your page instead:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optionally, customize the parameters of your `coaching-overlay` component as defined below.  For
Non-AFrame projects, please refer to the
 [VpsCoachingOverlay.configure()](/legacy/api/vpscoachingoverlay/vps-coachingoverlay-configure) documentation.

### A-Frame component parameters (all optional) {#vps-coaching-overlay-parameters}

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
wayspot-name | `String` | | The name of the Location which the Coaching Overlay is guiding the user to localize at. If no Location name is specified, it will use the nearest Project Location. If the project does not have any Project Locations, then it will use the nearest Location.
hint-image | `String` | | Image displayed to the user to guide them to the real-world location. If no hint-image is specified, it will use the default image for the Location. If the Location does not have a default image, no image will be shown. Accepted media sources include img id or static URL.
animation-color | `String` | `'#ffffff'` | Color of the Coaching Overlay animation. This parameter accepts valid CSS color arguments.
animation-duration | `Number` | `5000` | Total time the hint image is displayed before shrinking (in milliseconds).
prompt-color | `String` | `'#ffffff'` | Color of all the Coaching Overlay text. This parameter accepts valid CSS color arguments.
prompt-prefix | `String` | `'Point your camera at'` | Sets the text string for advised user action above the name of the Location.
prompt-suffix | `String` | `'and move around'` | Sets the text string for advised user action below the name of the Location.
status-text | `String` | `'Scanning...'` | Sets the text string that is displayed below the hint-image when it is in the shrunken state.
disable-prompt | `Boolean` | `false` | Set to true to hide default Coaching Overlay in order to use Coaching Overlay events for a custom overlay.

### Creating a custom Coaching Overlay for your project {#custom-vps-coaching-overlay}

Coaching Overlay can be added as a pipeline module and then hidden (using the `disablePrompt`
parameter) so that you can easily use the Coaching Overlay events to trigger a custom overlay.

VPS Coaching Overlay events are only fired when `enableVps` is set to `true`. Events are
emitted by the 8th Wall camera run loop and can be listened to from within a pipeline module.  These
events include:

* `vps-coaching-overlay.show`: event is triggered when the Coaching Overlay should be shown.
* `vps-coaching-overlay.hide`: event is triggered when the Coaching Overlay should be hidden.

#### Example - Coaching Overlay with user specified parameters {#example---coaching-overlay-with-user-specified-parameters}

![vps-coachingoverlay-example](/images/vps-coaching-overlay-example.jpg)

#### A-Frame Example (screenshot above) {#a-frame-example-screenshot-above}

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

#### Non-AFrame Example  (screenshot above) {#non-aframe-example--screenshot-above}

```javascript
// Configured here
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
  // Added here
  VpsCoachingOverlay.pipelineModule(),
  ...
])

```

#### AFrame Example - Listening for VPS Coaching Overlay events {#aframe-example---listening-for-vps-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('vps-coaching-overlay.show', () => {
  // Do something
 })

this.el.sceneEl.addEventListener('vps-coaching-overlay.hide', () => {
  // Do something
})
```

#### Non-AFrame Example - Listening for VPS Coaching Overlay events {#non-aframe-example---listening-for-vps-coaching-overlay-events}

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

## Sky Effects Coaching Overlay {#sky-effects-coaching-overlay}

The Sky Effects Coaching Overlay onboards users to Sky Effects experiences ensuring that they are pointing their
device at the sky. We designed the Coaching Overlay to make it easily customizable by developers,
enabling you to focus your time on building your WebAR experience.

**Note: Sky Effects are not currently previewable in the
[Simulator](/legacy/getting-started/quick-start-guide/#simulator).**

### Use Sky Effects Coaching Overlay in Your Project {#use-sky-effects-coaching-overlay-in-your-project}

1. Open your Project
2. Add the following tag to `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Note: For Self-Hosted projects, you would add the following `<script>` tag to your page instead:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optionally, customize the parameters of your `sky-coaching-overlay` component as defined below.
For Non-AFrame projects, please refer to the SkyCoachingOverlay.configure() documentation.

### A-Frame component parameters (all optional) {#sky-coaching-overlay-parameters}

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
animationColor | `String` | `'white'` | Color of the Coaching Overlay animation. This parameter accepts valid CSS color arguments.
promptColor | `String` | `'white'` | Color of all the Coaching Overlay text. This parameter accepts valid CSS color arguments.
promptText | `String` | `'Point your phone towards the sky'` | Sets the text string for the animation explainer text that informs users of the motion they need to make.
disablePrompt | `Boolean` | `false` | Set to true to hide default Coaching Overlay in order to use Coaching Overlay events for a custom overlay.
autoByThreshold | `Boolean` | `true` | Automatically show/hide the overlay based percentage of sky pixel is above/below `hideThreshold` / `showThreshold`
showThreshold | `Number` | 0.1 | Show a currently hidden overlay if percentage of sky pixel is below this threshold.
hideThreshold | `Number` | 0.05 | Hide a currently shown overlay if percentage of sky pixel is above this threshold.

### Creating a custom Coaching Overlay for your project {#custom-sky-coaching-overlay}

Sky Coaching Overlay can be added as a pipeline module and then hidden (using the `disablePrompt` parameter) so that you can easily use the Coaching Overlay events to trigger a custom overlay.

* `sky-coaching-overlay.show`: event is triggered when the Coaching Overlay should be shown.
* `sky-coaching-overlay.hide`: event is triggered when the Coaching Overlay should be hidden.


**SkyCoachingOverlay.control**

By default, Sky Effects Coaching Overlay automatically shows and hides the coaching overlay depending on whether the user is looking at the sky or not. You can take control of this behavior by using `SkyCoachingOverlay.control`.

```javascript
// Show the coaching overlay
SkyCoachingOverlay.control.show()
// Hide the coaching overlay
SkyCoachingOverlay.control.hide()
// Make it so the sky coaching overlay automatically shows / hides itself.
SkyCoachingOverlay.control.setAutoShowHide(true)
// Make it so the sky coaching overlay does not automatically show / hide itself.
SkyCoachingOverlay.control.setAutoShowHide(false)
// Hides the coaching overlay and cleans it up
SkyCoachingOverlay.control.cleanup()
```

For example, part of your experience might no longer require the user to look at the sky. If you don’t call `setAutoShowHide(false)`, the coaching overlay will appear on top of your UI. In this case, call `setAutoShowHide(false)`, then manually control show and hide using `show()` and `hide()`. Or when you are ready to ask the user to look at the sky again, `setAutoShowHide(true)`.


#### Example - Sky Coaching Overlay with user specified parameters {#example---sky-coaching-overlay-with-user-specified-parameters}

![sky-coachingoverlay-example](/images/sky-coachingoverlay-example.jpg)

#### A-Frame Example (screenshot above) {#a-frame-example-screenshot-above}

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

#### Non-AFrame Example  (screenshot above) {#non-aframe-example--screenshot-above}

```javascript
// Configured here
SkyCoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Look at the sky!!',
})
XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene as well as a Sky scene.
    window.LandingPage.pipelineModule(),         // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.

    // Enables Sky Segmentation.
    XR8.LayersController.pipelineModule(),
    SkyCoachingOverlay.pipelineModule(),

    ...
    mySkySampleScenePipelineModule(),
  ])

  XR8.LayersController.configure({layers: {sky: {invertLayerMask: false}}})
  XR8.Threejs.configure({layerScenes: ['sky']})

```

#### AFrame Example - Listening for Sky Coaching Overlay events {#aframe-example---listening-for-sky-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('sky-coaching-overlay.show', () => {
  // Do something
 })

this.el.sceneEl.addEventListener('sky-coaching-overlay.hide', () => {
  // Do something
})
```

#### Non-AFrame Example - Listening for Sky Coaching Overlay events {#non-aframe-example---listening-for-sky-coaching-overlay-events}

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

The Hand Tracking Coaching Overlay onboards users to Hand Tracking experiences ensuring that they are pointing their
phone at a hand. We designed the Coaching Overlay to make it easily customizable by developers,
enabling you to focus your time on building your WebAR experience.

### Use Hand Tracking Coaching Overlay in Your Project {#use-hand-tracking-coaching-overlay-in-your-project}

1. Open your Project
2. Add the following tag to `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Note: For Self-Hosted projects, you would add the following `<script>` tag to your page instead:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Optionally, customize the parameters of your `hand-coaching-overlay` component as defined below.
For Non-AFrame projects, please refer to the HandCoachingOverlay.configure() documentation.

### A-Frame component parameters (all optional) {#hand-coaching-overlay-parameters}

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
animationColor | `String` | `'white'` | Color of the Coaching Overlay animation. This parameter accepts valid CSS color arguments.
promptColor | `String` | `'white'` | Color of all the Coaching Overlay text. This parameter accepts valid CSS color arguments.
promptText | `String` | `'Point your phone towards your hand'` | Sets the text string for the animation explainer text that informs users of the motion they need to make.
disablePrompt | `Boolean` | `false` | Set to true to hide default Coaching Overlay in order to use Coaching Overlay events for a custom overlay.


### Creating a custom Coaching Overlay for your project {#custom-hand-coaching-overlay}

Hand Coaching Overlay can be added as a pipeline module and then hidden (using the `disablePrompt` parameter) so that you can easily use the Coaching Overlay events to trigger a custom overlay.

* `hand-coaching-overlay.show`: event is triggered when the Coaching Overlay should be shown.
* `hand-coaching-overlay.hide`: event is triggered when the Coaching Overlay should be hidden.


#### Example - Hand Coaching Overlay with user specified parameters {#example---hand-coaching-overlay-with-user-specified-parameters}

![hand-coachingoverlay-example](/images/hand-coaching-overlay-example.jpeg)

#### A-Frame Example (screenshot above) {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrhand="allowedDevices:any; cameraDirection:back;"
  hand-coaching-overlay="
    animationColor: #E86FFF;
    promptText: Point the phone at your left hand!;"
  ...
  renderer="colorManagement: true"
>
```

#### Non-AFrame Example  (screenshot above) {#non-aframe-example--screenshot-above}

```javascript
// Configured here
HandCoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Point the phone at your left hand!',
})
XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene as well as a Sky scene.
    window.LandingPage.pipelineModule(),         // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.

    // Enables Hand Tracking.
    XR8.HandController.pipelineModule(),
    HandCoachingOverlay.pipelineModule(),

    ...
    myHandSampleScenePipelineModule(),
  ])

```

#### AFrame Example - Listening for Hand Coaching Overlay events {#aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('hand-coaching-overlay.show', () => {
  // Do something
 })

this.el.sceneEl.addEventListener('hand-coaching-overlay.hide', () => {
  // Do something
})
```

#### Non-AFrame Example - Listening for Hand Coaching Overlay events {#non-aframe-example---listening-for-hand-coaching-overlay-events}

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
