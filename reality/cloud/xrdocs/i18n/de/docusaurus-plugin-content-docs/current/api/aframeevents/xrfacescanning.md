# xrfacescanning

## Beschreibung {#description}

Dieses Ereignis wird von [`xrface`](/api/aframe/#face-effects) ausgelöst, wenn alle Gesichtseffekt-AR-Ressourcen geladen wurden und das Scannen begonnen hat.

`xrfacescanning.detail : {maxDetections, pointsPerDetection, indices, uvs}`

| Eigentum             | Beschreibung                                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections        | Die maximale Anzahl von Gesichtern, die gleichzeitig verarbeitet werden können.                                                          |
| pointsPerDetection   | Anzahl der Scheitelpunkte, die pro Fläche extrahiert werden.                                                                             |
| indizes: [{a, b, c}] | Indizes in dem Array mit den Eckpunkten, die die Dreiecke des angeforderten Netzes bilden, wie mit meshGeometry bei configure angegeben. |
| uvs: [{u, v}]        | uv-Positionen in eine Texturkarte, die den zurückgegebenen Scheitelpunkten entspricht.                                                   |

## Beispiel {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection, uvs, indices} = detail
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection, uvs, indices}))
}
this.el.sceneEl.addEventListener('xrfacescanning', initMesh)
```
