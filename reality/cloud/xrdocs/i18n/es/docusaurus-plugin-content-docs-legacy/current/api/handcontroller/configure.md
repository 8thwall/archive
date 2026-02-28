---
sidebar_position: 1
sidebar_label: configurar()
---

# XR8.HandController.configure()

`XR8.HandController.configure({ nearClip, farClip, coordinates })`

## Descripción {#description}

Configura qué procesamiento realiza HandController.

## Parámetros {#parameters}

| Parámetro                                                                     | Tipo        | Por defecto | Descripción                                                                                                                                                            |
| ----------------------------------------------------------------------------- | ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Opcional]       | `Número`    | `0.01`      | La distancia desde la cámara del plano de clip cercano, es decir, la distancia más cercana a la cámara a la que son visibles los objetos de la escena. |
| farClip [Opcional]        | `Número`    | `1000`      | La distancia desde la cámara del plano del clip lejano, es decir, la distancia más lejana a la cámara a la que son visibles los objetos de la escena.  |
| maxDetecciones [Opcional] | `Número`    | `1`         | El número máximo de manos a detectar. La única opción disponible es 1.                                                                 |
| enableWrists [Opcional]   | Booleano    | `false`     | Si es verdadero, ejecuta la detección de la muñeca simultáneamente con el seguimiento de la mano y devuelve los puntos de fijación de la muñeca.       |
| coordenadas [Opcional]    | Coordenadas |             | La configuración de la cámara.                                                                                                                         |

El objeto `Coordinates` tiene las siguientes propiedades:

| Parámetro                                                                      | Tipo                                                                                | Por defecto                                                          | Descripción                                                            |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| origen [Opcional]          | \`{posición: {x, y, z}, rotación: {w, x, y, z}}\`\` | `{posición: {x: 0, y: 0, z: 0}, rotación: {w: 1, x: 0, y: 0, z: 0}}` | La posición y la rotación de la cámara.                |
| escala [Opcional]          | `Número`                                                                            | `1`                                                                  | Escala de la escena.                                   |
| ejes [Opcional]            | Cadena                                                                              | `'DIESTRO'`                                                          | Puede ser "MANO IZQUIERDA" o "MANO DERECHA".           |
| mirroredDisplay [Opcional] | Booleano                                                                            | `Falso`                                                              | Si es true, voltea a izquierda y derecha en la salida. |

**IMPORTANTE:** [`XR8.HandController`](./handcontroller.md) no puede utilizarse al mismo tiempo que [`XR8.XrController`](../xrcontroller/xrcontroller.md).

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
  XR8.HandController.configure({
    coordenadas: {mirroredDisplay: false},
})
```
