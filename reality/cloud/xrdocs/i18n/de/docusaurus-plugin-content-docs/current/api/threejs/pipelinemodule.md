---
sidebar_label: pipelineModule()
---

# XR8.Threejs.pipelineModule()

`XR8.Threejs.pipelineModule()`

## Beschreibung {#description}

Ein Pipeline-Modul, das mit der three.js Umgebung und dem Lebenszyklus zusammenarbeitet. Die three.js-Szene kann mit [`XR8.Threejs.xrScene()`](xrscene.md) abgefragt werden, nachdem [`XR8.Threejs.pipelineModule()`](pipelinemodule.md)'s [`onStart`](/api/camerapipelinemodule/onstart) Methode aufgerufen wurde. Die Einrichtung kann in der [`onStart`](/api/camerapipelinemodule/onstart) Methode eines anderen Pipeline-Moduls erfolgen, indem auf [`XR8.Threejs.xrScene()`](xrscene.md) verwiesen wird, solange [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule) auf dem zweiten Modul *nach dem* Aufruf `XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())` aufgerufen wird.

* [`onStart`](/api/camerapipelinemodule/onstart) werden ein three.js Renderer und eine Szene erstellt und so konfiguriert, dass sie über einen Kamera-Feed zeichnen.
* [`onUpdate`](/api/camerapipelinemodule/onupdate) wird die three.js Kamera durch die Bewegung des Telefons gesteuert.
* [`onRender`](/api/camerapipelinemodule/onrender), wird die Methode `render()` des Renderers aufgerufen.

Beachten Sie, dass dieses Modul das Kamerabild nicht tatsächlich auf die Leinwand zeichnet. Das übernimmt GlTextureRenderer . Um einen Kamera-Feed im Hintergrund hinzuzufügen, installieren Sie das [`XR8.GlTextureRenderer.pipelineModule()`](/api/gltexturerenderer/pipelinemodule) vor der Installation dieses Moduls (so dass es gerendert wird, bevor die Szene gezeichnet wird).

## Parameter {#parameters}

Keine

## Returns {#returns}

Ein three.js-Pipelinemodul, das über [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule) hinzugefügt werden kann.

## Beispiel {#example}

```javascript
// Fügen Sie XrController.pipelineModule() hinzu, das die Bewegungsschätzung der 6DoF-Kamera ermöglicht.
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())

// Fügen Sie einen GlTextureRenderer hinzu, der den Kamerafeed auf die Leinwand zeichnet.
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// Fügen Sie Threejs.pipelineModule() hinzu, das eine three.js-Szene, eine Kamera und einen Renderer erstellt und
// die Szenenkamera basierend auf der 6DoF-Kamerabewegung ansteuert.
XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())

// Fügen Sie der Kameraschleife eine eigene Logik hinzu. Dies geschieht mit Kamera-Pipeline-Modulen, die
// Logik für wichtige Lebenszyklusmomente zur Verarbeitung jedes Kamerabildes bereitstellen. In diesem Fall werden wir
// eine onStart-Logik für die Initialisierung der Szene und eine onUpdate-Logik für die Aktualisierung der Szene hinzufügen.
XR8.addCameraPipelineModule({
  // Kamera-Pipelinemodule benötigen einen Namen. Es kann sein, was immer Sie wollen, aber es muss eindeutig sein
  // innerhalb Ihrer App.
  name: 'myawesomeapp',

  // onStart wird einmal aufgerufen, wenn die Kamerafeed beginnt. In diesem Fall müssen wir warten, bis die
  // XR8.Threejs-Szene fertig ist, bevor wir auf sie zugreifen können, um Inhalte hinzuzufügen.
  onStart: ({canvasWidth, canvasHeight}) => {
    // Holen Sie sich die three.js Szene. Dies wurde von XR8.Threejs.pipelineModule().onStart() erstellt. Der
    // Grund, warum wir hier jetzt darauf zugreifen können, ist, dass 'myawesomeapp' nach
    // XR8.Threejs.pipelineModule() installiert wurde.
    const {scene, camera} = XR8.Threejs.xrScene()

    // Fügen Sie der Szene einige Objekte hinzu und legen Sie die Startposition der Kamera fest.
    initScene({scene, camera})

    // Synchronisieren Sie die 6DoF-Position und die Kameraparameter des xr-Controllers mit unserer Szene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
  },

  // onUpdate wird einmal pro Kameraschleife vor dem Rendern aufgerufen. Jede three.js Geometrie-Szene würde
  // normalerweise hier stattfinden.
  onUpdate: () => {
    // Aktualisieren Sie die Position von Objekten in der Szene, usw.
    updateScene(XR8.Threejs.xrScene())
  },
})
```
