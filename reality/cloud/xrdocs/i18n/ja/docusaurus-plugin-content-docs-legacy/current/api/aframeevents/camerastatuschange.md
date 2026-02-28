# カメラステータス変更

## 説明 {#description}

このイベントはカメラのステータスが変更されたときに発行される。 このイベントはカメラのステータスが変更されたときに発行される。[`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) の [`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) を参照してください。/legacy/api/xr8/addcamerapipelinemodule
/legacy/api/camerapipelinemodule/oncamerastatuschange

## 例 {#example}

```javascript
var handleCameraStatusChange = function handleCameraStatusChange(event) {
  console.log('status change', event.detail.status);

  switch (event.detail.status) {
    case 'requesting'：
      // Do something
      break;

    case 'hasStream'：
      // Do something
      break;

    case 'failed':
      event.target.emit('realityerror');
      break;
  }; let scene = this.
};
let scene = this.el.sceneEl
scene.addEventListener('camerastatuschange', handleCameraStatusChange)
```
