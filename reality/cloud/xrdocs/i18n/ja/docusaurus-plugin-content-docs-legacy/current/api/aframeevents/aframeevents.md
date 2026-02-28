# AFrameイベント

このセクションでは、A-Frame コンポーネントの `xrweb`、`xrface`、`xrhand` が発するイベントについて説明する。

Webアプリケーションでこれらのイベントをリッスンして、イベントを処理する関数を呼び出すことができます。

## xrconfig\\` {#events-emitted}が発するイベント

以下のイベントは `xrconfig` から発行される（`xrweb`, `xrface`, `xrhand` または `xrlayers` のみを使用している場合は自動的に追加される）：

| イベント                                | 説明                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [カメラステータス変更](camerastatuschange.md) | このイベントはカメラのステータスが変更されたときに発行される。 このイベントはカメラのステータスが変更されたときに発行される。 可能なステータスの詳細については、[`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) の [`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) を参照してください。                                                                                          |
| [realityerror](realityerror.md)     | このイベントは8th Wall Webの初期化時にエラーが発生した場合に発行されます。 これは、エラーメッセージが表示されるべき推奨時間である。 XR8.XrDevice()\` API](/legacy/api/xrdevice) は、どのようなエラーメッセージを表示するかを決めるのに役立ちます。 これは、エラーメッセージが表示されるべき推奨時間である。 XR8.XrDevice()` API](/legacy/api/xrdevice) は、どのようなエラーメッセージを表示するかを決めるのに役立ちます。 |
| [realityready](realityready.md)     | このイベントは8th Wall Webが初期化され、少なくとも1つのフレームが正常に処理された時に発行される。 これは、あらゆるローディング要素を非表示にすべき推奨時間である。 これは、あらゆるローディング要素を非表示にすべき推奨時間である。                                                                                                                                                                                                                         |
| [スクリーンショットエラー](screenshoterror.md)  | このイベントは、エラーが発生した [`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) イベントに応答して発行される。                                                                                                                                                                                                                                        |
| [スクリーンショット準備完了](screenshotready.md) | このイベントは、[`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) イベントが正常に完了したことに応答して発行される。 AFrameキャンバスのJPEG圧縮画像が提供されます。 AFrameキャンバスのJPEG圧縮画像が提供されます。                                                                                                                                                                             |

## xrweb\\` {#events-emitted-by-xrweb}が発するイベント

| イベント                                                    | 説明                                                                                       |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [xrimageloading](xrimageloading.md)                     | このイベントは、検出画像のロードが開始されたときに発行されます。                                                         |
| [xrimagescanning](xrimagescanning.md)                   | このイベントは、すべての検出画像がロードされ、スキャンが開始されたときに発行される。                                               |
| [xrimagefound](xrimagefound.md)                         | このイベントは、イメージターゲットが最初に見つかったときに発行される。                                                      |
| [xrimageupdated](xrimageupdated.md)                     | このイベントは、イメージターゲットが位置、回転、スケールを変更したときに発行されます。                                              |
| [xrimagelost](xrimagelost.md)                           | このイベントは、イメージターゲットが追跡されなくなったときに発行される。                                                     |
| [xrmeshfound](xrmeshfound.md)                           | このイベントは、開始後またはrecenter()の後にメッシュが最初に見つかったときに発行されます。                    |
| [xrmeshupdated](xrmeshupdated.md)                       | このイベントは、最初に見つかった\*\*メッシュの位置や回転が変化したときに発行されます。                                            |
| [xrmeshlost](xrmeshlost.md)                             | このイベントは `recenter()` が呼ばれたときに発生する。                                                       |
| [xrprojectwayspotscanning](xrprojectwayspotscanning.md) | このイベントは、すべてのプロジェクトウェイスポットがスキャン用にロードされたときに発行されます。                                         |
| [xrprojectwayspotfound](xrprojectwayspotfound.md)       | このイベントは、プロジェクト・ウェイスポットが最初に見つかったときに発行されます。                                                |
| [xrprojectwayspotupdated](xrprojectwayspotupdated.md)   | このイベントは、プロジェクトウェイスポットの位置や回転が変化したときに発行されます。                                               |
| [xrprojectwayspotlost](xrprojectwayspotlost.md)         | このイベントは、プロジェクトウェイスポットが追跡されなくなったときに発行されます。                                                |
| [xrtrackingstatus](xrtrackingstatus.md)                 | このイベントは[`XR8.XrController`](/legacy/api/xrcontroller)が起動し、トラッキングのステータスや理由が変更された時に発行されます。 |

## xrface\\` {#events-emitted-by-xrface}が発するイベント

| イベント                                                    | 説明                                                                |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| [xrfaceloading](xrfaceloading.md)                       | このイベントは、追加のフェイスARリソースのローディングが開始されたときに発行される。                       |
| [xrfacescanning](xrfacescanning.md)                     | このイベントは、ARリソースがロードされ、スキャンが開始されたときに発行される。                          |
| [xrfacefound](xrfacefound.md)                           | このイベントは、顔が最初に見つかったときに発行される。                                       |
| [xrfaceupdated](xrfaceupdated.md)                       | このイベントは、その後顔が見つかったときに発行される。                                       |
| [xrfacelost](xrfacelost.md)                             | このイベントは、顔が追跡されなくなったときに発行される。                                      |
| [xrmouthopened](xrmouthopened.md)                       | このイベントは、トラッキングされた顔の口が開いたときに発せられる。                                 |
| [xrmouthclosed](xrmouthclosed.md)                       | このイベントは、トラッキングされた顔の口が閉じられたときに発せられる。                               |
| [xrlefteyeopened](xrlefteyeopened.md)                   | このイベントは、追跡している顔の左目が開いたときに発せられる。                                   |
| [xrlefteyeclosed](xrlefteyeclosed.md)                   | このイベントは、追跡している顔の左目が閉じたときに発せられる。                                   |
| [xrrighteyeopened](xrrighteyeopened.md)                 | このイベントは、追跡している顔の右目が開いたときに発せられる。                                   |
| [xrrighteyeclosed](xrrighteyeclosed.md)                 | このイベントは、追跡している顔の右目が閉じたときに発せられる。                                   |
| [xrlefteyebrowraised](xrlefteyebrowraised.md)           | このイベントは、追跡している顔の左眉が、顔を見つけたときの初期位置から上がったときに発せられる。                  |
| [xrlefteyebrowlowered](xrlefteyebrowlowered.md)         | このイベントは、追跡している顔の左眉が、顔を見つけたときの初期位置まで下がったときに発せられる。                  |
| [xrrighteyebrowraised](xrrighteyebrowraised.md)         | このイベントは、追跡している顔の右眉が、顔を見つけたときの初期位置から上がったときに発せられる。                  |
| [xrrighteyebrowlowered](xrrighteyebrowlowered.md)       | このイベントは、追跡している顔の右眉が、顔を発見したときの初期位置まで下がったときに発せられる。                  |
| [xrlefteyewinked](xrlefteyewinked.md)                   | このイベントは、トラッキングされた顔の左目が750ミリ秒以内に閉じたり開いたりする一方で、右目は開いたままであるときに発せられる。 |
| [xrrighteyewinked](xrrighteyewinked.md)                 | このイベントは、追跡された顔の右目が750ミリ秒以内に閉じたり開いたりする一方で、左目が開いたままであるときに発せられる。     |
| [xrblinked](xrblinked.md)                               | このイベントは、追跡している顔の目がまばたきしたときに発せられる。                                 |
| [xrinterpupillarydistance](xrinterpupillarydistance.md) | このイベントは、追跡された顔の各瞳孔の中心間のミリメートル単位の距離が最初に検出されたときに発せられる。              |

## xrhand\\` が発するイベント {#events-emitted-by-xrhand}

| イベント                                | 説明                                         |
| ----------------------------------- | ------------------------------------------ |
| [xrhandloading](xrhandloading.md)   | このイベントは、追加のハンドARリソースのローディングが開始されたときに発行される。 |
| [xrhandscanning](xrhandscanning.md) | このイベントは、ARリソースがロードされ、スキャンが開始されたときに発行される。   |
| [xrhandfound](xrhandfound.md)       | このイベントは、ハンドが最初に見つかったときに発せられる。              |
| [xrhandupdated](xrhandupdated.md)   | このイベントは、その後にハンドが見つかったときに発行される。             |
| [xrhandlost](xrhandlost.md)         | このイベントは、ハンドがトラッキングされなくなったときに発行される。         |
