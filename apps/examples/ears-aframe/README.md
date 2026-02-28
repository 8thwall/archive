# A-Frame: Ears

Get started with 8th Wall's ear attachment points! This A-Frame example creates dangly lobe earrings, arrow through head, and helix stud try-on experience.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdG5udjZtbno4MDcyYWhhdG16a3dtMDFpb21sdWJvczQ4MnFlOHJ4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TnMUaLmaO5WVOEYSWI/giphy-downsized-large.gif)

### Ear Attachment Project Overview

- components/
  - **earring-chain.js** sets colliders and physics properties on earring models to create chain physics.
  - **hide-earrings.js** hides earring models not attached to face entity when face is lost.
  - **ui-manager.js** handles next button functionality.
- assets/models/
  - **8stud.glb** a stud of the 8thwall logo.
  - **arrowIn.glb** the first half of an arrow.
  - **arrowOut.glb** the second half of an arrow.
  - **danglyBottom.glb** the bottom piece of a dangly earring.
  - **danglyMiddle.glb** the middle piece of a dangly earring.
  - **danglyTop.glb** the top piece of a dangly earring.
  - **noEarsHeadOccluder.glb** a modified head occluder that has no ears.

### Ear Attachment Attributes & Entities

- `xrface` & `xrconfig` are required in your `<a-scene>` to access ear attachment points.
  - enableEars: If true, runs ear detection simultaneously with Face Effects and returns ear attachment points. (default: false)
  - meshGeometry: Configure which portions of the face mesh will have returned triangle indices. Can be any combination of 'face', 'eyes', 'iris', and 'mouth'. (default: face)
  - cameraDirection: Desired camera to use. Choose from: 'back' or 'front'. (default: back)
  - allowedDevices: Supported device classes. Choose from: 'mobile' or 'any'. Use 'any' to enable laptop or desktop-type devices with built-in or attached webcams. (default: mobile)
  - mirroredDisplay: Mirrors the camera feed. Choose from: 'true' or 'false'. (default: false)
  - Other scene parameters can be found within the [`xrconfig` docs](https://www.8thwall.com/docs/api/aframe/#configuring-the-camera).
- `xrextras-hider-material` is applied to any mesh or primitive that you would like to be transparent while blocking the rendering of models behind it. In the scene, this is applied to the head-occluder.glb.
- `physics` enables the ammo physics library in our project which lets us create real-time earring physics. This component is dependant on importing two scripts found in `head.html`.
- `reflections` enables reflections on our 3D models. This component is dependant on importing the `reflections` module.
- `rightEarOccluder` and `leftEarOccluder` are `a-sphere`s attached to the `rightCanal` and `leftCanal` attachment points, respectively, to create ear occluders that allow the ears to occlude objects that pass behind the head. 
- `rightTragusOccluder` and `leftTragusOccluder` are `a-spheres` attached to the `rightCanal` and `leftCanal` attachment points, respectively, to create tragus occluders that occlude models inserted into the ear such as earbuds.

### Ear Attachment Primitives

- `<xrextras-faceanchor>` inherits the detected face transforms. Entities inside will move with the face.

- `<xrextras-face-mesh>` generates a face mesh in your scene.

- `<xrextras-face-attachment>` inherits the detected attachment point transforms. Entities inside will move with the assigned attachment point.
  - `point`: name of attachment point (default: forehead)
  - Attachment points include: forehead, rightEyebrowInner, rightEyebrowMiddle, rightEyebrowOuter, leftEyebrowInner, leftEyebrowMiddle, leftEyebrowOuter, leftEar, rightEar, leftCheek, rightCheek, noseBridge, noseTip, leftEye, rightEye, leftEyeOuterCorner, rightEyeOuterCorner, leftIris, rightIris, leftUpperEyelid, rightUpperEyelid, leftLowerEyelid, rightLowerEyelid, upperLip, lowerLip, mouth, mouthRightCorner, mouthLeftCorner, chin, leftHelix, leftCanal, leftLobe, rightHelix, rightCanal, rightLobe.

### Ear Attachment Events
- `earfound`: Fires when an ear is first found.
  - id: A numerical id of the located face which the ear is attached to.
  - ear: Can be either 'left' or 'right'.
- `earlost`: Fires when an ear is lost.
  - id: A numerical id of the located face which the ear is attached to.
  - ear: Can be either 'left' or 'right'.
- `earpointfound`: Fires when an ear attachmentPoint is first found.
  - id: A numerical id of the located face which the ear is attached to.
  - point: Can be either leftHelix, leftCanal, leftLobe, rightHelix, rightCanal, or rightLobe.
- `earpointlost`: Fires when an ear attachmentPoint is lost.
  - id: A numerical id of the located face which the ear is attached to.
  - point: Can be either leftHelix, leftCanal, leftLobe, rightHelix, rightCanal, or rightLobe.

### Developing Ear Attachment Experiences
  1. Make sure `xrface` is attached to your `a-scene` and the `enableEars` property is set to `true`.
  2. Choose from 6 new attachment points to attach objects to different parts of the ears.
    - these include leftHelix, leftCanal, leftLobe, rightHelix, rightCanal, rightLobe.

    ![](https://7182223.fs1.hubspotusercontent-na1.net/hubfs/7182223/Ears%20-%20Attachment%20Points%20Blog.png)
  3. Utilize the `xrextras-face-attachment` primitive, pass in the name of the attachment point you want to attach objects to, and parent any child entities you want to be tracked on the ear.


### Ear Attachment Best Practices
- Ear points aren't available on the `xrfacefound` event, only after the first few updates of `xrfaceupdated` as we run the ear tracking algorithim after the face has been detected.
- We automatically mirror ear points if only one ear is in view. For example, we will mirror points of the right ear if only the left ear is in view and vice versa.
- There are also `leftear` and `rightear` attachment points that come from face effects, they are located at your sideburns; we reccomend using the specific ear points for precise experiences.
- It is reccomended to use A-Frame 1.3.0 or lower for physics-based experiences since newer versions change how physics are implemented.

To learn more about Ear Attachment Points and the API, please visit our [documentation](https://www.8thwall.com/docs/api/aframe/#face-effects).
