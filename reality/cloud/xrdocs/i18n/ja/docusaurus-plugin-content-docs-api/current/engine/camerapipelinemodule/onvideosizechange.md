# onVideoSizeChange()

`onVideoSizeChange: ({ GLctx, computeCtx, videoWidth, videoHeight, canvasWidth, canvasHeight, orientation })`

## 説明 {#description}

`onVideoSizeChange()`は、キャンバスのサイズが変更されたときに呼び出されます。 ビデオとキャンバスの寸法、およびデバイスの向きで呼び出されます。

## パラメータ {#parameters}

| パラメータ        | 説明                                                                                 |
| ------------ | ---------------------------------------------------------------------------------- |
| GLctx        | 描画キャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.     |
| computeCtx   | コンピュートキャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`. |
| videoWidth   | カメラフィードの幅（ピクセル単位）。                                                                 |
| videoHeight  | カメラフィードの高さ（ピクセル単位）。                                                                |
| canvasWidth  | `GLctx` キャンバスの幅をピクセル単位で指定する。                                                       |
| canvasHeight | `GLctx` キャンバスの高さをピクセル単位で指定する。                                                      |
| orientation  | ポートレートからのUIの回転を度単位で指定する（-90, 0, 90, 180）。                                          |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onVideoSizeChange: ({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight }) => {
    myHandleResize({ GLctx, videoWidth, videoHeight, canvasWidth, canvasHeight })
  },
})
```
