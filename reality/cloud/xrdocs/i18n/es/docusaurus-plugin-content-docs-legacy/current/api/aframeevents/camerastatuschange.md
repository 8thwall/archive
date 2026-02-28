# camerastatuschange

## Descripción {#description}

Este evento se emite cuando cambia el estado de la cámara. Consulte
[`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) de
[`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) para obtener más información sobre los posibles estados
.

## Ejemplo {#example}

```javascript
var handleCameraStatusChange = function handleCameraStatusChange(event) {
  console.log('cambio de estado', event.detail.status);

  switch (event.detail.status) {
    case 'solicitando':
      // Haz algo
      break;

    case 'hasStream':
      // Haz algo
      break;

    case 'failed':
      event.target.emit('realityerror');
      break;
  }
};
let scene = this.el.sceneEl
scene.addEventListener('camerastatuschange', handleCameraStatusChange)
```
