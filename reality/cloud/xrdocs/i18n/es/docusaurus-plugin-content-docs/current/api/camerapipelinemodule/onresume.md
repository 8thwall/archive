# onResume()

`onResume: ()`

## Descripción {#description}

`onResume()` se llama cuando se llama a [`XR8.resume()`](/api/xr8/resume).

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onResume: () => {
    console.log('resuming application')
  },
})
```
