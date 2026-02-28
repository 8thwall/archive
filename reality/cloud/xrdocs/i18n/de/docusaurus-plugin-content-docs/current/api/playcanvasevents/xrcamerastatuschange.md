---
sidebar_position: 1
---

# xr:camerastatuschange

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn sich der Status der Kamera ändert. Siehe [`onCameraStatusChange`](/api/camerapipelinemodule/oncamerastatuschange) von [`XR8.addCameraPipelineModule()`](/api/camerapipelinemodule) für weitere Informationen über den möglichen Status.

## Beispiel {#example}

```javascript
const handleCameraStatusChange = function handleCameraStatusChange(detail) {
  console.log('Statusänderung', detail.status);

  switch (detail.status) {
    case 'requesting':
      // Tun Sie etwas
      break;

    case 'hasStream':
      // Tun Sie etwas
      break;

    case 'failed':
      this.app.fire('xr:realityerror');
      break;
  }
}
this.app.on('xr:camerastatuschange', handleCameraStatusChange, this)
```
