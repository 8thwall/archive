---
sidebar_label: AttachmentPoints
---

# XR8.HandController.AttachmentPoints

Enumération

## Description {#description}

Points de la main sur lesquels vous pouvez ancrer du contenu.

#### Exemple - Mise en évidence des points d'attache sur l'anneau et le pouce {#example---showcasing-the-attachment-points-on-the-ring-and-thumb}

![exemple d'attaque à la main](/images/handAttachmentPoints.png)

## Propriétés {#properties}

| Propriété                                | Valeur                                                | Description                                                     |
| ---------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------- |
| BRACELET                                 | `poignet`                                             | Poignet                                                         |
| ARTICULATION_DE_BASE_DU_POUCE        | `thumbBaseJoint" (articulation de base du pouce)`     | Articulation carpométacarpienne (CMC) du pouce                  |
| POUCE_MID_JOINT                        | `pouceMidJoint`                                       | Articulation métacarpophalangienne (MCP) du pouce               |
| ARTICULATION_TOP_DU_POUCE              | `pouceJoint'' (thumbTopJoint)`                        | Articulation interphalangienne (IP) du pouce                    |
| THUMB_TIP                                | `pouce`                                               | Extrémité du pouce                                              |
| INDEX_BASE_JOINT                       | `indexBaseJoint`                                      | Articulation métacarpophalangienne (MCP) de l'index             |
| INDEX_MID_JOINT                        | `indexMidJoint`                                       | Articulation interphalangienne proximale (IPP) de l'index       |
| INDEX_TOP_JOINT                        | `indexTopJoint`                                       | Articulation interphalangienne distale (DIP) de l'index         |
| INDEX_TIP                                | `'indexTip' (conseil d'indexation)`                   | Extrémité de l'index                                            |
| ARTICULATION_DE_BASE_MOYENNE           | `joint de base médian`                                | Articulation métacarpophalangienne (MCP) du majeur              |
| ARTICULATION_MOYENNE                     | `articulation médiane`                                | Articulation interphalangienne proximale (PIP) du majeur        |
| ARTICULATION_TOP_MILIEU                | `jointure médiane" (middleTopJoint)`                  | Articulation interphalangienne distale (DIP) du majeur          |
| MIDDLE_TIP                               | `'middleTip'`                                         | Extrémité du majeur                                             |
| ANNEAU_BASE_JOINT                      | `ringBaseJoint`                                       | Articulation métacarpophalangienne (MCP) de l'annulaire         |
| RING_MID_JOINT                         | `anneau de jonction`                                  | Articulation interphalangienne proximale (PIP) de l'annulaire   |
| RING_TOP_JOINT                         | `ringTopJoint" (articulation supérieure de l'anneau)` | Articulation interphalangienne distale (DIP) de l'annulaire     |
| RING_TIP                                 | `conseil de l'anneau`                                 | Extrémité de l'annulaire                                        |
| ARTICULATION DE LA BASE DE L'AURICULAIRE | `articulation de base de l'auriculaire`               | Articulation métacarpophalangienne (MCP) de l'auriculaire       |
| ARTICULATION MÉDIANE DU PETIT DOIGT      | `articulation médiane du petit doigt`                 | Articulation interphalangienne proximale (PIP) de l'auriculaire |
| ARTICULATION SUPÉRIEURE DE L'AURICULAIRE | `articulation supérieure de l'auriculaire`            | Articulation interphalangienne distale (DIP) de l'auriculaire   |
| PINKY_TIP                                | `pointe petit doigt`                                  | Extrémité du petit doigt                                        |
| PAUME                                    | `paume`                                               | Paume                                                           |
| THUMB_UPPER                              | `thumbUpper" (pouce supérieur)`                       | Point médian de la phalange proximale du pouce                  |
| POINÇON DE LA MAIN                       | `ongle du pouce`                                      | Point médian de l'ongle du pouce                                |
| INDEX_LOWER                              | `indexLower" (inférieur)`                             | Point médian de la phalange proximale de l'index                |
| INDEX_UPPER                              | `index supérieur`                                     | Point médian de la phalange moyenne de l'index                  |
| INDEX_NAIL                               | `indexNail`                                           | Point médian de l'ongle de l'index                              |
| MOYEN_INFÉRIEUR                          | `'middleLower' (moyen-inférieur)`                     | Point médian de la phalange proximale du majeur                 |
| MOYEN_HAUT                               | `milieu-haut`                                         | Point médian de la phalange moyenne du majeur                   |
| POINTES DE LA MAIN                       | `ongle du milieu`                                     | Point médian de l'ongle du majeur                               |
| ANNEAU_INFÉRIEUR                         | `ringLower" (inférieur à l'anneau)`                   | Point médian de la phalange proximale de l'annulaire            |
| RING_UPPER                               | `ringUpper" (anneau supérieur)`                       | Point médian de la phalange moyenne de l'annulaire              |
| BAGUE_NAIL                               | `ongle de la bague`                                   | Point médian de l'ongle de l'annulaire                          |
| PINKY_LOWER                              | `petit doigt en bas de l'échelle`                     | Point médian de la phalange proximale de l'auriculaire          |
| PINKY_UPPER                              | `haut du petit doigt`                                 | Point médian de la phalange moyenne de l'auriculaire            |
| PINKY_NAIL                               | `petit doigt`                                         | Point médian de l'ongle du petit doigt                          |

Lorsque `enableWrist:true` la détection du poignet s'effectue en même temps que le suivi de la main et renvoie les points d'attache de l'oreille suivants :

| Propriété               | Valeur                          | Description                                                                     |
| ----------------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| SOMMET DU POIGNET       | `PoignetTop' (haut du poignet)` | Point central de la vue dorsale du poignet                                      |
| BOUTON DU BRISTOLET     | `Poignet en bas`                | Point central de la vue palmaire du poignet                                     |
| INNOVATION AU BRISTOLET | `poignetIntérieur`              | Point médian du poignet du côté du pouce sur une vue dorsale du poignet         |
| WRIST_OUTER             | `Poignet extérieur`             | Point médian du poignet du côté de l'auriculaire sur une vue dorsale du poignet |
