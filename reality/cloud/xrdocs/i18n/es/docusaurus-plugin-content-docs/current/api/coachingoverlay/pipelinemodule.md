---
sidebar_label: pipelineModule()
---

# CoachingOverlay.pipelineModule()

`CoachingOverlay.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización que, cuando se instala, añade la funcionalidad de Coaching Overlay a su proyecto de escala absoluta.

## Parámetros {#parameters}

Ninguno

## Vuelta {#returns}

Un módulo de canalización que añade Coaching Overlay a su proyecto.

## Ejemplo sin AFrame  {#non-aframe-example}

```javascript
// Configured here
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Para generar escala mueve el teléfono hacia delante y luego hacia atrás',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  LandingPage.pipelineModule(),
  // Added here
  CoachingOverlay.pipelineModule(),
  ...
])
```
