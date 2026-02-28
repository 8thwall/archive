---
sidebar_label: スクリーンショットを撮る
---

# XR8.CanvasScreenshot.takeScreenshot()。

`XR8.CanvasScreenshot.takeScreenshot({ onProcessFrame })`

## 説明 {#description}

解決されると、JPEG圧縮画像を含むバッファを提供するPromiseを返します。 拒否された場合は、エラーメッセージが表示される。 拒否された場合は、エラーメッセージが表示される。

## パラメータ {#parameters}

| パラメータ                                            | 説明                                 |
| ------------------------------------------------ | ---------------------------------- |
| onProcessFrame [オプション］ | スクリーンショット2Dキャンバスへの追加描画を実装するコールバック。 |

## を返す {#returns}

約束。

## 例 {#example}

```javascript
XR8.addCameraPipelineModule(XR8.canvasScreenshot().cameraPipelineModule())
XR8.canvasScreenshot().takeScreenshot().then(
  data => {
    // myImage は<img> HTML 要素
    const image = document.getElementById('myImage')
    image.src = 'data:image/jpeg;base64,' + data
  },
  error => {
    console.log(error)
    // スクリーンショットのエラーを処理します。
  })
})
```
