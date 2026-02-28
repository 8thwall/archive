---
sidebar_position: 1
---

# xr:カメラステータス変更

## 説明 {#description}

このイベントはカメラのステータスが変更されたときに発生します。 このイベントはカメラのステータスが変更されたときに発生します。 設定可能なステータスについては
[`XR8.addCameraPipelineModule()`](/legacy/api/camerapipelinemodule) の
[`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) を参照してください。 このイベントはカメラのステータスが変更されたときに発生します。 設定可能なステータスについては
[`XR8.addCameraPipelineModule()`](/legacy/api/camerapipelinemodule) の
[`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) を参照してください。

## 例 {#example}

```javascript
const handleCameraStatusChange = function handleCameraStatusChange(detail) {
  console.log('status change', detail.status);

  switch (detail.status) {
    case 'requesting'：
      // Do something
      break;

    case 'hasStream'：
      // Do something
      break;

    case 'failed':
      this.app.fire('xr:realityerror');
      break;
  }.
}
this.app.on('xr:camerastatuschange', handleCameraStatusChange, this)
```
