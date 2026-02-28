---
sidebar_label: setForegroundTextureProvider()
---

# XR8.GlTextureRenderer.setForegroundTextureProvider()

`XR8.GlTextureRenderer.setForegroundTextureProvider(({ frameStartResult, processGpuResult, processCpuResult }) => {} )`

## Description {#description}

Définit un fournisseur qui transmet une liste de textures de premier plan à dessiner. Il doit s'agir d'une fonction qui prend les mêmes entrées que [`cameraPipelineModule.onUpdate`](/api/camerapipelinemodule/onupdate).

## Paramètres {#parameters}

`setForegroundTextureProvider()` prend une fonction **** avec les paramètres suivants :

| Paramètres       | Type    | Description                                                                                                        |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| frameStartResult | `Objet` | Les données fournies au début d'une trame.                                                                         |
| processGpuResult | `Objet` | Données renvoyées par tous les modules installés pendant [`onProcessGpu`](/api/camerapipelinemodule/onprocessgpu). |
| processCpuResult | `Objet` | Données renvoyées par tous les modules installés pendant [`onProcessCpu`](/api/camerapipelinemodule/onprocesscpu). |

La fonction doit renvoyer un tableau d'objets contenant chacun les propriétés suivantes :

| Propriété                              | Type                                                                            | Défaut    | Description                                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| texture d'avant-plan                   | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) |           | La texture de premier plan à dessiner.                                                                                                   |
| masque de fond                         | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) |           | Un masque alpha à utiliser sur la texture de premier plan. Le canal `r` de la `foregroundMaskTexture` est utilisé pour le mélange alpha. |
| foregroundTextureFlipY [Optionnel]     | `faux`                                                                          | `Booléen` | Si l'on veut inverser la texture de `foregroundTexture`.                                                                                 |
| foregroundMaskTextureFlipY [Optionnel] | `faux`                                                                          | `Booléen` | S'il faut inverser la texture `foregroundMaskTexture`.                                                                                   |

Les textures d'avant-plan seront dessinées au-dessus de la texture fournie en appelant [`XR8.GlTextureRenderer.setTextureProvider()`](filltextureviewport.md). Les textures de premier plan seront dessinées dans l'ordre du tableau retourné.

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
XR8.GlTextureRenderer.setForegroundTextureProvider(
  ({processGpuResult}) => {
    // Effectuez un traitement...
    return [{
      foregroundTexture,
      foregroundMaskTexture,
      foregroundTextureFlipY,
      foregroundMaskTextureFlipY
    }]]
  })
```
