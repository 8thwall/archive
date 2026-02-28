---
sidebar_position: 1
---

# xr:スクリーンショット準備完了

## 説明 {#description}

このイベントは、[`xr:screenshotrequest`](/legacy/api/playcanvaseventlisteners/xrscreenshotrequest)イベントが正常に完了した場合に発行されます。 PlayCanvasキャンバスのJPEG圧縮画像が提供されます。 PlayCanvasキャンバスのJPEG圧縮画像が提供されます。

## 例 {#example}

```javascript
this.app.on('xr:screenshotready', (event) => {
  // screenshotPreviewは<img> HTML要素
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
}, this)
```
