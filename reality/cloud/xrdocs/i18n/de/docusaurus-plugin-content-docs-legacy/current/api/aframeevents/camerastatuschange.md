# kamerastatus ändern

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn sich der Status der Kamera ändert. Siehe
[`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) von
[`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) für weitere Informationen über den möglichen
Status.

## Beispiel {#example}

```javascript
var handleCameraStatusChange = function handleCameraStatusChange(event) {
  console.log('status change', event.detail.status);

  switch (event.detail.status) {
    case 'requesting':
      // Tun Sie etwas
      break;

    case 'hasStream':
      // Tu etwas
      break;

    case 'failed':
      event.target.emit('realityerror');
      break;
  }
};
let scene = this.el.sceneEl
scene.addEventListener('camerastatuschange', handleCameraStatusChange)
```
