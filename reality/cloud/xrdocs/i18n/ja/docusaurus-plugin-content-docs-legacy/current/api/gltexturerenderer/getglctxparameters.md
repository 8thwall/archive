---
sidebar_label: getGLctxParameters()
---

# XR8.GlTextureRenderer.getGLctxParameters()

`XR8.GlTextureRenderer.getGLctxParameters(GLctx, textureUnit)`.

## 説明 {#description}

WebGLバインディングの現在のセットを取得し、後で復元できるようにする。

## パラメータ {#parameters}

| パラメータ   | タイプ                                                         | 説明                                                                  |
| ------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| GLctx   | WebGlRenderingContext`または`WebGl2RenderingContext\\` を使用する。 | バインディングを取得する `WebGLRenderingContext` または `WebGL2RenderingContext` 。 |
| テクスチャ単位 | `[]`                                                        | 状態を保持するテクスチャ単位。例：`[GLctx.TEXTURE0]`。                                |

## {#returns}を返す。

setGLctxParameters](setglctxparameters.md) に渡す構造体。

## 例 {#example}

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// 必要に応じてコンテキストパラメータを変更する
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// コンテキストパラメータを以前の状態に戻す。
```
