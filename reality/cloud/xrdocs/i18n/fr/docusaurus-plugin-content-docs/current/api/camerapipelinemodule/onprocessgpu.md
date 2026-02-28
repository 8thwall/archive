# onProcessGpu()

`onProcessGpu : ({ framework, frameStartResult })`

## Description {#description}

`onProcessGpu()` est appelé pour démarrer le traitement par le GPU.

## Paramètres {#parameters}

| Paramètres       | Description                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| cadre            | { dispatchEvent(eventName, detail) } : Emet un événement nommé avec les détails fournis.                               |
| frameStartResult | { cameraTexture, computeTexture, GLctx, computeCtx, textureWidth, textureHeight, orientation, videoTime, repeatFrame } |

Le paramètre `frameStartResult` a les propriétés suivantes :

| Propriété             | Description                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| cameraTexture         | La texture WebGLTexture [`du support de dessin`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) contenant les données d'alimentation de la caméra. |
| calculerTexture       | Le support de calcul [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) contenant les données de la caméra.                           |
| GLctx                 | `WebGLRenderingContext` ou `WebGL2RenderingContext`.                                                                                                               |
| calculerCtx           | Le contexte de rendu du support de calcul `WebGLRenderingContext` ou `WebGL2RenderingContext`.                                                                     |
| largeur de la texture | Largeur (en pixels) de la texture du flux de la caméra.                                                                                                            |
| hauteur de la texture | Hauteur (en pixels) de la texture du flux de la caméra.                                                                                                            |
| l'orientation         | La rotation de l'interface utilisateur par rapport au portrait, en degrés (-90, 0, 90, 180).                                                                       |
| durée de la vidéo     | L'horodatage de cette image vidéo.                                                                                                                                 |
| repeatFrame           | Vrai si le flux de la caméra n'a pas été mis à jour depuis le dernier appel.                                                                                       |

## Retours {#returns}

Toutes les données que vous souhaitez fournir à [`onProcessCpu`](onprocesscpu.md) et [`onUpdate`](onupdate.md) doivent être renvoyées.  Il sera fourni à ces méthodes en tant que `processGpuResult.modulename`

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
    // Effectuez ici le traitement GPU approprié
    ...
    XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)

    // Ces champs seront fournis à onProcessCpu et onUpdate
    return {gpuDataA, gpuDataB}
  },
})
```
