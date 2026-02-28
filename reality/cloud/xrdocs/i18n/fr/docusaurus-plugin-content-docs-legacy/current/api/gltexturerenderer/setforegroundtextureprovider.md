---
sidebar_label: setForegroundTextureProvider()
---

# XR8.GlTextureRenderer.setForegroundTextureProvider()

`XR8.GlTextureRenderer.setForegroundTextureProvider(({ frameStartResult, processGpuResult, processCpuResult }) => {} )`

## Description {#description}

Définit un fournisseur qui transmet une liste de textures de premier plan à dessiner. Il doit s'agir d'une fonction qui prend les mêmes entrées que [`cameraPipelineModule.onUpdate`](/legacy/api/camerapipelinemodule/onupdate).

## Paramètres {#parameters}

`setForegroundTextureProvider()` prend une **fonction** avec les paramètres suivants :

| Paramètres       | Type    | Description                                                                                                                               |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| frameStartResult | `Objet` | Les données fournies au début d'une trame.                                                                                |
| processGpuResult | `Objet` | Données renvoyées par tous les modules installés pendant [`onProcessGpu`](/legacy/api/camerapipelinemodule/onprocessgpu). |
| processCpuResult | `Objet` | Données renvoyées par tous les modules installés pendant [`onProcessCpu`](/legacy/api/camerapipelinemodule/onprocesscpu). |

La fonction doit renvoyer un tableau d'objets contenant chacun les propriétés suivantes :

| Propriété                                                                                  | Type                                                                            | Défaut    | Description                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| texture d'avant-plan                                                                       | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) |           | La texture de premier plan à dessiner.                                                                                                                           |
| masque de fond                                                                             | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) |           | Un masque alpha à utiliser sur la texture de premier plan. Le canal `r` de la texture `foregroundMaskTexture` est utilisé dans le mélange alpha. |
| foregroundTextureFlipY [Optionnel]     | `false`                                                                         | `Booléen` | Indique s'il faut retourner la `Texture d'avant-plan`.                                                                                                           |
| foregroundMaskTextureFlipY [Optionnel] | `false`                                                                         | `Booléen` | Indique s'il faut retourner la texture `foregroundMaskTexture`.                                                                                                  |

Les textures de premier plan seront dessinées au-dessus de la texture fournie en appelant [`XR8.GlTextureRenderer.setTextureProvider()`](filltextureviewport.md). Les textures de premier plan seront dessinées dans l'ordre du tableau retourné.

## Retourne {#returns}

Aucun

## Exemple {#example}

```javascript
XR8.GlTextureRenderer.setForegroundTextureProvider(
  ({processGpuResult}) => {
    // Effectue quelques traitements...
    return [{
      foregroundTexture,
      foregroundMaskTexture,
      foregroundTextureFlipY,
      foregroundMaskTextureFlipY
    }]].
  })
```
