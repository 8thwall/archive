---
sidebar_label: xrlayersceneComponent()
---

# XR8.AFrame.xrlayersceneComponent()

`XR8.AFrame.xrlayersceneComponent()`

## Descripción {#description}

Crea un componente A-Frame que puede ser registrado con `AFRAME.registerComponent()`. Esto,
sin embargo, generalmente no necesitará ser llamado directamente. Al cargar el script de la 8ª Web Wall, este componente
se registrará automáticamente si se detecta que se ha cargado A-Frame (es decir, si existe `window.AFRAME`
).

## Parámetros {#parameters}

Ninguno

## Ejemplo {#example}

```javascript
window.AFRAME.registerComponent('xrlayersceneComponent', XR8.AFrame.xrlayersceneComponent())
```
