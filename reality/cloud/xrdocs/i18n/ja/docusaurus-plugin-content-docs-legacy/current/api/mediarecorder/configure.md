---
sidebar_label: configure()
---

# XR8.MediaRecorder.configure()

`XR8.MediaRecorder.configure({ coverImageUrl, enableEndCard, endCardCallToAction, footerImageUrl, foregroundCanvas, maxDurationMs, maxDimension, shortLink, configureAudioOutput, audioContext, requestMic })`)

## 説明 {#description}

MediaRecorderの各種パラメータを設定する。

## パラメータ {#parameters}

| パラメータ                                                                             | タイプ    | デフォルト                                          | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------- | ------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| coverImageUrl [オプション]。        | 文字列    | プロジェクトで設定されているカバー画像。                           | カバー画像の画像ソース。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| enableEndCard [オプション］                                   | 文字列    | false\\`                                      | trueの場合、エンドカードを有効にする。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| endCardCallToAction [オプション]。  | 文字列    | で試してみて：'\`                                     | コールトゥアクションの文字列を設定します。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| fileNamePrefix [オプション］                                  | 文字列    | 私の捕獲                                           | ファイル名の前にユニークタイムスタンプを付加する文字列を設定します。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| footerImageUrl [オプション]。       | 文字列    | null\\`。                                      | カバー画像の画像ソース                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| foregroundCanvas [オプション］                                | 文字列    | null\\`。                                      | 録画したビデオの前景として使用するキャンバス。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| maxDurationMs [オプション］                                   | 番号     | `15000`                                        | 動画の最大継続時間（ミリ秒単位）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| maxDimension [オプション］                                    | 番号     | `1280`                                         | キャプチャされた録画の最大寸法（ピクセル単位）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| shortLink [オプション］                                       | 文字列    | プロジェクト・ダッシュボードからの8th.ioショートリンク | ショートリンクの文字列を設定します。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| configureAudioOutput [オプション]。 | オブジェクト | null\\`。                                      | ユーザーが提供する関数で、`microphoneInput` と `audioProcessor` オーディオノードを受け取り、録音の音声を完全にコントロールする。 オーディオプロセッサーノードに接続されたノードは、録音のオーディオの一部になります。 ユーザーのオーディオグラフの終端ノードを返す必要がある。 オーディオプロセッサーノードに接続されたノードは、録音のオーディオの一部になります。 ユーザーのオーディオグラフの終端ノードを返す必要がある。                                                                                                                                                                                                                                                                                             |
| audioContext [オプション］                                    | 文字列    | null\\`。                                      | ユーザが提供する `AudioContext` インスタンス。 ユーザが提供する `AudioContext` インスタンス。 three.jsやBABYLON.jsのようなエンジンは、独自の内部オーディオインスタンスを持っている。 これらのエンジンで定義されたサウンドを録音に含めるには、そのエンジンの `AudioContext` インスタンスを提供する必要があります。 ユーザが提供する `AudioContext` インスタンス。 ユーザが提供する `AudioContext` インスタンス。 three.jsやBABYLON.jsのようなエンジンは、独自の内部オーディオインスタンスを持っている。 これらのエンジンで定義されたサウンドを録音に含めるには、そのエンジンの `AudioContext` インスタンスを提供する必要があります。 これらのエンジンで定義されたサウンドを録音に含めるには、そのエンジンの `AudioContext` インスタンスを提供する必要があります。 |
| requestMic [オプション］                                      | 文字列    | オート                                            | オーディオパーミッションが要求されるタイミングを決定します。 オーディオパーミッションが要求されるタイミングを決定します。 オプションは[`XR8.MediaRecorder.RequestMicOptions`](requestmicoptions.md)で提供されます。                                                                                                                                                                                                                                                                                                                                                                                      |

configureAudioOutput\\`に渡される関数は、以下のパラメータを持つオブジェクトを受け取る：

| パラメータ      | 説明                                                                                                                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| マイク入力      | ユーザーのマイク入力を含む [`GainNode`](https://developer.mozilla.org/en-US/docs/Web/API/GainNode)。 ユーザーのパーミッションが受け入れられない場合、このノードはマイク入力を出力しないが、まだ存在する。 ユーザーのパーミッションが受け入れられない場合、このノードはマイク入力を出力しないが、まだ存在する。                                   |
| オーディオプロセッサ | オーディオデータをレコーダーに渡す [`ScriptProcessorNode`](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode)。 オーディオノードを録音の音声出力の一部にしたい場合は、audioProcessorに接続する必要があります。 オーディオノードを録音の音声出力の一部にしたい場合は、audioProcessorに接続する必要があります。 |

## {#returns}を返す。

なし

## 例 {#example}

```javascript
XR8.MediaRecorder.configure({
  maxDurationMs：15000,
  enableEndCard: true,
  endCardCallToAction: 'Try it at:',
  shortLink：'8th.io/my-link',
})
```

## 例 - ユーザーが設定したオーディオ出力 {#example---user-configured-audio-output}

```javascript

  const userConfiguredAudioOutput = ({microphoneInput, audioProcessor}) => {
  const myCustomAudioGraph = ...
  myCustomAudioSource.connect(myCustomAudioGraph)
  microphoneInput.connect(myCustomAudioGraph)

  // オーディオグラフのエンドノードをハードウェアに接続する。destination)

  // オーディオグラフは自動的にプロセッサに接続されます。
  return myCustomAudioGraph
}
const threejsAudioContext = THREE.AudioContext.getContext()
XR8.MediaRecorder.configure({
  configureAudioOutput: userConfiguredAudioOutput,
  audioContext: threejsAudioContext,
  requestMic：XR8.MediaRecorder.RequestMicOptions.AUTO,
})
```
