# xrhandscanning

## Beschreibung {#description}

Dieses Ereignis wird von [`xrhand`](/api/aframe/#hand-tracking) ausgelöst, wenn alle Hand-AR-Ressourcen geladen wurden und das Scannen begonnen hat.

`xrhandscanning.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Eigentum                  | Beschreibung                                                               |
| ------------------------- | -------------------------------------------------------------------------- |
| maxDetections             | Die maximale Anzahl von Händen, die gleichzeitig bearbeitet werden können. |
| pointsPerDetection        | Anzahl der Scheitelpunkte, die pro Hand extrahiert werden.                 |
| rightIndices: [{a, b, c}] | Indiziert das Scheitelpunkt-Array, das die Dreiecke des Handnetzes bildet. |
| leftIndices: [{a, b, c}]  | Indiziert das Scheitelpunkt-Array, das die Dreiecke des Handnetzes bildet. |

## Beispiel {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection} = detail
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection}))
}
this.el.sceneEl.addEventListener('xrhandscanning', initMesh)
```
