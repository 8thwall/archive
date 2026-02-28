---
sidebar_label: pipelineModule()
---

# LandingPage.pipelineModule()

LandingPage.pipelineModule()\\`

## Beschreibung {#description}

Erstellt ein Pipeline-Modul, das nach der Installation die Landing Page-Funktionalität zu Ihrem Projekt hinzufügt.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Ein Pipeline-Modul, das Ihrem Projekt die Funktionalität einer Landing Page hinzufügt.

## Nicht-AFrame Beispiel {#non-aframe-example}

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
