---
sidebar_label: setForegroundTextureProvider()
---

# XR8.GlTextureRenderer.setForegroundTextureProvider()

`XR8.GlTextureRenderer.setForegroundTextureProvider(({ frameStartResult, processGpuResult, processCpuResult }) => {} )`.

## 説明 {#description}

描画する前景テクスチャのリストを渡すプロバイダを設定します。 描画する前景テクスチャのリストを渡すプロバイダを設定します。 これは、[`cameraPipelineModule.onUpdate`](/legacy/api/camerapipelinemodule/onupdate) と同じ入力を受け取る関数でなければなりません。

## パラメータ {#parameters}

setForegroundTextureProvider()\\`は、以下のパラメータを持つ **function** を受け取ります：

| パラメータ            | タイプ    | 説明                                                                                                                                              |
| ---------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| フレーム開始結果         | オブジェクト | フレームの最初に提供されたデータ。                                                                                                                               |
| processGpuResult | オブジェクト | onProcessGpu\\`](/legacy/api/camerapipelinemodule/onprocessgpu) 中に、インストールされているすべてのモジュールから返されるデータ。 |
| processCpuResult | オブジェクト | onProcessCpu\\`](/legacy/api/camerapipelinemodule/onprocesscpu) 中に、インストールされているすべてのモジュールから返されるデータ。 |

この関数は、それぞれが以下のプロパティを含むオブジェクトの配列を返す必要があります：

| プロパティ                                                                                   | タイプ                                                                               | デフォルト | 説明                                                                                                                                                                                                                            |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 前景テクスチャ                                                                                 | [WebGLTexture\\`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) |       | 描画する前景テクスチャ。                                                                                                                                                                                                                  |
| フォアグラウンド・マスク・テクスチャ                                                                      | [WebGLTexture\\`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) |       | foregroundTexture に使用するアルファマスク。 foregroundMaskTexture`の`r\`チャンネルがアルファブレンディングに使用される。 foregroundTexture に使用するアルファマスク。 foregroundMaskTexture`の`r\`チャンネルがアルファブレンディングに使用される。 foregroundMaskTexture`の`r\`チャンネルがアルファブレンディングに使用される。 |
| foregroundTextureFlipY [オプション]。     | false\\`                                                                         | ブーリアン | foregroundTexture\\`を反転させるかどうか。                                                                                                                                                                                              |
| foregroundMaskTextureFlipY [オプション]。 | false\\`                                                                         | ブーリアン | foregroundMaskTexture\\`を反転させるかどうか。                                                                                                                                                                                          |

前景テクスチャは、[`XR8.GlTextureRenderer.setTextureProvider()`](filltextureviewport.md)を呼び出して提供されたテクスチャの上に描画されます。 前景テクスチャは、返された配列の順序で描画されます。 前景テクスチャは、返された配列の順序で描画されます。

## {#returns}を返す。

なし

## 例 {#example}

```javascript
XR8.GlTextureRenderer.setForegroundTextureProvider(
  ({processGpuResult}) => {
    // いくつかの処理を行う...
    return [{
      foregroundTexture,
      foregroundMaskTexture,
      foregroundTextureFlipY,
      foregroundMaskTextureFlipY
    }].
  })
```
