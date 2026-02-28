---
sidebar_label: pipelineModule()
---

# XR8.Threejs.pipelineModule()

`XR8.Threejs.pipelineModule()`

## Descripción {#description}

Un módulo de canalización que interactúa con el entorno y el estilo de vida de three.js. La escena three.js puede ser consultada usando [`XR8.Threejs.xrScene()`](xrscene.md) después de que el método [`onStart`](/legacy/api/camerapipelinemodule/onstart) de [`XR8.Threejs.pipelineModule()`](pipelinemodule.md) sea llamado. La configuración puede realizarse en el método [`onStart`](/legacy/api/camerapipelinemodule/onstart) de otro módulo pipeline haciendo referencia a [`XR8.Threejs.xrScene()`](xrscene.md) siempre y cuando se llame a [`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) en el segundo módulo _después_ de llamar a `XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())`.

- [`onStart`](/legacy/api/camerapipelinemodule/onstart), un renderizador three.js y una escena son creados y configurados para dibujar sobre el feed de una cámara.
- [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate), la cámara three.js se maneja con el movimiento del teléfono.
- [`onRender`](/legacy/api/camerapipelinemodule/onrender), se invoca al método `render()` del renderizador.

Tenga en cuenta que este módulo no dibuja la imagen de la cámara en el lienzo, GlTextureRenderer lo hace en
. Para añadir una cámara en segundo plano, instale el módulo
[`XR8.GlTextureRenderer.pipelineModule()`](/legacy/api/gltexturerenderer/pipelinemodule) antes de instalar este módulo
(para que se renderice antes de que se dibuje la escena).

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Un módulo de canalización de three.js que puede añadirse mediante [`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule).

## Ejemplo {#example}

```javascript
// Añade XrController.pipelineModule(), que permite la estimación del movimiento de la cámara 6DoF.
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())

// Añade un GlTextureRenderer que dibuje la imagen de la cámara en el lienzo.
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// Añade Threejs.pipelineModule() que crea una escena three.js, una cámara y un renderizador, y
// controla la cámara de la escena basándose en el movimiento de la cámara 6DoF.
XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())

// Añade lógica personalizada al bucle de cámara. Esto se hace con módulos de canalización de cámara que proporcionan
// lógica para los momentos clave del ciclo de vida para el procesamiento de cada fotograma de la cámara. En este caso, estaremos
// añadiendo lógica onStart para la inicialización de la escena, y lógica onUpdate para las actualizaciones de la escena.
XR8.addCameraPipelineModule({
  // Los módulos de canalización de cámara necesitan un nombre. Puede ser el que quieras pero debe ser único
  // dentro de tu aplicación.
  name: 'myawesomeapp',

  // onStart se llama una vez cuando comienza la alimentación de la cámara. En este caso, tenemos que esperar a que la escena
  // XR8.Threejs esté lista antes de poder acceder a ella para añadir contenido.
  onStart: ({canvasWidth, canvasHeight}) => {
    // Obtén la escena three.js. Esta ha sido creada por XR8.Threejs.pipelineModule().onStart(). La
    // razón por la que podemos acceder a ella ahora es porque 'myawesomeapp' fue instalada después de
    // XR8.Threejs.pipelineModule().
    const {scene, camera} = XR8.Threejs.xrScene()

    // Añade algunos objetos a la escena y establece la posición inicial de la cámara.
    initScene({scene, camera})

    // Sincroniza la posición 6DoF del controlador xr y los parámetros de la cámara con nuestra escena.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
  },

  // onUpdate se llama una vez por bucle de cámara antes de renderizar. Cualquier escena de geometría three.js
  // típicamente ocurriría aquí.
  onUpdate: () => {
    // Actualiza la posición de los objetos en la escena, etc.
    updateScene(XR8.Threejs.xrScene())
  },
})
```
