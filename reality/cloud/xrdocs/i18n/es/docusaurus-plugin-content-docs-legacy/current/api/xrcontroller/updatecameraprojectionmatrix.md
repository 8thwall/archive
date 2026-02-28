---
sidebar_label: updateCameraProjectionMatrix()
---

# XR8.XrController.updateCameraProjectionMatrix()

`XR8.XrController.updateCameraProjectionMatrix({ cam, origin, facing })`

## Descripción {#description}

Restablece la geometría de visualización de la escena y la posición inicial de la cámara en la escena. La geometría de visualización es necesaria para superponer correctamente la posición de los objetos en la escena virtual sobre su posición correspondiente en la imagen de la cámara. La posición inicial especifica dónde se colocará y orientará la cámara al inicio de una sesión.

## Parámetros {#parameters}

| Parámetro                                                               | Tipo                                                                 | Por defecto                                   | Descripción                                                                                     |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| cam [Opcional]      | \`{pixelRectWidth, pixelRectHeight, nearClipPlane, farClipPlane}\`\` | `{nearClipPlane: 0.01, farClipPlane: 1000.0}` | La configuración de la cámara.                                                  |
| origen [Opcional]   | `{x, y, z}`                                                          | `{x: 0, y: 2, z: 0}`                          | La posición inicial de la cámara en la escena.                                  |
| frente a [Opcional] | `{w, x, y, z}`                                                       | `{w: 1, x: 0, y: 0, z: 0}`                    | La dirección inicial (cuaternión) de la cámara en la escena. |

`cam` tiene los siguientes parámetros:

| Parámetro       | Tipo     | Descripción                                                                                          |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| pixelRectWidth  | `Número` | La anchura del lienzo que muestra la alimentación de la cámara.                      |
| pixelRectHeight | `Número` | La altura del lienzo que muestra la alimentación de la cámara.                       |
| nearClipPlane   | `Número` | La distancia más cercana a la cámara a la que son visibles los objetos de la escena. |
| farClipPlane    | `Número` | La distancia más lejana a la cámara a la que son visibles los objetos de la escena.  |

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
XR8.XrController.updateCameraProjectionMatrix({
  origin: { x: 1, y: 4, z: 0 },
  facing: { w: 0.9856, x: 0, y: 0.169, z: 0 }
})
```
