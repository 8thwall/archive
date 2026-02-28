# onRender()

`onRender : ()`

## Description {#description}

`onRender()` est appelé après [`onUpdate`](onupdate.md). C'est le moment pour le moteur de rendu d'émettre des commandes de dessin WebGL. Si une application fournit sa propre boucle d'exécution et s'appuie sur [`XR8.runPreRender()`](/api/engine/xr8/runprerender) et [`XR8.runPostRender()`](/api/engine/xr8/runprerender), cette méthode n'est pas appelée et tous les rendus doivent être coordonnés par la boucle d'exécution externe.

## Paramètres {#parameters}

Aucun

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onRender : () => {
    // Ceci est déjà fait par XR8.Threejs.pipelineModule() mais est fourni ici à titre d'illustration.
    XR8.Threejs.xrScene().renderer.render()
  },
})
```
