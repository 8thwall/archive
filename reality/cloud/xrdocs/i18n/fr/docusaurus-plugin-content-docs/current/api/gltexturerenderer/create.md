---
sidebar_label: create()
---

# XR8.GlTextureRenderer.create()

`XR8.GlTextureRenderer.create({ GLctx, vertexSource, fragmentSource, toTexture, flipY, mirroredDisplay })`

## Description {#description}

Crée un objet pour le rendu d'une texture vers un support ou une autre texture.

## Paramètres {#parameters}

| Paramètres                   | Type                                                                            | Défaut                              | Description                                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GLctx                        | `WebGlRenderingContext` ou `WebGl2RenderingContext`                             |                                     | Le `WebGlRenderingContext` (ou `WebGl2RenderingContext`) à utiliser pour le rendu. Si aucun `toTexture` n'est spécifié, le contenu sera dessiné sur le support de ce contexte. |
| vertexSource [Facultatif]    | `Chaîne`                                                                        | Un nuanceur de vertex sans option   | Source du nuanceur de vertex à utiliser pour le rendu.                                                                                                                         |
| fragmentSource [Facultatif]  | `Chaîne`                                                                        | Un nuanceur de fragment sans option | Source du nuanceur de fragment à utiliser pour le rendu.                                                                                                                       |
| toTexture [Facultatif]       | [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Support de `GLctx`                  | Une texture à dessiner. Si aucune texture n'est fournie, le dessin se fera sur le support.                                                                                     |
| flipY [Facultatif]           | `Booléen`                                                                       | `faux`                              | Si c'est le cas, le rendu est inversé.                                                                                                                                         |
| mirroredDisplay [Facultatif] | `Booléen`                                                                       | `faux`                              | Si c'est le cas, le rendu est inversé de gauche à droite.                                                                                                                      |

## Retours {#returns}

Renvoie un objet : `{render, destroy, shader}`

| Propriété                           | Description                                                                                                                                                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| render({ renderTexture, viewport }) | Une fonction qui effectue le rendu de la texture dans la fenêtre spécifiée. Selon que `toTexture` est fourni, le point de vue est soit sur le support qui a créé `GLctx`, soit relatif à la texture de rendu fournie. |
| détruire                            | Nettoyer les ressources associées à cette `GlTextureRenderer`.                                                                                                                                                        |
| nuanceur                            | Obtient une poignée vers le shader utilisé pour dessiner la texture.                                                                                                                                                  |

La fonction `render` a les paramètres suivants :

| Paramètres    | Description                                                                                                                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rendreTexture | Une [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) (source) à dessiner.                                                                                                 |
| fenêtre       | La région de la toile ou de la texture de sortie dans laquelle dessiner ; elle peut être construite manuellement ou à l'aide de [`XR8.GlTextureRenderer.fillTextureViewport()`](filltextureviewport.md). |

La fenêtre de visualisation est spécifiée par `{ width, height, offsetX, offsetY }` :

| Propriété            | Type     | Description                                               |
| -------------------- | -------- | --------------------------------------------------------- |
| largeur              | `Nombre` | La largeur (en pixels) à dessiner.                        |
| hauteur              | `Nombre` | La hauteur (en pixels) à dessiner.                        |
| offsetX [Facultatif] | `Nombre` | La coordonnée x minimale (en pixels) à laquelle dessiner. |
| offsetY [Facultatif] | `Nombre` | La coordonnée y minimale (en pixels) à laquelle dessiner. |
