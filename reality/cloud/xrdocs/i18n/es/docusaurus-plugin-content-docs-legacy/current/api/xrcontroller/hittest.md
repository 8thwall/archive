---
sidebar_label: hitTest()
---

# XR8.XrController.hitTest()

`XrController.hitTest(X, Y, includedTypes = [])`

## Descripción {#description}

Estima la posición 3D de un punto en la alimentación de la cámara. X e Y se especifican como números entre 0 y 1, donde (0, 0) es la esquina superior izquierda y (1, 1) es la esquina inferior derecha de la alimentación de la cámara tal y como se renderiza en la cámara especificada por [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md). Pueden obtenerse varias estimaciones de posición en 3D para una misma prueba de impacto en función de la fuente de datos utilizada para estimar la posición. La fuente de datos que se ha utilizado para estimar la posición se indica mediante `hitTest.type`.

## Parámetros {#parameters}

| Parámetro       | Tipo       | Descripción                                                                                                                     |
| --------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| X               | `Número`   | Valor entre 0 y 1 que representa la posición horizontal en la alimentación de la cámara de izquierda a derecha. |
| Y               | `Número`   | Valor entre 0 y 1 que representa la posición vertical en la alimentación de la cámara de arriba a abajo.        |
| tipos incluidos | `[Cadena]` | Lista que debe contener `'FEATURE_POINT'`.                                                                      |

## Devuelve {#returns}

Una matriz de posiciones 3D estimadas a partir de la prueba de impacto:

`[{ tipo, posición, rotación, distancia }]`

| Parámetro | Tipo           | Descripción                                                                                                                                                        |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| tipo      | Cadena         | Una de las siguientes opciones: `'FEATURE_POINT', `'ESTIMATED_SURFACE', `'DETECTED_SURFACE' o `'UNSPECIFIED'. |
| posición  | `{x, y, z}`    | Posición 3D estimada del punto consultado en la imagen de la cámara.                                                                               |
| rotación  | `{x, y, z, w}` | La rotación 3D estimada del punto consultado en la alimentación de la cámara.                                                                      |
| distancia | `Número`       | La distancia estimada desde el dispositivo del punto consultado en la alimentación de la cámara.                                                   |

## Ejemplo {#example}

```javascript
const hitTestHandler = (e) => {
  const x = e.touches[0].clientX / window.innerWidth
  const y = e.touches[0].clientY / window.innerHeight
  const hitTestResults = XR8.XrController.hitTest(x, y, ['FEATURE_POINT'])
}
```
