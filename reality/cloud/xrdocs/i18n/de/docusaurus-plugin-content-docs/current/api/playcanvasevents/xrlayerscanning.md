---
sidebar_position: 1
---

# xr:layerscanning

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn alle Ressourcen für die Segmentierung der Ebene geladen wurden und der Scanvorgang begonnen hat. Für jede Ebene, die gescannt wird, wird ein Ereignis ausgelöst.

`xr:layerscanning.detail : { name }`

| Eigentum       | Beschreibung                         |
| -------------- | ------------------------------------ |
| name: `string` | Der Name der Ebene, die wir scannen. |

## Beispiel {#example}

```javascript
this.app.on('xr:layerscanning', (event) => {
  console.log(`Layer ${event.name} hat mit dem Scannen begonnen.`)
}, this)
```
