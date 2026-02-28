# onRender()

`onRender: ()`

## Beschreibung {#description}

`onRender()` wird nach [`onUpdate`](onupdate.md) aufgerufen. Dies ist der Zeitpunkt, an dem die Rendering-Engine alle WebGL-Zeichenbefehle ausgibt. Wenn eine Anwendung ihre eigene Laufschleife bereitstellt und sich auf [`XR8.runPreRender()`](/api/xr8/runprerender) und [`XR8.runPostRender()`](/api/xr8/runprerender) verlässt, wird diese Methode nicht aufgerufen und das gesamte Rendering muss von der externen Laufschleife koordiniert werden.

## Parameter {#parameters}

Keine

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onRender: () => {
    // Dies wird bereits von XR8.Threejs.pipelineModule() erledigt, wird hier aber zur Veranschaulichung bereitgestellt.
    XR8.Threejs.xrScene().renderer.render()
  },
})
```
