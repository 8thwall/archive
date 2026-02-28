# onProcessGpu()

`onProcessGpu : ({ framework, frameStartResult })`

## Description {#description}

`onProcessGpu()` est appelé pour démarrer le traitement GPU.

## Paramètres {#parameters}

| Paramètres       | Description                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| cadre            | { dispatchEvent(eventName, detail) } : émet un événement nommé avec les détails fournis. |
| frameStartResult | { cameraTexture, computeTexture, GLctx, computeCtx, textureWidth, textureHeight, orientation, videoTime, repeatFrame }                      |

Le paramètre `frameStartResult` a les propriétés suivantes :

| Propriété             | Description                                                                                                                                                                                                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cameraTexture         | La [`WebGLTexture`] du canevas de dessin (https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) contenant les données de la caméra. |
| calculerTexture       | La [`WebGLTexture`] du canevas de calcul (https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) contenant les données de la caméra. |
| GLctx                 | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` du canevas de dessin.                                                                                                                                                                                        |
| calculerCtx           | Le `WebGLRenderingContext` ou `WebGL2RenderingContext` du canevas de calcul.                                                                                                                                                                                        |
| largeur de la texture | Largeur (en pixels) de la texture du flux de la caméra.                                                                                                                                                                                          |
| hauteur de la texture | Hauteur (en pixels) de la texture du flux de la caméra.                                                                                                                                                                                          |
| l'orientation         | La rotation de l'interface utilisateur par rapport au portrait, en degrés (-90, 0, 90, 180).                                                                                                                                                     |
| durée de la vidéo     | L'horodatage de cette image vidéo.                                                                                                                                                                                                                                  |
| repeatFrame           | Vrai si le flux de la caméra n'a pas été mis à jour depuis le dernier appel.                                                                                                                                                                                        |

## Retourne {#returns}

Toutes les données que vous souhaitez fournir à [`onProcessCpu`](onprocesscpu.md) et [`onUpdate`](onupdate.md) doivent être renvoyées à
.  Il sera fourni à ces méthodes en tant que `processGpuResult.modulename`

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onProcessGpu : ({frameStartResult}) => {
    const {cameraTexture, GLctx, textureWidth, textureHeight} = frameStartResult

    if(!cameraTexture.name){
      console.error("[index] Camera texture does not have a name")
    }

    const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
    // Effectuer le traitement GPU approprié ici
    ...
    XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)

    // Ces champs seront fournis à onProcessCpu et onUpdate
    return {gpuDataA, gpuDataB}
  },
})
```
