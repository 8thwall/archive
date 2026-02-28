# xrhandloading

## Description {#description}

Cet événement est émis par [`xrhand`](/legacy/api/aframe/#hand-tracking) lorsque le chargement de ressources AR supplémentaires commence.

`xrhandloading.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Propriété                                                                                           | Description                                                                                         |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| maxDetections                                                                                       | Le nombre maximum de mains qui peuvent être traitées simultanément.                 |
| pointsParDetection                                                                                  | Nombre de sommets qui seront extraits par main.                                     |
| rightIndices : [{a, b, c}]      | Index dans le tableau des sommets qui forment les triangles du maillage de la main. |
| Indices de gauche : [{a, b, c}] | Index dans le tableau des sommets qui forment les triangles du maillage de la main. |

## Exemple {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection} = detail
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection})))
}
this.el.sceneEl.addEventListener('xrhandloading', initMesh)
```
