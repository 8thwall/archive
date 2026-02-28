# onProcessGpu()

onProcessGpu: ({ framework, frameStartResult })\\`.

## 説明 {#description}

onProcessGpu()\\`はGPU処理を開始するために呼ばれる。

## パラメータ {#parameters}

| パラメータ    | 説明                                                                                                                                      |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| フレームワーク  | {dispatchEvent(eventName, detail) } : 与えられた詳細を持つ名前付きイベントを発行します。                                      |
| フレーム開始結果 | { cameraTexture, computeTexture, GLctx, computeCtx, textureWidth, textureHeight, orientation, videoTime, repeatFrame }. |

frameStartResult\\`パラメータは以下のプロパティを持つ：

| プロパティ      | 説明                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| カメラテクスチャ   | カメラフィードデータを含む描画キャンバスの [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)。     |
| 計算テクスチャ    | カメラフィードデータを含むコンピュートキャンバスの [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)。 |
| GLctx      | 描画キャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.                             |
| computeCtx | コンピュートキャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.                         |
| テクスチャ幅     | カメラフィードテクスチャの幅（ピクセル単位）。                                                                                    |
| テクスチャの高さ   | カメラフィードテクスチャの高さ（ピクセル単位）。                                                                                   |
| オリエンテーション  | ポートレートからのUIの回転を度単位で指定する（-90, 0, 90, 180）。                                                                  |
| ビデオタイム     | このビデオフレームのタイムスタンプ。                                                                                         |
| リピートフレーム   | カメラのフィードが前回の呼び出し以降更新されていない場合は真。                                                                            |

## {#returns}を返す。

onProcessCpu`](onprocesscpu.md)と[`onUpdate`](onupdate.md)に提供したいデータは、
。  これは、`processGpuResult.modulename\`としてこれらのメソッドに提供される。  onProcessCpu`](onprocesscpu.md)と[`onUpdate`](onupdate.md)に提供したいデータは、
。  これは、`processGpuResult.modulename\`としてこれらのメソッドに提供される。  これは、`processGpuResult.modulename\`としてこれらのメソッドに提供される。

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onProcessGpu: ({frameStartResult}) => {
    const {cameraTexture, GLctx, textureWidth, textureHeight} = frameStartResult

    if(!cameraTexture.name){
      console.error("[index] Camera texture does not have a name")
    }

    const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
    // ここで関連するGPU処理を行う
    ...
    XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)

    // これらのフィールドはonProcessCpuとonUpdateに提供されます
    return {gpuDataA, gpuDataB}
  },
})
```
