# Realtime Reflections: Face Effects

Get started with Realtime Reflections in Face Effects!

![](https://media.giphy.com/media/jAJIj3bfb430DuoV9W/giphy.gif)

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
be any combination of 'face', 'eyes' and 'mouth'. (default: face)

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
upperLip,
lowerLip,
mouth,
mouthRightCorner,
mouthLeftCorner,
chin

### Reference Assets

Download the face mesh model for reference in your 3D modeling software
[here](https://cdn.8thwall.com/web/assets/face/facemesh.obj).

#### Attribution

Samurai Mask Model 3 by [flioink](https://skfb.ly/6WDWx)

---

Learn more about Face Effects in our [documentation](https://www.8thwall.com/docs/web/).
