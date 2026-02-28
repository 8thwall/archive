---
sidebar_label: pipelineModule()
---

# XR8.CameraPixelArray.pipelineModule()

`XR8.CameraPixelArray.pipelineModule({ luminance, maxDimension, width, height })`

## Description {#description}

Un module de pipeline qui fournit la texture de la caméra sous la forme d'un tableau de valeurs de pixels RGBA ou en niveaux de gris
qui peut être utilisé pour le traitement d'images par l'unité centrale.

## Paramètres {#parameters}

| Paramètres                                                                                      | Défaut                                                      | Description                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luminance [Optionnel]                       | `false`                                                     | Si vrai, sortie en niveaux de gris au lieu de RGBA                                                                                                                                                                                                                             |
| maxDimension : [Facultatif] |                                                             | La taille en pixels de la dimension la plus longue de l'image de sortie. La dimension la plus courte sera mise à l'échelle par rapport à la taille de l'entrée de la caméra afin que l'image soit redimensionnée sans recadrage ni distorsion. |
| largeur [Facultatif]                        | Largeur de la texture du flux de la caméra. | Largeur de l'image de sortie. Ignoré si `maxDimension` est spécifié.                                                                                                                                                                           |
| hauteur [Facultatif]                        | Hauteur de la texture du flux de la caméra. | Hauteur de l'image de sortie. Ignoré si `maxDimension` est spécifié.                                                                                                                                                                           |

## Retourne {#returns}

La valeur de retour est un objet mis à la disposition de [`onProcessCpu`](/legacy/api/camerapipelinemodule/onprocesscpu) et
[`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) comme :

processGpuResult.camerapixelarray : {rows, cols, rowBytes, pixels}

| Propriété        | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| rangs            | Hauteur en pixels de l'image de sortie.                    |
| cols             | Largeur en pixels de l'image de sortie.                    |
| octets de rangée | Nombre d'octets par ligne de l'image de sortie.            |
| pixels           | Un `UInt8Array` de données de pixels.                      |
| srcTex           | Une texture contenant l'image source des pixels retournés. |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule(XR8.CameraPixelArray.pipelineModule({ luminance: true }))
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onProcessCpu : ({ processGpuResult }) => {
    const { camerapixelarray } = processGpuResult
    if (!camerapixelarray || !camerapixelarray.pixels) {
      return
    }
    const { rows, cols, rowBytes, pixels } = camerapixelarray

    ...
  },
```
