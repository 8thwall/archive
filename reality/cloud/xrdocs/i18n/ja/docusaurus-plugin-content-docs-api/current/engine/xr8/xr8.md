# エックスアール8

## 説明 {#description}

8th WallのJavascript APIのエントリー・ポイント

## 機能 {#functions}

| 機能                                                            | 説明                                                                                                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [addCameraPipelineModule](addcamerapipelinemodule.md)         | カメラパイプラインの各ステージのイベントコールバックを受け取るモジュールをカメラパイプラインに追加します。                                                                                |
| [addCameraPipelineModules](addcamerapipelinemodules.md)       | 複数のカメラパイプラインモジュールを追加。 複数のカメラパイプラインモジュールを追加。 これは、[addCameraPipelineModule](addcamerapipelinemodule.md) を入力配列の各要素に対して順番に呼び出す便利なメソッドです。 |
| [clearCameraPipelineModules](clearcamerapipelinemodules.md)   | カメラループからすべてのカメラパイプラインモジュールを取り外します。                                                                                                   |
| [初期化](initialize.md)                                          | ARエンジンのWebAssemblyが初期化されたときに満たされる約束を返します。                                                                                            |
| [isInitialized](isinitialized.md)                             | ARエンジンのWebAssemblyが初期化されているかどうかを示します。                                                                                                |
| [isPaused](ispaused.md)                                       | XRセッションが一時停止されているかどうかを示す。                                                                                                            |
| [pause](pause.md)                                             | 現在の XR セッションを一時停止する。  一時停止中、カメラフィードは停止し、デバイスの動きは追跡されません。                                                                             |
| [resume](resume.md)                                           | 現在のXRセッションを再開する。                                                                                                                     |
| [removeCameraPipelineModule](removecamerapipelinemodule.md)   | カメラパイプラインからモジュールを削除する。                                                                                                               |
| [removeCameraPipelineModules](removecamerapipelinemodules.md) | 複数のカメラパイプラインモジュールを削除する。 これは、[removeCameraPipelineModule](removecamerapipelinemodule.md) を入力配列の各要素に対して順番に呼び出す便利なメソッドです。               |
| [必須パーミッション](requiredpermissions.md)                           | アプリケーションが必要とするパーミッションのリストを返します。                                                                                                      |
| 走る                                                            | カメラを開き、カメラ・ラン・ループの実行を開始する。                                                                                                           |
| [runPreRender](runprerender.md)                               | レンダリング前に行われるべきすべてのライフサイクル更新を実行する。                                                                                                    |
| [runPostRender](runpostrender.md)                             | レンダリング後に行われるべきすべてのライフサイクル更新を実行する。                                                                                                    |
| [stop](stop.md)                                               | 現在の XR セッションを停止する。  停止中はカメラフィードは閉じられ、デバイスの動きは追跡されません。                                                                                |
| [version](version.md)                                         | 第8回ウォールウェブエンジンバージョンを入手。                                                                                                              |

## イベント {#events}

| イベント     | 説明                           |
| -------- | ---------------------------- |
| xrloaded | このイベントは `XR8` がロードされると発行される。 |

<!-- ## Modules {#modules}

Module | Description
-------- | -----------
[CameraPixelArray](../camerapixelarray/camerapixelarray.md) | Provides a camera pipeline module that gives access to camera data as a grayscale or color uint8 array.
[CanvasScreenshot](../canvasscreenshot/canvasscreenshot.md) | Provides a camera pipeline module that can generate screenshots of the current scene.
[Vps](../vps/vps.md) | Utilities to talk to Vps services.
[XrDevice](../xrdevice/xrdevice.md) | Provides information about device compatibility and characteristics.
[XrPermissions](../xrpermissions/xrpermissions.md) | Utilities for specifying permissions required by a pipeline module. -->
