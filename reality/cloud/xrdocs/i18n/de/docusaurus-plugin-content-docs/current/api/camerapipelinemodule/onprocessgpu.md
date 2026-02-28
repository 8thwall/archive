# onProcessGpu()

`onProcessGpu: ({ framework, frameStartResult })`

## Beschreibung {#description}

`onProcessGpu()` wird aufgerufen, um die GPU-Verarbeitung zu starten.

## Parameter {#parameters}

| Parameter        | Beschreibung                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| framework        | { dispatchEvent(eventName, detail) } : Sendet ein benanntes Ereignis mit den angegebenen Details.                      |
| frameStartResult | { cameraTexture, computeTexture, GLctx, computeCtx, textureWidth, textureHeight, orientation, videoTime, repeatFrame } |

Der Parameter `frameStartResult` hat die folgenden Eigenschaften:

| Eigentum       | Beschreibung                                                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| cameraTexture  | Die [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) der Zeichenfläche, die die Daten des Kamerafeeds enthält.  |
| computeTexture | Die [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) des Compute Canvas, die die Daten des Kamerafeeds enthält. |
| GLctx          | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` der Zeichenfläche.                                                                   |
| computeCtx     | Der `WebGLRenderingContext` oder `WebGL2RenderingContext` des Compute Canvas.                                                                  |
| texturBreite   | Die Breite (in Pixeln) der Textur des Kamerafeeds.                                                                                             |
| textureHeight  | Die Höhe (in Pixeln) der Textur des Kamerafeeds.                                                                                               |
| orientierung   | Die Drehung der Benutzeroberfläche gegenüber dem Hochformat, in Grad (-90, 0, 90, 180).                                                        |
| videoZeit      | Der Zeitstempel dieses Videobildes.                                                                                                            |
| repeatFrame    | True, wenn der Kamerafeed seit dem letzten Aufruf nicht aktualisiert wurde.                                                                    |

## Returns {#returns}

Alle Daten, die Sie [`onProcessCpu`](onprocesscpu.md) und [`onUpdate`](onupdate.md) zur Verfügung stellen möchten, sollten zurückgegeben werden.  Er wird diesen Methoden als `processGpuResult.modulename zur Verfügung gestellt`

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onProcessGpu: ({frameStartResult}) => {
    const {cameraTexture, GLctx, textureWidth, textureHeight} = frameStartResult

    if(!cameraTexture.name){
      console.error("[index] Kameratextur hat keinen Namen")
    }

    const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
    // Machen Sie hier die relevante GPU-Verarbeitung
    ...
    XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)

    // Diese Felder werden an onProcessCpu und onUpdate übergeben
    return {gpuDataA, gpuDataB}
  },
})
```
