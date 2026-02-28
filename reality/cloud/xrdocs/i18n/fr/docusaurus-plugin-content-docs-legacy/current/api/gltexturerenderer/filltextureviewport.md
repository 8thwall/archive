---
sidebar_label: fillTextureViewport()
---

# XR8.GlTextureRenderer.fillTextureViewport()

`XR8.GlTextureRenderer.fillTextureViewport(srcWidth, srcHeight, destWidth, destHeight)`

## Description {#description}

Méthode pratique pour obtenir une structure Viewport qui remplit une texture ou un canevas à partir d'une source
sans distorsion. Il est transmis à la méthode de rendu de l'objet créé par
[`XR8.GlTextureRenderer.create()`](create.md).

## Paramètres {#parameters}

| Paramètres | Type     | Description                                               |
| ---------- | -------- | --------------------------------------------------------- |
| srcWidth   | `Nombre` | La largeur de la texture que vous rendez. |
| srcHeight  | `Nombre` | La hauteur de la texture que vous rendez. |
| destWidth  | `Nombre` | La largeur de la cible de rendu.          |
| destHeight | `Nombre` | La hauteur de la cible de rendu.          |

## Retourne {#returns}

Un objet : `{ width, height, offsetX, offsetY }`

| Propriété | Type     | Description                                                                                  |
| --------- | -------- | -------------------------------------------------------------------------------------------- |
| largeur   | `Nombre` | La largeur (en pixels) à dessiner.                        |
| hauteur   | `Nombre` | La hauteur (en pixels) à dessiner.                        |
| offsetX   | `Nombre` | La coordonnée x minimale (en pixels) à laquelle dessiner. |
| offsetY   | `Nombre` | La coordonnée y minimale (en pixels) à laquelle dessiner. |
