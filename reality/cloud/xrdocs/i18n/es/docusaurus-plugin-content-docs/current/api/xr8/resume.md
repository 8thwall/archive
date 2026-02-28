---
sidebar_label: resume()
---

# XR8.resume()

`XR8.resume()`

## Descripción {#description}

Reanuda la sesión XR actual después de haberla pausado.

## Parámetros {#parameters}

Ninguno

## Vuelta {#returns}

Ninguno

## Ejemplo {#example}

```javascript
// Llama a XR8.pause() / XR8.resume() cuando se pulsa el botón.
document.getElementById('pausa').addEventListener(
 'clic',
 () => {
    if (!XR8.isPaused()) {
      XR8.pause()
 }} else {
      XR8.resume()
 }
 }},
  true)
```
