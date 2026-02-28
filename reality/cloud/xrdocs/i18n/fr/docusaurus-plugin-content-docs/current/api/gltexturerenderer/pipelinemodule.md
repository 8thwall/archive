---
sidebar_label: pipelineModule()
---

# XR8.GlTextureRenderer.pipelineModule()

`XR8.GlTextureRenderer.pipelineModule({ vertexSource, fragmentSource, toTexture, flipY })`

## Description {#description}

Crée un module de pipeline qui dessine le flux de la caméra sur le support.

## Paramètres {#parameters}

| Paramètres                  | Type                                                                            | Défaut                              | Description                                                                                |
| --------------------------- | ------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| vertexSource [Facultatif]   | `Chaîne`                                                                        | Un nuanceur de vertex sans option   | Source du nuanceur de vertex à utiliser pour le rendu.                                     |
| fragmentSource [Facultatif] | `Chaîne`                                                                        | Un nuanceur de fragment sans option | Source du nuanceur de fragment à utiliser pour le rendu.                                   |
| toTexture [Facultatif]      | [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Le support                          | Une texture à dessiner. Si aucune texture n'est fournie, le dessin se fera sur le support. |
| flipY [Facultatif]          | `Booléen`                                                                       | `faux`                              | Si c'est le cas, le rendu est inversé.                                                     |

## Retours {#returns}

La valeur de retour est un objet `{viewport, shader}` mis à la disposition de [`onProcessCpu`](/api/camerapipelinemodule/onprocesscpu) et [`onUpdate`](/api/camerapipelinemodule/onupdate) en tant que :

`processGpuResult.gltexturerenderer` avec les propriétés suivantes :

| Propriété | Type                                | Description                                                                                                                                                                                              |
| --------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fenêtre   | `{width, height, offsetX, offsetY}` | La région de la toile ou de la texture de sortie dans laquelle dessiner ; elle peut être construite manuellement ou à l'aide de [`XR8.GlTextureRenderer.fillTextureViewport()`](filltextureviewport.md). |
| nuanceur  |                                     | Une poignée vers le shader utilisé pour dessiner la texture.                                                                                                                                             |

processGpuResult.gltexturerer.viewport : `{ width, height, offsetX, offsetY }`

| Propriété | Type     | Description                                               |
| --------- | -------- | --------------------------------------------------------- |
| largeur   | `Nombre` | La largeur (en pixels) à dessiner.                        |
| hauteur   | `Nombre` | La hauteur (en pixels) à dessiner.                        |
| offsetX   | `Nombre` | La coordonnée x minimale (en pixels) à laquelle dessiner. |
| offsetY   | `Nombre` | La coordonnée y minimale (en pixels) à laquelle dessiner. |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onProcessCpu : ({ processGpuResult }) => {
    const {viewport, shader} = processGpuResult.gltexturerenderer
    if (!viewport) {
      return
    }
    const { width, height, offsetX, offsetY } = viewport

    // ...
  },
```
