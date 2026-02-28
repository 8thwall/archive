---
sidebar_label: addCameraPipelineModule()
---

# XR8.addCameraPipelineModule()

`XR8.addCameraPipelineModule(module)`

## 説明 {#description}

8th Wallカメラ・アプリケーションは、カメラ・パイプライン・モジュール・フレームワークを使用して構築される。 カメラ・パイプライン・モジュールの詳細については、[CameraPipelineModule](/api/engine/camerapipelinemodule) を参照してください。

アプリケーションは、実行時にアプリケーションの動作を制御するモジュールをインストールする。 モジュール・オブジェクトはアプリケーション内で一意である\*\*.name\*\*文字列を持ち、実行ループの適切な時点で実行される1つ以上のカメラ・ライフサイクル・メソッドを提供する必要があります。

アプリケーションのメイン・ランタイム中、各カメラ・フレームは以下のサイクルを経る：

`onBeforeRun` -> `onCameraStatusChange` (`requesting` -> `hasStream` -> `hasVideo` | `failed`) -> `onStart` -> `onAttach` -> `onProcessGpu` -> `onProcessCpu` -> `onUpdate` -> `onRender`

カメラモジュールは、以下のカメラライフサイクルメソッドを1つ以上実装する必要があります：

| 機能                                                                                      | 説明                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [onAppResourcesLoaded](/api/engine/camerapipelinemodule/onappresourcesloaded)           | サーバーからアプリに添付されたリソースを受け取ったときに呼び出される。                                                                                                                                                                                                                                                         |
| [onAttach](/api/engine/camerapipelinemodule/onattach)                                   | モジュールが初めてフレームの更新を受け取る前に呼び出される。 パイプラインの実行前または実行後に追加されたモジュールに対して呼び出される。                                                                                                                                                                                                                       |
| [onBeforeRun](/api/engine/camerapipelinemodule/onbeforerun)                             | `XR8.run()` の直後に呼び出される。 何らかの約束が返された場合、XRはすべての約束を待ってから続行する。                                                                                                                                                                                                                                  |
| [onCameraStatusChange](/api/engine/camerapipelinemodule/oncamerastatuschange)           | カメラのアクセス許可要求中に変更が発生した場合に呼び出されます。                                                                                                                                                                                                                                                            |
| [onCanvasSizeChange](/api/engine/camerapipelinemodule/oncanvassizechange)               | キャンバスのサイズが変更されたときに呼び出される。                                                                                                                                                                                                                                                                   |
| [onDetach](/api/engine/camerapipelinemodule/ondetach)                                   | は、モジュールがフレームの更新を最後に受信した後に呼び出される。 これは、エンジンが停止した後か、モジュールがパイプラインから手動で取り外された後のどちらか早い方である。                                                                                                                                                                                                       |
| [onDeviceOrientationChange](/api/engine/camerapipelinemodule/ondeviceorientationchange) | デバイスが横向き/縦向きに変わったときに呼び出される。                                                                                                                                                                                                                                                                 |
| [onException](/api/engine/camerapipelinemodule/onexception)                             | XRでエラーが発生したときに呼び出される。 エラーオブジェクトと共に呼び出される。                                                                                                                                                                                                                                                   |
| [onPaused](/api/engine/camerapipelinemodule/onpaused)                                   | [`XR8.pause()`](pause.md) が呼ばれたときに呼び出される。                                                                                                                                                                                                                                                   |
| [onProcessCpu](/api/engine/camerapipelinemodule/onprocesscpu)                           | GPU処理の結果を読み取り、使用可能なデータを返すために呼び出される。                                                                                                                                                                                                                                                         |
| [onProcessGpu](/api/engine/camerapipelinemodule/onprocessgpu)                           | GPU処理を開始するために呼び出される。                                                                                                                                                                                                                                                                        |
| [onRemove](/api/engine/camerapipelinemodule/onremove)                                   | は、モジュールがパイプラインから削除されたときに呼び出される。                                                                                                                                                                                                                                                             |
| [onRender](/api/engine/camerapipelinemodule/onrender)                                   | onUpdateの後に呼び出される。 これはレンダリングエンジンがWebGLの描画コマンドを発行する時間です。 アプリケーションが独自のランループを提供し、[`XR8.runPreRender()`](runprerender.md)と[`XR8.runPostRender()`](runpostrender.md)に依存している場合、このメソッドは呼び出されず、すべてのレンダリングは外部のランループによって調整されなければなりません。                                                                |
| [onResume](/api/engine/camerapipelinemodule/onresume)                                   | XR8.resume()\\`](resume.md) が呼ばれたときに呼び出される。                                                                                                                                                |
| [onStart](/api/engine/camerapipelinemodule/onstart)                                     | XRの開始時に呼び出される。 `XR8.run()`が呼ばれた後の最初のコールバック。                                                                                                                                                                                                                                                 |
| [onUpdate](/api/engine/camerapipelinemodule/onupdate)                                   | レンダリング前にシーンを更新するために呼び出される。 レンダリング前にシーンを更新するために呼び出される。 [`onProcessGpu`](/api/engine/camerapipelinemodule/onprocessgpu)と[`onProcessCpu`](/api/engine/camerapipelinemodule/onprocesscpu)のモジュールによって返されるデータは、processGpu.modulenameとprocessCpu.modulenameとして存在する。 |
| [onVideoSizeChange](/api/engine/camerapipelinemodule/onvideosizechange)                 | キャンバスのサイズが変更されたときに呼び出される。                                                                                                                                                                                                                                                                   |
| [必須パーミッション](/api/engine/camerapipelinemodule/requiredpermissions)                       | モジュールは、許可要求が必要なブラウザの機能を示すことができます。 これらは、もし適切なパーミッションがない場合、フレームワークが要求するために使用されるか、XRを実行する前に適切なパーミッションを要求するコンポーネントを作成するために使用される。                                                                                                                                                                |

注：[`onProcessGpu`](/api/engine/camerapipelinemodule/onprocessgpu)または[`onProcessCpu`](/api/engine/camerapipelinemodule/onprocesscpu)を実装したカメラモジュールは、パイプラインの後続ステージにデータを提供することができます。 これはモジュール名によって行われる。

## パラメータ {#parameters}

| パラメータ | タイプ    | 説明            |
| ----- | ------ | ------------- |
| モジュール | オブジェクト | モジュール・オブジェクト。 |

## を返す {#returns}

なし

## 例1 - カメラのアクセス許可を管理するためのカメラパイプラインモジュール： {#example-1---a-camera-pipeline-module-for-managing-camera-permissions}

```javascript
XR8.addCameraPipelineModule({
  name: 'camerastartupmodule',
  onCameraStatusChange: ({status}) {
    if (status == 'requesting') {
      myApplication.showCameraPermissionsPrompt()
    } else if (status == 'hasStream') {
      myApplication.dismissCameraPermissionsPrompt()
    } else if (status == 'hasVideo') {
      myApplication.startMainApplictation()
    } else if (status == 'failed') {
      myApplication.promptUserToChangeBrowserSettings()
    }.
  },
})
```

## 例2 - QRコードスキャンアプリケーションは次のように構築できる {#example-2---a-qr-code-scanning-application-could-be-built-like-this}

```javascript
// カメラフィードを UInt8Array として取得するモジュールをインストールします。
XR8.addCameraPipelineModule(
  XR8.CameraPixelArray.pipelineModule({luminance: true, width: 240, height: 320}))

// カメラフィードをキャンバスに描画するモジュールをインストールします。
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// QRコードをスキャンして表示するためのカスタムアプリケーションロジックを作成します。
XR8.addCameraPipelineModule({
  name: 'qrscan',
  onProcessCpu: ({processGpuResult}) => {
    // CameraPixelArray.pipelineModule()はonProcessGpuでこれらを返します。
    const { pixels, rows, cols, rowBytes } = processGpuResult.camerapixelarray
    const { wasFound, url, corners } = findQrCode(pixels, rows, cols, rowBytes)
    return { wasFound, url, corners }
  },
  onUpdate: ({processCpuResult}) => {
    // これらはonProcessCpuでこのモジュール('qrscan')によって返された
    const {wasFound, url, corners } = processCpuResult.qrscan
    if (wasFound) {
      showUrlAndCorners(url, corners)
    }.
  },
})
```
