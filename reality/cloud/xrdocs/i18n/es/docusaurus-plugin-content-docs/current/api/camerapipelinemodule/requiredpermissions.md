# requiredPermissions()

`requiredPermissions: ([permissions])`

## Descripción {#description}

`requiredPermissions` se utiliza para definir la lista de permisos requeridos por un módulo pipeline.

## Parámetros {#parameters}

| Parámetro   | Descripción                                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| permissions | Una matriz de [`XR8.XrPermissions.permissions()`](/api/xrpermissions/permissions) requerida por el módulo de canalización. |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
