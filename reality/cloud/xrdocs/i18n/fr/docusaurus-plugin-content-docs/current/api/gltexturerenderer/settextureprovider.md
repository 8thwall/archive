---
sidebar_label: setTextureProvider()
---

# XR8.GlTextureRenderer.setTextureProvider()

`XR8.GlTextureRenderer.setTextureProvider(({ frameStartResult, processGpuResult, processCpuResult }) => {} )`

## Description {#description}

Définit un fournisseur qui transmet la texture à dessiner. Il doit s'agir d'une fonction qui prend les mêmes entrées que [`cameraPipelineModule.onUpdate`](/api/camerapipelinemodule/onupdate).

## Paramètres {#parameters}

`setTextureProvider()` prend une fonction **** avec les paramètres suivants :

| Paramètres       | Type    | Description                                                                                                        |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| frameStartResult | `Objet` | Les données fournies au début d'une trame.                                                                         |
| processGpuResult | `Objet` | Données renvoyées par tous les modules installés pendant [`onProcessGpu`](/api/camerapipelinemodule/onprocessgpu). |
| processCpuResult | `Objet` | Données renvoyées par tous les modules installés pendant [`onProcessCpu`](/api/camerapipelinemodule/onprocesscpu). |

La fonction doit renvoyer une WebGLTexture [``](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) à dessiner.

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
XR8.GlTextureRenderer.setTextureProvider(
  ({processGpuResult}) => {
    return processGpuResult.camerapixelarray ? processGpuResult.camerapixelarray.srcTex : null
  })
```
