---
sidebar_label: isDeviceBrowserCompatible()
---

# XR8.XrDevice.isDeviceBrowserCompatible()

`XR8.XrDevice.isDeviceBrowserCompatible({ allowedDevices })`

## Descripción {#description}

Devuelve una estimación de si el dispositivo y el navegador del usuario son compatibles con 8th Wall Web. Si devuelve false, [`XR8.XrDevice.incompatibleReasons()`](incompatiblereasons.md) devolverá las razones por las que el dispositivo y el navegador no son compatibles.

## Parámetros {#parameters}

| Parámetro                                                                             | Descripción                                                                                                           |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| dispositivospermitidos [Opcional] | Clases de dispositivo soportadas, un valor en [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device). |

## Devuelve {#returns}

Verdadero o falso.

## Ejemplo {#example}

```javascript
XR8.XrDevice.isDeviceBrowserCompatible({allowedDevices: XR8.XrConfig.device().MOBILE})
```
