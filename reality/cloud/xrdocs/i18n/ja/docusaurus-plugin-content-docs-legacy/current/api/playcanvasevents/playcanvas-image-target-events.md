---
sidebar_position: 2
---

# PlayCanvas イメージターゲットイベント

画像ターゲットのイベントは、`this.app.on(event, handler, this)`としてリッスンすることができます。

**xr:imageloading**：検出画像のロードが開始されたときに発生します。

xr:imageloading : { imageTargets： {name, type, metadata} }\\`

**xr:imagescanning**：すべての検出画像がロードされ、スキャンが開始されたときに発生します。

`xr:imagescanning : { imageTargets：{名前、タイプ、メタデータ、ジオメトリ}。}`

**xr:imagefound**：画像ターゲットが最初に見つかったときに発生します。

xr:imagefound : { name、type、position、rotation、scale、scaledWidth、scaledHeight、height、radiusTop、radiusBottom、arcStartRadians、arcLengthRadians }\\`。

**xr:imageupdated**：画像ターゲットの位置、回転、スケールが変更されたときに発生します。

xr:imageupdated : { name、type、position、rotation、scale、scaledWidth、scaledHeight、height、radiusTop、radiusBottom、arcStartRadians、arcLengthRadians }\\`。

**xr:imagelost**：画像ターゲットが追跡されなくなったときに発生します。

xr:imagelost : { name、type、position、rotation、scale、scaledWidth、scaledHeight、height、radiusTop、radiusBottom、arcStartRadians、arcLengthRadians }\\`。

## 例 {#example}

```javascript
const showImage = (detail) => {
  if (name != detail.name) { return }
  const {rotation, position, scale} = detail
  entity.setRotation(rotation.x, rotation.y, rotation.z, rotation.w)
  entity.setPosition(position.x, position.y, position.z)
  entity.setLocalScale(scale, scale, scale)
  entity.enabled = true
}

const hideImage = (detail) => {
  if (name != detail.name) { return }
  entity.enabled = false
}

this.app.on('xr:imagefound', showImage, {})
this.app.on('xr:imageupdated', showImage, {})
this.app.on('xr:imagelost', hideImage, {})
```
