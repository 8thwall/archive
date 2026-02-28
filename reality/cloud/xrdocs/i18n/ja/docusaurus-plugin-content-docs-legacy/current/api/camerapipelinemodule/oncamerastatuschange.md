# onCameraStatusChange()

onCameraStatusChange: ({ status, stream, video, config })\\`.

## 説明 {#description}

onCameraStatusChange()\\`は、カメラの許可要求中に変更が発生したときに呼び出される。

ステータスと、該当する場合は新しく利用可能になったデータへの参照が呼び出される。 典型的なステータスの流れはこうだ： ステータスと、該当する場合は新しく利用可能になったデータへの参照が呼び出される。 典型的なステータスの流れはこうだ： 典型的なステータスの流れはこうだ：

requesting`->`hasStream`->`hasVideo\\`.

## パラメータ {#parameters}

| パラメータ                                                                                | 説明                                                                                                                      |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| ステータス                                                                                | `'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ] のいずれかである。                           |
| stream: [オプション]。 | ステータスが `'hasStream'` の場合、カメラフィードに関連付けられた [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)。 |
| ビデオを見る：[オプション］                                             | ステータスが hasVideo の場合、ストリームを表示する video DOM 要素。                                                                            |
| コンフィグ                                                                                | ステータスが `'requesting'` の場合、[`XR8.run()`](/legacy/api/xr8/run) に渡された設定パラメータ。                                              |

パラメータ `status` には以下の状態がある：

| 州       | 説明                                                                                                                                                               |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| リクエスト   | request'\\`では、ブラウザはカメラを開き、該当する場合はユーザーの許可をチェックする。 この状態では、ユーザーにカメラの許可を求めるプロンプトを表示するのが適切です。 この状態では、ユーザーにカメラの許可を求めるプロンプトを表示するのが適切です。                                |
| ハズストリーム | ユーザの許可が与えられ、カメラが正常に開かれると、ステータスは `'hasStream'` に切り替わり、許可に関するユーザによるプロンプトはすべて解除されます。                                                                                |
| ハズビデオ   | カメラのフレームデータが処理に利用できるようになると、ステータスは `'hasVideo'` に切り替わり、カメラのフィードを表示できるようになります。                                                                                     |
| 失敗した    | カメラのフィードが開けなかった場合、ステータスは `'failed'` となります。 この場合、ユーザーがパーミッションを拒否している可能性があるので、パーミッションの再有効化を支援することが望ましい。 この場合、ユーザーがパーミッションを拒否している可能性があるので、パーミッションの再有効化を支援することが望ましい。 |

## 例 {#example}

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
