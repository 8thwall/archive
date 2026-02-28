---
sidebar_label: AttachmentPoints
---

# XR8.HandController.AttachmentPoints

Aufzählung

## Beschreibung {#description}

Punkte auf der Hand, an denen Sie Inhalte verankern können.

#### Beispiel - Veranschaulichung der Befestigungspunkte an Ring und Daumen {#example---showcasing-the-attachment-points-on-the-ring-and-thumb}

![hand-attachment-example](/images/handAttachmentPoints.png)

## Eigenschaften {#properties}

| Eigenschaft               | Wert                | Beschreibung                                               |
| ------------------------- | ------------------- | ---------------------------------------------------------- |
| WRIST                     | `'Handgelenk'`      | Handgelenk                                                 |
| THUMB_BASE_JOINT        | `'thumbBaseJoint'`  | Karpometakarpalgelenk (CMC) des Daumens                    |
| THUMB_MID_JOINT         | `'thumbMidJoint'`   | Metacarpophalangealgelenk (MCP) des Daumens                |
| THUMB_TOP_JOINT         | `'thumbTopJoint'`   | Interphalangealgelenk (IP) des Daumens                     |
| THUMB_TIP                 | `'thumbTip'`        | Spitze des Daumens                                         |
| INDEX_BASE_JOINT        | `'indexBaseJoint'`  | Metacarpophalangealgelenk (MCP) des Zeigefingers           |
| INDEX_MID_JOINT         | `'indexMidJoint'`   | Proximales Interphalangealgelenk (PIP) des Zeigefingers    |
| INDEX_TOP_JOINT         | `'indexTopJoint'`   | Distales Interphalangealgelenk (DIP) des Zeigefingers      |
| INDEX_TIP                 | `'indexTip'`        | Spitze des Zeigefingers                                    |
| MITTLERES_GRUNDGELENK     | `'middleBaseJoint'` | Metacarpophalangealgelenk (MCP) des Mittelfingers          |
| MITTLERES_ZWISCHENGELENK  | `'middleMidJoint'`  | Proximales Interphalangealgelenk (PIP) des Mittelfingers   |
| MITTLERES_OBERES_GELENK | `'middleTopJoint'`  | Distales Interphalangealgelenk (DIP) des Mittelfingers     |
| MIDDLE_TIP                | `'middleTip'`       | Spitze des Mittelfingers                                   |
| RING_BASE_JOINT         | `'ringBaseJoint'`   | Metacarpophalangealgelenk (MCP) des Ringfingers            |
| RING_MID_JOINT          | `'ringMidJoint'`    | Proximales Interphalangealgelenk (PIP) des Ringfingers     |
| RING_TOP_JOINT          | `'ringTopJoint'`    | Distales Interphalangealgelenk (DIP) des Ringfingers       |
| RING_TIP                  | `'ringTip'`         | Spitze des Ringfingers                                     |
| PINKY_BASE_JOINT        | `'pinkyBaseJoint'`  | Metacarpophalangealgelenk (MCP) des kleinen Fingers        |
| PINKY_MID_JOINT         | `'pinkyMidJoint'`   | Proximales Interphalangealgelenk (PIP) des kleinen Fingers |
| PINKY_TOP_JOINT         | `'pinkyTopJoint'`   | Distales Interphalangealgelenk (DIP) des kleinen Fingers   |
| PINKY_TIP                 | `'pinkyTip'`        | Spitze des kleinen Fingers                                 |
| PALM                      | `'Palme'`           | Palme                                                      |
| THUMB_UPPER               | `'thumbUpper'`      | Mittelpunkt der proximalen Phalanx des Daumens             |
| THUMB_NAIL                | `'thumbNail'`       | Mitte des Daumennagels                                     |
| INDEX_LOWER               | `'indexUnter'`      | Mitte der proximalen Phalanx des Zeigefingers              |
| INDEX_UPPER               | `'indexUpper'`      | Mittelpunkt des mittleren Fingerglieds des Zeigefingers    |
| INDEX_NAIL                | `'indexNail'`       | Mitte des Zeigefingernagels                                |
| MIDDLE_LOWER              | `'mittelUnter'`     | Mitte der proximalen Phalanx des Mittelfingers             |
| MIDDLE_UPPER              | `'middleUpper'`     | Mittelpunkt des Mittelfingers Mittelphalanx                |
| MIDDLE_NAIL               | `'middleNail'`      | Mittelpunkt des Mittelfingernagels                         |
| RING_LOWER                | `'ringLower'`       | Mitte der proximalen Phalanx des Ringfingers               |
| RING_UPPER                | `'ringUpper'`       | Mittelpunkt des mittleren Fingerglieds des Ringfingers     |
| RING_NAIL                 | `'ringNail'`        | Mittelpunkt des Ringfingernagels                           |
| PINKY_LOWER               | `'pinkyLower'`      | Mitte der proximalen Phalanx des kleinen Fingers           |
| PINKY_UPPER               | `'pinkyUpper'`      | Mittelpunkt der mittleren Phalanx des kleinen Fingers      |
| PINKY_NAIL                | `'pinkyNail'`       | Mitte des Fingernagels des kleinen Fingers                 |

Wenn `enableWrist:true` läuft die Handgelenkserkennung gleichzeitig mit dem Hand-Tracking und liefert die folgenden Ohranlegepunkte:

| Eigenschaft  | Wert                | Beschreibung                                                                                       |
| ------------ | ------------------- | -------------------------------------------------------------------------------------------------- |
| WRIST_TOP    | `'wristTop'`        | Mittelpunkt der Dorsalansicht des Handgelenks                                                      |
| WRIST_BOTTOM | `HandgelenkUnter`   | Mittelpunkt der Palmaransicht des Handgelenks                                                      |
| WRIST_INNER  | `HandgelenkInneres` | Mittelpunkt des Handgelenks auf der Daumenseite einer Dorsalansicht des Handgelenks                |
| WRIST_OUTER  | `'wristOuter'`      | Mittelpunkt des Handgelenks auf der Seite des kleinen Fingers in der Dorsalansicht des Handgelenks |