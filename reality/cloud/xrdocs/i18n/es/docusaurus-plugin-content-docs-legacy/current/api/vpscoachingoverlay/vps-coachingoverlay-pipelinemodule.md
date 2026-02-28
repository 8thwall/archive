---
sidebar_label: pipelineModule()
---

# VpsCoachingOverlay.pipelineModule()

`VpsCoachingOverlay.pipelineModule()`

## Descripción {#description}

Crea un módulo pipeline que, cuando se instala, añade la funcionalidad VPS Coaching Overlay a su proyecto WebAR habilitado para VPS
Lightship.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Un módulo de canalización que añade una Superposición de Coaching VPS a su proyecto.

## Ejemplo sin marco {#non-aframe-example}

```javascript
// Configurado aquí
VpsCoachingOverlay.configure({
    textColor: '#0000FF',
    promptPrefix: 'Go look for',
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
  VpsCoachingOverlay.pipelineModule(),
  ...
])
```
