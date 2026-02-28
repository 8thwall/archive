# xrfacesescaneado

## Descripción {#description}

Este evento es emitido por [`xrface`](/legacy/api/aframe/#face-effects) cuando todos los recursos de face AR han sido cargados y el escaneo ha comenzado.

\`xrfacescanning.detail : {maxDetections, pointsPerDetection, indices, uvs}\`\`

| Propiedad                                                                                | Descripción                                                                                                                                          |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetecciones                                                                           | Número máximo de caras que se pueden procesar simultáneamente.                                                                       |
| puntosPorDetección                                                                       | Número de vértices que se extraerán por cara.                                                                                        |
| índices: [{a, b, c}] | Índices en la matriz de vértices que forman los triángulos de la malla solicitada, como se especifica con meshGeometry en configure. |
| uvs: [{u, v}]        | posiciones uv en un mapa de textura correspondiente a los puntos de vértice devueltos.                                               |

## Ejemplo {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection, uvs, indices} = detalle
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection, uvs, indices}))
}
this.el.sceneEl.addEventListener('xrfacescanning', initMesh)
```
