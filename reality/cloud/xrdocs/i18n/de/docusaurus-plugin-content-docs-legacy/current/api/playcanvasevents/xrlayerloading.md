---
sidebar_position: 1
---

# xr:Schichtladung

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn der Ladevorgang für die Segmentierung zusätzlicher Schichten beginnt.

`xr:layerloading.detail : { }`

## Beispiel {#example}

```javascript
this.app.on('xr:layerloading', () => {
  console.log(`Layer loading.`)
}, this)
```
