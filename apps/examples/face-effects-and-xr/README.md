# three.js: Face Effects

Get started with 8th Wall Face Effects! This three.js example attaches 3D glasses to the detected 
face and applies a tattoo to the generated face mesh.

![](https://media.giphy.com/media/PmjHEktbE2BVSkuHgN/giphy.gif)

```face-scene.js``` generates the face mesh, sets its material, and updates its transforms. It also
imports the stereo-glasses.glb model and attaches it to the *noseBridge* attachment point.

```run-face-pipeline.js``` runs all the pipeline modules and provides a place to inject HTML before
the scene loads.

Attachment point data is provided in the ```attachmentPoints``` field of ```event.detail```. 
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

```XR8.FaceController```

- meshGeometry: List that contains which parts of the head geometry are visible. Choices include: 
XR8.FaceController.MeshGeometry.FACE, EYES, and NOSE (default: FACE)

- coordinates: { mirroredDisplay: bool } If true, flips camera feed horizontally in the output.

```XR8.run```

- cameraConfig: { direction } Sets device front or rear facing camera. 
XR8.XrConfig.camera().FRONT or BACK

- allowedDevices: Sets which device types supported, mobile only or all devices (including desktop)
XR8.XrConfig.device().ANY or MOBILE

### Reference Assets

Download 'uv-black.png' or 'uv-bright.png' from ```/assets/Tattoos/``` for face mesh UV reference 
images.

Download the face mesh model for reference in your 3D modeling software
[here](https://cdn.8thwall.com/web/assets/face/facemesh.obj).

### Media Recorder

This project includes video recording and photo capture functionality through the use of 
[XRExtras.MediaRecorder](https://www.8thwall.com/docs/web/#customize-video-recording), 
[XR8.MediaRecorder](https://www.8thwall.com/docs/web/#xr8mediarecorder), and 
[XR8.CanvasScreenshot](https://www.8thwall.com/docs/web/#xr8canvasscreenshot).

#### Attribution

Stereo glasses by [jau0gan](https://www.turbosquid.com/3d-models/free-stereo-3d-model/613193)

---

Learn more about Face Effects in our [documentation](https://www.8thwall.com/docs/web/).
