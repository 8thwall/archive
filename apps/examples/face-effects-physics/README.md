# A-Frame: Face Effects - Physics

Arrrgh! Wear a pirate hat, utilize chain physics, and use head/face occluders with this Face Effect.

![](https://media.giphy.com/media/Tfvi3IJzawcFpmylXV/giphy.gif)

This project uses *ammo.js* (javascript physics engine) and the ```ball-chain``` component to showcase 
chain physics working alongside face effects. Feel free to swap out the skull mesh for your own. 
The ammo.js documentation is located
[here](https://github.com/donmccurdy/aframe-physics-system/blob/master/AmmoDriver.md#ammo-driver).

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
- meshGeometry: Configure which portions of the face mesh will have returned triangle indices. Can be any
  combination of 'face', 'eyes' and 'mouth'. (default: face)

```<xrextras-faceanchor>``` copies the detected face transforms to itself and children. Add 
entities inside that you want to move with the face.

The ```xrextras-hider-material``` is applied to any mesh or primitive that you would like to be 
transparent while blocking the rendering of models behind it. In the scene, this is applied to the
head-occluder.glb and xrextras-face-mesh. The head-occluder also contains an ```ammo-body``` and
```ammo-shape``` which together prevent the ball-chain objects from colliding through the face.

```<xrextras-face-mesh>``` generates a face mesh in your scene. This example combines it with 
the xrextras-hider-material component for a more realistic head occluder.

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

Pirate hat by [Aartee](https://skfb.ly/6Syv6) and skull by [Artopsia](https://skfb.ly/6SwNI)

---

Learn more about Face Effects in our [documentation](https://www.8thwall.com/docs/web/).
