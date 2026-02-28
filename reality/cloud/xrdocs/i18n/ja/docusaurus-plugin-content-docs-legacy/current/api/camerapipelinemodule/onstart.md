# onStart()

`onStart: ({ canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, config })`)

## 説明 {#description}

onStart()\\`はXRの起動時に呼ばれる。

## パラメータ {#parameters}

| パラメータ      | 説明                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| キャンバス      | GPU処理とユーザー表示を支えるキャンバス。                                                                                                            |
| GLctx      | 描画キャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.                                                    |
| computeCtx | コンピュートキャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.                                                |
| isWebgl2   | GLctx`が`WebGL2RenderingContext\\` であれば真。                                                                                         |
| オリエンテーション  | ポートレートからのUIの回転を度単位で指定する（-90, 0, 90, 180）。                                                                                         |
| ビデオ幅       | カメラフィードの幅（ピクセル単位）。                                                                                                                |
| ビデオハイト     | カメラフィードの高さ（ピクセル単位）。                                                                                                               |
| キャンバス幅     | GLctx\\` キャンバスの幅をピクセル単位で指定する。                                                                                                    |
| キャンバスの高さ   | GLctx\\` キャンバスの高さをピクセル単位で指定する。                                                                                                   |
| コンフィグ      | XR8.run()\\`](/legacy/api/xr8/run) に渡された設定パラメータ。 |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onStart: ({canvasWidth, canvasHeight}) => {
    // three.jsのシーンを取得します。これはXR8.Threejs.pipelineModule().onStart()によって作成されました。
    // 今ここでアクセスできる理由は、'mycamerapipelinemodule'が
    // XR8.Threejs.pipelineModule()の後にインストールされたからです。
    const {scene, camera} = XR8.Threejs.xrScene()

    // いくつかのオブジェクトをシーンに追加し、開始カメラ位置を設定します。
    myInitXrScene({scene, camera})

    // xrコントローラの6DoF位置とカメラパラメータをシーンに同期します。
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
  },
})
```
