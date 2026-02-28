# onPaused()

onPaused: ()\`

## Descripción {#description}

Se llama a `onPaused()` cuando se llama a [`XR8.pause()`](/legacy/api/xr8/pause).

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onPaused: () => {
    console.log('aplicación en pausa')
  },
})
```
