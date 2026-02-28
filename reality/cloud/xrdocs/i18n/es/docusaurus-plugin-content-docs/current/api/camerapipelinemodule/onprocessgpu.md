# onProcessGpu()

`onProcessGpu: ({ framework, frameStartResult })`

## Descripción {#description}

`onProcessGpu()` se llama para iniciar el procesamiento en la GPU.

## Parámetros {#parameters}

| Parámetro        | Descripción                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| framework        | { dispatchEvent(eventName, detail) }: Emite un evento con nombre con el detalle proporcionado.                         |
| frameStartResult | { cameraTexture, computeTexture, GLctx, computeCtx, textureWidth, textureHeight, orientation, videoTime, repeatFrame } |

El parámetro `frameStartResult` tiene las siguientes propiedades:

| Propiedad      | Descripción                                                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cameraTexture  | El lienzo de dibujo [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) que contiene los datos de alimentación de la cámara.  |
| computeTexture | El lienzo de cálculo [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) que contiene los datos de alimentación de la cámara. |
| GLctx          | El lienzo de dibujo `WebGLRenderingContext` o `WebGL2RenderingContext`.                                                                                   |
| computeCtx     | El lienzo de cálculo `WebGLRenderingContext` o `WebGL2RenderingContext`.                                                                                  |
| textureWidth   | La anchura (en píxeles) de la textura de alimentación de la cámara.                                                                                       |
| textureHeight  | La altura (en píxeles) de la textura de alimentación de la cámara.                                                                                        |
| orientation    | La rotación de la IU respecto a la vertical, en grados (-90, 0, 90, 180).                                                                                 |
| videoTime      | La marca de tiempo de este fotograma de vídeo.                                                                                                            |
| repeatFrame    | Verdadero si la alimentación de la cámara no se ha actualizado desde la última llamada.                                                                   |

## Devuelve {#returns}

Cualquier dato que desees proporcionar a [`onProcessCpu`](onprocesscpu.md) y [`onUpdate`](onupdate.md) debe ser devuelto .  Se proporcionará a esos métodos como `processGpuResult.modulename`

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
