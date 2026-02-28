---
sidebar_label: create()
---

# XR8.GlTextureRenderer.create()

`XR8.GlTextureRenderer.create({ GLctx, vertexSource, fragmentSource, toTexture, flipY, mirroredDisplay })`

## Descripción {#description}

Crea un objeto para renderizar desde una textura a un lienzo u otra textura.

## Parámetros {#parameters}

| Parámetro                  | Tipo                                                                            | Por defecto                            | Descripción                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GLctx                      | `WebGlRenderingContext` o `WebGl2RenderingContext`                              |                                        | El `WebGlRenderingContext` (o `WebGl2RenderingContext`) que se utilizará para la renderización. Si no se especifica `toTexture`, el contenido se dibujará en el lienzo de este contexto. |
| vertexSource [Opcional]    | `Cadena`                                                                        | Un sombreador de vértices no operativo | La fuente del sombreador de vértices que se utilizará para el renderizado.                                                                                                               |
| fragmentSource [Opcional]  | `Cadena`                                                                        | Un sombreador de fragmentos no-op      | La fuente del sombreador de fragmentos que se utilizará para el renderizado.                                                                                                             |
| toTexture [Opcional]       | [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Lienzo de `GLctx`                      | Una textura para dibujar. Si no se proporciona ninguna textura, el dibujo se hará en el lienzo.                                                                                          |
| flipY [Opcional]           | `Booleano`                                                                      | `false`                                | Si es verdadero, da la vuelta a la representación.                                                                                                                                       |
| mirroredDisplay [Opcional] | `Booleano`                                                                      | `false`                                | Si es verdadero, voltea la representación de izquierda a derecha.                                                                                                                        |

## Vuelta {#returns}

Devuelve un objeto: `{render, destroy, shader}`

| Propiedad                           | Descripción                                                                                                                                                                                                                                    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| render({ renderTexture, viewport }) | Función que renderiza la textura renderizada en la ventana gráfica especificada. Dependiendo de si se proporciona `toTexture`, la ventana gráfica está en el lienzo que creó `GLctx`, o es relativa a la textura de renderizado proporcionada. |
| destroy                             | Limpia los recursos asociados a este `GlTextureRenderer`.                                                                                                                                                                                      |
| shader                              | Obtiene un manejador del sombreador que se está utilizando para dibujar la textura.                                                                                                                                                            |

La función `render` tiene los siguientes parámetros:

| Parámetro     | Descripción                                                                                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderTexture | Una [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) (fuente) para dibujar.                                                                         |
| viewport      | La región del lienzo o textura de salida sobre la que dibujar; puede construirse manualmente o utilizando [`XR8.GlTextureRenderer.fillTextureViewport()`](filltextureviewport.md). |

La ventana gráfica se especifica en `{ width, height, offsetX, offsetY }` :

| Propiedad          | Tipo     | Descripción                                            |
| ------------------ | -------- | ------------------------------------------------------ |
| width              | `Número` | La anchura (en píxeles) a dibujar.                     |
| height             | `Número` | La altura (en píxeles) a dibujar.                      |
| offsetX [Opcional] | `Número` | La coordenada x mínima (en píxeles) en la que dibujar. |
| offsetY [Opcional] | `Número` | La coordenada y mínima (en píxeles) a la que dibujar.  |
