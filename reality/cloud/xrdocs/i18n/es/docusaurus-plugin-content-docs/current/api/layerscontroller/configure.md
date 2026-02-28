---
sidebar_label: configure()
---

# XR8.LayersController.configure()

`XR8.LayersController.configure({ nearClip, farClip, coordinates, layers })`

## Descripción {#description}

Configura el procesamiento realizado por `LayersController`.

## Parámetros {#parameters}

| Parámetro              | Tipo                                  | Por defecto | Descripción                                                                                                                                                                                     |
| ---------------------- | ------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Opcional]    | `Número`                              | `0,01`      | La distancia desde la cámara del plano de clip cercano, es decir, la distancia más cercana a la cámara a la que son visibles los objetos de la escena.                                          |
| farClip [Opcional]     | `Number`                              | `1000`      | La distancia desde la cámara del plano del clip lejano, es decir, la distancia más lejana a la cámara a la que son visibles los objetos de la escena.                                           |
| coordinates [Opcional] | `Coordenadas`                         |             | La configuración de la cámara.                                                                                                                                                                  |
| layers [Optional]      | `Record<String, LayerOptions?>` | `{}`        | Capas semánticas para detectar. La clave es el nombre de la capa. Para eliminar una capa pasa `null` en lugar de `LayerOptions`. El único nombre de capa admitido en este momento es `'cielo'`. |

El objeto `Coordenadas` tiene las siguientes propiedades:

| Parámetro                  | Tipo                                           | Por defecto                                                         | Descripción                                                 |
| -------------------------- | ---------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------- |
| origin [Opcional]          | `{position: {x, y, z} rotación: {w, x, y, z}}` | `{position: {x: 0, y: 2, z: 0} rotación: {w: 1, x: 0, y: 0, z: 0}}` | La posición y rotación de la cámara.                        |
| scale [Opcional]           | `Número`                                       | `2`                                                                 | Escala de la escena.                                        |
| axes [Opcional]            | `Cadena`                                       | `'RIGHT_HANDED'`                                                    | Puede ser `'LEFT_HANDED'` o `'RIGHT_HANDED'`.               |
| mirroredDisplay [Opcional] | `Booleano`                                     | `false`                                                             | Si es verdadero, voltea a izquierda y derecha en la salida. |

El objeto `LayerOptions` tiene las siguientes propiedades:

| Parámetro                  | Tipo       | Por defecto | Descripción                                                                                                                                                                                                                         |
| -------------------------- | ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| invertLayerMask [Opcional] | `Booleano` | `false`     | Si `true`, el contenido que coloques en su escena será visible en las zonas no celestes. Si `false`, el contenido que coloques en su escena será visible en las zonas del cielo. Para restablecer el valor por defecto pasa `null`. |
| edgeSmoothness [Opcional]  | `Número`   | `0`         | Cantidad para alisar los bordes de la capa. Los valores válidos están entre [0-1]. Para restablecer el valor por defecto pasa `null`.                                                                                               |

**IMPORTANTE:** [`XR8.LayersController`](./layerscontroller.md) no puede utilizarse al mismo tiempo que [`XR8.FaceController`](../facecontroller/facecontroller.md).

## Vuelta {#returns}

Ninguno

## Ejemplo {#example}

```javascript
XR8.LayersController.configure({layers: {sky: {invertLayerMask: true, edgeSmoothness: 0.8}}})
```
