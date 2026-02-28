# autorisations requises()

`requiredPermissions : ([permissions])`

## Description {#description}

`requiredPermissions` est utilisé pour définir la liste des permissions requises par un module de pipeline.

## Paramètres {#parameters}

| Paramètres    | Description                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| autorisations | Un tableau de [`XR8.XrPermissions.permissions()`](/legacy/api/xrpermissions/permissions) requis par le module pipeline. |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'request-gyro',
  requiredPermissions : () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
