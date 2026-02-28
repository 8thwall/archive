# A-Frame: Face Effects

Get started with 8th Wall Face Effects! This A-Frame example attaches 3D glasses to the detected 
face and applies a tattoo to the generated face mesh.

![](https://media.giphy.com/media/PmjHEktbE2BVSkuHgN/giphy.gif)

### Tutorial Video

[![Getting Started With Face Effects](https://i.imgur.com/oMLaK7T.jpg)](https://youtu.be/V4NXQ5_3Wak?t=420)

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
- maxDetections: The maximum number of faces that can be simultaneously processed, up to 3. (default: 1)

```<xrextras-faceanchor>``` inherits the detected face transforms. Entities inside will move with 
the face. Use the `face-id` property when `maxDetections` > 1 to define different face scenes.
- face-id: attaches the children to the corresponding face id.

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

Download 'uv-black.png' or 'uv-bright.png' from ```/assets/Tattoos/``` for face mesh UV reference 
images.

Download the face mesh model for reference in your 3D modeling software
[here](https://cdn.8thwall.com/web/assets/face/facemesh.obj).

### Media Recorder

This project includes video recording and photo capture functionality through the use of 
[XRExtras.MediaRecorder](https://www.8thwall.com/docs/web/#customize-video-recording), 
[XR8.MediaRecorder](https://www.8thwall.com/docs/web/#xr8mediarecorder), and 
[XR8.CanvasScreenshot](https://www.8thwall.com/docs/web/#xr8canvasscreenshot).

```<xrextras-capture-button>```: Adds a capture button to the scene.

- capture-mode: Sets the capture mode behavior. Options include **standard** (default): tap to take 
photo and tap + hold to record video, **fixed**: tap to toggle video recording, or **photo**: tap to 
take photo. 

```<xrextras-capture-config>```: Configures the captured media.

- max-duration-ms: Total video duration (in miliseconds) that the capture button allows. 
If the end card is disabled, this corresponds to max user record time. 15000 by default.
- max-dimension: Maximum record dimension for both width and height. 1280 by default. 


- enable-end-card: Whether the end card is included in the recorded media. 'true' by default.
- cover-image-url: Image source for end card cover image. Uses project’s cover image by default.
- end-card-call-to-action: Sets the text string for call to action on end card. “Try it at:” by default.
- short-link: Sets the text string for end card shortlink. Uses project shortlink by default.
- footer-image-url: Image source for end card footer image. Uses 'Powered by 8th Wall' by default.


- watermark-image-url: Image source for watermark. Null by default.
- watermark-max-width: Max width (%) of watermark image. 20 by default.
- watermark-max-height: Max height (%) of watermark image. 20 by default.
- watermark-location: Location of watermark image. Options include **topLeft**, **topMiddle**, 
**topRight**, **bottomLeft**, **bottomMiddle**, or **bottomRight** (default).


- file-name-prefix: Sets the text string that prepends the unique timestamp on file name. 
'my-capture-' by default.


- request-mic: Determines if you want to set up the microphone during initialization ("auto") or during
 runtime ("manual")
- include-scene-audio: If true, the A-Frame sounds in the scene will be part of the recorder output

```<xrextras-capture-preview>```: Adds a media preview prefab to the scene which allows for 
playback, downloading, and sharing.

- action-button-share-text: Sets the text string in action button when Web Share API 2 is available 
(iOS 14, Android). “Share” by default.
- action-button-view-text: Sets the text string in action button when Web Share API 2 is not 
available in iOS (iOS 13). “View” by default.

Learn more about the XRExtras.MediaRecorder API 
[here](https://www.8thwall.com/docs/web/#customize-video-recording).

#### Attribution

Stereo glasses by [jau0gan](https://www.turbosquid.com/3d-models/free-stereo-3d-model/613193)

---

Learn more about Face Effects in our [documentation](https://www.8thwall.com/docs/web/).
