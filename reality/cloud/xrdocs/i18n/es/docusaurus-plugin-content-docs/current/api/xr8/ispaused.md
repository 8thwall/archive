---
sidebar_label: isPaused()
---

# XR8.isPaused()

`XR8.isPaused()`

## Descripción {#description}

Indica si la sesión XR está en pausa o no.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Verdadero si la sesión XR está en pausa, falso en caso contrario.

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
