---
sidebar_label: pipelineModule()
---

# XR8.GlTextureRenderer.pipelineModule()

XR8.GlTextureRenderer.pipelineModule({ vertexSource, fragmentSource, toTexture, flipY })\`

## Descripción {#description}

Crea un módulo de canalización que dibuja la imagen de la cámara en el lienzo.

## Parámetros {#parameters}

| Parámetro                                                                     | Tipo                                                                            | Por defecto                            | Descripción                                                                                                                     |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| vertexSource [Opcional]   | Cadena                                                                          | Un sombreador de vértices no operativo | La fuente del sombreador de vértices que se utilizará para el renderizado.                                      |
| fragmentSource [Opcional] | Cadena                                                                          | Un sombreador de fragmentos no-op      | La fuente del fragment shader a utilizar para el renderizado.                                                   |
| toTexture [Opcional]      | [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | El lienzo                              | Una textura para dibujar. Si no se proporciona ninguna textura, el dibujo se hará en el lienzo. |
| flipY [Opcional]          | Booleano                                                                        | `false`                                | Si es verdadero, invierte la representación.                                                                    |

## Devuelve {#returns}

El valor de retorno es un objeto `{viewport, shader}` puesto a disposición de
[`onProcessCpu`](/legacy/api/camerapipelinemodule/onprocesscpu) y
[`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) como:

`processGpuResult.gltexturerenderer` con las siguientes propiedades:

| Propiedad  | Tipo                                  | Descripción                                                                                                                                                                                     |
| ---------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ventana    | \`{ancho, alto, offsetX, offsetY}\`\` | La región del lienzo o textura de salida para dibujar; esto puede ser construido manualmente, o usando [`XR8.GlTextureRenderer.fillTextureViewport()`](filltextureviewport.md). |
| sombreador |                                       | Un manejador del sombreador que se utiliza para dibujar la textura.                                                                                                             |

processGpuResult.gltexturerenderer.viewport: `{ width, height, offsetX, offsetY }`

| Propiedad | Tipo     | Descripción                                                                       |
| --------- | -------- | --------------------------------------------------------------------------------- |
| anchura   | `Número` | El ancho (en píxeles) a dibujar.               |
| altura    | `Número` | La altura (en píxeles) a dibujar.              |
| offsetX   | `Número` | La coordenada x mínima (en píxeles) a dibujar. |
| offsetY   | `Número` | La coordenada y mínima (en píxeles) a dibujar. |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onProcessCpu: ({ processGpuResult }) => {
    const {viewport, shader} = processGpuResult.gltexturerenderer
    if (!viewport) {
      return
    }
    const { width, height, offsetX, offsetY } = viewport

    // ...
  },
```
