---
sidebar_label: Points d'attachement
---

# XR8.FaceController.AttachmentPoints

Enumération

## Description {#description}

Points du visage sur lesquels vous pouvez ancrer du contenu.

## Propriétés {#properties}

| Propriété                                                                                | Valeur                                                                        | Description                         |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------- |
| FOREHEAD                                                                                 | `'front'`                                                                     | Front                               |
| SOURCILS_DROITS_INTÉRIEUR                      | `'rightEyebrowInner'`'' (intérieur du sourcil droit)       | Face interne du sourcil droit       |
| SOURCILS_DROITS_MILIEU                         | `Sourcil droitMilieu'`.                                       | Milieu du sourcil droit             |
| SOURCILS_INTERNES_DROITS                       | `Sourcil Droit Extérieur'`.                                   | Face externe du sourcil droit       |
| SOURCILS_GAUCHE_INTÉRIEUR                      | \`'leftEyebrowInner'\`\\` (intérieur du sourcil gauche) | Face interne du sourcil gauche      |
| SOURCILS_GAUCHE_MILIEU                         | `'leftEyebrowMiddle'`'' (sourcil gauche)                   | Milieu du sourcil gauche            |
| SOURCILS_GAUCHE_EXTÉRIEUR                      | `Sourcil gauche Extérieur'`.                                  | Face externe du sourcil gauche      |
| AILE GAUCHE                                                                              | `'oreille gauche'`                                                            | Oreille gauche                      |
| OREILLE DROITE                                                                           | `'oreille droite'`                                                            | Oreille droite                      |
| LEFT_CHEEK                                                          | \`'leftCheek'\`\\`                                                         | Joue gauche                         |
| RIGHT_CHEEK                                                         | `'rightCheek'`                                                                | Joue droite                         |
| COIN_DE_L'OEIL_GAUCHE     | \\`'noseBridge'' (pont nasal)                             | Arête du nez                        |
| NOSE_TIP                                                            | `'noseTip'` \\`                                                              | Pointe du nez                       |
| YEUX_GAUCHE                                                         | `Oeil gauche`                                                                 | Oeil gauche                         |
| ŒIL DROIT                                                                                | `'rightEye'`                                                                  | Oeil droit                          |
| COIN_DE_L'OEIL_GAUCHE     | `Coin extérieur de l'œil gauche'`                                             | Coin externe de l'œil gauche        |
| COIN_YEUX_EXTÉRIEUR_DROIT | `Coin extérieur de l'œil droit'`                                              | Coin externe de l'œil droit         |
| LEFT_IRIS                                                           | `'leftIris'`                                                                  | Iris de l'œil gauche                |
| RIGHT_IRIS                                                          | `'rightIris'`                                                                 | Iris de l'œil droit                 |
| ŒIL_SUPÉRIEUR_GAUCHE                           | `'leftUpperEyelid'`''.                                        | Paupière supérieure de l'œil gauche |
| PAUPIÈRE_INFÉRIEURE_GAUCHE                     | `'rightUpperEyelid'`''.                                       | Paupière supérieure de l'œil droit  |
| PAUPIÈRE_INFÉRIEURE_GAUCHE                     | `'leftLowerEyelid'`''.                                        | Paupière inférieure de l'œil gauche |
| PAUPIÈRE_INFÉRIEURE_DROITE                     | `'rightLowerEyelid'`''.                                       | Paupière inférieure de l'œil droit  |
| UPPER_LIP                                                           | \`'upperLip'\`\\`                                                          | Lèvre supérieure                    |
| LOWER_LIP                                                           | `'lowerLip'`'                                                                 | Lèvre inférieure                    |
| BOUCHE                                                                                   | `'bouche'`                                                                    | Bouche                              |
| COIN_BOUCHE_DROIT                              | `BoucheCoinDroit'`.                                           | Coin droit de la bouche             |
| COIN_BOUCHE_GAUCHE                             | `BoucheCoinGauche'`.                                          | Coin gauche de la bouche            |
| CHIN                                                                                     | `'chin'`                                                                      | Menton                              |

Lorsque `enableEars:true` la détection des oreilles s'effectue en même temps que les effets de visage et renvoie les points d'attache des oreilles suivants :

| Propriété                                                      | Valeur                           | Description                         |
| -------------------------------------------------------------- | -------------------------------- | ----------------------------------- |
| EAR_LEFT_HELIX       | `'leftHelix'` \\`               | Hélix supérieur de l'oreille gauche |
| EAR_LEFT_CANAL       | `'canal gauche'`                 | Canal auditif de l'oreille gauche   |
| EAR_LEFT_LOBE        | \`'leftLobe'\`\\`             | Lobe de l'oreille gauche            |
| OREILLE_DROITE_HÉLIX | \`'rightHelix'\`\\`           | Hélix supérieur de l'oreille droite |
| EAR_RIGHT_CANAL      | `'rightCanal'` \\`              | Canal auditif de l'oreille droite   |
| EAR_RIGHT_LOBE       | `Lobe droit'' `. | Lobe de l'oreille droite            |
