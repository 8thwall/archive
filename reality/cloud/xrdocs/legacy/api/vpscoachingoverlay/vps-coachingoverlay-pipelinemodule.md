---
sidebar_label: pipelineModule()
---
# VpsCoachingOverlay.pipelineModule()

`VpsCoachingOverlay.pipelineModule()`

## Description {#description}

Creates a pipeline module that, when installed, adds VPS Coaching Overlay functionality to your
Lightship VPS enabled WebAR project.

## Parameters {#parameters}

None

## Returns {#returns}

A pipeline module that adds a VPS Coaching Overlay to your project.

## Non-AFrame Example {#non-aframe-example}

```javascript
// Configured here
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
  // Added here
  VpsCoachingOverlay.pipelineModule(),
  ...
])
```
