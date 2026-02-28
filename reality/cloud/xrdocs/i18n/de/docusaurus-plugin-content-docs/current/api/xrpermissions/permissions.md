---
sidebar_label: permissions()
---

# XR8.XrPermissions.permissions()

Aufzählung

## Beschreibung {#description}

Berechtigungen, die für ein Pipeline-Modul erforderlich sein können.

## Eigenschaften {#properties}

| Eigentum           | Wert                  | Beschreibung                           |
| ------------------ | --------------------- | -------------------------------------- |
| KAMERA             | `'camera'`            | Erfordert eine Kamera.                 |
| DEVICE_MOTION      | `'devicemotion'`      | Erfordert einen Beschleunigungsmesser. |
| GERÄTE_AUSRICHTUNG | `'Geräteausrichtung'` | Erfordert einen Kreisel.               |
| GERÄT_GPS          | `'Geolokalisierung'`  | Erfordert GPS-Ortung.                  |
| MIKROFON           | `'Mikrofon'`          | Erfordert ein Mikrofon.                |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
