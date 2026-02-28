# onRender()

`onRender: ()`

## Descripción {#description}

`onRender()` se llama después de [`onUpdate`](onupdate.md). Este es el momento en que el motor de renderizado emite cualquier comando de dibujo WebGL. Si una aplicación proporciona su propio bucle de ejecución y confía en [`XR8.runPreRender()`](/api/xr8/runprerender) y [`XR8.runPostRender()`](/api/xr8/runprerender), no se llama a este método y toda la renderización debe ser coordinada por el bucle de ejecución externo.

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onRender: () => {
 // Esto ya lo hace XR8.Threejs.pipelineModule(), pero se proporciona aquí a modo de ilustración.
    XR8.Threejs.xrScene().renderer.render()
  },
})
```
