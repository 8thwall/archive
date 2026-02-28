# Human AR - Hand Tracking

# Overview

We are using Hand Mesh model from MobRecon paper for hand tracking.

“MobRecon: Mobile-Friendly Hand Mesh Reconstruction from Monocular Image“

<https://arxiv.org/pdf/2112.02753.pdf>

github repo: <https://github.com/SeanChenxy/HandMesh>

Research repo for running MobRecon in Python -

# Workflow

The global palm detection is in `//reality/engine/hands/hand-detector-global.cc`

The local hand mesh detector is in `//reality/engine/hands/hand-detector-local-mesh.cc`

The hand mesh tracking logic is implemented in `//reality/engine/hands/hand-mesh-tracker.cc`

The hand ROI renderer is in `//reality/engine/hands/hand-roi-renderer.cc`

Hand mesh positioning and states are in `//reality/engine/hands/tracked-hand-state.cc`

The workflow for hand-mesh-tracker is -

 1. Global Hand Detection Using Mediapipe Palm Detection model

 * Palm Detection - A palm detector model that operates on the full image and computes the bounding box of hand locations.

Omniscope View → Pose → Hand Global

2\. Once a global hand is detected, the detected information will be passed to `HandDetectorLocalMesh` for local tracking.

The view in Omniscope can be found at Omniscope View → Pose → Hand Local Mesh

`HandDetectorLocalMesh::analyzeHand` is the main function for local tracking.

The input of the hand mesh model is 1x128x128x3 tensor in [-1, 1] from the cropped 128x128 image. The cropped image does not have rotation. The local image will be rendered using letterbox, which means the out-of-bound areas will be filled with black pixels.

The cropped image’s ROI relative to the input frame is computed in function `handDetectionRoi` in `//reality/engine/hands/hand-roi-renderer.cc`

The return results `DetectedPoints.points` contains 3 parts of data -

 * 1st part - 778 vertex positions in hand mesh local coordinate system, where the wrist point is at (0,0,0). The x,y,z values of the vertex positions are in metric scales.

 * 2nd part - 21 landmark 2D points in cropped image’s texture space. This set of points will be used later for positioning the hand mesh in world coordinate.

 * 3rd part - 21 hand 3D joint points computed from the 778 vertex positions and `HandDetectorLocalMesh::jRegressor_ ` . This set of points will be used later for positioning the hand mesh in world coordinate. The computation is following the code on line 78 of

 * 4th part - 12 landmark 2D points in cropped image’s texture space. These set of points will be used for positioning the wrist mesh in world coordinate.

Notice that the computed 3D joint points are in MANO indices, while the landmark points are in MPII indices. Therefore a reindexing step is needed to map MANO indices to MPII indices.

The 2D hand landmarks are in MPII indices, which is consistent with the Mediapipe landmarks shown below -

3\. The hand mesh tracker uses local hand mesh to track local hand first, which is `auto f = meshDetector_->analyzeHand(im, intrinsics);`

If the local hand mesh detection fails, the `localHands_`is empty, the global palm detection will be used to detect global hands.

If the global hand detector finds a hand, the tracking will be continued with local hand mesh detector at step 2.

4\. Once we have a local hand mesh, we will position the hand in world coordinate. The algorithm is implemented in file `//reality/engine/hands/tracked-hand-state.cc` in function

`Hand3d TrackedHandState::locateHandMesh(const DetectedPoints &localHandDetection, bool doTrackWrist)`.

The hand posing function is similar to the `def register` function on line #78 of

`computeHandMeshTranslation()`is where we optimize for mesh translation. Here we compare the positions of the 3D joint points in ray space vs the landmark points in ray space as seen in `class MinimizeTranslationRaySpace`.

This is the output mesh from local 128x128 image -

input -

Sample output mesh -

If wrist tracking is enabled `locateWrist()` will be called, and it will calculate `robustPnP` if the wrist was not tracked before or `posePnP` if it was. This will return the local transformation for the given wrist mesh based on the landmarks given by the model. The logic for the wrist posing is similar to this:

## Understanding the mesh in Blender

The mesh .ply above can be used to help with several tasks using Blender.

### How to fit the assets to the hand mesh

### Determining the indices of Attachment Points on the mesh

In the code [handmesh-data.cc](<http://handmesh-data.cc>) file, we use vertex indices to denote which vertex belong to which hand landmark. To visualize these vertices in Blender, you can use the following code in Blender python console.

You might need to select the hand_test object after importing hand_test.ply into Blender.
```js
import bpy
import bmesh

context = bpy.context
ob = context.object
bm = bmesh.from_edit_mesh(ob.data)

vertices_to_select = [388, 381, 375, 387, 367]

for i in vertices_to_select:
 bm.verts[i].select_set(True)
bmesh.update_edit_mesh(ob.data)
```

# Attachment Points

These data fields are filled for each attachment point -

 * Name

 * Position

 * Rotation

 * Radius - radius for normal finger joints

 * minorRadius - shortest length from wrist center to edge, only used for wrist

 * majorRadius - longest length from wrist center to edge, only used for wrist

 * Inner Point - points on the palm side

 * Outer Point - points on the back of hand side

For thumb, there is no `thumbLower` joint.

Anatomy of wrist

**NOTE: we are using hand mesh model for local detection. Mediapipe hand landmark model is not used right now.**

# Mediapipe Implementation

### DeepNets

We use two deep learning models provided by MediaPipeline to run Hand Tracking:

 * Palm Detection - A palm detector model that operates on the full image and computes the bounding box of hand locations.

 * Hand Landmark Model - a 3D hand landmark model that operates on the bounding box output of palm detection and predicts the approximate hand joint 3D positions via regression.

(Mediapipe link <https://google.github.io/mediapipe/solutions/hands.html> )

# Hand 3D Mesh

Currently we are using WebXR standard hand models for hand visualization and animation. (reference link <https://www.w3.org/TR/webxr-hand-input-1/#skeleton-joints-section> )

Hand model links -

const leftHandModelPath = '<https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0.10/dist/profiles/generic-hand/left.glb'>
const rightHandModelPath = '<https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0.10/dist/profiles/generic-hand/right.glb'>

This list of joints defines the following skeleton joints and their order:

| [Skeleton joint](<https://www.w3.org/TR/webxr-hand-input-1/#skeleton-joints>) | [Skeleton joint name](<https://www.w3.org/TR/webxr-hand-input-1/#skeleton-joint-name>) | Index |
|-------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|-----------------------------|
| Wrist | `wrist` | 0 |
| Thumb | Metacarpal | `thumb-metacarpal` | 1 |
| Proximal Phalanx | `thumb-phalanx-proximal` | 2 |
| Distal Phalanx | `thumb-phalanx-distal` | 3 |
| Tip | `thumb-tip` | 4 |
| Index finger | Metacarpal | `index-finger-metacarpal` | 5 |
| Proximal Phalanx | `index-finger-phalanx-proximal` | 6 |
| Intermediate Phalanx | `index-finger-phalanx-intermediate` | 7 |
| Distal Phalanx | `index-finger-phalanx-distal` | 8 |
| Tip | `index-finger-tip` | 9 |
| Middle finger | Metacarpal | `middle-finger-metacarpal` | 10 |
| Proximal Phalanx | `middle-finger-phalanx-proximal` | 11 |
| Intermediate Phalanx | `middle-finger-phalanx-intermediate` | 12 |
| Distal Phalanx | `middle-finger-phalanx-distal` | 13 |
| Tip | `middle-finger-tip` | 14 |
| Ring finger | Metacarpal | `ring-finger-metacarpal` | 15 |
| Proximal Phalanx | `ring-finger-phalanx-proximal` | 16 |
| Intermediate Phalanx | `ring-finger-phalanx-intermediate` | 17 |
| Distal Phalanx | `ring-finger-phalanx-distal` | 18 |
| Tip | `ring-finger-tip` | 19 |
| Little finger | Metacarpal | `pinky-finger-metacarpal` | 20 |
| Proximal Phalanx | `pinky-finger-phalanx-proximal` | 21 |
| Intermediate Phalanx | `pinky-finger-phalanx-intermediate` | 22 |
| Distal Phalanx | `pinky-finger-phalanx-distal` | 23 |
| Tip | `pinky-finger-tip` | 24 |

# Wrist Mesh

List of attachment points (in addition to the hand attachment points)

| **Wrist Attachment Point** | **Skeleton joint name** | **Index** |
|----------------------------|--------------------------|------------|
| Top wrist | `wrist-top` | 36 |
| Bottom wrist (palm side) | `wrist-bottom` | 37 |
| Inner Wrist (thumb side) | `wrist-inner` | 38 |
| Outer Wrist (pinky side) | `wrist-outer` | 39 |

# Reference
