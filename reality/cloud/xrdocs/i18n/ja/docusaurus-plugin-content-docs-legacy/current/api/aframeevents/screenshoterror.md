# スクリーンショットエラー

## 説明 {#description}

このイベントは、エラーが発生した [`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) に応答して発行される。

## 例 {#example}

```javascript
let scene = this.el.sceneEl
scene.addEventListener('screenshoterror', (event) => {
  console.log(event.detail)
  // スクリーンショットエラーを処理する。
})
```
