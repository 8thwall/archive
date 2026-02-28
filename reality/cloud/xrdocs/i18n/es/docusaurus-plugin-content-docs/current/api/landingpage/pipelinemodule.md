---
sidebar_label: pipelineModule()
---

# LandingPage.pipelineModule()

`LandingPage.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización que, cuando se instala, añade funcionalidad de página de destino a tu proyecto.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Un módulo de canalización que añade funcionalidad de página de destino a tu proyecto.

## Ejemplo sin AFrame {#non-aframe-example}

```javascript
// Configurado aquí
LandingPage.configure({ 
    mediaSrc: 'https://domain.com/bat.glb',
    sceneEnvMap: 'hill',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  // Añadido aquí
  LandingPage.pipelineModule(), 
  ...
])
```
