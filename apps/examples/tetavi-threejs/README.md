# three.js: Tetavi Volumetric Video

This example illustrates how to integrate a [Tetavi](https://tetavi.com) volumetric capture into
an 8th Wall WebAR project using three.js.

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

In **app.js**, we add the ```tetaviScenePipelineModule``` to our ```XR8.addCameraPipelineModules```.

**camerafeed.html** contains the UI and main canvas for drawing the scene.

**index.css** contains the styling rules for the UI.

**tetavi-scene-module.js** contains the volumetric video playback logic. It is here you can further
customize the hologram playback behavior.

**touch-controls.js** contains logic for pinch to scale, tap to reposition, and drag to rotate gestures.

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
6. In **tetavi-scene-module.js**, the `dancingHologram` object in `tetaviScenePipelineModule` 
should reference the correct `.tetavi` and `.mp4` files (with require./assets/ paths).

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

### Reality Engine Behavior

With R18, 8th Wall's AR Engine is now the Reality Engine. The Reality Engine automatically adapts
all WebAR projects to work with computers and headsets. This project has a few platform-specific 
customizations:

In **app.js**, we add the ```XR8.XrConfig.device().ANY``` parameter to ```XR8.run``` 
which ensures the project opens on all platforms, including desktop. By default, this is ```mobile-and-headsets```.

---
Looking for an A-Frame version? Check out the [8th Wall Project Library](https://www.8thwall.com/8thwall/tetavi-aframe).
