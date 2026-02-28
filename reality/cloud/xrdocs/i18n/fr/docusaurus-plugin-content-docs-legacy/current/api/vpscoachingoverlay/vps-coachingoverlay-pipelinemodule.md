---
sidebar_label: pipelineModule()
---

# VpsCoachingOverlay.pipelineModule()

`VpsCoachingOverlay.pipelineModule()`

## Description {#description}

Crée un module de pipeline qui, une fois installé, ajoute la fonctionnalité VPS Coaching Overlay à votre projet WebAR
Lightship VPS.

## Paramètres {#parameters}

Aucun

## Retourne {#returns}

Un module de pipeline qui ajoute une superposition de couverture VPS à votre projet.

## Exemple sans cadre {#non-aframe-example}

```javascript
// Configuré ici
VpsCoachingOverlay.configure({
    textColor : '#0000FF',
    promptPrefix : 'Go look for',
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
  VpsCoachingOverlay.pipelineModule(),
  ...
])
```
