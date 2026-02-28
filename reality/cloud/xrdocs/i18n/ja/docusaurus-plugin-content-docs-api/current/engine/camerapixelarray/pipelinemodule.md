---
sidebar_label: pipelineModule()
---

# XR8.CameraPixelArray.pipelineModule()

`XR8.CameraPixelArray.pipelineModule({ luminance, maxDimension, width, height })`

## 説明 {#description}

カメラのテクスチャをRGBAまたはグレースケールのピクセル値の配列として提供するパイプラインモジュール。
、CPUの画像処理に使用できます。

## パラメータ {#parameters}

| パラメータ                                          | デフォルト            | 説明                                                                             |
| ---------------------------------------------- | ---------------- | ------------------------------------------------------------------------------ |
| luminance [オプション］    | false\\`        | trueの場合、RGBAの代わりにグレースケールを出力する。                                                 |
| maxDimension：[オプション］ |                  | 出力画像の最長辺のピクセルサイズ。 短い方の寸法はカメラ入力のサイズに対してスケーリングされるので、画像は切り取られたり歪んだりすることなくリサイズされる。 |
| width [オプション］        | カメラフィードテクスチャの幅。  | 出力画像の幅。 `maxDimension` が指定されている場合は無視される。                                       |
| height [オプション］       | カメラフィードテクスチャの高さ。 | 出力画像の高さ。 出力画像の幅。 `maxDimension` が指定されている場合は無視される。                              |

## を返す {#returns}

戻り値は、[`onProcessCpu`](/api/engine/camerapipelinemodule/onprocesscpu) および
[`onUpdate`](/api/engine/camerapipelinemodule/onupdate) として利用可能なオブジェクトである：

processGpuResult.camerapixelarray: {rows, cols, rowBytes, pixels}

| プロパティ    | 説明                      |
| -------- | ----------------------- |
| rows     | 出力画像のピクセル単位の高さ。         |
| cols     | 出力画像のピクセル単位の幅。          |
| rowBytes | 出力画像の1行あたりのバイト数。        |
| pixels   | ピクセルデータの `UInt8Array` 。 |
| srcTex   | 返されたピクセルの元画像を含むテクスチャ。   |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule(XR8.CameraPixelArray.pipelineModule({ luminance: true }))
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onProcessCpu: ({ processGpuResult }) => {
    const { camerapixelarray } = processGpuResult
    if (!camerapixelarray || !camerapixelarray.pixels) {
      return
    }
    const { rows, cols, rowBytes, pixels } .= camerapixelarray

    ...
  },
```
