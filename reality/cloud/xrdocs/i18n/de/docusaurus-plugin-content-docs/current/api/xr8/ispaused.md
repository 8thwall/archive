---
sidebar_label: isPaused()
---

# XR8.isPaused()

`XR8.isPaused()`

## Beschreibung {#description}

Zeigt an, ob die XR-Sitzung pausiert ist oder nicht.

## Parameter {#parameters}

Keine

## Returns {#returns}

Wahr, wenn die XR-Sitzung pausiert ist, andernfalls falsch.

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
