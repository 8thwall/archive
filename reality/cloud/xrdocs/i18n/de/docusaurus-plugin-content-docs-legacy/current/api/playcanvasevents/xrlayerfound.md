---
sidebar_position: 1
---

# xr:layerfound

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn eine Ebene zum ersten Mal gefunden wird.

`xr:layerfound.detail : { name, percentage }`

| Eigentum                              | Beschreibung                                                |
| ------------------------------------- | ----------------------------------------------------------- |
| Name: `Zeichenfolge`  | Der Name der gefundenen Ebene.              |
| Prozentsatz: `Anzahl` | Der Prozentsatz der Pixel, die Himmel sind. |

## Beispiel {#example}

```javascript
this.app.on('xr:layerfound', (event) => {
  console.log(`Layer ${event.name} gefunden in ${event.percentage} des Bildschirms.`)
}, this)
```
