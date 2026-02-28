---
sidebar_label: isDeviceBrowserCompatible()
---

# XR8.XrDevice.isDeviceBrowserCompatible()

`XR8.XrDevice.isDeviceBrowserCompatible({ allowedDevices })`

## Beschreibung {#description}

Gibt eine Einschätzung zurück, ob das Gerät und der Browser des Benutzers mit 8th Wall Web kompatibel sind. Wenn dies false zurückgibt, gibt [`XR8.XrDevice.incompatibleReasons()`](incompatiblereasons.md) Gründe zurück, warum das Gerät und der Browser nicht unterstützt werden.

## Parameter {#parameters}

| Parameter                                                                     | Beschreibung                                                                                                    |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| allowedDevices [Optional] | Unterstützte Geräteklassen, ein Wert in [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device). |

## Rückgabe {#returns}

Richtig oder falsch.

## Beispiel {#example}

```javascript
XR8.XrDevice.isDeviceBrowserCompatible({allowedDevices: XR8.XrConfig.device().MOBILE})
```
