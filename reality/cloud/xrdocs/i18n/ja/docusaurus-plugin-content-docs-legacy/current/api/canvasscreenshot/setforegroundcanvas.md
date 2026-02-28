---
sidebar_label: setForegroundCanvas()
---

# XR8.CanvasScreenshot.setForegroundCanvas()

`XR8.CanvasScreenshot.setForegroundCanvas(canvas)`。

## 説明 {#description}

カメラ・キャンバスの上に表示する前景キャンバスを設定する。 これはカメラのキャンバスと同じ寸法でなければなりません。

カメラフィードとバーチャルオブジェクトに別々のキャンバスを使用する場合のみ必要です。

## パラメータ {#parameters}

| パラメータ | 説明                        |
| ----- | ------------------------- |
| キャンバス | スクリーンショットの前景として使用するキャンバス。 |

## {#returns}を返す。

なし

## 例 {#example}

```javascript
const myOtherCanvas = document.getElementById('canvas2')
XR8.CanvasScreenshot.setForegroundCanvas(myOtherCanvas)
```
