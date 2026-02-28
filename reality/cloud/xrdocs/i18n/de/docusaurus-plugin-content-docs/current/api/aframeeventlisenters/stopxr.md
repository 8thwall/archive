# stopxr

`scene.emit('stopxr')`

## Beschreibung {#description}

Beendet die aktuelle XR-Sitzung. Wenn die Kamera angehalten ist, wird die Übertragung gestoppt und die Bewegung des Geräts wird nicht verfolgt.

## Parameter {#parameters}

Keine

## Beispiel {#example}

```javascript
let scene = this.el.sceneEl
scene.emit('stopxr')
```
