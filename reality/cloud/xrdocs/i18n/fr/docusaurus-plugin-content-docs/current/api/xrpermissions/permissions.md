---
sidebar_label: permissions()
---

# XR8.XrPermissions.permissions()

Enumération

## Description {#description}

Permissions qui peuvent être requises par un module de pipeline.

## Propriétés {#properties}

| Propriété                   | Valeur                      | Description                     |
| --------------------------- | --------------------------- | ------------------------------- |
| CAMÉRA                      | `caméra`                    | Nécessite un appareil photo.    |
| DEVICE_MOTION               | `« devicemotion`            | Nécessite un accéléromètre.     |
| ORIENTATION_DU_DISPOSITIF | `orientation du dispositif` | Nécessite un gyroscope.         |
| DEVICE_GPS                  | `géolocalisation`           | Nécessite une localisation GPS. |
| MICROPHONE                  | `microphone`                | Nécessite un microphone.        |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'request-gyro',
  requiredPermissions : () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
