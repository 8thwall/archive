---
sidebar_label: configure()
---

# XR8.GlTextureRenderer.configure()

`XR8.GlTextureRenderer.configure({ vertexSource, fragmentSource, toTexture, flipY, mirroredDisplay })`

## Descripción {#description}

Configura el módulo de canalización que dibuja la imagen de la cámara en el lienzo.

## Parámetros {#parameters}

| Parámetro                  | Tipo                                                                            | Por defecto                            | Descripción                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| vertexSource [Opcional]    | `Cadena`                                                                        | Un sombreador de vértices no operativo | La fuente del sombreador de vértices que se utilizará para el renderizado.                      |
| fragmentSource [Opcional]  | `Cadena`                                                                        | Un sombreador de fragmentos no-op      | La fuente del sombreador de fragmentos que se utilizará para el renderizado.                    |
| toTexture [Opcional]       | [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | El lienzo                              | Una textura para dibujar. Si no se proporciona ninguna textura, el dibujo se hará en el lienzo. |
| flipY [Opcional]           | `Booleano`                                                                      | `false`                                | Si es verdadero, da la vuelta a la representación.                                              |
| mirroredDisplay [Opcional] | `Booleano`                                                                      | `false`                                | Si es verdadero, voltea la representación de izquierda a derecha.                               |

## Vuelta {#returns}

Ninguno

## Ejemplo {#example}

```javascript
const purpleShader =
 // Púrpura.
  ` precision mediump float;
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() {
      vec4 c = texture2D(sampler, texUv);
      float y = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      vec3 p = vec3(.463, .067, .712);
      vec3 p1 = vec3(1.0, 1.000, 1.0) - p;
      vec3 rgb = y < .25 ? (y * 4.00) * p : ((y - .25) * 1.333) * p1 + p;
      gl_FragColor = vec4(rgb, c.a);
    }`

XR8.GlTextureRenderer.configure({fragmentSource: purpleShader})
```
