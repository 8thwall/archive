---
sidebar_label: reanudar()
---

# XR8.reanudar()

`XR8.resume()`

## Descripción {#description}

Reanudar la sesión XR en curso después de haberla puesto en pausa.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
// Llama a XR8.pause() / XR8.resume() cuando se pulsa el botón.
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
