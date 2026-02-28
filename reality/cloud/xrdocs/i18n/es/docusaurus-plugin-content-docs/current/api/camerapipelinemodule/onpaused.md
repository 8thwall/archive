# onPaused()

`onPaused: ()`

## Descripción {#description}

`onPaused()` se llama cuando se llama a [`XR8.pause()`](/api/xr8/pause).

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onPaused: () => {
    console.log('pausing application')
  },
})
```
