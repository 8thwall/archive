---
sidebar_position: 1
sidebar_label: configurar()
---

# XR8.FaceController.configure()

XR8.FaceController.configure({ nearClip, farClip, meshGeometry, coordinates })\`

## Descripción {#description}

Configura qué procesamiento realiza FaceController.

## Parámetros {#parameters}

| Parámetro                                                                     | Tipo            | Por defecto                              | Descripción                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------- | --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Opcional]       | `Número`        | `0.01`                                   | La distancia desde la cámara del plano de clip cercano, es decir, la distancia más cercana a la cámara a la que son visibles los objetos de la escena.                                                                                                                |
| farClip [Opcional]        | `Número`        | `1000`                                   | La distancia desde la cámara del plano del clip lejano, es decir, la distancia más lejana a la cámara a la que son visibles los objetos de la escena.                                                                                                                 |
| meshGeometry [Opcional]   | `Array<String>` | `[XR8.FaceController.MeshGeometry.FACE]` | Controla qué partes de la geometría de la cabeza son visibles. Opciones: `[XR8.FaceController.MeshGeometry.FACE, XR8.FaceController.MeshGeometry.EYES, XR8.FaceController.MeshGeometry.IRIS, XR8.FaceController.MeshGeometry.MOUTH]`. |
| maxDetecciones [Opcional] | `Número`        | `1`                                      | Número máximo de caras a detectar. Las opciones disponibles son 1, 2 o 3.                                                                                                                                                                             |
| enableEars [Opcional]     | Booleano        | `false`                                  | Si es verdadero, ejecuta la detección de orejas simultáneamente con los efectos faciales y devuelve los puntos de fijación de las orejas.                                                                                                                             |
| uvType [Opcional]         | Cadena          | `[XR8.FaceController.UvType.STANDARD]`   | Especifica qué uvs se devuelven en el evento facescanning y faceloading. Las opciones son: `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`.                                                               |
| coordenadas [Opcional]    | Coordenadas     |                                          | La configuración de la cámara.                                                                                                                                                                                                                                        |

El objeto `Coordinates` tiene las siguientes propiedades:

| Parámetro                                                                      | Tipo                                                                                | Por defecto                                                          | Descripción                                                            |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| origen [Opcional]          | \`{posición: {x, y, z}, rotación: {w, x, y, z}}\`\` | `{posición: {x: 0, y: 0, z: 0}, rotación: {w: 1, x: 0, y: 0, z: 0}}` | La posición y la rotación de la cámara.                |
| escala [Opcional]          | `Número`                                                                            | `1`                                                                  | Escala de la escena.                                   |
| ejes [Opcional]            | Cadena                                                                              | `'DIESTRO'`                                                          | Puede ser "MANO IZQUIERDA" o "MANO DERECHA".           |
| mirroredDisplay [Opcional] | Booleano                                                                            | `Falso`                                                              | Si es true, voltea a izquierda y derecha en la salida. |

**IMPORTANTE:** [`XR8.FaceController`](./facecontroller.md) no puede utilizarse al mismo tiempo que [`XR8.XrController`](../xrcontroller/xrcontroller.md).

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
  XR8.FaceController.configure({
    meshGeometry: [XR8.FaceController.MeshGeometry.FACE],
    coordenadas: {
      mirroredDisplay: true,
      axes: 'LEFT_HANDED',
    },
})
```
