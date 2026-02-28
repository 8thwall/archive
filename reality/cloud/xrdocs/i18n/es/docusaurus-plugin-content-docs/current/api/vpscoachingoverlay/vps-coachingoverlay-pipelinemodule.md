---
sidebar_label: pipelineModule()
---

# VpsCoachingOverlay.pipelineModule()

`VpsCoachingOverlay.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización que, cuando se instala, añade la funcionalidad de superposición de coaching VPS a tu proyecto WebAR habilitado para VPS Lightship.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Un módulo de canalización que añade una superposición de coaching VPS a tu proyecto.

## Ejemplo sin AFrame {#non-aframe-example}

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
