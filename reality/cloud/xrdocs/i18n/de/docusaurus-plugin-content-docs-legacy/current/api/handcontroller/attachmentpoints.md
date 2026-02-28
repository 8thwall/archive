---
sidebar_label: AttachmentPoints
---

# XR8.HandController.AttachmentPoints

Aufzählung

## Beschreibung {#description}

Punkte auf der Hand, an denen Sie Inhalte verankern können.

#### Beispiel - Veranschaulichung der Befestigungspunkte am Ring und am Daumen {#example---showcasing-the-attachment-points-on-the-ring-and-thumb}

![hand-attachment-example](/images/handAttachmentPoints.png)

## Eigenschaften {#properties}

| Eigentum                                                           | Wert                         | Beschreibung                                                                  |
| ------------------------------------------------------------------ | ---------------------------- | ----------------------------------------------------------------------------- |
| WRIST                                                              | Handgelenk". | Handgelenk                                                                    |
| DAUMEN_GRUND_GELENK      | ''thumbBaseJoint''           | Karpometakarpalgelenk (CMC) des Daumens                    |
| DAUMEN_MITTELGELENK                           | `'thumbMidJoint'`            | Großzehengrundgelenk (MCP) des Daumens                     |
| DAUMEN_OBEN_GELENK       | `'thumbTopJoint'`            | Interphalangealgelenk (IP) des Daumens                     |
| THUMB_TIP                                     | `'thumbTip'`                 | Spitze des Daumens                                                            |
| INDEX_BASE_JOINT         | indexBaseJoint''             | Metakarpophalangealgelenk (MCP) des Zeigefingers           |
| INDEX_MID_JOINT          | indexMidJoint''              | Proximales Interphalangealgelenk (PIP) des Zeigefingers    |
| INDEX_TOP_JOINT          | indexTopJoint''              | Distales Interphalangealgelenk (DIP) des Zeigefingers      |
| INDEX_TIP                                     | `'indexTip'`                 | Spitze des Zeigefingers                                                       |
| MITTLERES_GRUNDGELENK                         | `'middleBaseJoint'`          | Metakarpophalangealgelenk (MCP) des Mittelfingers          |
| MITTLERES_MITTELGELENK                        | `'middleMidJoint'`           | Proximales Interphalangealgelenk (PIP) des Mittelfingers   |
| MITTLERES_OBERES_GELENK  | `'middleTopJoint'`           | Distales Interphalangealgelenk (DIP) des Mittelfingers     |
| MIDDLE_TIP                                    | `'middleTip'`                | Spitze des Mittelfingers                                                      |
| RING_BASIS_GELENK        | 'ringBaseJoint'              | Metakarpophalangealgelenk (MCP) des Ringfingers            |
| RING_MID_JOINT           | 'ringMidJoint'               | Proximales Interphalangealgelenk (PIP) des Ringfingers     |
| RING_TOP_JOINT           | `'ringTopJoint'`             | Distales Interphalangealgelenk (DIP) des Ringfingers       |
| RING_TIP                                      | `'ringTip'`                  | Spitze des Ringfingers                                                        |
| KLEINES_GRUNDGELENK                           | `'pinkyBaseJoint'`           | Metacarpophalangealgelenk (MCP) des kleinen Fingers        |
| MITTLERES_KLEINES_GELENK | `'pinkyMidJoint'`            | Proximales Interphalangealgelenk (PIP) des kleinen Fingers |
| OBERES_KLEINES_GELENK    | `'pinkyTopJoint'`            | Distales Interphalangealgelenk (DIP) des kleinen Fingers   |
| PINKY_TIP                                     | `'pinkyTip'`                 | Spitze des kleinen Fingers                                                    |
| PALM                                                               | Palme                        | Palme                                                                         |
| THUMB_UPPER                                   | `'thumbUpper'`               | Mittelpunkt der proximalen Phalanx des Daumens                                |
| THUMB_NAIL                                    | 'thumbNail'                  | Mitte des Daumennagels                                                        |
| INDEX_LOWER                                   | `'indexLower'`               | Mitte der proximalen Phalanx des Zeigefingers                                 |
| INDEX_UPPER                                   | `'indexUpper'`               | Mittelpunkt des mittleren Fingerglieds des Zeigefingers                       |
| INDEX_NAIL                                    | `'indexNail'`                | Mittelpunkt des Zeigefingernagels                                             |
| MITTEL_UNTEN                                  | `'MitteUnten'`               | Mittelpunkt der proximalen Phalanx des Mittelfingers                          |
| MITTEL_OBER                                   | `'middleUpper'`              | Mittelpunkt des Mittelfingers Mittelphalanx                                   |
| MITTEL_NAIL                                   | `'middleNail'`               | Mittelpunkt des Mittelfingernagels                                            |
| RING_LOWER                                    | `'ringLower'`                | Mitte der proximalen Phalanx des Ringfingers                                  |
| RING_UPPER                                    | 'ringUpper'                  | Mittelpunkt des mittleren Fingerglieds des Ringfingers                        |
| RING_NAIL                                     | RingNagel                    | Mittelpunkt des Ringfingernagels                                              |
| PINKY_LOWER                                   | `'pinkyLower'`               | Mittelpunkt der proximalen Phalanx des kleinen Fingers                        |
| PINKY_UPPER                                   | 'pinkyUpper'                 | Mittelpunkt des mittleren Fingerglieds des kleinen Fingers                    |
| PINKY_NAIL                                    | `'pinkyNail'`                | Mitte des Fingernagels des kleinen Fingers                                    |

Wenn `enableWrist:true` läuft die Handgelenkserkennung gleichzeitig mit der Handverfolgung und liefert die folgenden Ohranlegepunkte:

| Eigentum                          | Wert                                    | Beschreibung                                                                                       |
| --------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| WRIST_TOP    | `'wristTop'`                            | Mittelpunkt der Dorsalansicht des Handgelenks                                                      |
| WRIST_BOTTOM | `'wristBottom'`                         | Mittelpunkt der Palmaransicht des Handgelenks                                                      |
| WRIST_INNER  | Handgelenk-Innenseite". | Mittelpunkt des Handgelenks auf der Daumenseite einer Dorsalansicht des Handgelenks                |
| WRIST_OUTER  | Handgelenk-Außen                        | Mittelpunkt des Handgelenks auf der Seite des kleinen Fingers in der Dorsalansicht des Handgelenks |