---
sidebar_position: 2
---

# Eventos de destino de imagen de PlayCanvas

Los eventos de destino de imagen se pueden escuchar como `this.app.on(event, handler, this)`.

**xr:imageloading**: Se activa cuando comienza la carga de la imagen de detección.

`xr:imageloading : { imageTargets: {name, type, metadata} }`

**xr:imagescanning**: Se activa cuando se han cargado todas las imágenes de detección y se ha iniciado la exploración.

`xr:imagescanning : {objetivos de imagen: {nombre, tipo, metadatos, geometría} }`

**xr:imagefound**: Se activa cuando se encuentra por primera vez un objetivo de imagen.

xr:imagefound : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }\`

**xr:imageupdated**: Se activa cuando una imagen cambia de posición, rotación o escala.

xr:imageupdated : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }\`

**xr:imagelost**: Se dispara cuando un objetivo de imagen deja de ser rastreado.

`xr:imagelost : { name, type, position, rotation, scale, scaledWidth, scaledHeight, height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians }`

## Ejemplo {#example}

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
