# permisos necesarios()

`requiredPermissions: ([permisos])`

## Descripción {#description}

`requiredPermissions` se utiliza para definir la lista de permisos requeridos por un módulo pipeline.

## Parámetros {#parameters}

| Parámetro | Descripción                                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| permisos  | Un array de [`XR8.XrPermissions.permissions()`](/legacy/api/xrpermissions/permissions) requerido por el módulo pipeline. |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
