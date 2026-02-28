---
sidebar_position: 1
---

# xr:kamerastatus-wechsel

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn sich der Status der Kamera ändert. Siehe
[`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) von
[`XR8.addCameraPipelineModule()`](/legacy/api/camerapipelinemodule) für weitere Informationen über den möglichen Status.

## Beispiel {#example}

```javascript
const handleCameraStatusChange = function handleCameraStatusChange(detail) {
  console.log('status change', detail.status);

  switch (detail.status) {
    case 'requesting':
      // Tun Sie etwas
      break;

    case 'hasStream':
      // Etwas tun
      break;

    case 'failed':
      this.app.fire('xr:realityerror');
      break;
  }
}
this.app.on('xr:camerastatuschange', handleCameraStatusChange, this)
```
