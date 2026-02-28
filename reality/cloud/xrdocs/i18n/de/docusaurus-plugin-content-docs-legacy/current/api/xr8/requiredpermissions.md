---
sidebar_label: requiredPermissions()
---

# XR8.requiredPermissions()

`XR8.requiredPermissions()`

## Beschreibung {#description}

Gibt eine Liste der von der Anwendung benötigten Berechtigungen zurück.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Eine Liste von [`XR8.XrPermissions.permissions()`](../xrpermissions/permissions.md).

## Beispiel {#example}

```javascript
if (XR8.XrPermissions) {
  const permissions = XR8.XrPermissions.permissions()
  const requiredPermissions = XR8.requiredPermissions()
  if (!requiredPermissions.has(permissions.DEVICE_ORIENTATION)) {
    return
  }
}
```
