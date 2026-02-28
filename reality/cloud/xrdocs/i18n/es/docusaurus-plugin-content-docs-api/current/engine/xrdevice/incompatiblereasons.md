---
sidebar_label: incompatibleReasons()
---

# XR8.XrDevice.incompatibleReasons()

`XR8.XrDevice.incompatibleReasons({ allowedDevices })`

## Descripción {#description}

Devuelve una matriz de [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md) por qué el dispositivo el dispositivo y el navegador no son compatibles. Sólo contendrá entradas si [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) devuelve false.

## Parámetros {#parameters}

| Parámetro                                                                             | Descripción                                                                                           |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| dispositivospermitidos [Opcional] | Clases de dispositivo soportadas, un valor en [`XR8.XrConfig.device()`](/api/engine). |

## Devuelve {#returns}

Devuelve una matriz de [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md).

## Ejemplo {#example}

```javascript
const reasons = XR8.XrDevice.incompatibleReasons()
for (let reason of reasons) {
  switch (reason) {
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_OS:
      // Gestión de mensajes de error de SO no soportado.
      break;
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_BROWSER:
       // Gestión de navegador no soportado
       break;
   ... }
}
```
