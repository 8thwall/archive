---
sidebar_label: runPreRender()
---

# XR8.runPreRender()

`XR8.runPreRender( Zeitstempel )`

## Beschreibung {#description}

Führt alle Lebenszyklusaktualisierungen aus, die vor dem Rendern erfolgen sollen.

**WICHTIG**: Stellen Sie sicher, dass [`onStart`](/api/camerapipelinemodule/onstart) aufgerufen wurde, bevor Sie `XR8.runPreRender()` / `XR8.runPostRender()` aufrufen.

## Parameter {#parameters}

| Parameter | Typ      | Beschreibung                         |
| --------- | -------- | ------------------------------------ |
| timestamp | `Nummer` | Die aktuelle Zeit, in Millisekunden. |

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
// Implementieren Sie die tick()-Methode der A-Frame-Komponenten
function tick() {
  // Prüfen Sie die Gerätekompatibilität und führen Sie alle notwendigen Aktualisierungen der Ansichtsgeometrie durch und zeichnen Sie den Kamerafeed.
  ...
  // XR-Lebenszyklusmethoden ausführen
  XR8.runPreRender(Date.now())
  }
```
