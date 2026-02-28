---
sidebar_label: configure()
---

# CoachingOverlay.configure()

`CoachingOverlay.configure({ animationColor, promptColor, promptText, disablePrompt })`)

## 説明 {#description}

コーチング・オーバーレイの動作と外観を設定する。

## パラメータ（すべてオプション） {#parameters-all-optional}

| パラメータ        | タイプ   | デフォルト       | 説明                                                                                                                                   |
| ------------ | ----- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| アニメーションカラー   | 文字列   | 白           | Coaching Overlayアニメーションの色。 このパラメータは有効なCSSカラー引数を受け付ける。 このパラメータは有効なCSSカラー引数を受け付ける。                                                     |
| プロンプトカラー     | 文字列   | 白           | すべてのコーチング・オーバーレイ・テキストの色。 このパラメータは有効なCSSカラー引数を受け付ける。 Coaching Overlayアニメーションの色。 このパラメータは有効なCSSカラー引数を受け付ける。 このパラメータは有効なCSSカラー引数を受け付ける。 |
| プロンプトテキスト    | 文字列   | デバイスを前後に動かす | スケールを生成するために必要なモーションをユーザーに知らせるアニメーション説明テキストのテキスト文字列を設定します。                                                                           |
| ディスエーブルプロンプト | ブーリアン | false\\`   | カスタムオーバーレイにコーチングオーバーレイイベントを使用するために、デフォルトのコーチングオーバーレイを非表示にするにはtrueを設定します。                                                             |

## {#returns}を返す。

なし

## 例 - コード {#example---code}

```javascript
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText：'To generate scale push your phone forward and then pull back',
})
```
