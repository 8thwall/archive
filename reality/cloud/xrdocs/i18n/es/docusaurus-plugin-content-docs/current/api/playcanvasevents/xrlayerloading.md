---
sidebar_position: 1
---

# xr:layerloading

## Descripción {#description}

Este evento se emite cuando comienza la carga para la segmentación de capas adicionales.

`xr:layerloading.detail : { }`

## Ejemplo {#example}

```javascript
this.app.on('xr:layerloading', () => {
  console.log(`Carga de capas.`)
}, this)
```
