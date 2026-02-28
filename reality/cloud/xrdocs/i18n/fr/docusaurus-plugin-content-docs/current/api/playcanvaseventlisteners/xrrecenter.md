# xr:recenter

`this.app.fire('xr:recenter')`

## Description {#description}

Recentre le flux de la caméra sur son origine. Si un nouveau point d'origine est fourni en argument, le point d'origine de la caméra sera réinitialisé à ce point, puis la caméra se recentrera.

## Paramètres {#parameters}

| Paramètres           | Type           | Description                                                       |
| -------------------- | -------------- | ----------------------------------------------------------------- |
| origine [Facultatif] | `{x, y, z}`    | L'emplacement de la nouvelle origine.                             |
| en face [Facultatif] | `{w, x, y, z}` | Un quaternion représentant la direction de la caméra à l'origine. |

## Exemple {#example}

```javascript
/*jshint esversion : 6, asi : true, laxbreak : true*/

// taprecenter.js : Définit un script playcanvas qui recentre la scène AR lorsque l'écran est
// touché.

var taprecenter = pc.createScript('taprecenter')

// Déclenchez un événement 'recenter' pour ramener la caméra à son emplacement initial dans la scène.
taprecenter.prototype.initialize = function() {
  this.app.touch.on(pc.EVENT_TOUCHSTART,
    (event) => { if (event.touches.length !== 1) { return } this.app.fire('xr:recenter')})
}
```
