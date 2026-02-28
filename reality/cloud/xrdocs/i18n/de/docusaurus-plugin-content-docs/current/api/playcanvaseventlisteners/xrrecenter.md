# xr:recenter

`this.app.fire('xr:recenter')`

## Beschreibung {#description}

Bringt die Kamerafeed zu ihrem Ursprung zurück. Wenn ein neuer Ursprung als Argument angegeben wird, wird der Ursprung der Kamera auf diesen zurückgesetzt und dann neu zentriert.

## Parameter {#parameters}

| Parameter            | Typ            | Beschreibung                                                                         |
| -------------------- | -------------- | ------------------------------------------------------------------------------------ |
| Ursprung [Optional]  | `{x, y, z}`    | Der Ort des neuen Ursprungs.                                                         |
| zugewandt [Optional] | `{w, x, y, z}` | Eine Quaternion, die die Richtung angibt, in die die Kamera am Ursprung zeigen soll. |

## Beispiel {#example}

```javascript
/*jshint esversion: 6, asi: true, laxbreak: true*/

// taprecenter.js: Definiert ein Playcanvas-Skript, das die AR-Szene neu zentriert, wenn der Bildschirm
// angetippt wird.

var taprecenter = pc.createScript('taprecenter')

// Feuern Sie ein 'recenter'-Ereignis ab, um die Kamera wieder an ihre Ausgangsposition in der Szene zu bewegen.
taprecenter.prototype.initialize = function() {
  this.app.touch.on(pc.EVENT_TOUCHSTART,
    (event) => { if (event.touches.length !== 1) { return } this.app.fire('xr:recenter')})
}
```
