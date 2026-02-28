---
sidebar_label: isDeviceBrowserCompatible()
---

# XR8.XrDevice.isDeviceBrowserCompatible()

`XR8.XrDevice.isDeviceBrowserCompatible({ allowedDevices })`

## Description {#description}

Renvoie une estimation de la compatibilité de l'appareil et du navigateur de l'utilisateur avec 8th Wall Web. Si le résultat est faux, [`XR8.XrDevice.incompatibleReasons()`](incompatiblereasons.md) renverra les raisons pour lesquelles le périphérique et le navigateur ne sont pas pris en charge.

## Paramètres {#parameters}

| Paramètres                                                                      | Description                                                                                                        |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| allowedDevices [Facultatif] | Classes de périphériques prises en charge, une valeur dans [`XR8.XrConfig.device()`](/api/engine). |

## Retourne {#returns}

Vrai ou faux.

## Exemple {#example}

```javascript
XR8.XrDevice.isDeviceBrowserCompatible({allowedDevices : XR8.XrConfig.device().MOBILE})
```
