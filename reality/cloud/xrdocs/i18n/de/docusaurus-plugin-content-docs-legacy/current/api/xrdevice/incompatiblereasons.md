---
sidebar_label: inkompatibleGründe()
---

# XR8.XrDevice.incompatibleReasons()

`XR8.XrDevice.incompatibleReasons({ allowedDevices })`

## Beschreibung {#description}

Gibt ein Array von [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md) zurück, warum das Gerät das Gerät und der Browser nicht unterstützt werden. Diese enthält nur Einträge, wenn [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) false zurückgibt.

## Parameter {#parameters}

| Parameter                                                                     | Beschreibung                                                                                                    |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| allowedDevices [Optional] | Unterstützte Geräteklassen, ein Wert in [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device). |

## Rückgabe {#returns}

Gibt ein Array von [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md) zurück.

## Beispiel {#example}

```javascript
const reasons = XR8.XrDevice.incompatibleReasons()
for (let reason of reasons) {
  switch (reason) {
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_OS:
      // Behandelt nicht unterstützte Betriebssystem-Fehlermeldungen.
      break;
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_BROWSER:
       // Behandelt nicht unterstützte Browser
       break;
   ...
}
```
