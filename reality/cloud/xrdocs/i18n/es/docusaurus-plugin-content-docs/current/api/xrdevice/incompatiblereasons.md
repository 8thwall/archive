---
sidebar_label: incompatibleReasons()
---

# XR8.XrDevice.incompatibleReasons()

`XR8.XrDevice.incompatibleReasons({ allowedDevices })`

## Descripción {#description}

Devuelve una matriz de [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md) razones por las que el dispositivo el dispositivo y el navegador no son compatibles. Sólo contendrá entradas si [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) devuelve false.

## Parámetros {#parameters}

| Parámetro                 | Descripción                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| allowedDevices [Opcional] | Clases de dispositivos compatibles, un valor en [`XR8.XrConfig.device()`](/api/xrconfig/device). |

## Devuelve {#returns}

Devuelve una matriz de [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md).

## Ejemplo {#example}

```javascript
const reasons = XR8.XrDevice.incompatibleReasons()
for (let reason of reasons) {
  switch (reason) {
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_OS:
      // Maneja la mensajería de error de SO no soportado.
      break;
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_BROWSER:
       // Gestionar navegador no compatible
       break;
   ...
}
```
