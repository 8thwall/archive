# A-Frame: Face Effects Makeup 

Get started with 8th Wall Face Effects! This A-frame example project showcases how to use A-frame Materials with alpha masks for makeup try-on.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWZhNjZjZDE1YTRkN2I4YTg4YTU2M2JjYTYyZDIzNzgyNWE4MGQ1YyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/GAZU693TZ4DOy7tdgp/giphy-downsized-large.gif)

### Face Components & Primitives

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
chin