---
sidebar_label: addCameraPipelineModules()
---

# XR8.addCameraPipelineModules()

`XR8.addCameraPipelineModules([ modules ])`

## Beschreibung {#description}

Fügen Sie mehrere Kamera-Pipelinemodule hinzu. Dies ist eine bequeme Methode, die [`XR8.addCameraPipelineModule()`](addcamerapipelinemodule.md) nacheinander für jedes Element des Eingabe-Arrays aufruft.

## Parameter {#parameters}

| Parameter | Typ        | Beschreibung                                            |
| --------- | ---------- | ------------------------------------------------------- |
| Module    | `[Objekt]` | Eine Reihe von Kamera-Pipeline-Modulen. |

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
const onxrloaded = () => {
  XR8.addCameraPipelineModules([ // Kamera-Pipeline-Module hinzufügen.
    // Vorhandene Pipeline-Module.
    XR8.GlTextureRenderer.pipelineModule(), // Zeichnet den Kamera-Feed.
  ])

  // Abfrage von Kamerazulassungen und Ausführen der Kamera.
  XR8.run({canvas: document.getElementById('camerafeed')})
}

// Warten, bis das XR-Javascript geladen ist, bevor XR-Aufrufe erfolgen.
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```
