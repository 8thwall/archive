---
sidebar_position: 1
---

# xr:リアリティエラー

## 説明 {#description}

このイベントは8th Wall Webの初期化時にエラーが発生した場合に発行されます。 これは、エラーメッセージが表示される
推奨時間である。 XR8.XrDevice()\` API](/legacy/api/xrdevice)
は、どのようなエラーメッセージを表示するかを決めるのに役立ちます。 これは、エラーメッセージが表示される
推奨時間である。 XR8.XrDevice()` API](/legacy/api/xrdevice)
は、どのようなエラーメッセージを表示するかを決めるのに役立ちます。

## 例 {#example}

```javascript
this.app.on('xr:realityerror', ({error, isDeviceBrowserSupported, compatibility}) => {
  if (detail.isDeviceBrowserSupported) {
    // ブラウザは互換性があります。
    console.log(error)
    return
  } // ブラウザは互換性がありません。

  // ブラウザは互換性がありません。互換性`にない理由をチェック
  console.log(compatibility)
}, this)
```
