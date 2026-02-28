---
sidebar_label: AttachmentPoints
---

# XR8.HandController.AttachmentPoints

Enumeración

## Descripción {#description}

Puntos de la mano a los que puede anclar contenidos.

#### Ejemplo - Mostrando los puntos de enganche en el anillo y el pulgar {#example---showcasing-the-attachment-points-on-the-ring-and-thumb}

![ejemplo de ataque manual](/images/handAttachmentPoints.png)

## Propiedades {#properties}

| Propiedad                   | Valor               | Descripción                                                 |
| --------------------------- | ------------------- | ----------------------------------------------------------- |
| WRIST                       | `'wrist'`           | Wrist                                                       |
| THUMB_BASE_JOINT          | `'thumbBaseJoint'`  | Articulación carpometacarpiana (CMC) del pulgar             |
| THUMB_MID_JOINT           | `'thumbMidJoint'`   | Articulación metacarpofalángica (MCP) del pulgar            |
| THUMB_TOP_JOINT           | `'thumbTopJoint'`   | Articulación interfalángica (PI) del pulgar                 |
| THUMB_TIP                   | `'thumbTip'`        | Punta del pulgar                                            |
| INDEX_BASE_JOINT          | `'indexBaseJoint'`  | Metacarpophalangeal joint (MCP) of the index finger         |
| ARTICULACIÓN_MEDIA_ÍNDICE | `'indexMidJoint'`   | Articulación interfalángica proximal (PIP) del dedo índice  |
| INDEX_TOP_JOINT           | `indexTopJoint`     | Articulación interfalángica distal (DIP) del dedo índice    |
| INDEX_TIP                   | `'indexTip'`        | Punta del dedo índice                                       |
| MIDDLE_BASE_JOINT         | `'middleBaseJoint'` | Articulación metacarpofalángica (MCP) del dedo corazón      |
| MIDDLE_MID_JOINT          | `'middleMidJoint'`  | Articulación interfalángica proximal (PIP) del dedo corazón |
| MIDDLE_TOP_JOINT          | `'middleTopJoint'`  | Articulación interfalángica distal (DIP) del dedo corazón   |
| MIDDLE_TIP                  | `'middleTip'`       | Punta del dedo corazón                                      |
| RING_BASE_JOINT           | `'ringBaseJoint'`   | Articulación metacarpofalángica (MCP) del dedo anular       |
| RING_MID_JOINT            | `'ringMidJoint'`    | Articulación interfalángica proximal (PIP) del dedo anular  |
| RING_TOP_JOINT            | `'ringTopJoint'`    | Articulación interfalángica distal (DIP) del dedo anular    |
| RING_TIP                    | `'ringTip'`         | Punta del dedo anular                                       |
| PINKY_BASE_JOINT          | `'pinkyBaseJoint'`  | Articulación metacarpofalángica (MCP) del dedo meñique      |
| PINKY_MID_JOINT           | `'pinkyMidJoint'`   | Articulación interfalángica proximal (PIP) del dedo meñique |
| PINKY_TOP_JOINT           | `'pinkyTopJoint'`   | Articulación interfalángica distal (DIP) del dedo meñique   |
| PINKY_TIP                   | `'pinkyTip'`        | Punta del dedo meñique                                      |
| PALMA                       | `'palm'`            | Palma                                                       |
| PULGAR_SUPERIOR             | `'thumbUpper'`      | Punto medio de la falange proximal del pulgar               |
| THUMB_NAIL                  | `'thumbNail'`       | Punto medio de la uña del pulgar                            |
| INDEX_LOWER                 | `'indexLower'`      | Punto medio de la falange proximal del dedo índice          |
| INDEX_UPPER                 | `'indexUpper'`      | Punto medio de la falange media del dedo índice             |
| INDEX_NAIL                  | `'indexNail'`       | Punto medio de la uña del dedo índice                       |
| MIDDLE_LOWER                | `'middleLower'`     | Punto medio de la falange proximal del dedo corazón         |
| MIDDLE_UPPER                | `'middleUpper'`     | Punto medio de la falange media del dedo corazón            |
| MIDDLE_NAIL                 | `'middleNail'`      | Punto medio de la uña del dedo corazón                      |
| RING_LOWER                  | `'ringLower'`       | Punto medio de la falange proximal del dedo anular          |
| RING_UPPER                  | `'ringUpper'`       | Punto medio de la falange media del dedo anular             |
| RING_NAIL                   | `'ringNail'`        | Punto medio de la uña del dedo anular                       |
| PINKY_LOWER                 | `'pinkyLower'`      | Punto medio de la falange proximal del meñique              |
| PINKY_UPPER                 | `'pinkyUpper'`      | Punto medio de la falange media del meñique                 |
| PINKY_NAIL                  | `'pinkyNail'`       | Punto medio de la uña del dedo meñique                      |

Cuando `enableWrist:true` la detección de la muñeca se ejecuta simultáneamente con el seguimiento de la mano y devuelve los siguientes puntos de fijación de la oreja:

| Propiedad                   | Valor              | Descripción                                                                      |
| --------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| PARTE SUPERIOR DE LA MUÑECA | `'wristTop'`       | Punto central de la vista dorsal de la muñeca                                    |
| WRIST_BOTTOM                | `'wristBottom'`    | Punto central de la vista palmar de la muñeca                                    |
| WRIST_INNER                 | `'muñecaInterior'` | Punto medio de la muñeca en el lado del pulgar de una vista dorsal de la muñeca  |
| WRIST_OUTER                 | `Muñeca`           | Punto medio de la muñeca en el lado del meñique de una vista dorsal de la muñeca |