# three.js: 8i Volumetric Video

This example demonstrates how to use the 8i three.js component in a simple 8th Wall pipeline.

![](https://media.giphy.com/media/qJaWbUCugZJhK0bHGA/giphy.gif)

### About 8i

[8i](https://8i.com/) is an end-to-end provider of volumetric video solutions, from capture to
encoding and distribution. 8i's livestream capabilities make it possible to capture people on a
hologram stage and instantly stream them into a WebAR scene. Additionally, 8i’s adaptive bitrate 
streaming ensures users will receive the best quality version regardless of the connection quality.

To learn more about how 8i can help you bring volumetric video to your
projects, please contact [hi@8i.com](mailto:hi@8i.com).

---

### Project Overview

The `EightiHologram` class is exported globally when 8i's `volcap-player.js` library is included in
the page, e.g.: `<script src="https://player.8i.com/release/2.8.8/volcap-player.js"></script>`

You can create an instance of this class to play a volumetric asset.  The constructor has the
following signature:

`const hologram = new EightHologram(src, scene, renderer, opts = {})`

- src (string): URL of an 8i manifest file. Several samples are listed in the eighti-scene-init.js file.
- scene: three.js scene object
- renderer: three.js renderer object
- opts: a map of config properties, detailed below

### Config Options

- autoplay [boolean]: Start playing content immediately on load.  Content will be muted due to
                      browser autoplay constraints.
- loop [boolean]: Loop content automatically on completion.
- muted [boolean]: Set initial or current mute state.  This attribute will respond to runtime updates.
- touch-target-size [string]: Define the size of the invisible cylinder 'touch target'. Accepts a
                              string containing `'{height} {width}'`, defaults to `'1.65 0.35'`.
- touch-target-offset [string]: Define the x,z offset of the 'touch target'. Accepts a string
                                containing `'{x} {z}'`, defaulting to `'0 0'`.
- touch-target-visible [boolean]: Show the touch target to aid debugging.

### Functions, Getters, Setters

The `EightiHologram` class exposes several functions, getters, and setters that can be used to
monitor and control hologram playback:

- The play() and pause() functions can be used to start and stop playback
- The currentTime and duration getters can be used to monitor progress
- The currentTime setter can be used to seek to a different point on the timeline ([0, duration])

### Event handlers

There are several callbacks that you can attach to your instance of `EightiHologram` to respond to
playback changes.  These can be used to drive UI state changes, e.g. changing a play/pause button
image.

- onplay: Called when the hologram starts playing
- onpause: Called when the hologram is paused
- onended: Called when playback is complete, when loop: false
- oncanplay: Called when the hologram metadata is loaded and playback can begin

**eighti-scene-init.js** sets up the three.js scene for hologram playback.

**transform-controls.js** contains logic for one-finger-rotate and pinch-to-scale.

**index.css** contains the styling rules for the UI.

---
Looking for an A-Frame version? Check out the [8th Wall Project Library](https://www.8thwall.com/8thwall/aframe-8i).
