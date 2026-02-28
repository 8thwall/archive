# A-Frame: Tetavi Volumetric Video

This example illustrates how to integrate a [Tetavi](https://tetavi.com) volumetric capture into
an 8th Wall WebAR project using A-Frame.

![](https://media.giphy.com/media/dMBxNuC5kJBRI38gDo/giphy.gif)

### About Tetavi

With its fully mobile solution that is easy to deploy and operate, Tetavi’s studios can be set up 
virtually anywhere within four hours. Tetavi studios do not require the use of a green screen, and 
only need 4 depth cameras, a speedy timesaving setup for users. Tetavi’s capture capabilities 
enable high fidelity, photorealistic, live-action holograms with sub-millimeter accuracy in a
large 3x3m stage. Contact [Tetavi](mailto:hello@tetavi.com) to create your own volumetric videos.

---

### Project Overview

In **head.html**, we add ```<script src="//webplayer-test-1.az.tetavidemo.click/Version_2_0_0/TetaviBundle.js"></script>```
to download the latest version of the Tetavi player.

In **body.html**, we add the ```<tetavi-hologram>``` primitive to our ```<a-scene>``` which has a few important
parameters:

```<tetavi-hologram>```: primitive that contains volumetric video playback logic.

- tetavi-file: tetavi asset reference
- mp4-file: mp4 asset reference
- proximity-fade: if true, hologram fades out as camera approaches (default: true)
- loop: if true, loops hologram playback (default: true)
- playback-rate: rate of playback: 0.5 is half speed, 2.0 is double speed (default: 1.0)
- size: starting size of hologram (default: 1.0)
- touch-target-size: size of touch target cylinder: 'height radius' (default: '1.5 0.5')
- touch-target-offset: offset of touch target cylinder: 'x z' (default: '0 0')
- touch-target-visible: if true, show touch target for debugging (default: false)

```touch-target-size``` sets the height and radius of an invisible cylinder primitive positioned 
over the ```<tetavi-hologram>``` that receives raycasts, allowing the hologram to be manipulated
by user gestures. ```touch-target-visible``` makes this visible for debugging and 
```touch-target-offset``` allows for repositioning the touch target along the x and z axis.

**tetavi-hologram.js** contains all the logic for the ```<tetavi-hologram>``` primitive. It is here
you can further customize the hologram playback behavior.

**index.css** contains the styling rules for the UI.

---

### Add your own Tetavi Hologram

To upload your own Tetavi volumetric video:

1. Drag and drop your Tetavi video file (`.mp4`) into your ASSETS
2. In the File Directory, click the "+" to the right of ASSETS and select "New asset bundle" -> "Other"

  ![](https://media.giphy.com/media/RkQvv00o3E2cPancXS/giphy.gif)

3. Drag and drop your remaining Tetavi hologram files (`.manifest` + `.tvm`) into the "Files" window

  ![](https://media.giphy.com/media/v2kcRaA5Pxzggr0Abj/giphy.gif)

4. Select the Tetavi `.manifest` file from the "Select main file" dropdown and rename bundle to `YOURFILENAME.tetavi`

  ![](https://media.giphy.com/media/um0fs5fcroixu2fnbu/giphy.gif)

5. Click "Create Bundle"
6. In **body.html**, each `<xrextras-resource>` src should reference its `.tetavi` and `.mp4` file (with ./assets/ paths).
7. Ensure each `tetavi-file` and `mp4-file` value in `<tetavi-hologram>` matches the correct `<xrextras-resource>` id.

---

### Tetavi API Reference

```Tetavi.create(renderer, camera, MP4, tetavi)```: creates the Tetavi hologram.

- renderer: the WebGL renderer
- camera: the WebGL camera (needed to perform proximity-fade and shadow effects)
- MP4: refers to .mp4 file
- Tetavi: refers to .tetavi file


- .onSetBar(width, progress): called when position of volumetric video is updated.
- .setFadeAlpha(bool): if true, hologram fades out as camera approaches (default: true)
- .setShadowAngle(0.4): if viewed from below from this angle in radians, hologram becomes transparent.

```getScene()```: returns the sub-scene that is needed to be added to the WebGL root (or other) scene node.

```play()```: call this to start playing the volumetric video. It is recommended to call it only
when the progress callback was called with value close to 100.

```pause()```: call (after play) at any time to pause the video.

```resume()```: call (after pause) at any time to continue playing.

```isPlaying()```: returns bool of whether the volumetric video is now playing.

---

### Optimizing for Metaversal Deployment

With R18, the all-new 8th Wall Engine features Metaversal Deployment, enabling you to create WebAR experiences once and deploy them to smartphones, tablets, computers and both AR and VR headsets. This project has a few platform-specific customizations:

In **body.html**, we add the ```"allowedDevices: any"``` parameter to our ```xrweb``` component in ```<a-scene>``` 
which ensures the project opens on all platforms, including desktop. By default, this is ```mobile-and-headsets```.

In **tetavi-hologram.js**, the ```responsive-immersive``` checks the 8th Wall Engine's 
```sessionAttributes``` to accommodate current bugs related to VR mode.

---
Looking for a three.js version? Check out the [8th Wall Playground](https://www.8thwall.com/playground/tetavi-threejs).
