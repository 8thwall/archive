---
sidebar_label: removeCameraPipelineModules()
---

# XR8.removeCameraPipelineModules()

`XR8.removeCameraPipelineModules([ moduleNames ])`

## Beschreibung {#description}

Entfernen Sie mehrere Kamera-Pipelinemodule. Dies ist eine bequeme Methode, die
[`XR8.removeCameraPipelineModule()`](removecamerapipelinemodule.md) der Reihe nach für jedes Element des Eingabe-Arrays
aufruft.

## Parameter {#parameters}

| Parameter   | Typ                      | Beschreibung                                                                                          |
| ----------- | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| moduleNames | `[String] oder [Object]` | Ein Array von Objekten mit einer Namenseigenschaft oder eine Namenskette von Modulen. |

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.removeCameraPipelineModules(['threejsrenderer', 'reality'])
```
