---
sidebar_label: incompatibleReasons()
---

# XR8.XrDevice.incompatibleReasons()

`XR8.XrDevice.incompatibleReasons({ allowedDevices })`

## Description {#description}

Renvoie un tableau de [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md) raisons pour lesquelles l'appareil, le périphérique et le navigateur ne sont pas pris en charge. Il ne contiendra des entrées que si [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) renvoie la valeur faux.

## Paramètres {#parameters}

| Paramètres                  | Description                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| allowedDevices [Facultatif] | Classes de périphériques prises en charge, une valeur dans [`XR8.XrConfig.device()`](/api/xrconfig/device). |

## Retours {#returns}

Renvoie un tableau de [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md).

## Exemple {#example}

```javascript
const reasons = XR8.XrDevice.incompatibleReasons()
for (let reason of reasons) {
  switch (reason) {
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_OS :
      // Gérer les messages d'erreur concernant les systèmes d'exploitation non pris en charge.
      break ;
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_BROWSER :
       // Gérer un navigateur non pris en charge
       break ;
   ...
}
```
