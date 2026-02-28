---
sidebar_label: AttachmentPoints
---

# XR8.FaceController.AttachmentPoints

Enumeración

## Descripción {#description}

Puntos de la cara a los que puedes anclar contenidos.

## Propiedades {#properties}

| Propiedad                | Valor                   | Descripción                        |
| ------------------------ | ----------------------- | ---------------------------------- |
| FOREHEAD                 | `'forehead'`            | Frente                             |
| RIGHT_EYEBROW_INNER    | `'rightEyebrowInner'`   | Lado interno de la ceja derecha    |
| RIGHT_EYEBROW_MIDDLE   | `'rightEyebrowMiddle'`  | Mitad de la ceja derecha           |
| RIGHT_EYEBROW_OUTER    | `'rightEyebrowOuter'`   | Lado externo de la ceja derecha    |
| LEFT_EYEBROW_INNER     | `'leftEyebrowInner'`    | Lado interno de la ceja izquierda  |
| LEFT_EYEBROW_MIDDLE    | `'leftEyebrowMiddle'`   | Mitad de la ceja izquierda         |
| LEFT_EYEBROW_OUTER     | `'leftEyebrowOuter'`    | Lado externo de la ceja izquierda  |
| LEFT_EAR                 | `'leftEar'`             | Oreja izquierda                    |
| RIGHT_EAR                | `'rightEar'`            | Oreja derecha                      |
| LEFT_CHEEK               | `'leftCheek'`           | Mejilla izquierda                  |
| RIGHT_CHEEK              | `'rightCheek'`          | Mejilla derecha                    |
| NOSE_BRIDGE              | `'noseBridge'`          | Puente nasal                       |
| NOSE_TIP                 | `'noseTip'`             | Punta de la nariz                  |
| LEFT_EYE                 | `'leftEye'`             | Ojo izquierdo                      |
| RIGHT_EYE                | `'rightEye'`            | Ojo derecho                        |
| LEFT_EYE_OUTER_CORNER  | `'leftEyeOuterCorner'`  | Esquina externa del ojo izquierdo  |
| RIGHT_EYE_OUTER_CORNER | `'rightEyeOuterCorner'` | Esquina externa del ojo derecho    |
| LEFT_IRIS                | `'leftIris'`            | Iris del ojo izquierdo             |
| RIGHT_IRIS               | `'rightIris'`           | Iris del ojo derecho               |
| LEFT_UPPER_EYELID      | `'leftUpperEyelid'`     | Párpado superior del ojo izquierdo |
| RIGHT_UPPER_EYELID     | `'rightUpperEyelid'`    | Párpado superior del ojo derecho   |
| LEFT_LOWER_EYELID      | `'leftLowerEyelid'`     | Párpado inferior del ojo izquierdo |
| RIGHT_LOWER_EYELID     | `'rightLowerEyelid'`    | Párpado inferior del ojo derecho   |
| UPPER_LIP                | `'upperLip'`            | Labio superior                     |
| LOWER_LIP                | `'lowerLip'`            | Labio inferior                     |
| MOUTH                    | `'mouth'`               | Boca                               |
| MOUTH_RIGHT_CORNER     | `'mouthRightCorner'`    | Comisura derecha de la boca        |
| MOUTH_LEFT_CORNER      | `'mouthLeftCorner'`     | Comisura izquierda de la boca      |
| CHIN                     | `'chin'`                | Barbilla                           |

Con `enableEars:true`, la detección de orejas se ejecuta simultáneamente con los efectos faciales y devuelve los siguientes puntos de fijación de las orejas:

| Propiedad         | Valor          | Descripción                           |
| ----------------- | -------------- | ------------------------------------- |
| EAR_LEFT_HELIX  | `'leftHelix'`  | Hélice superior de la oreja izquierda |
| EAR_LEFT_CANAL  | `'leftCanal'`  | Conducto auditivo del oído izquierdo  |
| EAR_LEFT_LOBE   | `'leftLobe'`   | Lóbulo de la oreja izquierda          |
| EAR_RIGHT_HELIX | `'rightHelix'` | Hélice superior de la oreja derecha   |
| EAR_RIGHT_CANAL | `'rightCanal'` | Conducto auditivo del oído derecho    |
| EAR_RIGHT_LOBE  | `'rightLobe'`  | Lóbulo de la oreja derecha            |
