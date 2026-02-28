---
sidebar_label: Puntos de anclaje
---

# XR8.HandController.AttachmentPoints

Enumeración

## Descripción {#description}

Puntos de la mano a los que puedes anclar contenidos.

#### Ejemplo - Mostrando los puntos de fijación en el anillo y el pulgar {#example---showcasing-the-attachment-points-on-the-ring-and-thumb}

![hand-attachment-example](/images/handAttachmentPoints.png)

## Propiedades {#properties}

| Propiedad                                                                                    | Valor               | Descripción                                                                    |
| -------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------ |
| MUÑECA                                                                                       | `'muñeca'`          | Muñeca                                                                         |
| ARTICULACIÓN_BASE_DEL_PULGAR  | `'thumbBaseJoint'`  | Articulación carpometacarpiana (CMC) del pulgar             |
| ARTICULACIÓN_MEDIA_DEL_PULGAR | `'thumbMidJoint'`   | Articulación metacarpofalángica (MCP) del pulgar            |
| ARTICULACIÓN_DEL_PULGAR                            | `'thumbTopJoint'`   | Articulación interfalángica (IP) del pulgar                 |
| THUMB_TIP                                                               | `'thumbTip'`        | Punta del pulgar                                                               |
| INDEX_BASE_JOINT                                   | `'indexBaseJoint'`  | Articulación metacarpofalángica (MCP) del dedo índice       |
| INDEX_MID_JOINT                                    | `'indexMidJoint'`   | Articulación interfalángica proximal (PIP) del dedo índice  |
| INDEX_TOP_JOINT                                    | `'indexTopJoint'`   | Articulación interfalángica distal (DIP) del dedo índice    |
| INDEX_TIP                                                               | `'indexTip'`        | Punta del dedo índice                                                          |
| ARTICULACIÓN_BASE_MEDIA                            | `'middleBaseJoint'` | Articulación metacarpofalángica (MCP) del dedo corazón      |
| ARTICULACIÓN_MEDIA_MEDIA                           | `'middleMidJoint'`  | Articulación interfalángica proximal (PIP) del dedo corazón |
| ARTICULACIÓN_MEDIA_SUPERIOR                        | `'middleTopJoint'`  | Articulación interfalángica distal (DIP) del dedo corazón   |
| MIDDLE_TIP                                                              | `'middleTip'`       | Punta del dedo corazón                                                         |
| ARTICULACIÓN_BASE_ANULAR                           | `'ringBaseJoint'`   | Articulación metacarpofalángica (MCP) del dedo anular       |
| RING_MID_JOINT                                     | RingMidJoint        | Articulación interfalángica proximal (PIP) del dedo anular  |
| RING_TOP_JOINT                                     | `'ringTopJoint'`    | Articulación interfalángica distal (DIP) del dedo anular    |
| RING_TIP                                                                | `'ringTip'`         | Punta del dedo anular                                                          |
| ARTICULACIÓN_BASE_MEÑIQUE                          | `'pinkyBaseJoint'`  | Articulación metacarpofalángica (MCP) del dedo meñique      |
| ARTICULACIÓN_MEDIA_MEÑIQUE                         | `'pinkyMidJoint'`   | Articulación interfalángica proximal (PIP) del dedo meñique |
| ARTICULACIÓN_MEÑIQUE_SUPERIOR                      | `'pinkyTopJoint'`   | Articulación interfalángica distal (DIP) del dedo meñique   |
| PINKY_TIP                                                               | `'pinkyTip'`        | Punta del dedo meñique                                                         |
| PALMA                                                                                        | `'palma'`           | Palma                                                                          |
| THUMB_UPPER                                                             | `'thumbUpper'`      | Punto medio de la falange proximal del pulgar                                  |
| THUMB_NAIL                                                              | `'uña del pulgar'`  | Punto medio de la uña del pulgar                                               |
| INDEX_LOWER                                                             | `'indexLower'`      | Punto medio de la falange proximal del dedo índice                             |
| INDEX_UPPER                                                             | `'indexUpper'`      | Punto medio de la falange media del dedo índice                                |
| INDEX_NAIL                                                              | `'indexNail'`       | Punto medio de la uña del dedo índice                                          |
| MIDDLE_LOWER                                                            | `'middleLower'`     | Punto medio de la falange proximal del dedo corazón                            |
| MIDDLE_UPPER                                                            | `'medioSuperior'`   | Punto medio de la falange media del dedo corazón                               |
| CLAVO_MEDIO                                                             | `'middleNail'`      | Punto medio de la uña del dedo corazón                                         |
| ANILLO_INFERIOR                                                         | `'ringLower'`       | Punto medio de la falange proximal del dedo anular                             |
| RING_UPPER                                                              | `'ringUpper'`       | Punto medio de la falange media del dedo anular                                |
| ANILLO_NAIL                                                             | `'ringNail'`        | Punto medio de la uña del dedo anular                                          |
| PINKY_LOWER                                                             | `'pinkyLower'`      | Punto medio de la falange proximal del meñique                                 |
| PINKY_UPPER                                                             | `'pinkyUpper'`      | Punto medio de la falange media del meñique                                    |
| PINKY_NAIL                                                              | `'pinkyNail'`       | Punto medio de la uña del dedo meñique                                         |

Cuando `enableWrist:true` la detección de la muñeca se ejecuta simultáneamente con el seguimiento de la mano y devuelve los siguientes puntos de fijación de la oreja:

| Propiedad                         | Valor              | Descripción                                                                      |
| --------------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| PARTE SUPERIOR DE LA MUÑECA       | `'wristTop'`       | Punto central de la vista dorsal de la muñeca                                    |
| WRIST_BOTTOM | `'wristBottom'`    | Punto central de la vista palmar de la muñeca                                    |
| WRIST_INNER  | `'muñecaInterior'` | Punto medio de la muñeca en el lado del pulgar de una vista dorsal de la muñeca  |
| WRIST_OUTER  | `'muñecaExterior'` | Punto medio de la muñeca en el lado del meñique de una vista dorsal de la muñeca |