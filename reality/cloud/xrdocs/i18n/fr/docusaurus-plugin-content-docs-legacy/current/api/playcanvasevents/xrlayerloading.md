---
sidebar_position: 1
---

# xr:layerloading

## Description {#description}

Cet événement est émis lorsque le chargement commence pour la segmentation des couches supplémentaires.

`xr:layerloading.detail : { }`

## Exemple {#example}

```javascript
this.app.on('xr:layerloading', () => {
  console.log(`Layer loading.`)
}, this)
```
