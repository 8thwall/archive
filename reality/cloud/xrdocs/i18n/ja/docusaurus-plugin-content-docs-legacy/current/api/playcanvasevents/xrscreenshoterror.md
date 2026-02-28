---
sidebar_position: 1
---

# xr:スクリーンショットエラー

## 説明 {#description}

このイベントは[`xr:screenshotrequest`](/legacy/api/playcanvaseventlisteners/xrscreenshotrequest)がエラーになった場合に発生します。

## 例 {#example}

```javascript
this.app.on('xr:screenshoterror', (detail) => {
  console.log(detail)
  // スクリーンショットエラーを処理します。
}, this)
```
