# onResume()

`onResume: ()`

## Descripción {#description}

Se llama a `onResume()` cuando se llama a [`XR8.resume()`](/api/engine/xr8/resume).

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onResume: () => {
    console.log('reanudando aplicación')
  },
})
```
