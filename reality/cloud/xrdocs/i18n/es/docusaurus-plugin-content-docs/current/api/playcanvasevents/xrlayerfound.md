---
sidebar_position: 1
---

# xr:layerfound

## Descripción {#description}

Este evento se emite cuando se encuentra una capa por primera vez.

`xr:layerfound.detail : { name, percentage }`

| Propiedad            | Descripción                                |
| -------------------- | ------------------------------------------ |
| name: `string`       | El nombre de la capa que se ha encontrado. |
| percentage: `number` | El porcentaje de píxeles que son cielo.    |

## Ejemplo {#example}

```javascript
this.app.on('xr:layerfound', (event) => {
  console.log(`Layer ${event.name} found in ${event.percentage} of the screen.`)
}, this)
```
