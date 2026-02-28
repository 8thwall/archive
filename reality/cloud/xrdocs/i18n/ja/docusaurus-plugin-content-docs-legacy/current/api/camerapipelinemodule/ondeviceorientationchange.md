# onDeviceOrientationChange()

onDeviceOrientationChange: ({ GLctx, computeCtx, videoWidth, videoHeight, orientation })\\`.

## 説明 {#description}

onDeviceOrientationChange()\\`は、デバイスの縦横の向きが変わったときに呼ばれる。

## パラメータ {#parameters}

| パラメータ      | 説明                                                                                 |
| ---------- | ---------------------------------------------------------------------------------- |
| GLctx      | 描画キャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.     |
| computeCtx | コンピュートキャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`. |
| ビデオ幅       | カメラフィードの幅（ピクセル単位）。                                                                 |
| ビデオハイト     | カメラフィードの高さ（ピクセル単位）。                                                                |
| オリエンテーション  | ポートレートからのUIの回転を度単位で指定する（-90, 0, 90, 180）。                                          |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onDeviceOrientationChange: ({ GLctx, videoWidth, videoHeight, orientation }) => {
    // handleResize({ GLctx, videoWidth, videoHeight, orientation })
  },
})
```
