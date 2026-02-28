---
sidebar_position: 1
sidebar_label: configure()
---

# XR8.HandController.configurar()

`XR8.HandController.configure({ nearClip, farClip, coordinates })`

## Descripción {#description}

Configure qué procesamiento realiza HandController.

## Parámetros {#parameters}

| Parámetro                 | Tipo          | Por defecto | Descripción                                                                                                                                            |
| ------------------------- | ------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| nearClip [Opcional]       | `Número`      | `0,01`      | La distancia desde la cámara del plano de clip cercano, es decir, la distancia más cercana a la cámara a la que son visibles los objetos de la escena. |
| farClip [Opcional]        | `Number`      | `1000`      | La distancia desde la cámara del plano del clip lejano, es decir, la distancia más lejana a la cámara a la que son visibles los objetos de la escena.  |
| maxDetecciones [Opcional] | `Number`      | `1`         | El número máximo de manos a detectar. La única opción disponible es 1.                                                                                 |
| enableWrists [Opcional]   | `Booleano`    | `false`     | Si es verdadero, ejecuta la detección de la muñeca simultáneamente con el seguimiento de la mano y devuelve los puntos de fijación de la muñeca.       |
| coordenadas [Opcional]    | `Coordenadas` |             | La configuración de la cámara.                                                                                                                         |

El objeto `Coordinates` tiene las siguientes propiedades:

| Parámetro                  | Tipo                                             | Por defecto                                                         | Descripción                                                 |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------------------------- | ----------------------------------------------------------- |
| origin [Opcional]          | `{position: {x, y, z}, rotation: {w, x, y, z}}` | `{position: {x: 0, y: 0, z: 0} rotación: {w: 1, x: 0, y: 0, z: 0}}` | La posición y rotación de la cámara.                        |
| scale [Opcional]           | `Number`                                         | `1`                                                                 | Escala de la escena.                                        |
| axes [Opcional]            | `Cadena`                                         | `'RIGHT_HANDED'`                                                    | Puede ser `'LEFT_HANDED'` o `'RIGHT_HANDED'`.               |
| mirroredDisplay [Opcional] | `Boolean`                                        | `Falso`                                                             | Si es verdadero, voltea a izquierda y derecha en la salida. |

**IMPORTANTE:** [`XR8.HandController`](./handcontroller.md) no puede utilizarse al mismo tiempo que [`XR8.XrController`](../xrcontroller/xrcontroller.md).

## Devoluciones {#returns}

Ninguno

## Ejemplo {#example}

```javascript
  XR8.HandController.configure({
    coordenadas: {mirroredDisplay: false},
 }})
```
