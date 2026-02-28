---
sidebar_label: recordVideo()
---

# XR8.MediaRecorder.recordVideo()

`XR8.MediaRecorder.recordVideo({ onError, onProcessFrame, onStart, onStop, onVideoReady })`.

## 説明 {#description}

録音を開始する。

この関数は、以下のメディアレコーダーライセンスサイクルコールバックメソッドを1つ以上実装したオブジェクトを受け取る：

## パラメータ {#parameters}

| パラメータ          | 説明                                                           |
| -------------- | ------------------------------------------------------------ |
| オンエラー          | エラー時のコールバック。                                                 |
| onProcessFrame | 動画にオーバーレイを追加するためのコールバック。                                     |
| オン・スタート        | 録音開始時のコールバック。                                                |
| オンストップ         | 録音停止時のコールバック。                                                |
| プレビュー準備完了      | プレビュー可能だが共有に最適化されていない動画の準備ができたときにコールバックする（Android/デスクトップのみ）。 |
| オンファイナライズプログレス | メディアレコーダーが最終的なエクスポートを進めているときにコールバックします（Android/Desktopのみ）。   |
| オンビデオレディ       | 録画が完了し、ビデオの準備ができたらコールバックする。                                  |

**注意：**\* ブラウザがmp4ではなくwebmのネイティブMediaRecorderサポートを持っている場合（現在Android/Desktop）、webmはプレビュービデオとして使用できますが、最終的なビデオを生成するためにmp4に変換されます。 onPreviewReady`は変換が始まったときに呼ばれ、ユーザーがすぐにビデオを見ることができるようにし、mp4ファイルの準備ができたら、`onVideoReady`が呼ばれる。 変換中、`onFinalizeProgress\`が定期的に呼び出され、プログレスバーが表示される。 onPreviewReady`は変換が始まったときに呼ばれ、ユーザーがすぐにビデオを見ることができるようにし、mp4ファイルの準備ができたら、`onVideoReady`が呼ばれる。 変換中、`onFinalizeProgress`が定期的に呼び出され、プログレスバーが表示される。

## {#returns}を返す。

なし

## 例 {#example}

```javascript
XR8.MediaRecorder.recordVideo({
  onVideoReady: (result) => window.dispatchEvent(new CustomEvent('recordercomplete', {detail: result})),
  onStop: () => showLoading(),
  onError: () => clearState(),
  onProcessFrame: ({elapsedTimeMs, maxRecordingMs, ctx}) => {
    // 動画の上に赤いテキストをオーバーレイする
    ctx.fillStyle = 'red'
    ctx.fillText = '50px "Nunito"' ctx.fillText = '50px "Nunito"'font = '50px "Nunito"'
    ctx.fillText(`${elapsedTimeMs}/${maxRecordingMs}`, 50, 50)
    const timeLeft = ( 1 - elapsedTimeMs / maxRecordingMs)
    // 残り時間を示すプログレスバーを更新
    progressBar.style.strokeDashoffset = `${100 * timeLeft }`
  },
  onFinalizeProgress：({progress, total}) => {
    console.log('Export is ' + Math.round(progress / total) + '% complete')
  },
})
```
