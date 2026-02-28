# realityerror

## Descripción {#description}

Este evento se emite cuando se ha producido un error al inicializar 8th Wall Web. Este es el tiempo recomendado por
en el que deben mostrarse los mensajes de error. La [`XR8.XrDevice()` API](/legacy/api/xrdevice)
puede ayudar a determinar qué tipo de mensaje de error debe mostrarse.

## Ejemplo {#example}

```javascript
let scene = this.el.sceneEl
  scene.addEventListener('realityerror', (event) => {
    if (XR8.XrDevice.isDeviceBrowserCompatible()) {
      // El navegador es compatible. Imprime la excepción para obtener más información.
      console.log(event.detail.error)
      return
    }

    // El navegador no es compatible. Comprueba las razones por las que puede no serlo.
    for (let reason of XR8.XrDevice.incompatibleReasons()) {
      // Maneja cada XR8.XrDevice.IncompatibilityReasons
    }
  })
```
