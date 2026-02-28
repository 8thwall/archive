# リアリティエラー

## 説明 {#description}

このイベントは8th Wall Webの初期化時にエラーが発生した場合に発行されます。 これは、エラーメッセージが表示される
推奨時間である。 XR8.XrDevice()\` API](/legacy/api/xrdevice)
は、どのようなエラーメッセージを表示するかを決めるのに役立ちます。 これは、エラーメッセージが表示される
推奨時間である。 XR8.XrDevice()` API](/legacy/api/xrdevice)
は、どのようなエラーメッセージを表示するかを決めるのに役立ちます。

## 例 {#example}

```javascript
let scene = this.el.sceneEl
  scene.addEventListener('realityerror', (event) => {
    if (XR8.XrDevice.isDeviceBrowserCompatible()) {
      // ブラウザは互換性があります。
      console.log(event.detail.error)
      return
    } // ブラウザは互換性がありません。

    // ブラウザは互換性がありません。
    for (let reason of XR8.XrDevice.incompatibleReasons()) {
      // 各XR8.XrDevice.IncompatibilityReasonsの処理
    }.
  })
```
