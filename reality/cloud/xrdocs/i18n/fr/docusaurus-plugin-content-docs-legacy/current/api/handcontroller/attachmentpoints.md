---
sidebar_label: Points d'attachement
---

# XR8.HandController.AttachmentPoints

Enumération

## Description {#description}

Points de la main sur lesquels vous pouvez ancrer du contenu.

#### Exemple - Mise en évidence des points d'attache sur l'anneau et le pouce {#example---showcasing-the-attachment-points-on-the-ring-and-thumb}

![hand-attachment-example](/images/handAttachmentPoints.png)

## Propriétés {#properties}

| Propriété                                                                                                         | Valeur                                                                            | Description                                                                        |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| BRACELET                                                                                                          | `'poignet'`                                                                       | Poignet                                                                            |
| ARTICULATION_DE_BASE_DU_POUCE | \`'thumbBaseJoint'\`\\`                                                        | Articulation carpométacarpienne (CMC) du pouce                  |
| POUCE_MID_JOINT                                                         | `'thumbMidJoint'`'' (articulation médiane du pouce)            | Articulation métacarpophalangienne (MCP) du pouce               |
| ARTICULATION_TOP_DU_POUCE                          | `'thumbTopJoint'`'' (articulation du pouce)                    | Articulation interphalangienne (IP) du pouce                    |
| THUMB_TIP                                                                                    | `'thumbTip'`                                                                      | Extrémité du pouce                                                                 |
| INDEX_BASE_JOINT                                                        | \`'indexBaseJoint'\`\\`                                                        | Articulation métacarpophalangienne (MCP) de l'index             |
| INDEX_MID_JOINT                                                         | `IndexMidJoint'`                                                                  | Articulation interphalangienne proximale (PIP) de l'index       |
| INDEX_TOP_JOINT                                                         | `'indexTopJoint'`''.                                              | Articulation interphalangienne distale (DIP) de l'index         |
| INDEX_TIP                                                                                    | `'indexTip'`                                                                      | Extrémité de l'index                                                               |
| ARTICULATION_DE_BASE_MOYENNE                       | `'middleBaseJoint'`''.                                            | Articulation métacarpophalangienne (MCP) du majeur              |
| ARTICULATION_MOYENNE                                                                         | `'middleMidJoint'`''.                                             | Articulation interphalangienne proximale (PIP) du majeur        |
| ARTICULATION_TOP_MILIEU                                                 | `'middleTopJoint''`                                                               | Articulation interphalangienne distale (DIP) du majeur          |
| MIDDLE_TIP                                                                                   | `'middleTip'`                                                                     | Extrémité du majeur                                                                |
| ANNEAU_BASE_JOINT                                                       | `'ringBaseJoint'`''.                                              | Articulation métacarpophalangienne (MCP) de l'annulaire         |
| RING_MID_JOINT                                                          | `'ringMidJoint'`''.                                               | Articulation interphalangienne proximale (PIP) de l'annulaire   |
| RING_TOP_JOINT                                                          | `'ringTopJoint'`''.                                               | Articulation interphalangienne distale (DIP) de l'annulaire     |
| RING_TIP                                                                                     | `'ringTip'`                                                                       | Extrémité de l'annulaire                                                           |
| ARTICULATION DE LA BASE DE L'AURICULAIRE                                                                          | `'pinkyBaseJoint'`'' (articulation de base du petit doigt)     | Articulation métacarpophalangienne (MCP) de l'auriculaire       |
| ARTICULATION MÉDIANE DU PETIT DOIGT                                                                               | `'pinkyMidJoint'`'' (articulation médiane du petit doigt)      | Articulation interphalangienne proximale (PIP) de l'auriculaire |
| ARTICULATION SUPÉRIEURE DE L'AURICULAIRE                                                                          | `'pinkyTopJoint'`'' (articulation supérieure de l'auriculaire) | Articulation interphalangienne distale (DIP) de l'auriculaire   |
| PINKY_TIP                                                                                    | `'pinkyTip'` \\`                                                                 | Extrémité du petit doigt                                                           |
| PALM                                                                                                              | `'palm'`                                                                          | Palmier                                                                            |
| THUMB_UPPER                                                                                  | `'thumbUpper'`                                                                    | Point médian de la phalange proximale du pouce                                     |
| POINTES DE POUCE                                                                                                  | `'thumbNail'`                                                                     | Point médian de l'ongle du pouce                                                   |
| INDEX_LOWER                                                                                  | `'indexLower'`                                                                    | Point médian de la phalange proximale de l'index                                   |
| INDEX_UPPER                                                                                  | `'indexUpper'`                                                                    | Point médian de la phalange moyenne de l'index                                     |
| INDEX_NAIL                                                                                   | `'indexNail'`                                                                     | Point médian de l'ongle de l'index                                                 |
| MOYEN_INFÉRIEUR                                                                              | `'middleLower'`                                                                   | Point médian de la phalange proximale du majeur                                    |
| MOYEN_HAUT                                                                                   | `'middleUpper'`                                                                   | Point médian de la phalange moyenne du majeur                                      |
| POINTES DE LA MAIN                                                                                                | `'middleNail'`                                                                    | Point médian de l'ongle du majeur                                                  |
| ANNEAU_INFÉRIEUR                                                                             | `'ringLower'`'                                                                    | Point médian de la phalange proximale de l'annulaire                               |
| RING_UPPER                                                                                   | `'ringUpper'`                                                                     | Point médian de la phalange moyenne de l'annulaire                                 |
| BAGUE_NAIL                                                                                   | `'ringNail'`                                                                      | Point médian de l'ongle de l'annulaire                                             |
| PINKY_LOWER                                                                                  | `'pinkyLower'` \\`                                                               | Point médian de la phalange proximale de l'auriculaire                             |
| PINKY_UPPER                                                                                  | `'pinkyUpper'` \\`                                                               | Point médian de la phalange moyenne de l'auriculaire                               |
| PINKY_NAIL                                                                                   | `'pinkyNail'`                                                                     | Point médian de l'ongle du petit doigt                                             |

Lorsque `enableWrist:true` la détection du poignet s'effectue en même temps que le suivi de la main et renvoie les points d'attache de l'oreille suivants :

| Propriété                                 | Valeur                                                     | Description                                                                     |
| ----------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------- |
| SOMMET DU POIGNET                         | `'wristTop'`'' (poignet)                | Point central de la vue dorsale du poignet                                      |
| ARTICULATION_MOYENNE | `'wristBottom'`''.                         | Point central de la vue palmaire du poignet                                     |
| INNORMATEUR DE POIGNET                    | `'wristInner'`'' (intérieur du poignet) | Point médian du poignet du côté du pouce sur une vue dorsale du poignet         |
| WRIST_OUTER          | `Poignet extérieur`.                       | Point médian du poignet du côté de l'auriculaire sur une vue dorsale du poignet |