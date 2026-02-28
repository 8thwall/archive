# xrfacescanning

## Description {#description}

Cet événement est émis par [`xrface`](/api/aframe/#face-effects) lorsque toutes les ressources face AR ont été chargées et que le scan a commencé.

`xrfacescanning.detail : {maxDetections, pointsPerDetection, indices, uvs}`

| Propriété             | Description                                                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections         | Nombre maximal de visages pouvant être traités simultanément.                                                                       |
| pointsParDetection    | Nombre de sommets qui seront extraits par visage.                                                                                   |
| indices : [{a, b, c}] | Index dans le tableau des sommets qui forment les triangles du maillage demandé, comme spécifié avec meshGeometry en configuration. |
| uvs : [{u, v}]        | Les positions uv dans une carte de texture correspondant aux points de vertex retournés.                                            |

## Exemple {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection, uvs, indices} = detail
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection, uvs, indices}))
}
this.el.sceneEl.addEventListener('xrfacescanning', initMesh)
```
