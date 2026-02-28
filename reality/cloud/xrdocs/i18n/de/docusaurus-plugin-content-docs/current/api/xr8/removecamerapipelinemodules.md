---
sidebar_label: removeCameraPipelineModules()
---

# XR8.removeCameraPipelineModules()

`XR8.removeCameraPipelineModules([ moduleNames ])`

## Beschreibung {#description}

Entfernen Sie mehrere Kamera-Pipeline-Module. Dies ist eine praktische Methode, die [`XR8.removeCameraPipelineModule()`](removecamerapipelinemodule.md) nacheinander für jedes Element des Arrays der Eingabe aufruft.

## Parameter {#parameters}

| Parameter   | Typ                      | Beschreibung                                                                         |
| ----------- | ------------------------ | ------------------------------------------------------------------------------------ |
| moduleNames | `[String] oder [Objekt]` | Ein Array von Objekten mit einer name-Eigenschaft oder eine Namenskette von Modulen. |

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.removeCameraPipelineModules(['threejsrenderer', 'reality'])
```
