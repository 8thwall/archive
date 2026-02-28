# camerastatuschange

## Descripción {#description}

Este evento se emite cuando cambia el estado de la cámara. Consulta [`onCameraStatusChange`](/api/camerapipelinemodule/oncamerastatuschange) de [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule) para obtener más información sobre los posibles estados .

## Ejemplo {#example}

```javascript
var handleCameraStatusChange = function handleCameraStatusChange(event) {
  console.log('status change', event.detail.status);

  switch (event.detail.status) {
    case 'requesting':
      // Do something
      break;

    case 'hasStream':
      // Do something
      break;

    case 'failed':
      event.target.emit('realityerror');
      break;
  }
};
let scene = this.el.sceneEl
scene.addEventListener('camerastatuschange', handleCameraStatusChange)
```
