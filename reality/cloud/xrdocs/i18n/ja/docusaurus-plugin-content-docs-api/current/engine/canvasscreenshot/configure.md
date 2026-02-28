---
sidebar_label: configure()
---

# XR8.CanvasScreenshot.configure()

`XR8.CanvasScreenshot.configure({ maxDimension, jpgCompression })`

## 説明 {#description}

キャンバスのスクリーンショットの期待される結果を設定します。

## パラメータ {#parameters}

| パラメータ                                            | デフォルト  | 説明                                                    |
| ------------------------------------------------ | ------ | ----------------------------------------------------- |
| maxDimension：[オプション］   | `1280` | 予想される最大の次元の値。                                         |
| jpgCompression：[オプション］ | `75`   | JPEG 圧縮の品質を表す 1-100 の値。 100はほとんど損失がなく、1は非常に低品質な画像である。 |

## {#returns}を返す。

なし

## 例 {#example}

```javascript
XR8.CanvasScreenshot.configure({ maxDimension: 640, jpgCompression: 50 })
```
