# onProcessGpu()

`onProcessGpu: ({ framework, frameStartResult })`

## 説明 {#description}

`onProcessGpu()`はGPU処理を開始するために呼ばれる。

## パラメータ {#parameters}

| パラメータ            | 説明                                                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| framework        | {dispatchEvent(eventName, detail) } : 与えられた詳細を持つ名前付きイベントを発行します。                     |
| frameStartResult | { cameraTexture, computeTexture, GLctx, computeCtx, textureWidth, textureHeight, orientation, videoTime, repeatFrame } |

`frameStartResult`パラメータは以下のプロパティを持つ：

| プロパティ          | 説明                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| cameraTexture  | カメラフィードデータを含む描画キャンバスの [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)。     |
| computeTexture | カメラフィードデータを含むコンピュートキャンバスの [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)。 |
| GLctx          | 描画キャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.                             |
| computeCtx     | コンピュートキャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.                         |
| textureWidth   | カメラフィードテクスチャの幅（ピクセル単位）。                                                                                    |
| textureHeight  | カメラフィードテクスチャの高さ（ピクセル単位）。                                                                                   |
| orientation    | ポートレートからのUIの回転を度単位で指定する（-90, 0, 90, 180）。                                                                  |
| videoTime      | このビデオフレームのタイムスタンプ。                                                                                         |
| repeatFrame    | カメラのフィードが前回の呼び出し以降更新されていない場合は真。                                                                            |

## {#returns}を返す。

[`onProcessCpu`](onprocesscpu.md)と[`onUpdate`](onupdate.md)に提供したいデータは、
。  これは、`processGpuResult.modulename`としてこれらのメソッドに提供される。

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
