# スクリーンショット

## 説明 {#description}

このイベントは、[`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) イベントが正常に完了したことに応答して発行される。 AFrameキャンバスのJPEG圧縮画像が提供されます。 AFrameキャンバスのJPEG圧縮画像が提供されます。

## 例 {#example}

```javascript
let scene = this.el.sceneEl
scene.addEventListener('screenshotready', (event) => {
  // screenshotPreview は<img> HTML 要素
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
})
```
