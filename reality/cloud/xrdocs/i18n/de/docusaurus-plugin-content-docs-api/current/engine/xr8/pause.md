---
sidebar_label: pause()
---

# XR8.pause()

`XR8.pause()`

## Beschreibung {#description}

Unterbrechen Sie die aktuelle XR-Sitzung.  Im angehaltenen Zustand wird die Bewegung des Geräts nicht erfasst.

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
