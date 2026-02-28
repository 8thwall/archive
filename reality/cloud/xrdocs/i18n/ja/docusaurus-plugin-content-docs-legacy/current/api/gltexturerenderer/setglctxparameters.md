---
sidebar_label: setGLctxParameters()
---

# XR8.GlTextureRenderer.setGLctxParameters()

`XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)`.

## 説明 {#description}

XR8.GlTextureRenderer.getGLctxParameters()\\`](getglctxparameters.md)で保存したWebGLバインディングを復元します。

## パラメータ {#parameters}

| パラメータ   | タイプ                                                                                                                                                                                         | 説明                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| GLctx   | WebGlRenderingContext`または`WebGl2RenderingContext\\` を使用する。                                                                                                                                 | バインディングを復元する `WebGLRenderingContext` または `WebGL2RenderingContext` 。 |
| リストアパラム | XR8.GlTextureRenderer.getGLctxParameters()\\`](getglctxparameters.md) の出力。 |                                                                     |

## {#returns}を返す。

なし

## 例 {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// 必要に応じてコンテキストパラメータを変更する
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// コンテキストパラメータを以前の状態に戻す。
```
