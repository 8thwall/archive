---
sidebar_label: pipelineModule()
---

# LandingPage.pipelineModule()

`LandingPage.pipelineModule()`

## Beschreibung {#description}

Erstellt ein Pipeline-Modul, das, wenn es installiert wird, die Landing Page-Funktionalität zu Ihrem Projekt hinzufügt.

## Parameter {#parameters}

Keine

## Returns {#returns}

Ein Pipeline-Modul, das die Landing Page-Funktionalität zu Ihrem Projekt hinzufügt.

## Non-AFrame Beispiel {#non-aframe-example}

```javascript
// Hier konfiguriert
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
  // Hier hinzugefügt
  LandingPage.pipelineModule(), 
  ...
])
```
