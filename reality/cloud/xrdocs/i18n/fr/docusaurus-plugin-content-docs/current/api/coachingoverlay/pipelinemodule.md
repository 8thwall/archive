---
sidebar_label: pipelineModule()
---

# CoachingOverlay.pipelineModule()

`CoachingOverlay.pipelineModule()`

## Description {#description}

Crée un module de pipeline qui, une fois installé, ajoute la fonctionnalité de superposition de coaching à votre projet à l'échelle absolue.

## Paramètres {#parameters}

Aucun

## Retours {#returns}

Un module de pipeline qui ajoute une superposition de coaching à votre projet.

## Exemple sans cadre {#non-aframe-example}

```javascript
// Configuré ici
CoachingOverlay.configure({
    animationColor : '#E86FFF',
    promptText : 'To generate scale push your phone forward and then pull back',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  LandingPage.pipelineModule(),
  // Ajouté ici
  CoachingOverlay.pipelineModule(),
  ...
])
```
