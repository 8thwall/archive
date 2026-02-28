# onRender()

`onRender: ()`

## Beschreibung {#description}

`onRender()` wird nach [`onUpdate`](onupdate.md) aufgerufen. Dies ist der Zeitpunkt, an dem die Rendering-Engine alle WebGL-Zeichenbefehle ausgibt. Wenn eine Anwendung ihre eigene Ausführungsschleife bereitstellt und sich auf [`XR8.runPreRender()`](/api/engine/xr8/runprerender) und [`XR8.runPostRender()`](/api/engine/xr8/runprerender) verlässt, wird diese Methode nicht aufgerufen und das gesamte Rendering muss von der externen Ausführungsschleife koordiniert werden.

## Parameter {#parameters}

Keine

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onRender: () => {
    // Dies wird bereits von XR8.Threejs.pipelineModule() ausgeführt, wird hier jedoch zur Veranschaulichung bereitgestellt.
    XR8.Threejs.xrScene().renderer.render()
  },
})
```
