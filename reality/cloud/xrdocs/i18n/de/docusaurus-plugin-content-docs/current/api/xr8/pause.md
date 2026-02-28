---
sidebar_label: pause()
---

# XR8.pause()

`XR8.pause()`

## Beschreibung {#description}

Pausieren Sie die aktuelle XR-Sitzung.  Im angehaltenen Zustand wird die Bewegung des Geräts nicht verfolgt.

## Parameter {#parameters}

Keine

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
// Rufen Sie XR8.pause() / XR8.resume() auf, wenn die Taste gedrückt wird.
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
