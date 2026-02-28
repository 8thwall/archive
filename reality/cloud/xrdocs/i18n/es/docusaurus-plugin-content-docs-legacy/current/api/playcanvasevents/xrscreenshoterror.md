---
sidebar_position: 1
---

# xr:error de pantalla

## Descripción {#description}

Este evento se emite en respuesta a la [`xr:screenshotrequest`](/legacy/api/playcanvaseventlisteners/xrscreenshotrequest) que resulta en un error.

## Ejemplo {#example}

```javascript
this.app.on('xr:screenshoterror', (detail) => {
  console.log(detail)
  // Manejar error de captura de pantalla.
}, this)
```
