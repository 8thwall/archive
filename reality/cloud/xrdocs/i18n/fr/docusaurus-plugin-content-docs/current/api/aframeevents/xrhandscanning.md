# xrhandscanning

## Description {#description}

Cet événement est émis par [`xrhand`](/api/aframe/#hand-tracking) lorsque toutes les ressources Hand AR ont été chargées et que le scan a commencé.

`xrhandscanning.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Propriété                       | Description                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| maxDetections                   | Le nombre maximum de mains qui peuvent être traitées simultanément.                 |
| pointsParDetection              | Nombre de sommets qui seront extraits par main.                                     |
| rightIndices : [{a, b, c}]      | Index dans le tableau des sommets qui forment les triangles du maillage de la main. |
| indices de gauche : [{a, b, c}] | Index dans le tableau des sommets qui forment les triangles du maillage de la main. |

## Exemple {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection} = detail
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection}))
}
this.el.sceneEl.addEventListener('xrhandscanning', initMesh)
```
