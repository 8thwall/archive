# stopxr

`scene.emit('stopxr')`

## Description {#description}

Arrêtez la session XR en cours. Lorsque l'appareil est arrêté, le flux de la caméra est interrompu et les mouvements de l'appareil ne sont pas suivis.

## Paramètres {#parameters}

Aucun

## Exemple {#example}

```javascript
let scene = this.el.sceneEl
scene.emit('stopxr')
```
