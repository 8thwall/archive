---
sidebar_label: configurar()
---

# XR8.LayersController.configure()

`XR8.LayersController.configure({ nearClip, farClip, coordinates, layers })`

## Descripción {#description}

Configura el procesamiento realizado por `LayersController`.

## Parámetros {#parameters}

| Parámetro                                                                  | Tipo                              | Por defecto | Descripción                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------- | --------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Opcional]    | `Número`                          | `0.01`      | La distancia desde la cámara del plano de clip cercano, es decir, la distancia más cercana a la cámara a la que son visibles los objetos de la escena.                                                                                        |
| farClip [Opcional]     | `Número`                          | `1000`      | La distancia desde la cámara del plano de clip lejano, es decir, la distancia más lejana a la cámara a la que son visibles los objetos de la escena.                                                                                          |
| coordenadas [Opcional] | Coordenadas                       |             | La configuración de la cámara.                                                                                                                                                                                                                |
| capas [Opcional]       | `Registro<String, LayerOptions?>` | `{}`        | Capas semánticas para detectar. La clave es el nombre de la capa. Para eliminar una capa pase `null` en lugar de `LayerOptions`. El único nombre de capa admitido en este momento es `'sky'`. |

El objeto `Coordinates` tiene las siguientes propiedades:

| Parámetro                                                                      | Tipo                                                                                | Por defecto                                                          | Descripción                                                            |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| origen [Opcional]          | \`{posición: {x, y, z}, rotación: {w, x, y, z}}\`\` | `{posición: {x: 0, y: 2, z: 0}, rotación: {w: 1, x: 0, y: 0, z: 0}}` | La posición y la rotación de la cámara.                |
| escala [Opcional]          | `Número`                                                                            | `2`                                                                  | Escala de la escena.                                   |
| ejes [Opcional]            | Cadena                                                                              | `'DIESTRO'`                                                          | Puede ser "MANO IZQUIERDA" o "MANO DERECHA".           |
| mirroredDisplay [Opcional] | Booleano                                                                            | `false`                                                              | Si es true, voltea a izquierda y derecha en la salida. |

El objeto `LayerOptions` tiene las siguientes propiedades:

| Parámetro                                                                      | Tipo     | Por defecto | Descripción                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------ | -------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| invertLayerMask [Opcional] | Booleano | `false`     | Si es `true`, el contenido que coloques en tu escena será visible en las zonas no celestes. Si es `false`, el contenido que coloques en tu escena será visible en las zonas del cielo. Para restablecer el valor por defecto pase `null`. |
| edgeSmoothness [Opcional]  | `Número` | `0`         | Cantidad para alisar los bordes de la capa. Los valores válidos están comprendidos entre [0-1]. Para restablecer el valor por defecto pase `null`.                                    |

**IMPORTANTE:** [`XR8.LayersController`](./layerscontroller.md) no puede utilizarse al mismo tiempo que [`XR8.FaceController`](../facecontroller/facecontroller.md).

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
XR8.LayersController.configure({layers: {sky: {invertLayerMask: true, edgeSmoothness: 0.8}}})
```
