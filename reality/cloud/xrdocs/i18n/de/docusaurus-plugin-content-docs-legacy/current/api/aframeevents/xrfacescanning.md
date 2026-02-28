# xrfacescanning

## Beschreibung {#description}

Dieses Ereignis wird von [`xrface`](/legacy/api/aframe/#face-effects) ausgelöst, wenn alle Face-AR-Ressourcen geladen wurden und das Scannen begonnen hat.

`xrfacescanning.detail : {maxDetections, pointsPerDetection, indices, uvs}`

| Eigentum                                                                                 | Beschreibung                                                                                                                                        |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections                                                                            | Die maximale Anzahl von Flächen, die gleichzeitig verarbeitet werden können.                                                        |
| pointsPerDetection                                                                       | Anzahl der Scheitelpunkte, die pro Fläche extrahiert werden.                                                                        |
| Indizes: [{a, b, c}] | Indizes in das Scheitelpunkt-Array, die die Dreiecke des angeforderten Netzes bilden, wie mit meshGeometry auf configure angegeben. |
| uvs: [{u, v}]        | uv-Positionen in eine Texturkarte, die den zurückgegebenen Scheitelpunkten entspricht.                                              |

## Beispiel {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection, uvs, indices} = detail
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection, uvs, indices}))
}
this.el.sceneEl.addEventListener('xrfacescanning', initMesh)
```
