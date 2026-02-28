---
sidebar_label: crear()
---

# XR8.GlTextureRenderer.create()

XR8.GlTextureRenderer.create({ GLctx, vertexSource, fragmentSource, toTexture, flipY, mirroredDisplay })\`

## Descripción {#description}

Crea un objeto para renderizar desde una textura a un lienzo u otra textura.

## Parámetros {#parameters}

| Parámetro                                                                      | Tipo                                                                            | Por defecto                            | Descripción                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GLctx                                                                          | `WebGlRenderingContext` o `WebGl2RenderingContext`.             |                                        | El `WebGlRenderingContext` (o `WebGl2RenderingContext`) a utilizar para el renderizado. Si no se especifica `toTexture`, el contenido se dibujará en el lienzo de este contexto. |
| vertexSource [Opcional]    | Cadena                                                                          | Un sombreador de vértices no operativo | La fuente del sombreador de vértices que se utilizará para el renderizado.                                                                                                                                          |
| fragmentSource [Opcional]  | Cadena                                                                          | Un sombreador de fragmentos no-op      | La fuente del fragment shader a utilizar para el renderizado.                                                                                                                                                       |
| toTexture [Opcional]       | [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Lienzo de \`GLctx                      | Una textura para dibujar. Si no se proporciona ninguna textura, el dibujo se hará en el lienzo.                                                                                                     |
| flipY [Opcional]           | Booleano                                                                        | `false`                                | Si es verdadero, invierte la representación.                                                                                                                                                                        |
| mirroredDisplay [Opcional] | Booleano                                                                        | `false`                                | Si es true, voltea la representación de izquierda a derecha.                                                                                                                                                        |

## Devuelve {#returns}

Devuelve un objeto: `{render, destroy, shader}`

| Propiedad                                              | Descripción                                                                                                                                                                                                                                                |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| render({ renderTexture, viewport }) | Función que renderiza la textura en la ventana gráfica especificada. Dependiendo de si se suministra `toTexture`, la vista se encuentra en el lienzo que creó `GLctx`, o es relativa a la textura de render proporcionada. |
| destruir                                               | Limpia los recursos asociados a este `GlTextureRenderer`.                                                                                                                                                                                  |
| sombreador                                             | Obtiene un manejador del sombreador utilizado para dibujar la textura.                                                                                                                                                                     |

La función `render` tiene los siguientes parámetros:

| Parámetro     | Descripción                                                                                                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderTexture | Una [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) (fuente) para dibujar.                                                   |
| ventana       | La región del lienzo o textura de salida para dibujar; esto puede ser construido manualmente, o usando [`XR8.GlTextureRenderer.fillTextureViewport()`](filltextureviewport.md). |

La ventana gráfica se especifica mediante `{ width, height, offsetX, offsetY }` :

| Propiedad                                                              | Tipo     | Descripción                                                                       |
| ---------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------- |
| anchura                                                                | `Número` | El ancho (en píxeles) a dibujar.               |
| altura                                                                 | `Número` | La altura (en píxeles) a dibujar.              |
| offsetX [Opcional] | `Número` | La coordenada x mínima (en píxeles) a dibujar. |
| offsetY [Opcional] | `Número` | La coordenada y mínima (en píxeles) a dibujar. |
