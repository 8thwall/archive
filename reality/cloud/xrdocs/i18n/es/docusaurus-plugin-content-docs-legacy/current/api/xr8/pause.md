---
sidebar_label: pausa()
---

# XR8.pausa()

`XR8.pause()`

## Descripción {#description}

Pausa la sesión XR actual.  Mientras está en pausa, no se rastrea el movimiento del dispositivo.

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
