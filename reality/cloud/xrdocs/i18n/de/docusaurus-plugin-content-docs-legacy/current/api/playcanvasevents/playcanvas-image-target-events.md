---
sidebar_position: 2
---

# PlayCanvas Bild-Ziel-Ereignisse

Bildzielereignisse können als `this.app.on(event, handler, this)` abgehört werden.

**xr:imageloading**: Wird ausgelöst, wenn das Laden des Erkennungsbildes beginnt.

`xr:imageloading : { imageTargets: {name, type, metadata} }`

**xr:imagescanning**: Wird ausgelöst, wenn alle Erkennungsbilder geladen wurden und der Scanvorgang begonnen hat.

`xr:imagescanning : { imageTargets: {Name, Typ, Metadaten, Geometrie} }`

**xr:imagefound**: Wird ausgelöst, wenn ein Bildziel zum ersten Mal gefunden wird.

`xr:imagefound : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

**xr:imageupdated**: Wird ausgelöst, wenn ein Bildziel seine Position, Drehung oder Skalierung ändert.

`xr:imageupdated : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

**xr:imagelost**: Wird ausgelöst, wenn ein Bildziel nicht mehr verfolgt wird.

`xr:imagelost : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

## Beispiel {#example}

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
