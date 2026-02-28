# stopxr

`scene.emit('stopxr')`

## Description {#description}

Arrête la session XR en cours. En cas d'arrêt, l'alimentation de la caméra est interrompue et les mouvements de l'appareil ne sont pas suivis.

## Paramètres {#parameters}

Aucun

## Exemple {#example}

```javascript
let scene = this.el.sceneEl
scene.emit('stopxr')
```
