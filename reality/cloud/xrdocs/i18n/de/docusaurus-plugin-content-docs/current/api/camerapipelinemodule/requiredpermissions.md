# requiredPermissions()

`requiredPermissions: ([permissions])`

## Beschreibung {#description}

`requiredPermissions` wird verwendet, um die Liste der von einem Pipeline-Modul benötigten Berechtigungen zu definieren.

## Parameter {#parameters}

| Parameter   | Beschreibung                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| permissions | Ein Array von [`XR8.XrPermissions.permissions()`](/api/xrpermissions/permissions) , das vom Pipeline-Modul benötigt wird. |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
