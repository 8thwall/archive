# xrhandloading

## Descripción {#description}

Este evento es emitido por [`xrhand`](/legacy/api/aframe/#hand-tracking) cuando se inicia la carga de recursos adicionales hand AR.

`xrhandloading.detail : {maxDetections, pointsPerDetection, rightIndices, leftIndices}`

| Propiedad                                                                                     | Descripción                                                                                        |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| maxDetecciones                                                                                | El número máximo de manos que se pueden procesar simultáneamente.                  |
| puntosPorDetección                                                                            | Número de vértices que se extraerán por mano.                                      |
| rightIndices: [{a, b, c}] | Índices en la matriz de vértices que forman los triángulos de la malla de la mano. |
| leftIndices: [{a, b, c}]  | Índices en la matriz de vértices que forman los triángulos de la malla de la mano. |

## Ejemplo {#example}

```javascript
const initMesh = ({detail}) => {
  const {pointsPerDetection} = detalle
  this.el.object3D.add(generateMeshGeometry({pointsPerDetection}))
}
this.el.sceneEl.addEventListener('xrhandloading', initMesh)
```
