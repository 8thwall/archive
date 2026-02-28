---
sidebar_position: 1
---

# xr:layerscanning

## Descripción {#description}

Este evento se emite cuando se han cargado todos los recursos de segmentación de capas y ha comenzado la exploración. Se envía un evento por capa escaneada.

`xr:layerscanning.detail : { name }`

| Propiedad        | Descripción                                  |
| ---------------- | -------------------------------------------- |
| nombre: `cadena` | El nombre de la capa que estamos escaneando. |

## Ejemplo {#example}

```javascript
this.app.on('xr:layerscanning', (event) => {
  console.log(`La capa ${event.name} ha comenzado a escanearse.`)
}, this)
```
