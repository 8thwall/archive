# xr:スクリーンショット要求

`this.app.fire('xr:screenshotrequest')`。

## パラメータ {#parameters}

なし

## 説明 {#description}

PlayCanvas キャンバスのスクリーンショットをキャプチャするリクエストをエンジンに発行します。 エンジンはJPEG圧縮された画像で
[`xr:screenshotready`](/legacy/api/playcanvasevents/xrscreenshotready)イベントを、エラーが発生した場合は
[`xr:screenshoterror`](/legacy/api/playcanvasevents/xrscreenshoterror)イベントを発行します。 エンジンはJPEG圧縮された画像で
[`xr:screenshotready`](/legacy/api/playcanvasevents/xrscreenshotready)イベントを、エラーが発生した場合は
[`xr:screenshoterror`](/legacy/api/playcanvasevents/xrscreenshoterror)イベントを発行します。

## 例 {#example}

```javascript
this.app.on('xr:screenshotready', (event) => {
  // screenshotPreviewは<img> HTML要素
  const image = document.getElementById('screenshotPreview')
  image.src = 'data:image/jpeg;base64,' + event.detail
}, this)

this.app.on('xr:screenshoterror', (detail) => {
  console.log(detail)
  // スクリーンショットエラーを処理します。
}, this)

this.app.fire('xr:screenshotrequest')
```
