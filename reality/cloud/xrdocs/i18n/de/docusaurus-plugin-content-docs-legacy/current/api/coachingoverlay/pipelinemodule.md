---
sidebar_label: pipelineModule()
---

# CoachingOverlay.pipelineModule()

`CoachingOverlay.pipelineModule()`

## Beschreibung {#description}

Erstellt ein Pipeline-Modul, das, wenn es installiert ist, die Coaching-Overlay-Funktionalität zu Ihrem Projekt in absoluter Größe hinzufügt.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Ein Pipeline-Modul, das ein Coaching-Overlay zu Ihrem Projekt hinzufügt.

## Nicht-AFrame Beispiel {#non-aframe-example}

```javascript
// Hier konfiguriert
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
  // Hier hinzugefügt
  CoachingOverlay.pipelineModule(),
  ...
])
```
