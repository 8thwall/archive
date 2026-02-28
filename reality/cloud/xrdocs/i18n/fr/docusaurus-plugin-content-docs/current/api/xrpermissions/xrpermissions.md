# XR8.XrPermissions

## Description {#description}

Utilitaires permettant de spécifier les autorisations requises par un module de pipeline.

Les modules peuvent indiquer les fonctionnalités du navigateur dont ils ont besoin et qui peuvent nécessiter des demandes d'autorisation. Elles peuvent être utilisées par le cadre pour demander les autorisations appropriées en cas d'absence, ou pour créer des composants qui demandent les autorisations appropriées avant d'exécuter XR.

## Propriétés {#properties}

| Propriété                       | Type | Description                                                                                   |
| ------------------------------- | ---- | --------------------------------------------------------------------------------------------- |
| [permissions()](permissions.md) | Enum | Liste des autorisations qui peuvent être spécifiées comme requises par un module de pipeline. |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'request-gyro',
  requiredPermissions : () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
