# stopxr

`scene.emit('stopxr')`

## Beschreibung {#description}

Beendet die aktuelle XR-Sitzung. Im angehaltenen Zustand wird die Kameraübertragung gestoppt und die Bewegung des Geräts wird nicht verfolgt.

## Parameter {#parameters}

Keine

## Beispiel {#example}

```javascript
let scene = this.el.sceneEl
scene.emit('stopxr')
```
