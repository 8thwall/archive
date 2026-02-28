---
sidebar_label: fortsetzen()
---

# XR8.resume()

XR8.resume()\\`

## Beschreibung {#description}

Fortsetzen der aktuellen XR-Sitzung, nachdem sie unterbrochen wurde.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
// Aufruf von XR8.pause() / XR8.resume(), wenn die Schaltfläche gedrückt wird.
document.getElementById('pause').addEventListener(
  'click',
  () => {
    if (!XR8.isPaused()) {
      XR8.pause()
    } else {
      XR8.resume()
    }
  },
  true)
```
