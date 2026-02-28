# A-Frame: Face Effects - Custom Shaders 

Check out a wide variety of custom effects that can be applied to the face mesh.

![](https://media.giphy.com/media/Vg5gxNcZFmhPFmPc4q/giphy.gif)

### Tutorial Video

[![Getting Started With Face Effects](https://i.imgur.com/oMLaK7T.jpg)](https://youtu.be/V4NXQ5_3Wak?t=420)

### Custom Effects

This project shows you how to create four kinds of effects on the face:

* **Shader Effects:** Use A-Frame's shader registry to draw over the face with your own shader.
Provided examples include a full motion cosmic wave effect, a flat color changing effect, motion
lava, and one that contorts a texture into a spiraling loop.
* **PBR Material Effects:** Define a Physically Based Rendering (PBR) material with color, metal,
  roughness, normal and alpha maps to achieve realistic looking face materials.
* **Texture Effects: ** Paint your face or add a tattoo with an image and alpha mask.
* **Video Effects:** Add some motion to your face effects with videos and alpha mask. Check out the
videos available in ```assets/Custom/videos/```.

### Material Primitives

```<xrextras-resource>``` is referenced by xrextras materials. 

- src: the file path

```<xrextras-pbr-material>``` is used to construct a PBR material.

- tex: color map
- metalness: metalness map
- normals: normal map
- roughness: roughness map
- alpha: alpha map (activates when opacity set to < 1.0)
- opacity: overall opacity of material (default: 1.0)

```<xrextras-basic-material>``` is used to construct a flat material.

- tex: color map
- alpha: alpha map (activates when opacity set to < 1.0)
- opacity: overall opacity of material (default: 1.0)

```<xrextras-video-material>``` is used to construct a flat video material.

- video: ```<video>``` src id
- alpha: alpha map (activates when opacity set to < 1.0)
- autoplay: autoplays on scene load. ```<video>``` must have ```muted``` attribute.
(default: true)
- opacity: overall opacity of material (default: 1.0)
  
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

```<xrextras-face-mesh>``` generates a face mesh in your scene.

- material-resource: reference xrextras materials by id.
- material: use this instead to set custom shaders or 
[A-Frame material properties](https://aframe.io/docs/1.0.0/components/material.html).

### Reference Assets

The ```/assets/Alpha/``` folder contains a series of alpha textures used for selectively occluding 
parts of the face. These are useful for blending the edges of the face mesh, makeup try-on and even 
superhero masks.

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

silky-blue.mp4, tunnel-dodeca.mp4, and tunnel-tri.mp4 courtesy of Videezy.com

---

Learn more about Face Effects in our 
[documentation](https://www.8thwall.com/docs/web/).
