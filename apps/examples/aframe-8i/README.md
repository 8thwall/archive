# A-Frame: 8i Volumetric Video

This example demonstrates how to use the 8i A-Frame component to display volumetric video.

![](https://media.giphy.com/media/qJaWbUCugZJhK0bHGA/giphy.gif)

### About 8i

[8i](https://8i.com/) is an end-to-end provider of volumetric video solutions, from capture to
encoding and distribution. 8i's livestream capabilities make it possible to capture people on a
hologram stage and instantly stream them into a WebAR scene. Additionally, 8i’s adaptive bitrate 
streaming ensures users will receive the best quality version regardless of the connection.

To learn more about how 8i can help you bring volumetric video to your
projects, please contact [hi@8i.com](mailto:hi@8i.com).

---

### Project Overview

In **head.html**, we add ``<script src="https://player.8i.com/release/2.8.8/volcap-player.js"></script>``
to download the latest version of the 8i player.

In **body.html**, we add the ```hologram``` component to a ```<a-entity>``` in  the ```<a-scene>``` which has a few important
parameters:

```hologram```: component that contains volumetric video playback logic.

- src (string): URL of an 8i manifest file. Several samples are listed in the body.html file.
- autoplay (bool): Start playing content immediately on load.  Content will be muted due to browser autoplay constraints.
- loop (bool): Loop content automatically on completion.
- muted (bool): Set initial or current mute state.  This attribute will respond to runtime updates.
- touch-target-size (string): Define the size of the invisible cylinder 'touch target'. Accepts a string containing `'{height} {radius}'`. (default: '1.65 0.35')
- touch-target-offset (string): Define the x,z offset of the 'touch target'. Accepts a string containing `'{x} {z}'` (default: '0 0')

In addition to these attributes, the component exposes an API that is similar to the standard
HTMLVideoElement.  The `play()` and `pause()` functions can be used to control playback state and
the `currentTime` and `duration` getters can be used to monitor progress or seek. Note that `duration` will return `Infinity` for live events.

```eighti-controls```: component that controls hologram placement and playback UI.

- size (float): starting size of hologram (default: 1.0)

**eighti-controls.js** contains all the logic for the ```eighti-controls``` component. It is here
you can further customize the hologram playback behavior.

**index.css** contains the styling rules for the UI.

### Additional Documentation 
 
 [https://8i.github.io/embeddable_webplayer/#/?id=a-frame-component](https://8i.github.io/embeddable_webplayer/#/?id=a-frame-component)

---

### Optimizing for Metaversal Deployment

With R18, the all-new 8th Wall Engine features Metaversal Deployment, enabling you to create WebAR experiences once and deploy them to smartphones, tablets, computers and both AR and VR headsets. This project has a few platform-specific customizations:

In **eighti-controls.js**, the ```responsiveImmersive()``` function checks the 8th Wall Engine's 
```sessionAttributes``` and changes the prompt language and CSS to match the detected platform.

---

Looking for a three.js version? Check out the [8th Wall Playground](https://www.8thwall.com/playground/threejs-8i).
