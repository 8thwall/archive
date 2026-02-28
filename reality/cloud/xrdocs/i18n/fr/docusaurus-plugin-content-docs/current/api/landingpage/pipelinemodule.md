---
sidebar_label: pipelineModule()
---

# LandingPage.pipelineModule()

`LandingPage.pipelineModule()`

## Description {#description}

Crée un module de pipeline qui, une fois installé, ajoute une fonctionnalité de page d'atterrissage à votre projet.

## Paramètres {#parameters}

Aucun

## Retours {#returns}

Un module de pipeline qui ajoute une fonctionnalité de page d'atterrissage à votre projet.

## Exemple sans cadre {#non-aframe-example}

```javascript
// Configuré ici
LandingPage.configure({ 
    mediaSrc : 'https://domain.com/bat.glb',
    sceneEnvMap : 'hill',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  // Ajouté ici
  LandingPage.pipelineModule(), 
  ...
])
```
