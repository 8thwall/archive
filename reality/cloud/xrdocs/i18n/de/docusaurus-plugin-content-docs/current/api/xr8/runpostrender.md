---
sidebar_label: runPostRender()
---

# XR8.runPostRender()

`XR8.runPostRender()`

## Beschreibung {#description}

Führt alle Lebenszyklusaktualisierungen aus, die nach dem Rendern erfolgen sollen.

**WICHTIG**: Stellen Sie sicher, dass [`onStart`](/api/camerapipelinemodule/onstart) aufgerufen wurde, bevor Sie `XR8.runPreRender()` / `XR8.runPostRender()` aufrufen.

## Parameter {#parameters}

Keine

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
// Implementieren Sie die Methode tock() der A-Frame-Komponenten
function tock() {
  // Prüfen Sie, ob XR initialisiert ist
  ...
  // XR-Lebenszyklusmethoden ausführen
  XR8.runPostRender()
}
```
