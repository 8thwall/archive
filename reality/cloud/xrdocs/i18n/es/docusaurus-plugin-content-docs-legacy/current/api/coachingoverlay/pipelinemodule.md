---
sidebar_label: pipelineModule()
---

# CoachingOverlay.pipelineModule()

`CoachingOverlay.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización que, cuando se instala, añade la funcionalidad de superposición de Coaching a su proyecto de escala absoluta.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Un módulo de canalización que añade una Superposición de Coaching a su proyecto.

## Ejemplo sin marco {#non-aframe-example}

```javascript
// Configurado aquí
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'To generate scale push your phone forward and then pull back',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  LandingPage.pipelineModule(),
  // Añadido aquí
  CoachingOverlay.pipelineModule(),
  ...
])
```
