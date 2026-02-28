---
sidebar_position: 1
---

# xr:capafunda

## Descripción {#description}

Este evento se emite cuando se encuentra una capa por primera vez.

`xr:layerfound.detail : { name, percentage }`

| Propiedad                            | Descripción                                                |
| ------------------------------------ | ---------------------------------------------------------- |
| nombre: `string`     | El nombre de la capa que se ha encontrado. |
| porcentaje: `número` | El porcentaje de píxeles que son cielo.    |

## Ejemplo {#example}

```javascript
this.app.on('xr:layerfound', (event) => {
  console.log(`Capa ${event.name} encontrada en ${event.percentage} de la pantalla.`)
}, this)
```
