# onPaused()

`onPaused : ()`

## Description {#description}

`onPaused()` est appelé lorsque [`XR8.pause()`](/api/engine/xr8/pause) est appelé.

## Paramètres {#parameters}

Aucun

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onPaused : () => {
    console.log('pausing application')
  },
})
```
