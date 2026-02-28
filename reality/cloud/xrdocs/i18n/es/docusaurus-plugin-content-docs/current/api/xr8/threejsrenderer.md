---
sidebar_label: ThreejsRenderer() (deprecated)
---

# XR8.ThreejsRenderer() (deprecated)

`XR8.ThreejsRenderer()`

## Descripción {#description}

Devuelve un renderizador basado en three.js.  Es responsable de manejar la cámara de la escena, de hacer coincidir el campo de visión de la cámara con el campo de visión de la AR, y de llamar a 'render' dentro del bucle de ejecución de la cámara.

Si utilizas three.js, añádelo como módulo de canalización de la cámara para crear la escena three.js, la cámara, el renderizador y controlar la cámara de la escena basándote en el movimiento de la cámara 6DoF.

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
window.onload = () => {
  // xr3js posee la escena, la cámara y el renderizador three.js. Es responsable de manejar la cámara de la escena,
 // hacer coincidir el campo de visión de la cámara con el campo de visión de la AR, y de llamar a 'render' dentro del bucle de ejecución de la cámara
 //.
  const xr3js = XR8.ThreejsRenderer()

 // El controlador XR proporciona seguimiento de cámara 6DoF e interfaces para configurar el seguimiento.
  const xrController = XR8.xrController()

  // ...

  // Añade el módulo xrController, que permite la estimación del movimiento de la cámara 6DoF.
  XR8.addCameraPipelineModule(xrController.cameraPipelineModule())

  // Añade un GLRenderer que dibuja la imagen de la cámara en el lienzo.
  XR8.addCameraPipelineModule(XR8.GLRenderer())

 // Añade xr3js que crea una escena, una cámara y un renderizador threejs, y maneja la cámara de la escena
 // basándose en el movimiento de la cámara 6DoF.
  XR8.addCameraPipelineModule(xr3js)

 // ...
}
```
