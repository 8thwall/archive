---
sidebar_position: 1
---

# xr:cambioestadocámara

## Descripción {#description}

Este evento se dispara cuando cambia el estado de la cámara. Consulte
[`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) de
[`XR8.addCameraPipelineModule()`](/legacy/api/camerapipelinemodule) para obtener más información sobre los posibles estados.

## Ejemplo {#example}

```javascript
const handleCameraStatusChange = function handleCameraStatusChange(detail) {
  console.log('cambio de estado', detail.status);

  switch (detail.status) {
    case 'solicitando':
      // Haz algo
      break;

    case 'hasStream':
      // Hacer algo
      break;

    case 'failed':
      this.app.fire('xr:realityerror');
      break;
  }
}
this.app.on('xr:camerastatuschange', handleCameraStatusChange, this)
```
