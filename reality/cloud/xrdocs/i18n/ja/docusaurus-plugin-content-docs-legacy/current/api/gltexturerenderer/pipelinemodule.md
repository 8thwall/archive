---
sidebar_label: pipelineModule()
---

# XR8.GlTextureRenderer.pipelineModule()

XR8.GlTextureRenderer.pipelineModule({ vertexSource, fragmentSource, toTexture, flipY })\\`.

## 説明 {#description}

カメラフィードをキャンバスに描画するパイプラインモジュールを作成します。

## パラメータ {#parameters}

| パラメータ                                            | タイプ                                                                               | デフォルト             | 説明                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------- |
| vertexSource [オプション］   | 文字列                                                                               | ノーオペ・バーテックス・シェーダー | レンダリングに使用する頂点シェーダーのソース。                             |
| fragmentSource [オプション］ | 文字列                                                                               | ノーオペ・フラグメント・シェーダー | レンダリングに使用するフラグメントシェーダーのソース。                         |
| toTexture [オプション］      | [WebGlTexture\\`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | キャンバス             | ドローイングの質感。 ドローイングの質感。 テクスチャが提供されない場合、描画はキャンバスに行われる。 |
| flipY [オプション］          | ブーリアン                                                                             | false\\`         | trueの場合、レンダリングを上下反転させる。                             |

## {#returns}を返す。

戻り値は、
[`onProcessCpu`](/legacy/api/camerapipelinemodule/onprocesscpu) および
[`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) で利用可能なオブジェクト `{viewport, shader}` である：

processGpuResult.gltexturerenderer\\`は以下のプロパティを持つ：

| プロパティ  | タイプ                      | 説明                                                                                                             |
| ------ | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| ビューポート | 幅、高さ、オフセットX、オフセットY}\\`。 | 描画するキャンバスまたは出力テクスチャの領域。手動で作成するか、[`XR8.GlTextureRenderer.fillTextureViewport()`](filltextureviewport.md)を使用します。 |
| シェーダー  |                          | テクスチャの描画に使用されるシェーダへのハンドル。                                                                                      |

processGpuResult.gltexturerenderer.viewport：幅、高さ、オフセットX、オフセットY }\\`。

| プロパティ     | タイプ | 説明                   |
| --------- | --- | -------------------- |
| 幅         | 番号  | 描画する幅（ピクセル単位）。       |
| 高さ        | 番号  | 描画する高さ（ピクセル単位）。      |
| オフセットエックス | 番号  | 描画するx座標の最小値（ピクセル単位）。 |
| オフセットY    | 番号  | 描画するy座標の最小値（ピクセル単位）。 |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onProcessCpu: ({ processGpuResult }) => {
    const {viewport, shader} = processGpuResult.gltexturerenderer
    if (!viewport) {
      return
    }
    const { width, height, offsetX, offsetY } .= viewport

    // ...
  },
```
