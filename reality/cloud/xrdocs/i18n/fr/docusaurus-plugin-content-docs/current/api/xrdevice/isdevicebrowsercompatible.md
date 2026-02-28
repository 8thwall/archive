---
sidebar_label: isDeviceBrowserCompatible()
---

# XR8.XrDevice.isDeviceBrowserCompatible()

`XR8.XrDevice.isDeviceBrowserCompatible({ allowedDevices })`

## Description {#description}

Indique si l'appareil et le navigateur de l'utilisateur sont compatibles avec 8th Wall Web. Si le résultat est faux, [`XR8.XrDevice.incompatibleReasons()`](incompatiblereasons.md) renverra les raisons pour lesquelles le périphérique et le navigateur ne sont pas pris en charge.

## Paramètres {#parameters}

| Paramètres                  | Description                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| allowedDevices [Facultatif] | Classes de périphériques prises en charge, une valeur dans [`XR8.XrConfig.device()`](/api/xrconfig/device). |

## Retours {#returns}

Vrai ou faux.

## Exemple {#example}

```javascript
XR8.XrDevice.isDeviceBrowserCompatible({allowedDevices: XR8.XrConfig.device().MOBILE})
```
