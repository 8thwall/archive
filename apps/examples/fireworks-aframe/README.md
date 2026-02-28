# A-Frame: Fireworks

Celebrate any occasion with AR fireworks!

![](https://media.giphy.com/media/j0GUVZTVfRYBEj8qTJ/giphy.gif)

### NOTE: [aframe-particle-system-component](https://github.com/IdeaSpaceVR/aframe-particle-system-component) is not supported in iOS 15.0 - 15.1.1. This [bug](https://bugs.webkit.org/show_bug.cgi?id=229378) has been fixed in iOS 15.2.

### launch-btn component

This leverages the [aframe-particle-system-component](https://github.com/IdeaSpaceVR/aframe-particle-system-component) 
to generate the wick particles, propellant particles, and explosion particles. 

### tap-place component

Used to place all of the rockets before firing with the launch-btn component.

### reflections module

The Reflections Module adds two components to your project that improve the realism of GLB models: ```reflections``` and ```xr-light```.

```reflections``` applies static and realtime environment cubemaps to your glb models. Its primary parameter is called type:

type: static or realtime (default: 'realtime')

You may use multiple "type: static" or "type: realtime" reflections components in your scene.

By default, "type: static" will use a built-in cubemap but you can override this in the module config or by specifying posx, posy, etc in code.

Learn more about the reflections module [here](https://www.8thwall.com/8thwall/cubemap-aframe).