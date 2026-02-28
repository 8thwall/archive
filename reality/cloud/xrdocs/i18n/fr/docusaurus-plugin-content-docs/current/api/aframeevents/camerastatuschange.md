# changement d'état de la caméra

## Description {#description}

Cet événement est émis lorsque l'état de la caméra change. Voir [`onCameraStatusChange`](/api/camerapipelinemodule/oncamerastatuschange) depuis [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule) pour plus d'informations sur les états possibles .

## Exemple {#example}

```javascript
var handleCameraStatusChange = function handleCameraStatusChange(event) {
  console.log('status change', event.detail.status) ;

  switch (event.detail.status) {
    case 'requesting' :
      // Fait quelque chose
      break ;

    case 'hasStream' :
      // Fait quelque chose
      break ;

    case 'failed' :
      event.target.emit('realityerror') ;
      break ;
  }
} ;
let scene = this.el.sceneEl
scene.addEventListener('camerastatuschange', handleCameraStatusChange)
```
