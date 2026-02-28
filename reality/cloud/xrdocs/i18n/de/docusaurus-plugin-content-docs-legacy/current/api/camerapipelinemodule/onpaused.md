# onPaused()

`onPaused: ()`

## Beschreibung {#description}

`onPaused()` wird aufgerufen, wenn [`XR8.pause()`](/legacy/api/xr8/pause) aufgerufen wird.

## Parameter {#parameters}

Keine

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onPaused: () => {
    console.log('pausing application')
  },
})
```
