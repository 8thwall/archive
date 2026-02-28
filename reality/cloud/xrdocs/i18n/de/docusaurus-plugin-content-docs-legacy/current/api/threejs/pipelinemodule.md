---
sidebar_label: pipelineModule()
---

# XR8.Threejs.pipelineModule()

`XR8.Threejs.pipelineModule()`

## Beschreibung {#description}

Ein Pipeline-Modul, das eine Schnittstelle zur three.js-Umgebung und zum Lebenszyklus bildet. Die three.js-Szene kann mit [`XR8.Threejs.xrScene()`](xrscene.md) abgefragt werden, nachdem die [`XR8.Threejs.pipelineModule()`](pipelinemodule.md) Methode [`onStart`](/legacy/api/camerapipelinemodule/onstart) aufgerufen wurde. Die Einrichtung kann in der Methode [`onStart`](/legacy/api/camerapipelinemodule/onstart) eines anderen Pipelinemoduls erfolgen, indem auf [`XR8.Threejs.xrScene()`](xrscene.md) verwiesen wird, solange [`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) auf dem zweiten Modul _nach_ dem Aufruf von `XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())` aufgerufen wird.

- [`onStart`](/legacy/api/camerapipelinemodule/onstart) werden ein three.js-Renderer und eine Szene erstellt und so konfiguriert, dass sie über einen Kamera-Feed gezeichnet werden.
- [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate), wird die three.js-Kamera durch die Bewegung des Telefons gesteuert.
- [`onRender`](/legacy/api/camerapipelinemodule/onrender), wird die Methode `render()` des Renderers aufgerufen.

Beachten Sie, dass dieses Modul nicht tatsächlich zeichnen die Kamera-Feed auf der Leinwand, GlTextureRenderer tut
. Um einen Kamera-Feed im Hintergrund hinzuzufügen, installieren Sie das
[`XR8.GlTextureRenderer.pipelineModule()`](/legacy/api/gltexturerenderer/pipelinemodule) vor der Installation dieses
Moduls (so dass es gerendert wird, bevor die Szene gezeichnet wird).

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Ein three.js-Pipelinemodul, das über [`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) hinzugefügt werden kann.

## Beispiel {#example}

```javascript
// Fügen Sie XrController.pipelineModule() hinzu, das die 6DoF-Kamerabewegungsschätzung ermöglicht.
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())

// Fügen Sie einen GlTextureRenderer hinzu, der den Kamerafeed auf die Leinwand zeichnet.
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// Fügen Sie Threejs.pipelineModule() hinzu, das eine three.js-Szene, eine Kamera und einen Renderer erstellt und
// die Szenenkamera basierend auf der 6DoF-Kamerabewegung ansteuert.
XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())

// Fügen Sie der Kameraschleife benutzerdefinierte Logik hinzu. Dies geschieht mit Kamera-Pipeline-Modulen, die
// Logik für wichtige Lebenszyklusmomente zur Verarbeitung jedes Kamerabildes bereitstellen. In diesem Fall fügen wir
// eine onStart-Logik für die Initialisierung der Szene und eine onUpdate-Logik für die Aktualisierung der Szene hinzu.
XR8.addCameraPipelineModule({
  // Kamera-Pipelinemodule benötigen einen Namen. Er kann beliebig sein, muss aber
  // innerhalb der App eindeutig sein.
  name: 'myawesomeapp',

  // onStart wird einmal aufgerufen, wenn die Kameraübertragung beginnt. In diesem Fall müssen wir warten, bis die
  // XR8.Threejs-Szene bereit ist, bevor wir auf sie zugreifen können, um Inhalte hinzuzufügen.
  onStart: ({canvasWidth, canvasHeight}) => {
    // Holen Sie die three.js-Szene. Diese wurde durch XR8.Threejs.pipelineModule().onStart() erstellt. Der
    // Grund, warum wir jetzt darauf zugreifen können, ist, dass 'myawesomeapp' nach
    // XR8.Threejs.pipelineModule() installiert wurde.
    const {scene, camera} = XR8.Threejs.xrScene()

    // Fügen Sie der Szene einige Objekte hinzu und setzen Sie die Startposition der Kamera.
    initScene({scene, camera})

    // Synchronisieren Sie die 6DoF-Position und die Kameraparameter des XR-Controllers mit unserer Szene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
  },

  // onUpdate wird einmal pro Kameraschleife vor dem Rendern aufgerufen. Jede Three.js-Geometrie-Szene würde
  // typischerweise hier stattfinden.
  onUpdate: () => {
    // Aktualisieren der Position von Objekten in der Szene usw.
    updateScene(XR8.Threejs.xrScene())
  },
})
```
