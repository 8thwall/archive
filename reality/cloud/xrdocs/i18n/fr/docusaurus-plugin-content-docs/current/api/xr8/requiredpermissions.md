---
sidebar_label: requiredPermissions()
---

# XR8.autorisations requises()

`XR8.autorisations requises()`

## Description {#description}

Renvoyer une liste des autorisations requises par l'application.

## Paramètres {#parameters}

Aucun

## Retours {#returns}

Une liste de [`XR8.XrPermissions.permissions()`](../xrpermissions/permissions.md).

## Exemple {#example}

```javascript
if (XR8.XrPermissions) {
  const permissions = XR8.XrPermissions.permissions()
  const requiredPermissions = XR8.requiredPermissions()
  if (!requiredPermissions.has(permissions.DEVICE_ORIENTATION)) {
    return
  }
}
```
