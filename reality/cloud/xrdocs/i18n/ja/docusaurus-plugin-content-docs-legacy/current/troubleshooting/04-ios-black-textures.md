---
id: ios-black-textures
---

# iOSデバイスの黒いテクスチャ

#### 問題 {#issue}

特定のバージョンのiOSで高解像度や多数のテクスチャを使用すると、SafariのGPUメモリが不足することがあります。 テクスチャが黒くレンダリングされたり、ページがクラッシュしたりすることがある。 テクスチャが黒くレンダリングされたり、ページがクラッシュしたりすることがある。

#### 回避策 {#workarounds}

1. **シーンで使用するテクスチャのサイズ/解像度を小さくする** (
   [テクスチャの最適化](/legacy/guides/your-3d-models-on-the-web/#texture-optimization) を参照)

2. \*\*iOSデバイスで画像のビットマップを無効にする：

iOS 14とiOS 15には、テクスチャの問題を引き起こす可能性のある画像ビットマップに関連する既存のバグがあります。
画像ビットマップを無効にして、黒いテクスチャやクラッシュを防ぎます。 以下の例を参照のこと：
画像ビットマップを無効にして、黒いテクスチャやクラッシュを防ぎます。 以下の例を参照のこと：

#### 例iOSビットマップを無効にする（app.jsの先頭に追加）： {#example-disable-ios-bitmaps-add-to-the-top-of-appjs}

```javascript
// iOSでは、ビットマップがテクスチャの問題を引き起こすことがあります。
const IS_IOS =
  /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
  (/^Mac/.test(window.navigator.platform) && window.navigator.maxTouchPoints > 1)
if (IS_IOS) {
  window.createImageBitmap = undefined
}.
```
