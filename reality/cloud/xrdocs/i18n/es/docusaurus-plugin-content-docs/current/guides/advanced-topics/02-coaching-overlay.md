---
id: coaching-overlays
---

# Coaching Overlay

Coaching Overlay le permite incorporar usuarios y garantizar la mejor experiencia.

## Escala absoluta de Coaching Overlay {#absolute-scale-coaching-overlay}

La superposición de entrenamiento de escala absoluta introduce a los usuarios en las experiencias de escala absoluta, lo que garantiza que recopilen los mejores datos posibles para determinar la escala. Hemos diseñado Coaching Overlay para que sea fácilmente personalizable por los desarrolladores, permitiéndole centrar su tiempo en construir su experiencia WebAR.

### Utilice la superposición de entrenamiento de escala absoluta en su proyecto: {#use-absolute-scale-coaching-overlay-in-your-project}

1. Abra su proyecto
2. Añada la siguiente etiqueta a `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Nota: para los proyectos autohospedado, debería añadir la siguiente etiqueta `<script>` a su página en su lugar:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. De manera opcional, personalice los parámetros de su componente `coaching-overlay` como se define a continuación. Para los proyectos que no sean AFrame, consulte la documentación de [CoachingOverlay.configure()](/api/coachingoverlay/configure).

### Parámetros del componente A-Frame (todos opcionales) {#absolute-scale-coaching-overlay-parameters}

| Parámetro      | Tipo      | Por defecto                                          | Descripción                                                                                                                                               |
| -------------- | --------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor | `Cadena`  | `'blanco'`                                           | Color de la animación de Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                         |
| promptColor    | `Cadena`  | `'blanco'`                                           | Color de todo el texto de Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                        |
| promptText     | `Cadena`  | `'Mover el dispositivo hacia delante y hacia atrás'` | Establece la cadena de texto para el texto explicativo de la animación que informa a los usuarios del movimiento que deben realizar para generar escala.  |
| disablePrompt  | `Boolean` | `false`                                              | Establézcalo como verdadero (true) para ocultar el Coaching Overlay por defecto y poder utilizar los eventos de Coaching Overlay de manera personalizada. |

### Crear un Coaching Overlay personalizado para su proyecto {#custom-absolute-scale-coaching-overlay}

Coaching Overlay puede añadirse como módulo de canalización y luego ocultarse (utilizando el parámetro `disablePrompt` ) para que pueda utilizar fácilmente los eventos de Coaching Overlay para activar una superposición personalizada.

Los eventos de Coaching Overlay solo se lanzan cuando la `escala` se establece en `absoluta`. Los eventos son emitidos por el bucle de ejecución de la cámara de 8th Wall y pueden escucharse desde un módulo de canalización.  Estos eventos incluyen:

* `coaching-overlay.show`: el evento se activa cuando debe mostrarse la el Coaching Overlay.
* `coaching-overlay.hide`: el evento se activa cuando debe ocultarse el Coaching Overlay.

#### Ejemplo - Coaching Overlay con parámetros especificados por el usuario {#example---coaching-overlay-with-user-specified-parameters}

![coachingoverlay-example](/images/coachingoverlay-example.jpg)

#### Ejemplo de Aframe (captura de pantalla anterior) {#a-frame-example-screenshot-above}

```jsx
<a-scene
  coaching-overlay="
    animationColor: #E86FFF;
    promptText: Para generar escala mueve el teléfono hacia delante y luego hacia atrás;"
  xrextras-loading
  xrextras-gesture-detector
...
  xrweb="scale: absolute;">
```

#### Ejemplo sin AFrame (captura de pantalla anterior) {#non-aframe-example--screenshot-above}

```jsx
// Configured here
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Para generar escala mueve el teléfono hacia delante y luego hacia atrás',
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

#### Ejemplo de AFrame - Escucha de eventos de Coaching Overlay {#aframe-example---listening-for-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('coaching-overlay.show', () => {
  // Do something
 })

this.el.sceneEl.addEventListener('coaching-overlay.hide', () => {
  // Do something
})
```

#### Ejemplo sin AFrame - Escucha de eventos de Coaching Overlay {#non-aframe-example---listening-for-coaching-overlay-events}

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


## Coaching Overlay VPS {#vps-coaching-overlay}

La superposición de entrenamiento de VPS introduce a los usuarios en las experiencias de VPS, lo que garantiza que se localicen correctamente en ubicaciones del mundo real. Hemos diseñado Coaching Overlay para que sea fácilmente personalizable por los desarrolladores, permitiéndole centrar su tiempo en construir su experiencia WebAR.

### Utilice la superposición de entrenamiento de VPS en su proyecto: {#use-vps-coaching-overlay-in-your-project}

1. Abra su proyecto
2. Añada la siguiente etiqueta a `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Nota: para los proyectos autohospedado, debería añadir la siguiente etiqueta `<script>` a su página en su lugar:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. De manera opcional, personalice los parámetros de su componente `coaching-overlay` como se define a continuación. Para proyectos que no sean AFrame, consulte la documentación de [VpsCoachingOverlay.configure()](/api/vpscoachingoverlay/vps-coachingoverlay-configure).

### Parámetros del componente A-Frame (todos opcionales) {#vps-coaching-overlay-parameters}

| Parámetro                | Tipo       | Por defecto              | Descripción                                                                                                                                                                                                                                                                                                                |
| ------------------------ | ---------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| wayspot-name             | `Cadena`   |                          | El nombre de la ubicación en la que la Superposición de Coaching está guiando al usuario para que se localice. Si no se especifica ningún nombre de Ubicación, utilizará la Ubicación de Proyecto más cercana. Si el proyecto no tiene ninguna Ubicación de Proyecto, entonces utilizará la Ubicación más cercana.         |
| hint-image               | `Cadena`   |                          | Imagen mostrada al usuario para guiarle hasta la ubicación en el mundo real. Si no se especifica hint-image, se utilizará la imagen por defecto para la Ubicación. Si la Ubicación no tiene una imagen por defecto, no se mostrará ninguna imagen. Las fuentes multimedia aceptadas incluyen el id img o la URL estáticas. |
| animation-color          | `Cadena`   | `'#ffffff'`              | Color de la animación superposición de coaching. Este parámetro acepta argumentos de color CSS válidos.                                                                                                                                                                                                                    |
| duración de la animación | `Número`   | `5000`                   | Tiempo total que se muestra la imagen de sugerencia antes de encogerse (en milisegundos).                                                                                                                                                                                                                                  |
| prompt-color             | `Cadena`   | `'#ffffff'`              | Color de todo el texto de coaching superpuesto. Este parámetro acepta argumentos de color CSS válidos.                                                                                                                                                                                                                     |
| prompt-prefix            | `Cadena`   | `'Point your camera at'` | Establece la cadena de texto para la acción de usuario asesorado por encima del nombre de la Ubicación.                                                                                                                                                                                                                    |
| prompt-suffix            | `Cadena`   | `'and move around'`      | Establece la cadena de texto para la acción de usuario aconsejada debajo del nombre de la Ubicación.                                                                                                                                                                                                                       |
| status-text              | `Cadena`   | `'Scanning...'`          | Establece la cadena de texto que se muestra debajo de la imagen de sugerencia cuando está en estado reducido.                                                                                                                                                                                                              |
| disable-prompt           | `Booleano` | `false`                  | Establézcalo como verdadero (true) para ocultar el Coaching Overlay por defecto y poder utilizar los eventos de Coaching Overlay de manera personalizada.                                                                                                                                                                  |

### Crear un Coaching Overlay personalizado para su proyecto {#custom-vps-coaching-overlay}

Coaching Overlay puede añadirse como módulo de canalización y luego ocultarse (utilizando el parámetro `disablePrompt` ) para que pueda utilizar fácilmente los eventos de Coaching Overlay para activar una superposición personalizada.

Los eventos de Coaching Overlay VPS solo se lanzan cuando `enableVps` se establece en `true`. Los eventos son emitidos por el bucle de ejecución de la cámara de8th Wall y pueden escucharse desde un módulo de canalización.  Estos eventos incluyen:

* `vps-coaching-overlay.show`: el evento se activa cuando debería mostrarse el Coaching Overlay.
* `coaching-overlay.hide`: el evento se activa cuando debería ocultarse el Coaching Overlay.

#### Ejemplo - Coaching Overlay con parámetros especificados por el usuario {#example---coaching-overlay-with-user-specified-parameters}

![vps-coachingoverlay-example](/images/vps-coaching-overlay-example.jpg)

#### Ejemplo de AFrame (captura de pantalla anterior) {#a-frame-example-screenshot-above}

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

#### Ejemplo sin AFrame (captura de pantalla anterior) {#non-aframe-example--screenshot-above}

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

#### Ejemplo de AFrame - Escucha de eventos de Coaching Overlay VPS {#aframe-example---listening-for-vps-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('vps-coaching-overlay.show', () => {
  // Do something
 })

this.el.sceneEl.addEventListener('vps-coaching-overlay.hide', () => {
  // Do something
})
```

#### Ejemplo sin AFrame - Escucha de eventos de Coaching Overlay VPS {#non-aframe-example---listening-for-vps-coaching-overlay-events}

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

## Coaching Overlay para efectos en el cielo (Sky Effects) {#sky-effects-coaching-overlay}

La superposición de entrenamiento de efectos del cielo introduce a los usuarios en las experiencias de efectos del cielo, lo que garantiza que estén apuntando su dispositivo al cielo. Hemos diseñado Coaching Overlay para que sea fácilmente personalizable por los desarrolladores, permitiéndote centrar su tiempo en construir tu experiencia WebAR.

**Nota: Los efectos del cielo no se pueden previsualizar actualmente en el [simulador](/getting-started/quick-start-guide/#simulator).**

### Utilice Coaching Overlay para efectos en el cielo en su proyecto {#use-sky-effects-coaching-overlay-in-your-project}

1. Abra su proyecto
2. Añada la siguiente etiqueta a `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Nota: para los proyectos autohospedado, debería añadir la siguiente etiqueta `<script>` a su página en su lugar:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. De manera opcional, personalice los parámetros de su componente `sky-coaching-overlay` como se define a continuación. Para los proyectos sin AFrame, consulte la documentación
<!-- TODO (tri) API link doesn't exist, remove/replace it -->
 [SkyCoachingOverlay.configure()](#skycoachingoverlayconfigure).

### Parámetros del componente A-Frame (todos opcionales) {#sky-coaching-overlay-parameters}

| Parámetro       | Tipo       | Por defecto                               | Descripción                                                                                                                                                           |
| --------------- | ---------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor  | `Cadena`   | `'blanco'`                                | Color de la animación de Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                     |
| promptColor     | `Cadena`   | `'blanco'`                                | Color de todo el texto de Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                    |
| promptText      | `Cadena`   | `'Apunta con tu teléfono hacia el cielo'` | Establece la cadena de texto para el texto explicativo de la animación que informa a los usuarios del movimiento que deben realizar.                                  |
| disablePrompt   | `Boolean`  | `false`                                   | Establézcalo como verdadero para ocultar el Coaching Overlay por defecto y poder utilizar los eventos de Coaching Overlay de manera personalizada.                    |
| autoByThreshold | `Booleano` | `true`                                    | Mostrar/ocultar automáticamente la superposición en función del porcentaje de píxeles del cielo que esté por encima o por debajo de `hideThreshold` / `showThreshold` |
| showThreshold   | `Número`   | 0,1                                       | Mostrar una superposición actualmente oculta si el porcentaje de píxel de cielo está por debajo de este umbral.                                                       |
| hideThreshold   | `Número`   | 0,05                                      | Ocultar una superposición mostrada actualmente si el porcentaje de píxel de cielo está por encima de este umbral.                                                     |

### Crear un Coaching Overlay personalizado para su proyecto {#custom-sky-coaching-overlay}

El Coaching Overlay en el cielo puede añadirse como un módulo de canalización y luego ocultarse (utilizando el parámetro `disablePrompt`) para que pueda utilizar fácilmente los eventos del Coaching Overlay para activar una superposición personalizada.

* `sky-coaching-overlay.show`: el evento se activa cuando debería mostrarse el Coaching Overlay.
* `sky-coaching-overlay.show`: el evento se activa cuando debería ocultarse el Coaching Overlay.


**SkyCoachingOverlay.control**

Por defecto, el Coaching Overlay para efectos en el cielo muestra y oculta automáticamente el Coaching Overlay dependiendo de si el usuario está mirando al cielo o no. Puede manejarlo utilizando `SkyCoachingOverlay.control`.

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

Por ejemplo, puede que parte de su experiencia ya no requiera que el usuario mire al cielo. Si no llama a `setAutoShowHide(false)`, el Coaching Overlay aparecerá encima de su interfaz de usuario. En este caso, llame a `setAutoShowHide(false)` y luego controle manualmente mostrar y ocultar mediante `show()` y `hide()`. O cuando esté listo para pedir al usuario que vuelva a mirar al cielo, `setAutoShowHide(true)`.


#### Ejemplo - Coaching Overlay para el cielo con parámetros especificados por el usuario {#example---sky-coaching-overlay-with-user-specified-parameters}

![sky-coachingoverlay-example](/images/sky-coachingoverlay-example.jpg)

#### Ejemplo de AFrame (captura de pantalla anterior) {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrlayers="cameraDirection: back;"
  sky-coaching-overlay="
    animationColor: #E86FFF;
    promptText: ¡Mira hacia el cielo!;"
  ...
  renderer="colorManagement: true"
>
```

#### Ejemplo sin AFrame (captura de pantalla anterior) {#non-aframe-example--screenshot-above}

```javascript
// Configured here
SkyCoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: '¡Mira hacia el cielo!',
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

#### Ejemplo de AFrame - Escucha de eventos de Coaching Overlay en el Cielo {#aframe-example---listening-for-sky-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('sky-coaching-overlay.show', () => {
  // Do something
 })

this.el.sceneEl.addEventListener('sky-coaching-overlay.hide', () => {
  // Do something
})
```

#### Ejemplo sin AFrame - Escucha de eventos de Coaching Overlay en el Cielo {#non-aframe-example---listening-for-sky-coaching-overlay-events}

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

## Coaching Overlay de seguimiento de manos {#hand-tracking-coaching-overlay}

La superposición de entrenamiento de seguimiento de la mano introduce a los usuarios en las experiencias de seguimiento de la mano, lo que garantiza que apunten con su teléfono a una mano. Hemos diseñado Coaching Overlay para que sea fácilmente personalizable por los desarrolladores, permitiéndole centrar su tiempo en construir tu experiencia WebAR.

### Utilice Coaching Overlay de seguimiento manual en su proyecto {#use-hand-tracking-coaching-overlay-in-your-project}

1. Abra su proyecto
2. Añada la siguiente etiqueta a `head.html`

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Nota: para los proyectos autohospedado, debería añadir la siguiente etiqueta `<script>` a su página en su lugar:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. De manera opcional, personalice los parámetros de su component de</code>hand-coaching-overlay` como se define a continuación.
Para los proyectos sin AFrame, consulte la documentación
<!-- TODO (tri) API link doesn't exist, remove/replace it -->
 <a href="#handcoachingoverlayconfigure">HandCoachingOverlay.configure()</a>.</li>
</ol>

<h3 id="hand-coaching-overlay-parameters" spaces-before="0">Parámetros del componente A-Frame (todos opcionales)</h3>

<table spaces-before="0">
<thead>
<tr>
  <th>Parámetro</th>
  <th>Tipo</th>
  <th>Por defecto</th>
  <th>Descripción</th>
</tr>
</thead>
<tbody>
<tr>
  <td>animationColor</td>
  <td><code>Cadena`</td> 
   </tr> 
   </tbody> </table>


### Crear un Coaching Overlay personalizado para su proyecto {#custom-hand-coaching-overlay}

El Coaching Overlay manual puede añadirse como módulo de canalización y luego ocultarse (utilizando el parámetro `disablePrompt`) para que pueda utilizar fácilmente los eventos de Coaching Overlay para activar una superposición personalizada.

* `hand-coaching-overlay.show`: el evento se activa cuando debería mostrarse el Coaching Overlay.
* `hand-coaching-overlay.hide`: el evento se activa cuando debería ocultarse el Coaching Overlay.


#### Ejemplo - Coaching Overlay manual con parámetros especificados por el usuario {#example---hand-coaching-overlay-with-user-specified-parameters}

![hand-coachingoverlay-example](/images/hand-coaching-overlay-example.jpeg)

#### Ejemplo de AFrame (captura de pantalla anterior) {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrhand="allowedDevices:any; cameraDirection:back;"
  hand-coaching-overlay="
    animationColor: #E86FFF;
    promptText: Apunta con el teléfono a tu mano izquierda;"
...
  renderer="colorManagement: true"
>
```

#### Ejemplo sin AFrame (captura de pantalla anterior) {#non-aframe-example--screenshot-above}

```javascript
// Configurado aquí
HandCoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: '¡Apunta con el teléfono a tu mano izquierda!',
})
XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Módulos de canalización existentes.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene as well as a Sky scene.
    window.LandingPage.pipelineModule(),         // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Muestra una imagen de error.

    // Enables Hand Tracking.
    XR8.HandController.pipelineModule(),
    HandCoachingOverlay.pipelineModule(),

    ...
    myHandSampleScenePipelineModule(),
  ])

```

#### Ejemplo de AFrame - Escucha de eventos de Coaching Overlay Manual {#aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('hand-coaching-overlay.show', () => {
  // Do something
 })

this.el.sceneEl.addEventListener('hand-coaching-overlay.hide', () => {
  // Do something
})
```

#### Ejemplo sin Aframe- Escucha de eventos de Coaching Overlay manual {#non-aframe-example---listening-for-hand-coaching-overlay-events}

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
