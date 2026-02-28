---
sidebar_label: resume()
---

# XR8.resume()

`XR8.resume()`

## Beschreibung {#description}

Setzen Sie die aktuelle XR-Sitzung fort, nachdem sie unterbrochen wurde.

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
