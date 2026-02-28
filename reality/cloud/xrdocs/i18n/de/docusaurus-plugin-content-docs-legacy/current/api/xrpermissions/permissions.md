---
sidebar_label: Berechtigungen()
---

# XR8.XrPermissions.permissions()

Aufzählung

## Beschreibung {#description}

Berechtigungen, die für ein Pipeline-Modul erforderlich sein können.

## Eigenschaften {#properties}

| Eigentum                                | Wert                               | Beschreibung                                           |
| --------------------------------------- | ---------------------------------- | ------------------------------------------------------ |
| KAMERA                                  | 'Kamera'                           | Sie benötigen eine Kamera.             |
| GERÄT_BETRIEB      | 'devicemotion'                     | Erfordert einen Beschleunigungsmesser. |
| GERÄTE_AUSRICHTUNG | 'Geräteorientierung'               | Erfordert Kreisel.                     |
| GERÄT_GPS          | Geolokalisierung". | Erfordert GPS-Ortung.                  |
| MIKROFON                                | Mikrofon".         | Ein Mikrofon ist erforderlich.         |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
