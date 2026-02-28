---
sidebar_label: incompatibleReasons()
---

# XR8.XrDevice.incompatibleReasons()

`XR8.XrDevice.incompatibleReasons({ allowedDevices })`

## Beschreibung {#description}

Liefert ein Array von [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md) warum das Gerät das Gerät und der Browser nicht unterstützt werden. Diese enthält nur Einträge, wenn [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) false zurückgibt.

## Parameter {#parameters}

| Parameter                 | Beschreibung                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| allowedDevices [Optional] | Unterstützte Geräteklassen, ein Wert in [`XR8.XrConfig.device()`](/api/xrconfig/device). |

## Returns {#returns}

Gibt ein Array von [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md) zurück.

## Beispiel {#example}

```javascript
const reasons = XR8.XrDevice.incompatibleReasons()
for (let reason of reasons) {
  switch (reason) {
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_OS:
      // Fehlermeldungen zu nicht unterstützten Betriebssystemen behandeln.
      break;
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_BROWSER:
       // Nicht unterstützte Browser behandeln
       break;
   ...
}
```
