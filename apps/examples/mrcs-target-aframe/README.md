# A-Frame: MRCS Image Target

This example illustrates how to anchor a Microsoft Mixed Reality Capture Studio hologram 
onto an image target.

![](https://i.giphy.com/media/vhWGWuQNNQCGAR0OLp/giphy.gif)

## Image Target:

![](https://static.8thwall.app/assets/stone-jkrd7bo7ih.jpg)

---

### Project Overview

In **head.html**, we add `<meta name="8thwall:package" content="@mrcs.holovideoobject:1.3.2">` and
`<script crossorigin="anonymous" src="https://cdn.dashjs.org/latest/dash.mediaplayer.min.js"></script>` to
download the latest version of the HCAP and DASH players.

In **body.html**, we add the ```<hcap-hologram>``` primitive to our ```<a-scene>``` which has a few important
parameters:

```<hcap-hologram>```: primitive that contains volumetric video playback logic.

- src: hcap asset path (local path or external cdn link)
- size: starting size of hologram (default: 1)
- loop: if true, loops hologram playback (default: true)
- touch-target-size: size of touch target cylinder: 'height radius' (default: '1.65 0.35')
- touch-target-offset: offset of touch target cylinder: 'x z' (default: '0 0')
- touch-target-visible: if true, show touch target for debugging (default: false)

**hcap.js** contains all the logic for the ```<hcap-hologram>``` primitive. It is here you can control 
behavior such as looping, muting, and even displaying messages based on playback states 
(i.e. "loading", "buffering", etc). 

Upload your HCAP files directly in Cloud Editor to create an HCAP asset bundle you can reference with a 
local path in ```<hcap-hologram src="">```. Learn more about asset bundles in our 
[docs](https://www.8thwall.com/docs/web/#asset-bundles).

---

### HCAP API Reference

```this.hvo.state```: HCAP playback states.

- Closed: -1 (A previously loaded capture has been unloaded)
- Empty: 0 (Initial state of all HoloVideoObjectThreeJS instances)
- Opening: 1 (A capture is in the process of opening and buffering data for playback)
- Opened: 2 (The capture loaded and ready for hvo.play() to be called)
- Playing: 3 (Capture playback is in progress)
- Paused: 4 (Playback is paused and may be resumed by calling hvo.play())

```this.hvo.videoState```: HCAP video states.

- Undefined: 0
- CanPlay: 1
- CanPlayThrough: 2
- Waiting: 3
- Suspended: 4
- Stalled: 5
- Playing: 6

```this.hvo.open(url, options)```: Opens and capture and begins buffering data for playback.
- url: capture URL
- options.audioEnabled: Specifies whether audio playback is enabled initially.
- options.autoplay: Specifies whether capture should automatically begin playback when loaded. 
If enabled will disable audio as many browsers do not allow automatic audio playback without user input.
- options.minBuffers: Minimum number of .bin segments that must be buffered before capture is 
considered preloaded. Default value is 2.
- options.maxBuffers: Maximum number of .bin segments that can be buffered and kept in memory at one time.
- options.keepAllMeshesInMemory: Overrides maxBuffers setting and keeps all mesh in memory to prevent further loading.
- options.streamMode: forces the StreamMode for the video object. 
  - Automatic: 0 (Selects based on browser. This is the default value.)
  - MP4: 1 (Force load of full mp4 before playing)
  - HLS: 2 (Force use of HLS for playback. Usually used only in Safari)
  - Dash: 3 (Force use of Dash for segmenting video and faster load. Usually NOT used in Safari. Requires Dash player.)


 ```this.hvo.play()```: Starts playback.
 
```this.hvo.pause()```: Pauses playback.

```this.hvo.rewind()```: Rewinds capture back to the first frame and pauses.

```this.hvo.close()```: Stops playback and releases capture-specific resources.
A new capture can then be loaded by calling this.hvo.open(url, options)

```this.hvo.setAudioEnabled(enabled)```: Enables or disables audio playback. May be called at any time.

```this.hvo.audioEnabled()```: Returns whether audio playback is currently enabled.

```this.hvo.setAudioVolume(volume)```: Sets audio volume between 0 and 1.

```this.hvo.setAutoLooping(loop)```: Specifies whether capture should loop automatically. 
May be called at any time.

```this.hvo.setLogLevel(level)```: Sets verbosity level of log output. 
- level 0: errors (default)
- level 1: warnings
- level 2: info
- level 3: debug

```this.hvo.update()```: Updates capture mesh and texture to latest playback frame. This is called each tick().

#### NOTE: There was previously a [bug](https://bugs.webkit.org/show_bug.cgi?id=218637) that prevented HLS playback, resulting in HCAP playback falling back to MP4. It affected iPhone 12 models running iOS 14.1 - 14.5, and all iOS/iPadOS models running 14.0 - 14.1. It has since been fixed in 14.6, so most users will not encounter this.
