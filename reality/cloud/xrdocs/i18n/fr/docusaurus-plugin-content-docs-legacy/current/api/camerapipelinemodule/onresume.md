# onResume()

`onResume : ()`

## Description {#description}

`onResume()` est appelé lorsque [`XR8.resume()`](/legacy/api/xr8/resume) est appelé.

## Paramètres {#parameters}

Aucun

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onResume : () => {
    console.log('resuming application')
  },
})
```
