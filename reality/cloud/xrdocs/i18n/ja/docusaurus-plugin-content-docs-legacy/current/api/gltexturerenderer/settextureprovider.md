---
sidebar_label: setTextureProvider()
---

# XR8.GlTextureRenderer.setTextureProvider()

`XR8.GlTextureRenderer.setTextureProvider(({ frameStartResult, processGpuResult, processCpuResult }) => {} )`.

## 説明 {#description}

描画するテクスチャを渡すプロバイダを設定します。 描画するテクスチャを渡すプロバイダを設定します。 これは、[`cameraPipelineModule.onUpdate`](/legacy/api/camerapipelinemodule/onupdate) と同じ入力を受け取る関数でなければなりません。

## パラメータ {#parameters}

setTextureProvider()\\`は以下のパラメータを持つ **function** を取ります：

| パラメータ            | タイプ    | 説明                                                                                                                                              |
| ---------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| フレーム開始結果         | オブジェクト | フレームの最初に提供されたデータ。                                                                                                                               |
| processGpuResult | オブジェクト | onProcessGpu\\`](/legacy/api/camerapipelinemodule/onprocessgpu) 中に、インストールされているすべてのモジュールから返されるデータ。 |
| processCpuResult | オブジェクト | onProcessCpu\\`](/legacy/api/camerapipelinemodule/onprocesscpu) 中に、インストールされているすべてのモジュールから返されるデータ。 |

この関数は描画するための[`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)を返す必要があります。

## {#returns}を返す。

なし

## 例 {#example}

```javascript
XR8.GlTextureRenderer.setTextureProvider(
  ({processGpuResult}) => {
    return processGpuResult.camerapixelarray ? processGpuResult.camerapixelarray.srcTex : null
})
```
