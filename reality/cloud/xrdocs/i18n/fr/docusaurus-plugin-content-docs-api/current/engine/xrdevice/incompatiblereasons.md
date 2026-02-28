---
sidebar_label: raisons incompatibles()
---

# XR8.XrDevice.incompatibleReasons()

`XR8.XrDevice.incompatibleReasons({ allowedDevices })`

## Description {#description}

Retourne un tableau de [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md) pour lesquelles le périphérique, le périphérique et le navigateur ne sont pas supportés. Elle ne contiendra des entrées que si [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) renvoie la valeur false.

## Paramètres {#parameters}

| Paramètres                                                                      | Description                                                                                                        |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| allowedDevices [Facultatif] | Classes de périphériques prises en charge, une valeur dans [`XR8.XrConfig.device()`](/api/engine). |

## Retourne {#returns}

Retourne un tableau de [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md).

## Exemple {#example}

```javascript
const reasons = XR8.XrDevice.incompatibleReasons()
for (let reason of reasons) {
  switch (reason) {
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_OS :
      // Traite les messages d'erreur relatifs aux systèmes d'exploitation non pris en charge.
      break ;
    case XR8.XrDevice.IncompabilityReasons.UNSUPPORTED_BROWSER :
       // Traite les navigateurs non pris en charge
       break ;
   ...
}
```
