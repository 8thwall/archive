# onAttach()

onAttach: ({framework, canvas, GLctx, computeCtx, isWebgl2, orientation, videoWidth, videoHeight, canvasWidth, canvasHeight, status, stream, video, version, imageTargets, config})\\`。

## 説明 {#description}

onAttach()\\`は、モジュールが最初にフレーム更新を受け取る前に呼ばれる。 パイプラインの実行前または実行後に追加されたモジュールに対して呼び出される。 最新のデータも含まれている： パイプラインの実行前または実行後に追加されたモジュールに対して呼び出される。 最新のデータも含まれている：

- [`onStart()`](./onstart.md)
- [`onDeviceOrientationChange()`](./ondeviceorientationchange.md)
- [`onCanvasSizeChange()`](./oncanvassizechange.md)
- [`onVideoSizeChange()`](./onvideosizechange.md)
- [`onCameraStatusChange()`](./oncamerastatuschange.md)
- [`onAppResourcesLoaded()`](./onappresourcesloaded.md)

## パラメータ {#parameters}

| パラメータ                                          | 説明                                                                                                                                |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| フレームワーク                                        | イベントをディスパッチするための、このモジュールのフレームワークバインディング。                                                                                          |
| キャンバス                                          | GPU処理とユーザー表示を支えるキャンバス。                                                                                                            |
| GLctx                                          | 描画キャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.                                                    |
| computeCtx                                     | コンピュートキャンバスの `WebGLRenderingContext` または `WebGL2RenderingContext`.                                                |
| isWebgl2                                       | GLctx`が`WebGL2RenderingContext\\` であれば真。                                                                                         |
| オリエンテーション                                      | ポートレートからのUIの回転を度単位で指定する（-90, 0, 90, 180）。                                                                                         |
| ビデオ幅                                           | カメラフィードの幅（ピクセル単位）。                                                                                                                |
| ビデオハイト                                         | カメラフィードの高さ（ピクセル単位）。                                                                                                               |
| キャンバス幅                                         | GLctx\\` キャンバスの幅をピクセル単位で指定する。                                                                                                    |
| キャンバスの高さ                                       | GLctx\\` キャンバスの高さをピクセル単位で指定する。                                                                                                   |
| ステータス                                          | `'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ] のいずれかである。                                     |
| ストリーム                                          | カメラフィードに関連付けられた [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) 。                                   |
| ビデオ                                            | ストリームを表示する video dom 要素。                                                                                                          |
| バージョン [オプション］        | アプリのリソースがロードされている場合は、エンジンのバージョン（例：14.0.8.949）。                                    |
| imageTargets [オプション］ | フィールド `{imagePath, metadata, name}` を持つイメージターゲットの配列。                                                                              |
| コンフィグ                                          | XR8.run()\\`](/legacy/api/xr8/run) に渡された設定パラメータ。 |
