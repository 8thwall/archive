---
sidebar_position: 1
---

# xr:layerloading

## Beschreibung {#description}

Dieses Ereignis wird ausgegeben, wenn der Ladevorgang für die Segmentierung zusätzlicher Ebenen beginnt.

`xr:layerloading.detail : { }`

## Beispiel {#example}

```javascript
this.app.on('xr:layerloading', () => {
  console.log(`Layer loading.`)
}, this)
```
