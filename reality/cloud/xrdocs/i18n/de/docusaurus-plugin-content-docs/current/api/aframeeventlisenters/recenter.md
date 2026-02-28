# recenter

`scene.emit('recenter', {origin, facing})`

## Beschreibung {#description}

Bringt die Kamerafeed zu ihrem Ursprung zurück. Wenn ein neuer Ursprung als Argument angegeben wird, wird der Ursprung der Kamera auf diesen zurückgesetzt und dann neu zentriert.

Wenn Ursprung und Ausrichtung nicht angegeben werden, wird die Kamera auf den Ursprung zurückgesetzt, der zuvor durch einen Aufruf von `recenter` oder den letzten Aufruf von `XR8.XrController.updateCameraProjectionMatrix()` bei Verwendung von `xrweb` oder `XR8.FaceController.configure({coordinates: {origin, scale, axes}})` / `XR8.LayersController.configure({coordinates: {origin, scale, axes}})` bei Verwendung von `xrface` oder `xrlayers`.

**WICHTIG:** Bei A-Frame wird `updateCameraProjectionMatrix()` und / oder `configure()` zunächst auf Basis der anfänglichen Kameraposition in der Szene aufgerufen.

## Parameter {#parameters}

| Parameter                       | Beschreibung                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| Ursprung: {x, y, z} [Optional]  | Der Ort des neuen Ursprungs.                                                         |
| facing: {w, x, y, z} [Optional] | Eine Quaternion, die die Richtung angibt, in die die Kamera am Ursprung zeigen soll. |

## Beispiel - Neuausrichtung der Szene {#example}

```javascript
let scene = this.el.sceneEl
scene.emit('recenter')
```

## Beispiel - Neuausrichtung der Szene und Aktualisierung des Ursprungs {#example---update-origin}

```javascript
let scene = this.el.sceneEl
scene.emit('recenter', {
  origin: {x: 1, y: 4, z: 0},
  facing: {w: 0.9856, x:0, y:0.169, z:0}
})
```
