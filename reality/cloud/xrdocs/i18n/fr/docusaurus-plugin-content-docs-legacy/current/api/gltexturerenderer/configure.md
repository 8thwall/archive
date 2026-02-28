---
sidebar_label: configure()
---

# XR8.GlTextureRenderer.configure()

`XR8.GlTextureRenderer.configure({ vertexSource, fragmentSource, toTexture, flipY, mirroredDisplay })`

## Description {#description}

Configure le module de pipeline qui dessine le flux de la caméra sur le canevas.

## Paramètres {#parameters}

| Paramètres                                                                       | Type                                                                            | Défaut                              | Description                                                                                                                |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| vertexSource [Facultatif]    | `Chaîne`                                                                        | Un nuanceur de vertex sans option   | Source du nuanceur de vertex à utiliser pour le rendu.                                                     |
| fragmentSource [Facultatif]  | `Chaîne`                                                                        | Un nuanceur de fragment sans option | Source du nuanceur de fragment à utiliser pour le rendu.                                                   |
| toTexture [Facultatif]       | [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La toile                            | Une texture à dessiner. Si aucune texture n'est fournie, le dessin se fera sur le canevas. |
| flipY [Facultatif]           | `Booléen`                                                                       | `false`                             | Si c'est le cas, le rendu est inversé.                                                                     |
| mirroredDisplay [Facultatif] | `Booléen`                                                                       | `false`                             | Si c'est le cas, le rendu est inversé de gauche à droite.                                                  |

## Retourne {#returns}

Aucun

## Exemple {#example}

```javascript
const purpleShader =
  // Pourpre.
  ` precision mediump float ;
    varying vec2 texUv ;
    uniform sampler2D sampler ;
    void main() {
      vec4 c = texture2D(sampler, texUv) ;
      float y = dot(c.rgb, vec3(0.299, 0.587, 0.114)) ;
      vec3 p = vec3(.463, .067, .712) ;
      vec3 p1 = vec3(1.0, 1.0, 1.0) - p ;
      vec3 rgb = y < .25 ? (y * 4.0) * p : ((y - .25) * 1.333) * p1 + p ;
      gl_FragColor = vec4(rgb, c.a) ;
    }`

XR8.GlTextureRenderer.configure({fragmentSource: purpleShader})
```
