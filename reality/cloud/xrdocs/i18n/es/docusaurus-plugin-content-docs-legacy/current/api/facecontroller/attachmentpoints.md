---
sidebar_label: Puntos de anclaje
---

# XR8.FaceController.AttachmentPoints

Enumeración

## Descripción {#description}

Puntos de la cara a los que puedes anclar contenidos.

## Propiedades {#properties}

| Propiedad                                                                                   | Valor                              | Descripción                        |
| ------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------- |
| FRENTE                                                                                      | "frente                            | Frente                             |
| CEJA_DERECHA_INTERIOR                             | `'CejaDerechaInterior'`            | Cara interna de la ceja derecha    |
| CEJA_DERECHA_MEDIA                                | `'cejaDerechaMedia'`               | Mitad de la ceja derecha           |
| CEJA_DERECHA_EXTERIOR                             | `'CejaDerechaExterior'`            | Cara externa de la ceja derecha    |
| CEJA_IZQUIERDA_INTERIOR                           | `'CejaIzquierdaInterior'`          | Cara interna de la ceja izquierda  |
| CEJA_IZQUIERDA_MEDIA                              | `'cejaIzquierdaMedia'`             | Mitad de la ceja izquierda         |
| CEJA_IZQUIERDA_EXTERIOR                           | `'CejaExternaIzquierda'`           | Cara externa de la ceja izquierda  |
| LEFT_EAR                                                               | `'OrejaIzquierda'`                 | Oreja izquierda                    |
| RIGHT_EAR                                                              | `'OídoDerecho'`                    | Oído derecho                       |
| LEFT_CHEEK                                                             | `'MejillaIzquierda'`               | Mejilla izquierda                  |
| CHEQUE_DERECHO                                                         | "mejilla derecha                   | Mejilla derecha                    |
| NOSE_BRIDGE                                                            | puente nasal                       | Puente de la nariz                 |
| NOSE_TIP                                                               | `'noseTip'`                        | Punta de la nariz                  |
| OJO_IZQUIERDO                                                          | `'ojoizquierdo'`                   | Ojo izquierdo                      |
| OJO_DERECHO                                                            | `'ojoDerecho'`                     | Ojo derecho                        |
| ESQUINA_EXTERIOR_IZQUIERDA                        | esquina exterior del ojo izquierdo | Ángulo externo del ojo izquierdo   |
| ESQUINA_EXTERIOR_OJO_DERECHA | Esquina exterior del ojo derecho   | Ángulo externo del ojo derecho     |
| LEFT_IRIS                                                              | `'IrisIzquierdo'`                  | Iris del ojo izquierdo             |
| RIGHT_IRIS                                                             | `'rightIris'`                      | Iris del ojo derecho               |
| PÁRPADO SUPERIOR IZQUIERDO                                                                  | "párpado superior izquierdo        | Párpado superior del ojo izquierdo |
| PÁRPADO SUPERIOR DERECHO                                                                    | "párpado superior derecho          | Párpado superior del ojo derecho   |
| PÁRPADO_INFERIOR_IZQUIERDO                        | `'LeftLowerEyelid'`                | Párpado inferior del ojo izquierdo |
| PÁRPADO INFERIOR DERECHO                                                                    | "párpado inferior derecho          | Párpado inferior del ojo derecho   |
| UPPER_LIP                                                              | labio superior                     | Labio superior                     |
| LABIO_INFERIOR                                                         | labio inferior                     | Labio inferior                     |
| BOCA                                                                                        | `'boca'`                           | Boca                               |
| BOCA_ESQUINA_DERECHA                              | `'bocaEsquinaDerecha'`             | comisura derecha de la boca        |
| BOCA_ESQUINA_IZQUIERDA                            | `'bocaEsquinaIzquierda'`           | comisura izquierda de la boca      |
| CHIN                                                                                        | `'barbilla'`                       | Chin                               |

Cuando `enableEars:true` la detección de orejas se ejecuta simultáneamente con Face Effects y devuelve los siguientes puntos de fijación de orejas:

| Propiedad                                                     | Valor               | Descripción                          |
| ------------------------------------------------------------- | ------------------- | ------------------------------------ |
| EAR_LEFT_HELIX      | `'HéliceIzquierda'` | Hélix superior de la oreja izquierda |
| EAR_LEFT_CANAL      | `'CanalIzquierdo'`  | Conducto auditivo del oído izquierdo |
| EAR_LEFT_LOBE       | lóbulo izquierdo    | Lóbulo de la oreja izquierda         |
| OREJA_HELIX_DERECHA | `'rightHelix'`      | Hélix superior de la oreja derecha   |
| CANAL_OÍDO_DERECHO  | `'CanalDerecho'`    | Conducto auditivo del oído derecho   |
| EAR_RIGHT_LOBE      | Lóbulo derecho      | Lóbulo de la oreja derecha           |
