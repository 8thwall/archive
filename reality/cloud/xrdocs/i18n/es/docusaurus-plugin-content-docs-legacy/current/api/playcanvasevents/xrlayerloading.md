---
sidebar_position: 1
---

# xr:carga de capas

## Descripción {#description}

Este evento se emite cuando comienza la carga para la segmentación de capas adicionales.

`xr:layerloading.detail : { }`

## Ejemplo {#example}

```javascript
this.app.on('xr:layerloading', () => {
  console.log(`Layer loading.`)
}, this)
```
