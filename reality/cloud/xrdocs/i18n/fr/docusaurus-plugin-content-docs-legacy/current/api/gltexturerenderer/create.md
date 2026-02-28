---
sidebar_label: créer()
---

# XR8.GlTextureRenderer.create()

`XR8.GlTextureRenderer.create({ GLctx, vertexSource, fragmentSource, toTexture, flipY, mirroredDisplay })`

## Description {#description}

Crée un objet pour le rendu d'une texture vers un canevas ou une autre texture.

## Paramètres {#parameters}

| Paramètres                                                                       | Type                                                                            | Défaut                              | Description                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GLctx                                                                            | `WebGlRenderingContext` ou `WebGl2RenderingContext`.            |                                     | Le `WebGlRenderingContext` (ou `WebGl2RenderingContext`) à utiliser pour le rendu. Si aucun `toTexture` n'est spécifié, le contenu sera dessiné sur le canevas de ce contexte. |
| vertexSource [Facultatif]    | `Chaîne`                                                                        | Un nuanceur de vertex sans option   | Source du nuanceur de vertex à utiliser pour le rendu.                                                                                                                                                            |
| fragmentSource [Facultatif]  | `Chaîne`                                                                        | Un nuanceur de fragment sans option | Source du nuanceur de fragment à utiliser pour le rendu.                                                                                                                                                          |
| toTexture [Facultatif]       | [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Le canevas de \`GLctx               | Une texture à dessiner. Si aucune texture n'est fournie, le dessin se fera sur le canevas.                                                                                                        |
| flipY [Facultatif]           | `Booléen`                                                                       | `false`                             | Si c'est le cas, le rendu est inversé.                                                                                                                                                                            |
| mirroredDisplay [Facultatif] | `Booléen`                                                                       | `false`                             | Si c'est le cas, le rendu est inversé de gauche à droite.                                                                                                                                                         |

## Retourne {#returns}

Retourne un objet : `{render, destroy, shader}`

| Propriété                                              | Description                                                                                                                                                                                                                                           |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| render({ renderTexture, viewport }) | Une fonction qui effectue le rendu de la texture dans la fenêtre spécifiée. Selon que `toTexture` est fourni, le point de vue est soit sur le canevas qui a créé `GLctx`, soit relatif à la texture de rendu fournie. |
| détruire                                               | Nettoie les ressources associées à ce `GlTextureRenderer`.                                                                                                                                                                            |
| nuanceur                                               | Obtient une poignée vers le shader utilisé pour dessiner la texture.                                                                                                                                                                  |

La fonction `render` a les paramètres suivants :

| Paramètres    | Description                                                                                                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| rendreTexture | Une [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) (source) à dessiner.                                                                              |
| fenêtre       | La région du canevas ou de la texture de sortie dans laquelle dessiner ; elle peut être construite manuellement ou en utilisant [`XR8.GlTextureRenderer.fillTextureViewport()`](filltextureviewport.md). |

La fenêtre de visualisation est spécifiée par `{ width, height, offsetX, offsetY }` :

| Propriété                                                                | Type     | Description                                                                                  |
| ------------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------- |
| largeur                                                                  | `Nombre` | La largeur (en pixels) à dessiner.                        |
| hauteur                                                                  | `Nombre` | La hauteur (en pixels) à dessiner.                        |
| offsetX [Facultatif] | `Nombre` | La coordonnée x minimale (en pixels) à laquelle dessiner. |
| offsetY [Facultatif] | `Nombre` | La coordonnée y minimale (en pixels) à laquelle dessiner. |
