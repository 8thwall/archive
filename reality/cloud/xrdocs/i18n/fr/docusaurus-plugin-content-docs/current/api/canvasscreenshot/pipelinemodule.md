---
sidebar_label: pipelineModule()
---

# XR8.CanvasScreenshot.pipelineModule()

`XR8.CanvasScreenshot.pipelineModule()`

## Description {#description}

Crée un module de pipeline de caméra qui, lorsqu'il est installé, reçoit des rappels lorsque la caméra a démarré et lorsque la taille du support a changé.

## Paramètres {#parameters}

Aucun

## Retours {#returns}

Un module de pipeline CanvasScreenshot qui peut être ajouté via [XR8.addCameraPipelineModule()](/api/xr8/addcamerapipelinemodule).

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule(XR8.CanvasScreenshot.pipelineModule())
```
