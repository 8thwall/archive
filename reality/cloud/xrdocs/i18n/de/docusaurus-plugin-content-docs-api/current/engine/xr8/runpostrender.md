---
sidebar_label: runPostRender()
---

# XR8.runPostRender()

XR8.runPostRender()\\`

## Beschreibung {#description}

Führt alle Lebenszyklusaktualisierungen aus, die nach dem Rendering erfolgen sollen.

**WICHTIG**: Stellen Sie sicher, dass [`onStart`](/api/engine/camerapipelinemodule/onstart) vor dem Aufruf von `XR8.runPreRender()` / `XR8.runPostRender()` aufgerufen wurde.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
// Implementieren der A-Frame-Komponenten tock() Methode
function tock() {
  // Prüfen, ob XR initialisiert ist
  ...
  // XR-Lebenszyklusmethoden ausführen
  XR8.runPostRender()
}
```
