---
sidebar_label: pipelineModule()
---

# VpsCoachingOverlay.pipelineModule()

`VpsCoachingOverlay.pipelineModule()`

## Beschreibung {#description}

Erstellt ein Pipeline-Modul, das nach der Installation die VPS-Coaching-Overlay-Funktionalität zu Ihrem Lightship VPS-fähigen WebAR-Projekt hinzufügt.

## Parameter {#parameters}

Keine

## Returns {#returns}

Ein Pipeline-Modul, das ein VPS Coaching Overlay zu Ihrem Projekt hinzufügt.

## Non-AFrame Beispiel {#non-aframe-example}

```javascript
// Hier konfiguriert
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
  // Hier hinzugefügt
  VpsCoachingOverlay.pipelineModule(),
  ...
])
```
