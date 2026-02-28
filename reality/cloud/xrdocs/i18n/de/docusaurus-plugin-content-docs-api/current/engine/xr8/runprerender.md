---
sidebar_label: runPreRender()
---

# XR8.runPreRender()

`XR8.runPreRender( timestamp )`

## Beschreibung {#description}

Führt alle Lebenszyklusaktualisierungen aus, die vor dem Rendern erfolgen sollen.

**WICHTIG**: Stellen Sie sicher, dass [`onStart`](/api/engine/camerapipelinemodule/onstart) vor dem Aufruf von `XR8.runPreRender()` / `XR8.runPostRender()` aufgerufen wurde.

## Parameter {#parameters}

| Parameter   | Typ    | Beschreibung                                        |
| ----------- | ------ | --------------------------------------------------- |
| Zeitstempel | Nummer | Die aktuelle Zeit in Millisekunden. |

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
// Implementierung der A-Frame-Komponenten tick()-Methode
function tick() {
  // Überprüfung der Gerätekompatibilität und Durchführung aller notwendigen Aktualisierungen der Ansichtsgeometrie und Zeichnen des Kamerafeeds.
  ...
  // XR-Lebenszyklusmethoden ausführen
  XR8.runPreRender(Date.now())
}
```
