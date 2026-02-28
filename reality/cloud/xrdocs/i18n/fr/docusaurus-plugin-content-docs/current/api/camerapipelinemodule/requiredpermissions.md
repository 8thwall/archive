# autorisations requises()

`permissions requises : ([permissions])`

## Description {#description}

`requiredPermissions` est utilisé pour définir la liste des autorisations requises par un module de pipeline.

## Paramètres {#parameters}

| Paramètres    | Description                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| autorisations | Un tableau de [`XR8.XrPermissions.permissions()`](/api/xrpermissions/permissions) requis par le module de pipeline. |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'request-gyro',
  requiredPermissions : () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
