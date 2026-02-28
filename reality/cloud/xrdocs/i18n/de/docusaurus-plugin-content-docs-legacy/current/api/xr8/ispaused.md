---
sidebar_label: isPaused()
---

# XR8.isPaused()

`XR8.isPaused()`

## Beschreibung {#description}

Zeigt an, ob die XR-Sitzung unterbrochen ist oder nicht.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Wahr, wenn die XR-Sitzung pausiert, andernfalls falsch.

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
