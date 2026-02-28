---
sidebar_label: rellenarTexturaVista()
---

# XR8.GlTextureRenderer.fillTextureViewport()

XR8.GlTextureRenderer.fillTextureViewport(srcWidth, srcHeight, destWidth, destHeight)\`

## Descripción {#description}

Método conveniente para obtener una estructura Viewport que llene una textura o lienzo desde una fuente
sin distorsión. Se pasa al método render del objeto creado por
[`XR8.GlTextureRenderer.create()`](create.md)

## Parámetros {#parameters}

| Parámetro  | Tipo     | Descripción                                                     |
| ---------- | -------- | --------------------------------------------------------------- |
| srcWidth   | `Número` | El ancho de la textura que estás renderizando.  |
| srcHeight  | `Número` | La altura de la textura que estás renderizando. |
| destWidth  | `Número` | La anchura del objetivo de renderizado.         |
| destHeight | `Número` | La altura del objetivo de renderizado.          |

## Devuelve {#returns}

Un objeto: `{ width, height, offsetX, offsetY }`

| Propiedad | Tipo     | Descripción                                                                       |
| --------- | -------- | --------------------------------------------------------------------------------- |
| anchura   | `Número` | El ancho (en píxeles) a dibujar.               |
| altura    | `Número` | La altura (en píxeles) a dibujar.              |
| offsetX   | `Número` | La coordenada x mínima (en píxeles) a dibujar. |
| offsetY   | `Número` | La coordenada y mínima (en píxeles) a dibujar. |
