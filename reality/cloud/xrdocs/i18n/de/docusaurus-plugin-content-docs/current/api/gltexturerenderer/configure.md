---
sidebar_label: configure()
---

# XR8.GlTextureRenderer.configure()

`XR8.GlTextureRenderer.configure({ vertexSource, fragmentSource, toTexture, flipY, mirroredDisplay })`

## Beschreibung {#description}

Konfiguriert das Pipeline-Modul, das den Kamerafeed auf die Leinwand zeichnet.

## Parameter {#parameters}

| Parameter                  | Typ                                                                            | Standard                  | Beschreibung                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------ | ------------------------- | --------------------------------------------------------------------------------------------- |
| vertexSource [Optional]    | `String`                                                                       | Ein No-Op-Vertex-Shader   | Die Vertex-Shader-Quelle, die für das Rendering verwendet wird.                               |
| fragmentSource [Optional]  | `String`                                                                       | Ein No-Op-Fragment-Shader | Die Fragment-Shader-Quelle, die für das Rendering verwendet wird.                             |
| toTexture [Optional]       | [`WebGlTextur`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Leinwand              | Eine Textur zum Zeichnen. Wenn keine Textur angegeben wird, wird auf die Leinwand gezeichnet. |
| flipY [Optional]           | `Boolesche`                                                                    | `false`                   | Wenn ja, wird die Darstellung auf den Kopf gestellt.                                          |
| mirroredDisplay [Optional] | `Boolesche`                                                                    | `false`                   | Wenn wahr, wird die Darstellung von links nach rechts gespiegelt.                             |

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
const purpleShader =
  // Lila.
  ` precision mediump float;
    varying vec2 texUv;
    uniform sampler2D sampler;
    void main() {
      vec4 c = texture2D(sampler, texUv);
      float y = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      vec3 p = vec3(.463, .067, .712);
      vec3 p1 = vec3(1.0, 1.0, 1.0) - p;
      vec3 rgb = y < .25 ? (y * 4.0) * p : ((y - .25) * 1.333) * p1 + p;
      gl_FragColor = vec4(rgb, c.a);
    }`

XR8.GlTextureRenderer.configure({fragmentSource: purpleShader})
```
