---
id: video-recording
---

# ビデオ録画のカスタマイズ

8th Wallの[XRExtras](https://github.com/8thwall/web/tree/master/xrextras)ライブラリは、ロード画面、ソーシャルリンクアウト
フロー、エラー処理など、WebARアプリケーションの最も一般的なニーズを処理するモジュール
を提供します。

XRExtras [MediaRecorder](https://github.com/8thwall/web/tree/master/xrextras/src/mediarecorder)
モジュールを使用すると、プロジェクトでビデオ録画のユーザーエクスペリエンスを簡単にカスタマイズできます。

このセクションでは、キャプチャボタンの動作
（タップとホールドの違い）、ビデオウォーターマークの追加、ビデオの最大長、エンドカードの動作や外観など、録画したビデオをカスタマイズする方法について説明します。

## A-Frame プリミティブ {#a-frame-primitives}

xrextras-capture-button\\` : シーンにキャプチャボタンを追加します。

| パラメータ    | タイプ | デフォルト  | 説明                                                                                                                                       |
| -------- | --- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| キャプチャモード | 文字列 | スタンダード | キャプチャモードの動作を設定する。 **標準**：タップで写真撮影、タップ+ホールドでビデオ録画。 **修正**：タップしてビデオ録画を切り替える。 **写真**：タップして写真を撮る。 標準、固定、写真]\`のいずれか |

xrextras-capture-config\\` : キャプチャしたメディアを設定する。

| パラメータ               | タイプ   | デフォルト                   | 説明                                                                                                                                                     |
| ------------------- | ----- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 最大継続時間              | イント   | `15000`                 | キャプチャボタンが許可するビデオの総時間（ミリ秒単位）。 エンドカードが無効の場合、これはユーザーの最大記録時間に相当する。 デフォルトでは15000。                                                                           |
| 最大寸法                | イント   | `1280`                  | キャプチャしたビデオの最大寸法（幅または高さ）。  キャプチャしたビデオの最大寸法（幅または高さ）。  写真の設定については、[`XR8.CanvasScreenshot.configure()`](/legacy/api/canvasscreenshot/configure) を参照してください。 |
| イネーブル・エンド・カード       | ブーリアン | true\\`                | エンドカードが記録メディアに含まれているかどうか。                                                                                                                              |
| カバー画像URL            | 文字列   |                         | エンドカード表紙の画像ソース。 デフォルトでプロジェクトのカバー画像を使用します。 デフォルトでプロジェクトのカバー画像を使用します。                                                                                    |
| エンドカード-コール・トゥ・アクション | 文字列   | で試してみて：'\`              | エンドカードのコールトゥアクションの文字列を設定します。                                                                                                                           |
| ショートリンク             | 文字列   |                         | エンドカードショートリンクの文字列を設定します。 エンドカードショートリンクの文字列を設定します。 デフォルトでプロジェクトのショートリンクを使用します。 エンドカードショートリンクの文字列を設定します。 デフォルトでプロジェクトのショートリンクを使用します。                     |
| フッター画像URL           | 文字列   | Powered by 第8回ウォール・イメージ | エンドカードフッター画像の画像ソース。                                                                                                                                    |
| ウォーターマーク画像-url      | 文字列   | null\\`。               | 透かしの画像ソース。                                                                                                                                             |
| ウォーターマーク最大幅         | イント   | 20                      | 透かし画像の最大幅（%）。                                                                                                                                          |
| ウォーターマーク・マックスハイト    | イント   | 20                      | 透かし画像の最大高さ（%）。                                                                                                                                         |
| ウォーターマークロケーション      | 文字列   | 右下                      | 透かし画像の位置。 topLeft、topMiddle、topRight、bottomLeft、bottomMiddle、bottomRight\`のいずれか。                                                                       |
| ファイル名プレフィックス        | 文字列   | 私の捕獲                    | ファイル名の前にユニークタイムスタンプを付加する文字列を設定します。                                                                                                                     |
| リクエストマイク            | 文字列   | オート                     | 初期化時にマイクの設定を行うか（`'auto'`）、実行時に行うか（`'manual'`）を指定する。                                                                                                    |
| シーンオーディオを含む         | ブーリアン | true\\`                | trueの場合、シーン内のA-Frameサウンドは録音出力の一部となる。                                                                                                                   |

xrextras-capture-preview\\` : 再生、ダウンロード、共有を可能にするメディアプレビュープレファブをシーンに追加します。

| パラメータ             | タイプ | デフォルト | 説明                                                                                                                             |
| ----------------- | --- | ----- | ------------------------------------------------------------------------------------------------------------------------------ |
| アクションボタン・シェア・テキスト | 文字列 | シェア   | Web Share API 2 \*\*\*が利用可能な場合（Android、iOS 15以上）、アクションボタンの文字列を設定します。 デフォルトでは`'Share'`である。 デフォルトでは `'View'`.    |
| アクションボタン・ビュー・テキスト | 文字列 | 見る    | iOSでWeb Share API 2が利用できない場合（iOS 14以下）、アクションボタンの文字列を設定します。 デフォルトでは `'View'`. デフォルトでは `'View'`. |

## XRExtras.MediaRecorder イベント {#xrextrasmediarecorder-events}

XRExtras.MediaRecorderは以下のイベントを発行します。

#### イベント {#events-emitted}

| イベント                | 説明                                                                                                                                                                                                  | イベント詳細            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| メディアレコーダー・フォトコンプリート | 写真撮影後に発せられる。                                                                                                                                                                                        | {blob}            |
| メディアレコーダー           | ビデオ録画終了後に発せられる。                                                                                                                                                                                     | {videoBlob}       |
| メディアレコーダープレビューレディ   | プレビュー可能なビデオ録画が完了した後に発せられる。 プレビュー可能なビデオ録画が完了した後に発せられる。 (Android/デスクトップのみ)](/legacy/api/mediarecorder/recordvideo/#parameters)        | {videoBlob}       |
| メディアレコーダー           | メディアレコーダーが最終的な書き出しを進めているときに発せられる。 プレビュー可能なビデオ録画が完了した後に発せられる。 (Android/デスクトップのみ)](/legacy/api/mediarecorder/recordvideo/#parameters) | {progress, total} |
| メディアレコーダープレビューオープン  | 録画プレビューが開かれた後に発せられる。                                                                                                                                                                                | ヌル                |
| メディアレコーダープレビュークローズド | 録画プレビューが閉じられた後に発せられる。                                                                                                                                                                               | ヌル                |

#### 例A-Frame プリミティブ {#primitives-example}

```jsx
<xrextras-capture-button capture-mode="standard"></xrextras-capture-button>

<xrextras-capture-config max-duration-ms="15000" max-dimension="1280" enable-end-card="true" cover-image-url="" end-card-call-to-action="Try it at:" short-link="" footer-image-url="//cdn.8thwall.com/web/img/almostthere/v2/poweredby-horiz-white-2.svg" watermark-image-url="//cdn.8thwall.com/web/img/mediarecorder/8logo.png" watermark-max-width="100" watermark-max-height="10" watermark-location="bottomRight" file-name-prefix="my-capture-"。  > <xrextras-capture-preview action-button-share-text="Share" action-button-view-text="View" finalize-text="Exporting..."  >












</xrextras-capture-config>





</xrextras-capture-preview>
```

#### 例A-Frame Events {#example-a-frame-events}

```javascript
window.addEventListener('mediarecorder-previewready', (e) => {
  console.log(e.detail.videoBlob)
})
```

#### 例共有ボタンCSSの変更 {#change-share-button-example}

```css
#actionButton {
  /* アクションボタンの色を変更 */
  background-color：#007aff !important;
}.
```
