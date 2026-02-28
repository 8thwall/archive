---
sidebar_label: pipelineModule()
---

# CoachingOverlay.pipelineModule()

`CoachingOverlay.pipelineModule()`

## Beschreibung {#description}

Erzeugt ein Pipeline-Modul, das, wenn es installiert ist, die Coaching Overlay-Funktionalität zu Ihrem Absolutmaßstab-Projekt hinzufügt.

## Parameter {#parameters}

Keine

## Returns {#returns}

Ein Pipeline-Modul, das ein Coaching-Overlay zu Ihrem Projekt hinzufügt.

## Non-AFrame Beispiel {#non-aframe-example}

```javascript
// Hier konfiguriert
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Um eine Skalierung zu erzeugen, schieben Sie Ihr Telefon nach vorne und ziehen Sie es dann zurück',
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
