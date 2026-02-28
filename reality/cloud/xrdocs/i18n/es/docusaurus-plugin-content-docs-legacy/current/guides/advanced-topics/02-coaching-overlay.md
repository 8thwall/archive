---
id: coaching-overlays
---

# Coaching Overlay

Las superposiciones de entrenamiento le permiten incorporar usuarios y garantizar la mejor experiencia.

## Escala absoluta Coaching Overlay {#absolute-scale-coaching-overlay}

La Superposición de Coaching de Escala Absoluta introduce a los usuarios en las experiencias de escala absoluta garantizando que recopilan los
mejores datos posibles para determinar la escala. Hemos diseñado la Coaching Overlay para que los desarrolladores puedan personalizarla fácilmente
, lo que le permitirá centrar su tiempo en crear su experiencia WebAR.

### Utilización de la escala absoluta en el revestimiento de su proyecto: {#use-absolute-scale-coaching-overlay-in-your-project}

1. Abra su proyecto
2. Añada la siguiente etiqueta a `head.html`.

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Nota: Para proyectos autoalojados, añada la siguiente etiqueta `<script>` a su página:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Opcionalmente, personalice los parámetros de su componente `coaching-overlay` como se define a continuación.
   Para proyectos que no sean de marco, consulte la documentación de
   [CoachingOverlay.configure()](/legacy/api/coachingoverlay/configure).

### Parámetros del componente A-Frame (todos opcionales) {#absolute-scale-coaching-overlay-parameters}

| Parámetro      | Tipo     | Por defecto                                          | Descripción                                                                                                                                                                                        |
| -------------- | -------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor | Cadena   | `'blanco'`                                           | Color de la animación Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                     |
| promptColor    | Cadena   | `'blanco'`                                           | Color de todo el texto de Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                 |
| promptText     | Cadena   | `'Mover el dispositivo hacia delante y hacia atrás'` | Establece la cadena de texto para el texto explicativo de la animación que informa a los usuarios del movimiento que deben realizar para generar escala.                           |
| disablePrompt  | Booleano | `false`                                              | Establézcalo como true para ocultar la sobreimpresión de Coaching predeterminada y poder utilizar los eventos de sobreimpresión de Coaching para una sobreimpresión personalizada. |

### Creación de un Coaching Overlay personalizado para su proyecto {#custom-absolute-scale-coaching-overlay}

La superposición de Coaching puede añadirse como módulo de canalización y ocultarse (mediante el parámetro `disablePrompt`
) para que pueda utilizar fácilmente los eventos de superposición de Coaching para activar una superposición personalizada.

Los eventos de Coaching Overlay sólo se disparan cuando `scale` se establece en `absolute`. Los eventos son emitidos por el bucle de ejecución de la cámara
8th Wall y pueden escucharse desde un módulo pipeline.  Estos eventos
incluyen:

- `coaching-overlay.show`: el evento se activa cuando debe mostrarse el Coaching Overlay.
- `coaching-overlay.hide`: el evento se activa cuando la Superposición de Entrenamiento debe ocultarse.

#### Ejemplo - Coaching Overlay con parámetros especificados por el usuario {#example---coaching-overlay-with-user-specified-parameters}

![coachingoverlay-example](/images/coachingoverlay-example.jpg)

#### Ejemplo de marco A (captura de pantalla anterior) {#a-frame-example-screenshot-above}

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

#### Ejemplo sin marco (captura de pantalla anterior) {#non-aframe-example--screenshot-above}

```jsx
// Configurado aquí
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
  // Añadido aquí
  CoachingOverlay.pipelineModule(),
  ...
])
```

#### Ejemplo de AFrame - Escucha de eventos de Coaching Overlay {#aframe-example---listening-for-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('coaching-overlay.show', () => {
  // Haz algo
 })

this.el.sceneEl.addEventListener('coaching-overlay.hide', () => {
  // Haz algo
})
```

#### Ejemplo sin marco - Escucha de eventos de Coaching Overlay {#non-aframe-example---listening-for-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EJEMPLO: COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EJEMPLO: COACHING OVERLAY - HIDE')
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

La Superposición de Entrenamiento VPS embarca a los usuarios en experiencias VPS asegurándose de que localizan correctamente
en ubicaciones del mundo real. Hemos diseñado la Coaching Overlay para que sea fácilmente personalizable por los desarrolladores de
, lo que le permitirá centrar su tiempo en crear su experiencia WebAR.

### Utilice la superposición de Coaching VPS en su proyecto: {#use-vps-coaching-overlay-in-your-project}

1. Abra su proyecto
2. Añada la siguiente etiqueta a `head.html`.

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Nota: Para proyectos autoalojados, añada la siguiente etiqueta `<script>` a su página:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Opcionalmente, personalice los parámetros de su componente `coaching-overlay` como se define a continuación.  Para proyectos
   Non-AFrame, consulte la documentación
   [VpsCoachingOverlay.configure()](/legacy/api/vpscoachingoverlay/vps-coachingoverlay-configure).

### Parámetros del componente A-Frame (todos opcionales) {#vps-coaching-overlay-parameters}

| Parámetro                | Tipo     | Por defecto                                                    | Descripción                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------ | -------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| wayspot-nombre           | Cadena   |                                                                | El nombre de la ubicación en la que la Superposición de Coaching está guiando al usuario para que se localice. Si no se especifica ningún nombre de Ubicación, utilizará la Ubicación de Proyecto más cercana. Si el proyecto no tiene ninguna Ubicación de Proyecto, entonces utilizará la Ubicación más cercana.                 |
| imagen indirecta         | Cadena   |                                                                | Imagen mostrada al usuario para guiarle hasta la ubicación en el mundo real. Si no se especifica hint-image, se utilizará la imagen por defecto para la Ubicación. Si la Ubicación no tiene una imagen por defecto, no se mostrará ninguna imagen. Las fuentes de medios aceptadas incluyen img id o URL estática. |
| animación-color          | Cadena   | `'#ffffff'`                                                    | Color de la animación Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                                                                                                                                                                                                     |
| duración de la animación | `Número` | `5000`                                                         | Tiempo total que se muestra la imagen de sugerencia antes de reducirse (en milisegundos).                                                                                                                                                                                                                                                       |
| prompt-color             | Cadena   | `'#ffffff'`                                                    | Color de todo el texto de Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                                                                                                                                                                                                 |
| prompt-prefix            | Cadena   | "Apunta tu cámara hacia                                        | Establece la cadena de texto para la acción de usuario asesorado por encima del nombre de la Ubicación.                                                                                                                                                                                                                                                            |
| prompt-suffix            | Cadena   | `'y moverse'`                                                  | Establece la cadena de texto para la acción de usuario aconsejada debajo del nombre de la Ubicación.                                                                                                                                                                                                                                                               |
| texto-estado             | Cadena   | "Escaneando... | Establece la cadena de texto que se muestra debajo de la imagen de sugerencia cuando está en estado reducido.                                                                                                                                                                                                                                                      |
| disable-prompt           | Booleano | `false`                                                        | Establézcalo como true para ocultar la sobreimpresión de Coaching predeterminada y poder utilizar los eventos de sobreimpresión de Coaching para una sobreimpresión personalizada.                                                                                                                                                                                 |

### Creación de un Coaching Overlay personalizado para su proyecto {#custom-vps-coaching-overlay}

La superposición de Coaching puede añadirse como módulo de canalización y ocultarse (mediante el parámetro `disablePrompt`
) para que pueda utilizar fácilmente los eventos de superposición de Coaching para activar una superposición personalizada.

Los eventos VPS Coaching Overlay sólo se disparan cuando `enableVps` se establece en `true`. Los eventos son
emitidos por el bucle de ejecución de la cámara 8th Wall y pueden escucharse desde un módulo pipeline.  Estos eventos de
incluyen:

- `vps-coaching-overlay.show`: el evento se activa cuando debe mostrarse el Coaching Overlay.
- `vps-coaching-overlay.hide`: el evento se activa cuando la Sobreimpresión de Coaching debe ocultarse.

#### Ejemplo - Coaching Overlay con parámetros especificados por el usuario {#example---coaching-overlay-with-user-specified-parameters}

![vps-coachingoverlay-example](/images/vps-coaching-overlay-example.jpg)

#### Ejemplo de marco A (captura de pantalla anterior) {#a-frame-example-screenshot-above}

```html
<a-scene
  vps-coaching-overlay="
    prompt-color: #0000FF;
    prompt-prefix: Ir a buscar;"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb="vpsEnabled: true;">
```

#### Ejemplo sin marco (captura de pantalla anterior) {#non-aframe-example--screenshot-above}

```javascript
// Configurado aquí
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
  // Añadido aquí
  VpsCoachingOverlay.pipelineModule(),
  ...
])

```

#### Ejemplo de AFrame - Escucha de eventos de VPS Coaching Overlay {#aframe-example---listening-for-vps-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('vps-coaching-overlay.show', () => {
  // Haz algo
 })

this.el.sceneEl.addEventListener('vps-coaching-overlay.hide', () => {
  // Haz algo
})
```

#### Ejemplo No-AFrame - Escuchando eventos de VPS Coaching Overlay {#non-aframe-example---listening-for-vps-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EJEMPLO: VPS COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EJEMPLO: VPS COACHING OVERLAY - HIDE')
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

## Efectos del cielo Coaching Overlay {#sky-effects-coaching-overlay}

La superposición de entrenamiento de Sky Effects introduce a los usuarios en las experiencias de Sky Effects asegurándose de que están apuntando su dispositivo
al cielo. Hemos diseñado el Coaching Overlay para que sea fácilmente personalizable por los desarrolladores,
permitiéndole centrar su tiempo en construir su experiencia WebAR.

**Nota: Los efectos del cielo no se pueden previsualizar actualmente en el
[Simulator](/legacy/getting-started/quick-start-guide/#simulator).**

### Utilice la superposición de Coaching de efectos de cielo en su proyecto {#use-sky-effects-coaching-overlay-in-your-project}

1. Abra su proyecto
2. Añada la siguiente etiqueta a `head.html`.

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Nota: Para proyectos autoalojados, añada la siguiente etiqueta `<script>` a su página:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Opcionalmente, personalice los parámetros de su componente `sky-coaching-overlay` como se define a continuación.
   Para proyectos sin marco, consulte la documentación de SkyCoachingOverlay.configure().

### Parámetros del componente A-Frame (todos opcionales) {#sky-coaching-overlay-parameters}

| Parámetro       | Tipo     | Por defecto                           | Descripción                                                                                                                                                                                        |
| --------------- | -------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor  | Cadena   | `'blanco'`                            | Color de la animación Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                     |
| promptColor     | Cadena   | `'blanco'`                            | Color de todo el texto de Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                 |
| promptText      | Cadena   | `'Apunta tu teléfono hacia el cielo'` | Establece la cadena de texto para el texto explicativo de la animación que informa a los usuarios del movimiento que deben realizar.                                               |
| disablePrompt   | Booleano | `false`                               | Establézcalo como true para ocultar la sobreimpresión de Coaching predeterminada y poder utilizar los eventos de sobreimpresión de Coaching para una sobreimpresión personalizada. |
| autoByThreshold | Booleano | `true`                                | Mostrar / ocultar automáticamente la superposición basada en el porcentaje de píxeles del cielo está por encima / debajo de `hideThreshold` / `showThreshold`.                     |
| showThreshold   | `Número` | 0.1                   | Mostrar una superposición actualmente oculta si el porcentaje de píxeles del cielo está por debajo de este umbral.                                                                 |
| hideThreshold   | `Número` | 0.05                  | Oculta una superposición mostrada actualmente si el porcentaje de píxeles del cielo está por encima de este umbral.                                                                |

### Creación de un Coaching Overlay personalizado para su proyecto {#custom-sky-coaching-overlay}

La superposición de entrenamiento de Sky puede añadirse como módulo de canalización y ocultarse (mediante el parámetro `disablePrompt`) para que pueda utilizar fácilmente los eventos de superposición de entrenamiento para activar una superposición personalizada.

- `sky-coaching-overlay.show`: el evento se activa cuando debe mostrarse el Coaching Overlay.
- `sky-coaching-overlay.hide`: el evento se activa cuando la Sobreimpresión de Entrenamiento debe ocultarse.

_SkyCoachingOverlay.control_

Por defecto, la superposición de entrenamiento Efectos del cielo muestra y oculta automáticamente la superposición de entrenamiento en función de si el usuario está mirando al cielo o no. Puede controlar este comportamiento utilizando `SkyCoachingOverlay.control`.

```javascript
// Mostrar la ventana superpuesta de coaching
SkyCoachingOverlay.control.show()
// Ocultar la ventana superpuesta de coaching
SkyCoachingOverlay.control.hide()
// Hacer que la ventana superpuesta de coaching del cielo se muestre/oculte automáticamente.
SkyCoachingOverlay.control.setAutoShowHide(true)
// Para que la sobreimpresión de entrenamiento en el cielo no se muestre/oculte automáticamente.
SkyCoachingOverlay.control.setAutoShowHide(false)
// Oculta la superposición de coaching y la limpia
SkyCoachingOverlay.control.cleanup()
```

Por ejemplo, puede que parte de su experiencia ya no requiera que el usuario mire al cielo. Si no llama a `setAutoShowHide(false)`, la superposición de coaching aparecerá en la parte superior de su interfaz de usuario. En este caso, llame a `setAutoShowHide(false)`, luego controle manualmente mostrar y ocultar usando `show()` y `hide()`. O cuando esté listo para pedir al usuario que vuelva a mirar al cielo, `setAutoShowHide(true)`.

#### Ejemplo - Superposición de Coaching del cielo con parámetros especificados por el usuario {#example---sky-coaching-overlay-with-user-specified-parameters}

![sky-coachingoverlay-example](/images/sky-coachingoverlay-example.jpg)

#### Ejemplo de marco A (captura de pantalla anterior) {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrlayers="cameraDirection: back;"
  sky-coaching-overlay="
    animationColor: #E86FFF;
    promptText: ¡Mira el cielo!;"
  ...
  renderer="colorManagement: true"
>
```

#### Ejemplo sin marco (captura de pantalla anterior) {#non-aframe-example--screenshot-above}

```javascript
// Configurado aquí
SkyCoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Look at the sky!!',
})
XR8.addCameraPipelineModules([ // Añadir módulos de canalización de cámara.
    // Módulos existentes.
    XR8.GlTextureRenderer.pipelineModule(), // Dibuja el feed de la cámara.
    XR8.Threejs.pipelineModule(), // Crea una escena ThreeJS AR así como una escena Sky.
    window.LandingPage.pipelineModule(), // Detecta navegadores no soportados y da pistas.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifica el lienzo para llenar la ventana.
    XRExtras.Loading.pipelineModule(), // Gestiona la pantalla de carga al inicio.
    XRExtras.RuntimeError.pipelineModule(), // Muestra una imagen de error en tiempo de ejecución.

    // Habilita la segmentación del cielo.
    XR8.LayersController.pipelineModule(),
    SkyCoachingOverlay.pipelineModule(),

    ...
    mySkySampleScenePipelineModule(),
  ])

  XR8.LayersController.configure({layers: {sky: {invertLayerMask: false}}})
  XR8.Threejs.configure({layerScenes: ['sky']})

```

#### Ejemplo de AFrame - Escucha de eventos de Sky Coaching Overlay {#aframe-example---listening-for-sky-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('sky-coaching-overlay.show', () => {
  // Haz algo
 })

this.el.sceneEl.addEventListener('sky-coaching-overlay.hide', () => {
  // Haz algo
})
```

#### Ejemplo sin marco - Escucha de los eventos de Sky Coaching Overlay {#non-aframe-example---listening-for-sky-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EJEMPLO: SKY COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EJEMPLO: SKY COACHING OVERLAY - HIDE')
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

## Seguimiento de la mano Coaching Overlay {#hand-tracking-coaching-overlay}

La sobreimpresión de seguimiento de la mano introduce a los usuarios en las experiencias de seguimiento de la mano asegurándose de que están apuntando con su teléfono
a una mano. Hemos diseñado el Coaching Overlay para que sea fácilmente personalizable por los desarrolladores,
permitiéndole centrar su tiempo en construir su experiencia WebAR.

### Utilice la superposición de seguimiento manual en su proyecto {#use-hand-tracking-coaching-overlay-in-your-project}

1. Abra su proyecto
2. Añada la siguiente etiqueta a `head.html`.

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

Nota: Para proyectos autoalojados, añada la siguiente etiqueta `<script>` a su página:

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. Opcionalmente, personalice los parámetros de su componente `hand-coaching-overlay` como se define a continuación.
   Para proyectos sin marco, consulte la documentación de HandCoachingOverlay.configure().

### Parámetros del componente A-Frame (todos opcionales) {#hand-coaching-overlay-parameters}

| Parámetro      | Tipo     | Por defecto                          | Descripción                                                                                                                                                                                        |
| -------------- | -------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor | Cadena   | `'blanco'`                           | Color de la animación Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                     |
| promptColor    | Cadena   | `'blanco'`                           | Color de todo el texto de Coaching Overlay. Este parámetro acepta argumentos de color CSS válidos.                                                                 |
| promptText     | Cadena   | `'Apunta tu teléfono hacia tu mano'` | Establece la cadena de texto para el texto explicativo de la animación que informa a los usuarios del movimiento que deben realizar.                                               |
| disablePrompt  | Booleano | `false`                              | Establézcalo como true para ocultar la sobreimpresión de Coaching predeterminada y poder utilizar los eventos de sobreimpresión de Coaching para una sobreimpresión personalizada. |

### Creación de un Coaching Overlay personalizado para su proyecto {#custom-hand-coaching-overlay}

La superposición de entrenamiento manual puede añadirse como módulo de canalización y ocultarse (mediante el parámetro `disablePrompt`) para que pueda utilizar fácilmente los eventos de superposición de entrenamiento para activar una superposición personalizada.

- `hand-coaching-overlay.show`: el evento se activa cuando debe mostrarse el Coaching Overlay.
- `hand-coaching-overlay.hide`: el evento se activa cuando la Sobreimpresión de Coaching debe ocultarse.

#### Ejemplo - ventana superpuesta Entrenamiento manual con parámetros especificados por el usuario {#example---hand-coaching-overlay-with-user-specified-parameters}

![hand-coachingoverlay-example](/images/hand-coaching-overlay-example.jpeg)

#### Ejemplo de marco A (captura de pantalla anterior) {#a-frame-example-screenshot-above}

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

#### Ejemplo sin marco (captura de pantalla anterior) {#non-aframe-example--screenshot-above}

```javascript
// Configurado aquí
HandCoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: '¡Apunta con el teléfono a tu mano izquierda!',
})
XR8.addCameraPipelineModules([ // Añadir módulos de canalización de cámara.
    // Módulos existentes.
    XR8.GlTextureRenderer.pipelineModule(), // Dibuja el feed de la cámara.
    XR8.Threejs.pipelineModule(), // Crea una escena ThreeJS AR así como una escena Sky.
    window.LandingPage.pipelineModule(), // Detecta navegadores no soportados y da pistas.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifica el lienzo para llenar la ventana.
    XRExtras.Loading.pipelineModule(), // Gestiona la pantalla de carga al inicio.
    XRExtras.RuntimeError.pipelineModule(), // Muestra una imagen de error en tiempo de ejecución.

    // Habilita el seguimiento de la mano.
    XR8.HandController.pipelineModule(),
    HandCoachingOverlay.pipelineModule(),

    ...
    myHandSampleScenePipelineModule(),
  ])

```

#### Ejemplo de AFrame - Escucha de eventos de superposición de entrenamiento manual {#aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('hand-coaching-overlay.show', () => {
  // Haz algo
 })

this.el.sceneEl.addEventListener('hand-coaching-overlay.hide', () => {
  // Haz algo
})
```

#### Ejemplo sin marco: escucha de eventos de superposición de entrenamiento manual {#non-aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EJEMPLO: HAND COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EJEMPLO: HAND COACHING OVERLAY - HIDE')
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
