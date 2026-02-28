---
sidebar_label: pipelineModule()
---

# XR8.Threejs.pipelineModule()

`XR8.Threejs.pipelineModule()`

## Descripción {#description}

Un módulo de canalización que interactúa con el entorno y el ciclo de vida de three.js. La escena three.js puede consultarse utilizando [`XR8.Threejs.xrScene()`](xrscene.md) después de llamar al método [`onStart`](/api/camerapipelinemodule/onstart) de [`XR8.Threejs.pipelineModule()`](pipelinemodule.md).  La configuración se puede hacer en el método [`onStart`](/api/camerapipelinemodule/onstart) de otro módulo pipeline haciendo referencia a [`XR8.Threejs.xrScene()`](xrscene.md) siempre que [`<code>XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule) se llame en el segundo módulo *después de* llamar a `XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())`.

* [`onStart`](/api/camerapipelinemodule/onstart), se crean y configuran un renderizador y una escena three.js para dibujar sobre el feed de una cámara.
* [`onUpdate`](/api/camerapipelinemodule/onupdate), la cámara three.js se acciona con el movimiento del teléfono.
* [`onRender`](/api/camerapipelinemodule/onrender), se invoca al método `render()` del renderizador.

Tenga en cuenta que este módulo no dibuja realmente la imagen de la cámara en el lienzo, GlTextureRenderer lo hace. Para añadir una cámara en segundo plano, instala el módulo [`XR8.GlTextureRenderer.pipelineModule()`](/api/gltexturerenderer/pipelinemodule) antes de instalar este módulo (para que se renderice antes de dibujar la escena).

## Parámetros {#parameters}

Ninguno

## Vuelta {#returns}

Un módulo pipeline de three.js que puede añadirse mediante [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule).

## Ejemplo {#example}

```javascript
// Añade XrController.pipelineModule(), que permite la estimación del movimiento de la cámara 6DoF.
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())

// Añade un GlTextureRenderer que dibuje la imagen de la cámara en el lienzo.
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// Añade Threejs.pipelineModule() que crea una escena, una cámara y un renderizador three.js, y
// maneja la cámara de la escena basándose en el movimiento de la cámara 6DoF.
XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())

// Añade lógica personalizada al bucle de la cámara. Esto se hace con módulos de canalización de la cámara que proporcionan
// lógica para los momentos clave del ciclo de vida para procesar cada fotograma de la cámara. En este caso, estaremos
// añadiendo lógica onStart para la inicialización de la escena, y lógica onUpdate para las actualizaciones de la escena.
XR8.addCameraPipelineModule({
 // Los módulos de canalización de cámara necesitan un nombre. Puede ser lo que quieras, pero debe ser único
 // dentro de su aplicación.
  name: 'myawesomeapp',

 // onStart se llama una vez cuando comienza la alimentación de la cámara. En este caso, tenemos que esperar a que la escena
 // XR8.Threejs esté lista antes de poder acceder a ella para añadir contenido.
  onStart: ({canvasWidth, canvasHeight}) => {
 // Obtenga la escena three.js. Esto fue creado por XR8.Threejs.pipelineModule().onStart(). La
 // razón por la que podemos acceder a ella aquí ahora es porque 'myawesomeapp' se instaló después de
    // XR8.Threejs.pipelineModule().
    const {scene, camera} = XR8.Threejs.xrScene()

 // Añade algunos objetos a la escena y fija la posición inicial de la cámara.
    initScene({scene, camera})

 // Sincroniza la posición 6DoF del controlador xr y los parámetros de la cámara con nuestra escena.
    XR8.XrController.updateCameraProjectionMatrix({
      origen: camera.position,
      orientación: camera.quaternion,
 })
 },

 // onUpdate se llama una vez por bucle de cámara antes de la renderización. Cualquier escena de geometría de three.js
 // suele ocurrir aquí.
  onUpdate: () => {
 // Actualiza la posición de los objetos en la escena, etc.
    updateScene(XR8.Threejs.xrScene())
 },
})
```
