---
sidebar_position: 1
---

# xr:schichtabtastung

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn alle Segmentierungsressourcen für die Ebene geladen wurden und der Scanvorgang begonnen hat. Pro gescannter Ebene wird ein Ereignis ausgelöst.

`xr:layerscanning.detail : { name }`

| Eigentum                             | Beschreibung                                         |
| ------------------------------------ | ---------------------------------------------------- |
| Name: `Zeichenfolge` | Der Name der Ebene, die wir scannen. |

## Beispiel {#example}

```javascript
this.app.on('xr:layerscanning', (event) => {
  console.log(`Layer ${event.name} hat mit dem Scannen begonnen.`)
}, this)
```
