---
sidebar_position: 1
---

# xr:camerastatuschange

## Description {#description}

Cet événement est déclenché lorsque l'état de la caméra change. Voir [`onCameraStatusChange`](/api/camerapipelinemodule/oncamerastatuschange) from [`XR8.addCameraPipelineModule()`](/api/camerapipelinemodule) pour plus d'informations sur les états possibles.

## Exemple {#example}

```javascript
const handleCameraStatusChange = function handleCameraStatusChange(detail) {
  console.log('status change', detail.status) ;

  switch (detail.status) {
    case 'requesting' :
      // Faites quelque chose
      break ;

    case 'hasStream' :
      // Fait quelque chose
      break ;

    case 'failed' :
      this.app.fire('xr:realityerror') ;
      break ;
  }
}
this.app.on('xr:camerastatuschange', handleCameraStatusChange, this)
```
