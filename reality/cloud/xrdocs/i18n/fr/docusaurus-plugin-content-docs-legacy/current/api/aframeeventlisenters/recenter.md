# recentrer

`scene.emit('recenter', {origin, facing})`

## Description {#description}

Recentre le flux de la caméra sur son origine. Si un nouveau point d'origine est fourni en argument, le point d'origine de la caméra sera réinitialisé à ce point, puis la caméra se recentrera.

Si l'origine et l'orientation ne sont pas fournies, la caméra est réinitialisée à l'origine précédemment spécifiée par un appel à `recenter` ou le dernier appel à `XR8.XrController.updateCameraProjectionMatrix()` lors de l'utilisation de `xrweb` ou `XR8.FaceController.configure({coordinates : {origin, scale, axes}})` / `XR8.LayersController.configure({coordinates : {origin, scale, axes}})` lors de l'utilisation de `xrface` ou de `xrlayers`.

**IMPORTANT:** Avec A-Frame, `updateCameraProjectionMatrix()` et / ou `configure()` est initialement appelé en fonction de la position initiale de la caméra dans la scène.

## Paramètres {#parameters}

| Paramètres                                                                                             | Description                                                                       |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| origine : {x, y, z} [Facultatif]   | L'emplacement de la nouvelle origine.                             |
| en face : {w, x, y, z} [Optionnel] | Un quaternion représentant la direction de la caméra à l'origine. |

## Exemple - Recentrer la scène {#example}

```javascript
let scene = this.el.sceneEl
scene.emit('recenter')
```

## Exemple - Recentrer la scène et mettre à jour l'origine {#example---update-origin}

```javascript
let scene = this.el.sceneEl
scene.emit('recenter', {
  origin : {x: 1, y: 4, z: 0},
  facing : {w : 0.9856, x:0, y:0.169, z:0}
})
```
