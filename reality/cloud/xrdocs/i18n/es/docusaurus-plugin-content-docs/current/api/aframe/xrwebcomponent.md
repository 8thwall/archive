---
sidebar_label: xrwebComponent()
---

# XR8.AFrame.xrwebComponent()

`XR8.AFrame.xrwebComponent()`

## Descripción {#description}

Crea un componente A-Frame que se puede registrar con `AFRAME.registerComponent()`. Esto, sin embargo, generalmente no necesitará ser llamado directamente. Al cargar el código de 8th Wall Web, este componente se registrará automáticamente si se detecta que se ha cargado A-Frame (es decir, si existe `window.AFRAME` ).

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
window.AFRAME.registerComponent('xrweb', XR8.AFrame.xrwebComponent())
```
