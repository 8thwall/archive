# カメラパイプラインモジュール

8th Wallカメラ・アプリケーションは、カメラ・パイプライン・モジュール・フレームワークを使用して構築される。 アプリケーションは、実行時にアプリケーションの動作を制御するモジュールをインストールする。

アプリケーションにカメラパイプラインモジュールを追加する方法については、[`XR8.addCameraPipelineModule()`](/api/engine/xr8/addcamerapipelinemodule)を参照してください。

カメラパイプラインモジュールオブジェクトには、アプリケーション内で一意である **.name** 文字列が必要です。 以下のカメラ・ライフサイクル・メソッドの1つ以上を実装する必要があります。  これらのメソッドは、実行ループの適切な時点で実行される。

アプリケーションのメイン・ランタイム中、各カメラ・フレームは以下のサイクルを経る：

onBeforeRun`->`onCameraStatusChange` (`requesting`->`hasStream`->`hasVideo`|`failed`) -> `onStart`->`onAttach`->`onProcessGpu`->`onProcessCpu`->`onUpdate`->`onRender\\`.

カメラモジュールは、以下のカメラライフサイクルメソッドを1つ以上実装する必要があります：

| 機能                                                        | 説明                                                                                                                                                                                                                                                     |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [onAppResourcesLoaded](onappresourcesloaded.md)           | サーバーからアプリに添付されたリソースを受け取ったときに呼び出される。                                                                                                                                                                                                                    |
| [onAttach](onattach.md)                                   | モジュールが初めてフレームの更新を受け取る前に呼び出される。 パイプラインの実行前または実行後に追加されたモジュールに対して呼び出される。                                                                                                                                                                                  |
| [onBeforeRun](onbeforerun.md)                             | [`XR8.run()`](/api/engine/xr8) の直後に呼び出される。 何らかの約束が返された場合、XRはすべての約束を待ってから続行する。                                                                                                                                                                          |
| [onCameraStatusChange](oncamerastatuschange.md)           | カメラのアクセス許可要求中に変更が発生した場合に呼び出されます。                                                                                                                                                                                                                       |
| [onCanvasSizeChange](oncanvassizechange.md)               | キャンバスのサイズが変更されたときに呼び出される。                                                                                                                                                                                                                              |
| [onDetach](ondetach.md)                                   | は、モジュールがフレームの更新を最後に受信した後に呼び出される。 は、モジュールがフレームの更新を最後に受信した後に呼び出される。 これは、エンジンが停止した後か、モジュールがパイプラインから手動で取り外された後のどちらか早い方である。                                                                                                                                 |
| [onDeviceOrientationChange](ondeviceorientationchange.md) | デバイスが横向き/縦向きに変わったときに呼び出される。                                                                                                                                                                                                                            |
| [onException](onexception.md)                             | XRでエラーが発生したときに呼び出される。 エラーオブジェクトと共に呼び出される。 エラーオブジェクトと共に呼び出される。                                                                                                                                                                                          |
| [onPaused](onpaused.md)                                   | [`XR8.pause()`](/api/engine/xr8/pause) が呼ばれたときに呼び出される。                                                                                                                                                                                                 |
| [onProcessCpu](onprocesscpu.md)                           | GPU処理の結果を読み取り、使用可能なデータを返すために呼び出される。                                                                                                                                                                                                                    |
| [onProcessGpu](onprocessgpu.md)                           | GPU処理を開始するために呼び出される。                                                                                                                                                                                                                                   |
| [onRemove](onremove.md)                                   | は、モジュールがパイプラインから削除されたときに呼び出される。                                                                                                                                                                                                                        |
| [onRender](onrender.md)                                   | onUpdateの後に呼び出される。 これはレンダリングエンジンがWebGLの描画コマンドを発行する時間です。 アプリケーションが独自のランループを提供し、[`XR8.runPreRender()`](/api/engine/xr8/runprerender)と[`XR8.runPostRender()`](/api/engine/xr8/runpostrender)に依存している場合、このメソッドは呼び出されず、すべてのレンダリングは外部のランループによって調整されなければなりません。 |
| [onResume](onresume.md)                                   | [`XR8.resume()`](/api/engine/xr8/resume) が呼ばれたときに呼び出される。                                                                                                                                                                                               |
| [onStart](onstart.md)                                     | XRの開始時に呼び出される。 [`XR8.run()`](/api/engine/xr8) が呼ばれた後の最初のコールバック。                                                                                                                                                                                        |
| [onUpdate](onupdate.md)                                   | レンダリング前にシーンを更新するために呼び出される。 [`onProcessGpu`](onprocessgpu.md)と[`onProcessCpu`](onprocesscpu.md)のモジュールによって返されるデータは、processGpu.modulenameとprocessCpu.modulenameとして存在する。                                                   |
| [onVideoSizeChange](onvideosizechange.md)                 | キャンバスのサイズが変更されたときに呼び出される。                                                                                                                                                                                                                              |
| [requiredPermissions](requiredpermissions.md)             | モジュールは、許可要求が必要なブラウザの機能を示すことができます。 これらは、もし適切なパーミッションがない場合、フレームワークが要求するために使用されるか、XRを実行する前に適切なパーミッションを要求するコンポーネントを作成するために使用される。                                                                                                                           |

注：[`onProcessGpu`](onprocessgpu.md)または[`onProcessCpu`](onprocesscpu.md)を実装したカメラモジュールは、パイプラインの後続ステージにデータを提供することができます。 これはモジュール名によって行われる。
