---
sidebar_position: 1
---

# xr:realityerror

## Descripción {#description}

Este evento se emite cuando se ha producido un error al inicializar 8th Wall Web. Este es el tiempo recomendado por
en el que deben mostrarse los mensajes de error. La [`XR8.XrDevice()` API](/legacy/api/xrdevice)
puede ayudar a determinar qué tipo de mensaje de error debe mostrarse.

## Ejemplo {#example}

```javascript
this.app.on('xr:realityerror', ({error, isDeviceBrowserSupported, compatibility}) => {
  if (detail.isDeviceBrowserSupported) {
    // El navegador es compatible. Imprime la excepción para más información.
    console.log(error)
    return
  }

  // El navegador no es compatible. Comprueba las razones por las que puede no estar en `compatibilidad`
  console.log(compatibility)
}, this)
```
