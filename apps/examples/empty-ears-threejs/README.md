# three.js: Ears Template

Get started with 8th Wall's ear attachment points! This three.js template includes occluders and two purple cubes located on both earlobes.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWRxbmhsZ2hlN29qMTh5aWc2bXdmdDJudHZ6eGI1a2Juano3czIzZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MRB7lGigxVNqmAqmTd/giphy.gif)

### Ear Attachment Project Overview
- assets/models/
  - **noEarsHeadOccluder.glb** a modified head occluder that has no ears.
- ```face-scene.js``` generates the face mesh, sets its material, and updates its transforms. It also
imports the stereo-glasses.glb model and attaches it to the *noseBridge* attachment point.

- ```run-face-pipeline.js``` runs all the pipeline modules and provides a place to inject HTML before
the scene loads.

### Ear Attachment Configuration

- ```XR8.FaceController``` is required for face effects and ear attachment points
  - enableEars: If true, runs ear detection simultaneously with Face Effects and returns ear attachment points. (default: false)
  - meshGeometry: List that contains which parts of the head geometry are visible. Choices include: 
  XR8.FaceController.MeshGeometry.FACE, EYES, and NOSE (default: FACE)
  - coordinates: { mirroredDisplay: bool } If true, flips camera feed horizontally in the output.
- ```XR8.run```
  - cameraConfig: { direction } Sets device front or rear facing camera. 
  XR8.XrConfig.camera().FRONT or BACK
  - allowedDevices: Sets which device types supported, mobile only or all devices (including desktop)
  XR8.XrConfig.device().ANY or MOBILE
  - mirroredDisplay: Mirrors the camera feed. Choose from: 'true' or 'false'. (default: false)


- Attachment point data is provided in the ```attachmentPoints``` field of the event ```facecontroller.faceupdated.detail```. 
  The following attachment points are available to choose from:

    forehead,
    rightEyebrowInner,
    rightEyebrowMiddle,
    rightEyebrowOuter,
    leftEyebrowInner,
    leftEyebrowMiddle,
    leftEyebrowOuter,
    leftEar,
    rightEar,
    rightHelix,
    rightCanal,
    rightLobe,
    leftHelix,
    leftCanal,
    leftLobe,
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

### Ear Attachment Events
- `facecontroller.earfound`: Fires when an ear is first found.
  - id: A numerical id of the located face which the ear is attached to.
  - ear: Can be either 'left' or 'right'.
- `facecontroller.earlost`: Fires when an ear is lost.
  - id: A numerical id of the located face which the ear is attached to.
  - ear: Can be either 'left' or 'right'.
- `facecontroller.earpointfound`: Fires when an ear attachmentPoint is first found.
  - id: A numerical id of the located face which the ear is attached to.
  - point: Can be either leftHelix, leftCanal, leftLobe, rightHelix, rightCanal, or rightLobe.
- `facecontroller.earpointlost`: Fires when an ear attachmentPoint is lost.
  - id: A numerical id of the located face which the ear is attached to.
  - point: Can be either leftHelix, leftCanal, leftLobe, rightHelix, rightCanal, or rightLobe.

### Developing Ear Attachment Experiences
  1. Make sure ```XR8.FaceController``` is attached to your camera pipeline and the `enableEars` property is configured to `true`.
  2. Choose from 6 new attachment points to attach objects to different parts of the ears.
    - these include leftHelix, leftCanal, leftLobe, rightHelix, rightCanal, rightLobe.

    ![](https://7182223.fs1.hubspotusercontent-na1.net/hubfs/7182223/Ears%20-%20Attachment%20Points%20Blog.png)
  3. Copy the position of the attachment point(s) you want to attach objects to and parent any child entities you want to be tracked.


### Ear Attachment Best Practices
- Ear points aren't available on the `facecontroller.facefound` event, only after the first few updates of `facecontroller.faceupdated` as we run the ear tracking algorithim after the face has been detected.
- We automatically mirror ear points if only one ear is in view. For example, we will mirror points of the right ear if only the left ear is in view and vice versa.
- There are also `leftear` and `rightear` attachment points that come from face effects, they are located at your sideburns; we reccomend using the specific ear points for precise experiences.


To learn more about Ear Attachment Points and to view the API, please visit our [documentation](https://www.8thwall.com/docs/api/aframe/#face-effects).