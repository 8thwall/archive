# エックスアール8

## 説明 {#description}

8th WallのJavascript APIのエントリー・ポイント

## 機能 {#functions}

| 機能                                                            | 説明                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [addCameraPipelineModule](addcamerapipelinemodule.md)         | カメラパイプラインの各ステージのイベントコールバックを受け取るモジュールをカメラパイプラインに追加します。                                                                                                                                                                                                                 |
| [addCameraPipelineModules](addcamerapipelinemodules.md)       | 複数のカメラパイプラインモジュールを追加。 複数のカメラパイプラインモジュールを追加。 これは、[addCameraPipelineModule](addcamerapipelinemodule.md) を入力配列の各要素に対して順番に呼び出す便利なメソッドです。 複数のカメラパイプラインモジュールを追加。 これは、[addCameraPipelineModule](addcamerapipelinemodule.md) を入力配列の各要素に対して順番に呼び出す便利なメソッドです。                   |
| [clearCameraPipelineModules](clearcamerapipelinemodules.md)   | カメラループからすべてのカメラパイプラインモジュールを取り外します。                                                                                                                                                                                                                                    |
| [初期化](initialize.md)                                          | ARエンジンのWebAssemblyが初期化されたときに満たされる約束を返します。                                                                                                                                                                                                                             |
| [isInitialized](isinitialized.md)                             | ARエンジンのWebAssemblyが初期化されているかどうかを示します。                                                                                                                                                                                                                                 |
| [isPaused](ispaused.md)                                       | XRセッションが一時停止されているかどうかを示す。                                                                                                                                                                                                                                             |
| [pause](pause.md)                                             | 現在の XR セッションを一時停止する。  現在の XR セッションを一時停止する。  一時停止中、カメラフィードは停止し、デバイスの動きは追跡されません。  現在の XR セッションを一時停止する。  一時停止中、カメラフィードは停止し、デバイスの動きは追跡されません。                                                                                                                              |
| [レジュメ](resume.md)                                             | 現在のXRセッションを再開する。                                                                                                                                                                                                                                                      |
| [removeCameraPipelineModule](removecamerapipelinemodule.md)   | カメラパイプラインからモジュールを削除する。                                                                                                                                                                                                                                                |
| [removeCameraPipelineModules](removecamerapipelinemodules.md) | 複数のカメラパイプラインモジュールを削除する。 複数のカメラパイプラインモジュールを削除する。 これは、[removeCameraPipelineModule](removecamerapipelinemodule.md) を入力配列の各要素に対して順番に呼び出す便利なメソッドです。 複数のカメラパイプラインモジュールを削除する。 これは、[removeCameraPipelineModule](removecamerapipelinemodule.md) を入力配列の各要素に対して順番に呼び出す便利なメソッドです。 |
| [必須パーミッション](requiredpermissions.md)                           | アプリケーションが必要とするパーミッションのリストを返します。                                                                                                                                                                                                                                       |
| [run](run.md)                                                 | カメラを開き、カメラ・ラン・ループの実行を開始する。                                                                                                                                                                                                                                            |
| [runPreRender](runprerender.md)                               | レンダリング前に行われるべきすべてのライフサイクル更新を実行する。                                                                                                                                                                                                                                     |
| [runPostRender](runpostrender.md)                             | レンダリング後に行われるべきすべてのライフサイクル更新を実行する。                                                                                                                                                                                                                                     |
| [ストップ](stop.md)                                               | 現在の XR セッションを停止する。  現在の XR セッションを停止する。  停止中はカメラフィードは閉じられ、デバイスの動きは追跡されません。  現在の XR セッションを停止する。  停止中はカメラフィードは閉じられ、デバイスの動きは追跡されません。                                                                                                                                      |
| [バージョン](version.md)                                           | 第8回ウォールウェブエンジンバージョンを入手。                                                                                                                                                                                                                                               |

## イベント {#events}

| イベント  | 説明                           |
| ----- | ---------------------------- |
| XRロード | このイベントは `XR8` がロードされると発行される。 |

## モジュール {#modules}

| モジュール                                                          | 説明                                                                   |
| -------------------------------------------------------------- | -------------------------------------------------------------------- |
| [AFrame](../aframe/aframe.md)                                  | A-Frameと8th Wall Webとの統合の入り口。                                        |
| [バビロンjs](../babylonjs/babylonjs.md)                            | Babylon.jsと8th Wall Webとの統合のためのエントリー・ポイント。           |
| [カメラピクセル配列](../camerapixelarray/camerapixelarray.md)           | グレースケールまたはカラーの uint8 配列としてカメラデータにアクセスできるカメラパイプラインモジュールを提供します。        |
| [CanvasScreenshot](../canvasscreenshot/canvasscreenshot.md)    | 現在のシーンのスクリーンショットを生成できるカメラパイプラインモジュールを提供する。                           |
| [FaceController](../facecontroller/facecontroller.md)          | 顔検出とメッシュ生成、トラッキング設定用インターフェースを提供。                                     |
| [GlTextureRenderer](../gltexturerenderer/gltexturerenderer.md) | カメラフィードをキャンバスに描画するカメラパイプラインモジュールと、GL描画操作のための追加ユーティリティを提供します。         |
| [ハンドコントローラ](../handcontroller/handcontroller.md)               | 手の検出とメッシュ生成、トラッキング設定用インターフェースを提供。                                    |
| [LayersController](../layerscontroller/layerscontroller.md)    | セマンティックレイヤー検出を可能にするカメラパイプラインモジュールと、レイヤーレンダリングを設定するためのインターフェースを提供します。 |
| [MediaRecorder](../mediarecorder/mediarecorder.md)             | MP4形式でビデオを録画できるカメラパイプラインモジュールを提供します。                                 |
| [プレイキャンバス](../playcanvas/playcanvas.md)                        | PlayCanvasと8th Wall Webの統合のためのエントリーポイントです。                           |
| [スリージェイエス](../threejs/threejs.md)                              | 仮想オーバーレイを行うためにthree.jsカメラを駆動するカメラパイプラインモジュールを提供します。  |
| [Vps](../vps/vps.md)                                           | Vpsサービスに相談するユーティリティ                                                  |
| [XrConfig](../xrconfig/xrconfig.md)                            | パイプラインモジュールが実行されるべきデバイスとカメラのクラスを指定する。                                |
| [XrController](../xrcontroller/xrcontroller.md)                | XrController\\`は6DoFカメラ・トラッキングとトラッキング設定用インターフェースを提供する。              |
| [XrDevice](../xrdevice/xrdevice.md)                            | デバイスの互換性と特性に関する情報を提供します。                                             |
| [XrPermissions](../xrpermissions/xrpermissions.md)             | パイプラインモジュールに必要なパーミッションを指定するユーティリティ。                                  |
