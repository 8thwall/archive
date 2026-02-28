# requiredPermissions()

`requiredPermissions: ([permissions])`

## Beschreibung {#description}

Mit "Required Permissions" wird die Liste der für ein Pipelinemodul erforderlichen Berechtigungen definiert.

## Parameter {#parameters}

| Parameter      | Beschreibung                                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Berechtigungen | Ein Array von [`XR8.XrPermissions.permissions()`](/api/engine/xrpermissions/permissions), das vom Pipeline-Modul benötigt wird. |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
