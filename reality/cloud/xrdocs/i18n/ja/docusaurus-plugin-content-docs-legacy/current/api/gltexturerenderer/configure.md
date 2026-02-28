---
sidebar_label: configure()
---

# XR8.GlTextureRenderer.configure()

`XR8.GlTextureRenderer.configure({ vertexSource, fragmentSource, toTexture, flipY, mirroredDisplay })`.

## 説明 {#description}

カメラフィードをキャンバスに描画するパイプラインモジュールを設定します。

## パラメータ {#parameters}

| パラメータ                                            | タイプ                                                                               | デフォルト             | 説明                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------- |
| vertexSource [オプション］   | 文字列                                                                               | ノーオペ・バーテックス・シェーダー | レンダリングに使用する頂点シェーダーのソース。                             |
| fragmentSource [オプション］ | 文字列                                                                               | ノーオペ・フラグメント・シェーダー | レンダリングに使用するフラグメントシェーダーのソース。                         |
| toTexture [オプション］      | [WebGlTexture\\`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | キャンバス             | ドローイングの質感。 ドローイングの質感。 テクスチャが提供されない場合、描画はキャンバスに行われる。 |
| flipY [オプション］          | ブーリアン                                                                             | false\\`         | trueの場合、レンダリングを上下反転させる。                             |
| mirroredDisplay［オプション］                           | ブーリアン                                                                             | false\\`         | trueの場合、レンダリングを左右反転する。                              |

## {#returns}を返す。

なし

## 例 {#example}

```javascript
const purpleShader =
  // 紫。
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
