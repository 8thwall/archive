---
sidebar_label: addCameraPipelineModules()
---

# XR8.addCameraPipelineModules()

`XR8.addCameraPipelineModules([ modules ])`

## Beschreibung {#description}

Fügen Sie mehrere Kamera-Pipelinemodule hinzu. Dies ist eine praktische Methode, die [`XR8.addCameraPipelineModule()`](addcamerapipelinemodule.md) nacheinander für jedes Element des Eingabe-Arrays aufruft.

## Parameter {#parameters}

| Parameter | Typ        | Beschreibung                            |
| --------- | ---------- | --------------------------------------- |
| module    | `[Objekt]` | Eine Reihe von Kamera-Pipeline-Modulen. |

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
const onxrloaded = () => {
  XR8.addCameraPipelineModules([ // Kamera-Pipeline-Module hinzufügen.
    // Vorhandene Pipeline-Module.
    XR8.GlTextureRenderer.pipelineModule(), // Zeichnet den Kamera-Feed.
  ])

  // Fordern Sie Kamerarechte an und starten Sie die Kamera.
  XR8.run({canvas: document.getElementById('camerafeed')})
}

// Warten Sie, bis das XR-Javascript geladen ist, bevor Sie XR-Aufrufe tätigen.
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```
