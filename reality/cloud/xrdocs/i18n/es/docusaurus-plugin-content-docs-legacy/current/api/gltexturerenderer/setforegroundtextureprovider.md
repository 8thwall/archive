---
sidebar_label: setForegroundTextureProvider()
---

# XR8.GlTextureRenderer.setForegroundTextureProvider()

XR8.GlTextureRenderer.setForegroundTextureProvider(({ frameStartResult, processGpuResult, processCpuResult }) => {} )\`

## Descripción {#description}

Establece un proveedor que pasa una lista de texturas de primer plano para dibujar. Debe ser una función que tome las mismas entradas que [`cameraPipelineModule.onUpdate`](/legacy/api/camerapipelinemodule/onupdate).

## Parámetros {#parameters}

`setForegroundTextureProvider()` toma una **función** con los siguientes parámetros:

| Parámetro        | Tipo   | Descripción                                                                                                                               |
| ---------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| frameStartResult | Objeto | Los datos que se proporcionaron al principio de un fotograma.                                                             |
| processGpuResult | Objeto | Datos devueltos por todos los módulos instalados durante [`onProcessGpu`](/legacy/api/camerapipelinemodule/onprocessgpu). |
| processCpuResult | Objeto | Datos devueltos por todos los módulos instalados durante [`onProcessCpu`](/legacy/api/camerapipelinemodule/onprocesscpu). |

La función debe devolver una matriz de objetos que contengan cada uno las siguientes propiedades:

| Propiedad                                                                                 | Tipo                                                                            | Por defecto | Descripción                                                                                                                                                        |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| foregroundTexture                                                                         | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) |             | La textura de primer plano a dibujar.                                                                                                              |
| foregroundMaskTexture                                                                     | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) |             | Una máscara alfa para usar en la textura de primer plano. El canal `r` de la `foregroundMaskTexture` se utiliza en la mezcla alfa. |
| foregroundTextureFlipY [Opcional]     | `false`                                                                         | Booleano    | Si se voltea la `foregroundTexture`.                                                                                                               |
| foregroundMaskTextureFlipY [Opcional] | `false`                                                                         | Booleano    | Si se voltea la `foregroundMaskTexture`.                                                                                                           |

Las texturas de primer plano se dibujarán sobre la textura proporcionada llamando a [`XR8.GlTextureRenderer.setTextureProvider()`](filltextureviewport.md). Las texturas de primer plano se dibujarán en el orden de la matriz devuelta.

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
XR8.GlTextureRenderer.setForegroundTextureProvider(
  ({processGpuResult}) => {
    // Realiza algún proceso...
    return [{
      foregroundTexture,
      foregroundMaskTexture,
      foregroundTextureFlipY,
      foregroundMaskTextureFlipY
    }]
  })
```
