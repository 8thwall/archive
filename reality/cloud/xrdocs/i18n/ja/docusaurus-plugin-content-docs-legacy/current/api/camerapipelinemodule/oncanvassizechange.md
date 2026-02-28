# onCanvasSizeChange()

onCanvasSizeChange：（{ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight }）\\`。

## 説明 {#description}

onCanvasSizeChange()\\`はキャンバスのサイズが変わったときに呼ばれる。 ビデオとキャンバスの寸法で呼び出される。 ビデオとキャンバスの寸法で呼び出される。

## パラメータ {#parameters}

| パラメータ      | 説明                                                                                 |
| ---------- | ---------------------------------------------------------------------------------- |
| GLctx      | 描画キャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.     |
| computeCtx | コンピュートキャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`. |
| ビデオ幅       | カメラフィードの幅（ピクセル単位）。                                                                 |
| ビデオハイト     | カメラフィードの高さ（ピクセル単位）。                                                                |
| キャンバス幅     | GLctx\\` キャンバスの幅をピクセル単位で指定する。                                                     |
| キャンバスの高さ   | GLctx\\` キャンバスの高さをピクセル単位で指定する。                                                    |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onCanvasSizeChange: ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
