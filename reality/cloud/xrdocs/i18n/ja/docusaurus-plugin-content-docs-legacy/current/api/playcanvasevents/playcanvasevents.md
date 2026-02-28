# PlayCanvas イベント

このセクションでは、PlayCanvas環境で8th Wallによって発生するイベントについて説明します。

Webアプリケーションでこれらのイベントをリッスンすることができます。

## イベント {#events-emitted}

| イベント                                                             | 説明                                                                                                                                                                                                                                                                                                                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xr:camerastatuschange](xrcamerastatuschange.md) | このイベントはカメラのステータスが変更されたときに発行される。 このイベントはカメラのステータスが変更されたときに発行される。 可能なステータスの詳細については、[`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) の [`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) を参照してください。                                                                                          |
| [xr:realityerror](xrrealityerror.md)             | このイベントは8th Wall Webの初期化時にエラーが発生した場合に発行されます。 これは、エラーメッセージが表示されるべき推奨時間である。 XR8.XrDevice()\` API](/legacy/api/xrdevice) は、どのようなエラーメッセージを表示するかを決めるのに役立ちます。 これは、エラーメッセージが表示されるべき推奨時間である。 XR8.XrDevice()` API](/legacy/api/xrdevice) は、どのようなエラーメッセージを表示するかを決めるのに役立ちます。 |
| [xr:realityready](xrrealityready.md)             | このイベントは8th Wall Webが初期化され、少なくとも1つのフレームが正常に処理された時に発行される。 これは、あらゆるローディング要素を非表示にすべき推奨時間である。 これは、あらゆるローディング要素を非表示にすべき推奨時間である。                                                                                                                                                                                                                         |
| [xr:screenshoterror](xrscreenshoterror.md)       | このイベントは、エラーが発生した [`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) に応答して発行される。                                                                                                                                                                                                                                            |
| [xr:screenshotready](xrscreenshotready.md)       | このイベントは、[`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) イベントが正常に完了したことに応答して発行される。 AFrameキャンバスのJPEG圧縮画像が提供されます。 AFrameキャンバスのJPEG圧縮画像が提供されます。                                                                                                                                                                             |

## XR8.XrController 発生イベント {#xrcontroller-events-emitted}

XR8.PlayCanvas.run()`の `extraModules`に`XR8.XrController.pipelineModule()\\` を渡して追加すると、これらのイベントが発生します：

| イベント                                                                     | 説明                                                                    |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| [xr:imageloading](playcanvas-image-target-events.md)     | このイベントは、検出画像のロードが開始されたときに発行されます。                                      |
| [xr:imagescanning](playcanvas-image-target-events.md)    | このイベントは、すべての検出画像がロードされ、スキャンが開始されたときに発行される。                            |
| [xr:imagefound](playcanvas-image-target-events.md)       | このイベントは、イメージターゲットが最初に見つかったときに発行される。                                   |
| [xr:imageupdated](playcanvas-image-target-events.md)     | このイベントは、イメージターゲットが位置、回転、スケールを変更したときに発行されます。                           |
| [xr:imagelost](playcanvas-image-target-events.md)        | このイベントは、イメージターゲットが追跡されなくなったときに発行される。                                  |
| [xr:meshfound](xrmeshfound.md)                           | このイベントは、開始後またはrecenter()の後にメッシュが最初に見つかったときに発行されます。 |
| [xr:meshupdated](xrmeshupdated.md)                       | このイベントは、最初に見つかった\*\*メッシュの位置や回転が変化したときに発行されます。                         |
| [xr:meshlost](xrmeshlost.md)                             | このイベントは `recenter()` が呼ばれたときに発生する。                                    |
| [xr:projectwayspotscanning](xrprojectwayspotscanning.md) | このイベントは、すべてのプロジェクトロケーションがスキャンのためにロードされたときに発行されます。                     |
| [xr:projectwayspotfound](xrprojectwayspotfound.md)       | このイベントは、プロジェクトロケーションが最初に見つかったときに発行されます。                               |
| [xr:projectwayspotupdated](xrprojectwayspotupdated.md)   | このイベントは、プロジェクトロケーションが位置や回転を変更したときに発行されます。                             |
| [xr:projectwayspotlost](xrprojectwayspotlost.md)         | このイベントは、プロジェクトの場所が追跡されなくなったときに発行されます。                                 |

## XR8.LayersController 発生するイベント {#layerscontroller-events-emitted}

XR8.PlayCanvas.run()`の `extraModules`に`XR8.LayersController.pipelineModule()\\` を渡して追加すると、これらのイベントが発生します：

| イベント                                                   | 説明                                                                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| [xr:layerloading](xrlayerloading.md)   | 追加のレイヤーセグメンテーションリソースのロードが始まるときに発生します。                                                                            |
| [xr:layerscanning](xrlayerscanning.md) | すべてのレイヤーセグメンテーションリソースがロードされ、スキャンが開始されたときに発生する。 スキャンされるレイヤーごとに1つのイベントがディスパッチされる。 スキャンされるレイヤーごとに1つのイベントがディスパッチされる。 |
| [xr:layerfound](xrlayerfound.md)       | レイヤーが最初に見つかったときに発火する。                                                                                            |

## XR8.FaceController 発生イベント {#facecontroller-events-emitted}

XR8.FaceController.pipelineModule()`を `XR8.PlayCanvas.run()`の`extraModules\\` に渡して追加すると、これらのイベントが発生します：

| イベント                                                                 | 説明                                      |
| -------------------------------------------------------------------- | --------------------------------------- |
| [xr:faceloading](playcanvas-face-effects-events.md)  | フェースARの追加リソースのロードが開始されたときに発生します。        |
| [xr:facescanning](playcanvas-face-effects-events.md) | すべてのフェイスARリソースがロードされ、スキャンが開始されたときに発火する。 |
| [xr:facefound](playcanvas-face-effects-events.md)    | 顔が最初に見つかったときに発火する。                      |
| [xr:faceupdated](playcanvas-face-effects-events.md)  | その後に顔が見つかると発火する。                        |
| [xr:facelost](playcanvas-face-effects-events.md)     | 顔が追跡されなくなったときに発生します。                    |

## XR8.HandController 発生イベント {#handcontroller-events-emitted}

XR8.PlayCanvas.run()`の `extraModules`に`XR8.HandController.pipelineModule()\\` を渡して追加すると、これらのイベントが発生します：

| イベント                                                                  | 説明                                     |
| --------------------------------------------------------------------- | -------------------------------------- |
| [xr:handloading](playcanvas-hand-tracking-events.md)  | ハンドARの追加リソースのロード開始時に発火する。              |
| [xr:handscanning](playcanvas-hand-tracking-events.md) | すべてのハンドARリソースがロードされ、スキャンが開始されたときに発火する。 |
| [xr:handfound](playcanvas-hand-tracking-events.md)    | ハンドが最初に見つかったときに発射される。                  |
| [xr:handupdated](playcanvas-hand-tracking-events.md)  | 続いて手が見つかったときに発射される。                    |
| [xr:handlost](playcanvas-hand-tracking-events.md)     | 手が追跡されなくなったときに発火する。                    |
