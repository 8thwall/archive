---
sidebar_label: ThreejsRenderer() (obsoleto)
---

# XR8.ThreejsRenderer() (obsoleto)

`XR8.ThreejsRenderer()`

## Descripción {#description}

Devuelve un renderizador basado en three.js.  Es responsable de manejar la cámara de la escena, haciendo coincidir el campo de visión de la cámara con el campo de visión de la RA, y de llamar a 'render' dentro del bucle de ejecución de la cámara.

Si utiliza three.js, añada esto como un módulo de canalización de la cámara para crear la escena three.js, la cámara, el renderizador y controlar la cámara de la escena basándose en el movimiento de la cámara 6DoF.

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
window.onload = () => {
  // xr3js posee la escena three.js, la cámara y el renderizador. Es responsable de manejar la cámara de la escena,
  // hacer coincidir el campo de visión de la cámara con el campo de visión de la RA, y de llamar a 'render' dentro del bucle de ejecución de la cámara
  //
  const xr3js = XR8.ThreejsRenderer()

  // El controlador XR proporciona seguimiento de cámara 6DoF e interfaces para configurar el seguimiento.
  const xrController = XR8.xrController()

  // ...

  // Añade el módulo xrController, que permite la estimación del movimiento de la cámara 6DoF.
  XR8.addCameraPipelineModule(xrController.cameraPipelineModule())

  // Añade un GLRenderer que dibuje la imagen de la cámara en el lienzo.
  XR8.addCameraPipelineModule(XR8.GLRenderer())

  // Añade xr3js que crea una escena, cámara y renderizador threejs, y controla la cámara de la escena
  // basándose en el movimiento de la cámara 6DoF.
  XR8.addCameraPipelineModule(xr3js)

  // ...
}
```
