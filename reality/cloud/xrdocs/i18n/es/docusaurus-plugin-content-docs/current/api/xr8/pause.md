---
sidebar_label: pause()
---

# XR8.pause()

`XR8.pause()`

## Descripción {#description}

Pausa la sesión XR actual.  Mientras está en pausa, no se sigue el movimiento del dispositivo.

## Parámetros {#parameters}

Ninguno

## Vuelta {#returns}

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
