# onProcessGpu()

`onProcessGpu: ({ framework, frameStartResult })`

## Descripción {#description}

Se llama a `onProcessGpu()` para iniciar el procesamiento en la GPU.

## Parámetros {#parameters}

| Parámetro        | Descripción                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| marco            | { dispatchEvent(eventName, detail) } : Emite un evento con el nombre y los detalles proporcionados. |
| frameStartResult | { cameraTexture, computeTexture, GLctx, computeCtx, textureWidth, textureHeight, orientation, videoTime, repeatFrame }                                 |

El parámetro `frameStartResult` tiene las siguientes propiedades:

| Propiedad      | Descripción                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cameraTexture  | La [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) del lienzo que contiene los datos de la cámara.            |
| computeTexture | La [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) del lienzo de cálculo que contiene los datos de la cámara. |
| GLctx          | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo.                                                                             |
| computeCtx     | El `WebGLRenderingContext` o `WebGL2RenderingContext` del lienzo de cálculo.                                                                  |
| textureWidth   | La anchura (en píxeles) de la textura de alimentación de la cámara.                                                        |
| textureHeight  | La altura (en píxeles) de la textura de alimentación de la cámara.                                                         |
| orientación    | La rotación de la interfaz de usuario con respecto a la vertical, en grados (-90, 0, 90, 180).                             |
| videoTiempo    | La marca de tiempo de este fotograma de vídeo.                                                                                                |
| repetirCuadro  | True si la alimentación de la cámara no se ha actualizado desde la última llamada.                                                            |

## Devuelve {#returns}

Cualquier dato que desee proporcionar a [`onProcessCpu`](onprocesscpu.md) y [`onUpdate`](onupdate.md) debe ser devuelto a
.  Se proporcionará a esos métodos como `processGpuResult.modulename`.

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onProcessGpu: ({frameStartResult}) => {
    const {cameraTexture, GLctx, textureWidth, textureHeight} = frameStartResult

    if(!cameraTexture.name){
      console.error("[index] Camera texture does not have a name")
    }

    const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
    // Realiza aquí el procesamiento GPU pertinente
    ...
    XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)

    // Estos campos se proporcionarán a onProcessCpu y onUpdate
    return {gpuDataA, gpuDataB}
  },
})
```
