# onRender()

`onRender: ()`

## Descripción {#description}

`onRender()` se llama después de [`onUpdate`](onupdate.md). Este es el momento para que el motor de renderizado emita cualquier comando de dibujo WebGL. Si una aplicación está proporcionando su propio bucle de ejecución y está confiando en [`XR8.runPreRender()`](/legacy/api/xr8/runprerender) y [`XR8.runPostRender()`](/legacy/api/xr8/runprerender), este método no es llamado y todo el renderizado debe ser coordinado por el bucle de ejecución externo.

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onRender: () => {
    // Esto ya lo hace XR8.Threejs.pipelineModule() pero se proporciona aquí como ilustración.
    XR8.Threejs.xrScene().renderer.render()
  },
})
```
