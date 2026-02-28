---
sidebar_label: permisos necesarios()
---

# XR8.permisosrequeridos()

`XR8.requiredPermissions()`

## Descripción {#description}

Devuelve una lista de permisos requeridos por la aplicación.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Una lista de [`XR8.XrPermissions.permissions()`](../xrpermissions/permissions.md).

## Ejemplo {#example}

```javascript
if (XR8.XrPermissions) {
  const permissions = XR8.XrPermissions.permissions()
  const requiredPermissions = XR8.requiredPermissions()
  if (!requiredPermissions.has(permissions.DEVICE_ORIENTATION)) {
    return
  }
}
```
