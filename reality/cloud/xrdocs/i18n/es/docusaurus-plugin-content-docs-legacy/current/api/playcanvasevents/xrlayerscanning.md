---
sidebar_position: 1
---

# xr:exploración de capas

## Descripción {#description}

Este evento se emite cuando se han cargado todos los recursos de segmentación de capas y se ha iniciado la exploración. Se envía un evento por cada capa escaneada.

`xr:layerscanning.detail : { name }`

| Propiedad                        | Descripción                                                  |
| -------------------------------- | ------------------------------------------------------------ |
| nombre: `string` | El nombre de la capa que estamos escaneando. |

## Ejemplo {#example}

```javascript
this.app.on('xr:layerscanning', (event) => {
  console.log(`Layer ${event.name} has started scanning.`)
}, this)
```
