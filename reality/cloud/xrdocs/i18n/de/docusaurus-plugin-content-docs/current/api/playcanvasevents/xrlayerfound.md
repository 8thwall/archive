---
sidebar_position: 1
---

# xr:layerfound

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn eine Ebene zum ersten Mal gefunden wird.

`xr:layerfound.detail : { name, percentage }`

| Eigentum            | Beschreibung                                |
| ------------------- | ------------------------------------------- |
| name: `string`      | Der Name der Ebene, die gefunden wurde.     |
| prozentsatz: `Zahl` | Der Prozentsatz der Pixel, die Himmel sind. |

## Beispiel {#example}

```javascript
this.app.on('xr:layerfound', (event) => {
  console.log(`Schicht ${event.name} gefunden in ${event.percentage} des Bildschirms.`)
}, this)
```
