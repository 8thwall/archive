# A-Frame: Face Effects Morph Targets 

Get started with 8th Wall Face Effects Morph Targets! This A-frame example project showcases how to access face camera pixels and use morph targets to configure the user's face shape with 20 default morph target toggles.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWNlYjFmOWNmOWY3ZDFkMjU1Y2ViMzdkNjAxZWYxZjFlMjc0YTM1ZCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/GH0WbtYHeNYWioYqUW/giphy-downsized-large.gif)

For detailed documentation, visit the [Face Effects Docs](https://www.8thwall.com/docs/api/aframe/#face-effects) 🔗

### Face Effects Makeup Overview

* components/
  * **animate-face.js** Grabs camera feed and binds it to a face geometry in order to overlay it on top of the user's face
  * **gltf-morph.js** sets morph target value on a glb file with a valid morph target
  * **ui-manager.js** creates slider UI and allows the user to toggle through different morph targets

* assets/models/
  * **blankFace.glb** A blank face model without any morph targets
  * **morphTargets.glb** A face model with 20 default morph targets, used in the project
* assets/UI/
  * **leftArrow.svg** used by the `ui-manager` componenent to set the icon for the left arrow button
  * **rightArrow.svg** used by the `ui-manager` componenent to set the icon for the right arrow button

```xrface``` is required in your ```<a-scene>``` for face effects.

- cameraDirection: Desired camera to use. Choose from: 'back' or 'front'. Use 
'cameraDirection: front;' with 'mirroredDisplay: true;' for selfie mode. (default: back)
- allowedDevices: Supported device classes. Choose from: 'mobile' or 'any'. Use 'any' to enable 
laptop- or desktop-type devices with built-in or attached webcams. (default: mobile)
- mirroredDisplay: If true, flip left and right in the output geometry and reversie the direction 
of the camera feed. Use 'mirroredDisplay: true' with 'cameraDirection: front;' with selfie mode. 
(default: false)
- meshGeometry: Configure which portions of the face mesh will have returned triangle indices. Can 
be any combination of 'face', 'eyes', 'iris', and 'mouth'. (default: face)
- uvSet: Configure which set of UVs the project uses to apply face mesh textures. Can be `flat` or `unwrapped`. (default: unwrapped)

```<xrextras-faceanchor>``` inherits the detected face transforms. Entities inside will move with 
the face.

```xrextras-hider-material``` is applied to any mesh or primitive that you would like to be 
transparent while blocking the rendering of models behind it. In the scene, this is applied to the
head-occluder.glb.

```<xrextras-face-mesh>``` generates a face mesh in your scene.

```<xrextras-face-attachment>``` inherits the detected attachment point transforms. Entities inside
will move with the assigned attachment point.  

- point: name of attachment point (default: forehead)

Attachment points include: 
forehead,
rightEyebrowInner,
rightEyebrowMiddle,
rightEyebrowOuter,
leftEyebrowInner,
leftEyebrowMiddle,
leftEyebrowOuter,
leftEar,
rightEar,
leftCheek,
rightCheek,
noseBridge,
noseTip,
leftEye,
rightEye,
leftEyeOuterCorner,
rightEyeOuterCorner,
leftIris,
rightIris,
leftUpperEyelid,
rightUpperEyelid,
leftLowerEyelid,
rightLowerEyelid,
upperLip,
lowerLip,
mouth,
mouthRightCorner,
mouthLeftCorner,
chin.


### Developing Morph Target Experiences
`morphTargets.glb` includes 20 default morph targets that can be programatically set. They include:
* cheekBonesExpand
* cheeksExpand
* cheeksShrink
* eyesExpand
* eyesShrink
* eyesPop
* lipsExpand
* lipsPurse
* lipsPucker
* lipsStretch
* lipsSmile
* lipsFrown
* noseExpand
* noseShrink
* foreheadExpand
* headExpand
* headShrink
* browsSad
* browsAngry
* browsSurprised

1. In your `<a-scene>` add the `xrface` component.
2. Set the `animate-face` component on an entity within a `<xrextras-face-anchor>` primitive.
3. Specify the `morphTarget` and `amount` properties of the `animate-face` component to morph the face.

#### Adding More Morph Targets & Best Practices
* Ensure you are adding other morph targets to either `blankFace.glb` or `morphTarget.glb`; other face models will not work as they will not have the same amount of vertices and triangles.
* We reccomend using Blender to add shape keys or other 3D softwares to create morph targets.
  * When using Blender, ensure that the face model is facing the y+ direction and that the rotation is baked in; not doing so will make the face model map incorrectly onto the user's face. This is already done in the two models by default.
* When adding morph targets, we reccomend using some sort of proportional editing or sculpting technique so that the triangles are displaced in a natural fashion; simply grabbing the vertices will result in harsh transitions on the face mesh which may not be the desired result.