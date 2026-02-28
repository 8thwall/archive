# onAttach()

`onAttach: ({framework, canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, status, stream, video, version, imageTargets, config})`

## 説明 {#description}

`onAttach()`は、モジュールが最初にフレーム更新を受け取る前に呼ばれる。 パイプラインの実行前または実行後に追加されたモジュールに対して呼び出される。 最新のデータも含まれている：

- [`onStart()`](./onstart.md)
- [`onDeviceOrientationChange()`](./ondeviceorientationchange.md)
- [`onCanvasSizeChange()`](./oncanvassizechange.md)
- [`onVideoSizeChange()`](./onvideosizechange.md)
- [`onCameraStatusChange()`](./oncamerastatuschange.md)
- [`onAppResourcesLoaded()`](./onappresourcesloaded.md)

## パラメータ {#parameters}

| パラメータ                                                               | 説明                                                                                                                       |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| framework                                                           | イベントをディスパッチするための、このモジュールのフレームワークバインディング。                                                                                 |
| canvas                                                              | GPU処理とユーザー表示を支えるキャンバス。                                                                                                   |
| GLctx                                                               | 描画キャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.                                           |
| computeCtx                                                          | コンピュートキャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.                                       |
| isWebgl2                                                            | `GLctx`が`WebGL2RenderingContext` であれば真。                                                                                  |
| orientation                                                         | ポートレートからのUIの回転を度単位で指定する（-90, 0, 90, 180）。                                                                                |
| videoWidth                                                          | カメラフィードの幅（ピクセル単位）。                                                                                                       |
| videoHeight                                                         | カメラフィードの高さ（ピクセル単位）。                                                                                                      |
| canvasWidth                                                         | `GLctx` キャンバスの幅をピクセル単位で指定する。                                                                                             |
| canvasHeight                                                        | `GLctx` キャンバスの高さをピクセル単位で指定する。                                                                                            |
| status                                                              | [`'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ] のいずれかである。 |
| stream                                                              | カメラフィードに関連付けられた [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) 。                          |
| video                                                               | ストリームを表示する video dom 要素。                                                                                                 |
| version [オプション] | アプリのリソースがロードされている場合は、エンジンのバージョン（例：14.0.8.949）。                           |
| imageTargets [オプション］                      | フィールド `{imagePath, metadata, name}` を持つイメージターゲットの配列。                                                                     |
| config                                                              | [`XR8.run()`](/api/engine/xr8) に渡された設定パラメータ。                                                                             |
