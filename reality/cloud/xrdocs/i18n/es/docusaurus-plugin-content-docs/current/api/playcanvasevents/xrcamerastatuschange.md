---
sidebar_position: 1
---

# xr:camerastatuschange

## Descripción {#description}

Este evento se dispara cuando cambia el estado de la cámara. Consulta [`onCameraStatusChange`](/api/camerapipelinemodule/oncamerastatuschange) de [`XR8.addCameraPipelineModule()`](/api/camerapipelinemodule) para obtener más información sobre los posibles estados.

## Ejemplo {#example}

```javascript
const handleCameraStatusChange = function handleCameraStatusChange(detail) {
  console.log('status change', detail.status);

  switch (detail.status) {
    case 'requesting':
      // Do something
      break;

    case 'hasStream':
      // Do something
      break;

    case 'failed':
      this.app.fire('xr:realityerror');
      break;
  }
}
this.app.on('xr:camerastatuschange', handleCameraStatusChange, this)
```
