---
sidebar_position: 2
---

# Événements de l'image cible PlayCanvas

Les événements d’images cible peuvent être écoutés comme `this.app.on(event, handler, this)`.

**xr:imageloading**: Se déclenche lorsque le chargement de l'image de détection commence.

`xr:imageloading : { imageTargets: {name, type, metadata} }`

**xr:imagescanning**: Se déclenche lorsque toutes les images de détection ont été chargées et que la numérisation a commencé.

`xr:imagescanning : { imageTargets: {name, type, metadata, geometry} }`

**xr:imagefound**: Se déclenche lorsqu'une cible d'image est trouvée pour la première fois.

`xr:imagefound : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

**xr:imageupdated**: Se déclenche lorsqu'une image cible change de position, de rotation ou d'échelle.

`xr:imageupdated : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

**xr:imagelost**: Se déclenche lorsqu'une image cible n'est plus suivie.

`xr:imagelost : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

## Exemple {#example}

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
