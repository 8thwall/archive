---
sidebar_position: 1
---

# xr:screenshoterror

## Descripción {#description}

Este evento se emite en respuesta a la [`xr:screenshotrequest`](/api/playcanvaseventlisteners/xrscreenshotrequest) que provoca un error.

## Ejemplo {#example}

```javascript
this.app.on('xr:screenshoterror', (detail) => {
  console.log(detail)
  // Gestiona el error de captura de pantalla.
}, this)
```
