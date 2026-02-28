---
sidebar_label: permissions()
---

# XR8.XrPermissions.permissions()

Enumeración

## Descripción {#description}

Permisos que puede requerir un módulo de canalización.

## Propiedades {#properties}

| Propiedad          | Valor                           | Descripción                |
| ------------------ | ------------------------------- | -------------------------- |
| 'CAMERA'           | `cámara`                        | Requiere cámara.           |
| DEVICE_MOTION      | `'devicemoción'`                | Requiere acelerómetro.     |
| DEVICE_ORIENTATION | `'orientación del dispositivo'` | Requiere giroscopio.       |
| DEVICE_GPS         | `'geolocalización'`             | Requiere localización GPS. |
| MICRÓFONO          | `'micrófono'`                   | Requiere micrófono.        |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
