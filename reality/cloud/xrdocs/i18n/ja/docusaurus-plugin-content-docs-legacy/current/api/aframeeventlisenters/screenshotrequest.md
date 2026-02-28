# スクリーンショット要求

`scene.emit('screenshotrequest')`

## 説明 {#description}

AFrameキャンバスのスクリーンショットをキャプチャするリクエストをエンジンに送ります。 AFrameキャンバスのスクリーンショットをキャプチャするリクエストをエンジンに送ります。 エンジンはJPEG圧縮画像とともに
[`screenshotready`](/legacy/api/aframeevents/screenshotready) イベントを、エラーが発生した場合は
[`screenshoterror`](/legacy/api/aframeevents/screenshoterror) イベントを発行します。 AFrameキャンバスのスクリーンショットをキャプチャするリクエストをエンジンに送ります。 エンジンはJPEG圧縮画像とともに
[`screenshotready`](/legacy/api/aframeevents/screenshotready) イベントを、エラーが発生した場合は
[`screenshoterror`](/legacy/api/aframeevents/screenshoterror) イベントを発行します。

## パラメータ {#parameters}

なし

## 例 {#example}

```javascript
const scene = this.el.sceneEl
const photoButton = document.getElementById('photoButton')

// ユーザータップ時にscreenshotrequestをemit
photoButton.addEventListener('click', () => {
  image.src = ""
  scene.emit('screenshotrequest')
})

scene.addEventListener('screenshotready', event => {
  image.src = 'data:image/jpeg;base64,' + event.detail
})

scene.addEventListener('screenshoterror', event => {
  console.log("error")
})
```
