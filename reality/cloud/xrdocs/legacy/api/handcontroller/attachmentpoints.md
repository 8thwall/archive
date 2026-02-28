---
sidebar_label: AttachmentPoints
---
# XR8.HandController.AttachmentPoints

Enumeration

## Description {#description}

Points of the hand you can anchor content to.

#### Example - Showcasing the attachment points on the ring and thumb {#example---showcasing-the-attachment-points-on-the-ring-and-thumb}

![hand-attachment-example](/images/handAttachmentPoints.png)

## Properties {#properties}

Property | Value | Description
-------- | ----- | -----------
WRIST | `'wrist'` | Wrist
THUMB_BASE_JOINT | `'thumbBaseJoint'` | Carpometacarpal joint (CMC) of the thumb
THUMB_MID_JOINT | `'thumbMidJoint'` | Metacarpophalangeal joint (MCP) of the thumb
THUMB_TOP_JOINT | `'thumbTopJoint'` | Interphalangeal joint (IP) of the thumb
THUMB_TIP | `'thumbTip'` | Tip of the thumb
INDEX_BASE_JOINT | `'indexBaseJoint'` | Metacarpophalangeal joint (MCP) of the index finger
INDEX_MID_JOINT | `'indexMidJoint'` | Proximal Interphalangeal joint (PIP) of the index finger
INDEX_TOP_JOINT | `'indexTopJoint'` | Distal Interphalangeal joint (DIP) of the index finger
INDEX_TIP | `'indexTip'` | Tip of the index finger
MIDDLE_BASE_JOINT | `'middleBaseJoint'` | Metacarpophalangeal joint (MCP) of the middle finger
MIDDLE_MID_JOINT | `'middleMidJoint'` | Proximal Interphalangeal joint (PIP) of the middle finger
MIDDLE_TOP_JOINT | `'middleTopJoint'` | Distal Interphalangeal joint (DIP) of the middle finger
MIDDLE_TIP | `'middleTip'` | Tip of the middle finger
RING_BASE_JOINT | `'ringBaseJoint'` | Metacarpophalangeal joint (MCP) of the ring finger
RING_MID_JOINT | `'ringMidJoint'` | Proximal Interphalangeal joint (PIP) of the ring finger
RING_TOP_JOINT | `'ringTopJoint'` | Distal Interphalangeal joint (DIP) of the ring finger
RING_TIP | `'ringTip'` | Tip of the ring finger
PINKY_BASE_JOINT | `'pinkyBaseJoint'` | Metacarpophalangeal joint (MCP) of the pinky finger
PINKY_MID_JOINT | `'pinkyMidJoint'` | Proximal Interphalangeal joint (PIP) of the pinky finger
PINKY_TOP_JOINT | `'pinkyTopJoint'` | Distal Interphalangeal joint (DIP) of the pinky finger
PINKY_TIP | `'pinkyTip'` | Tip of the pinky finger
PALM | `'palm'` | Palm
THUMB_UPPER | `'thumbUpper'` | Midpoint of the thumb proximal phalanx
THUMB_NAIL | `'thumbNail'` | Midpoint of the thumb nail
INDEX_LOWER | `'indexLower'` | Midpoint of the index finger proximal phalanx
INDEX_UPPER  | `'indexUpper'` | Midpoint of the index finger middle phalanx
INDEX_NAIL | `'indexNail'` | Midpoint of the index finger nail
MIDDLE_LOWER | `'middleLower'` | Midpoint of the middle finger proximal phalanx
MIDDLE_UPPER | `'middleUpper'` | Midpoint of the middle finger middle phalanx
MIDDLE_NAIL | `'middleNail'` | Midpoint of the middle finger nail
RING_LOWER | `'ringLower'` | Midpoint of the ring finger proximal phalanx
RING_UPPER | `'ringUpper'` | Midpoint of the ring finger middle phalanx
RING_NAIL | `'ringNail'` | Midpoint of the ring finger nail
PINKY_LOWER | `'pinkyLower'` | Midpoint of the pinky proximal phalanx
PINKY_UPPER  | `'pinkyUpper'` | Midpoint of the pinky middle phalanx
PINKY_NAIL | `'pinkyNail'` | Midpoint of the pinky finger nail

When `enableWrist:true` wrist detection runs simultaneously with Hand Tracking and returns the following ear attachment points:

Property | Value | Description
-------- | ----- | -----------
WRIST_TOP | `'wristTop'` | Centerpoint of the dorsal view of the wrist
WRIST_BOTTOM | `'wristBottom'` | Centerpoint of the palmar view of the wrist
WRIST_INNER | `'wristInner'` | Wrist midpoint on the thumb side of a dorsal view of the wrist
WRIST_OUTER | `'wristOuter'` | Wrist midpoint on the pinky side of a dorsal view of the wrist