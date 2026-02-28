---
sidebar_label: fillTextureViewport()
---

# XR8.GlTextureRenderer.fillTextureViewport()

`SXR8.GlTextureRenderer.fillTextureViewport(srcAnchura, srcAltura, destAnchura, destAltura)`

## Descripción {#description}

Método práctico para obtener una estructura Viewport que rellene una textura o un lienzo a partir de una fuente sin distorsión. Se pasa al método de renderizado del objeto creado por [`XR8.GlTextureRenderer.create()`](create.md)

## Parámetros {#parameters}

| Parámetro  | Tipo     | Descripción                                      |
| ---------- | -------- | ------------------------------------------------ |
| srcWidth   | `Número` | La anchura de la textura que estás renderizando. |
| srcHeight  | `Número` | La altura de la textura que estás renderizando.  |
| destWidth  | `Número` | La anchura del objetivo de renderizado.          |
| destHeight | `Número` | La altura del objetivo de renderizado.           |

## Vuelta {#returns}

Un objeto: `{ width, height, offsetX, offsetY }`

| Propiedad | Tipo     | Descripción                                            |
| --------- | -------- | ------------------------------------------------------ |
| width     | `Número` | La anchura (en píxeles) a dibujar.                     |
| height    | `Número` | La altura (en píxeles) a dibujar.                      |
| offsetX   | `Número` | La coordenada x mínima (en píxeles) en la que dibujar. |
| offsetY   | `Número` | La coordenada y mínima (en píxeles) a la que dibujar.  |
