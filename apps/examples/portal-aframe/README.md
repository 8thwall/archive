# A-Frame: World Tracking Portal

This example shows off the popular portal illusion in WebAR using hider materials and the camera position as an event trigger.

![](https://media.giphy.com/media/r1ZdOADqXQvQbwWjK5/giphy.gif)

Try the full demo here at [8th.io/moon-demo](https://8th.io/moon-demo).

Learn more about WebAR Portals on the [8th Wall blog](https://www.8thwall.com/blog/post/51653771942/webar-portals-get-even-more-powerful-with-8th-walls-upgraded-ar-engine).

### World Tracking Portal Components

```portal-camera``` : Attached to the camera, this component hides and shows portal elements as the camera moves.

- width: width of portal bounds (default: 10)
- height: height of portal bounds (default: 10)

```tap-to-place-portal``` : recenters the camera and triggers portal opening animations

```prompt-flow``` : displays onscreen onboarding UX instructions

```xrextras-hider-material``` : Applied to any mesh or primitive that must be transparent while 
blocking the rendering of models behind it.

---

### Optimizing for Metaversal Deployment

With R18, the all-new 8th Wall Engine features Metaversal Deployment, enabling you to create WebAR experiences once and deploy them to smartphones, tablets, computers and both AR and VR headsets. This project has a few platform-specific customizations:

In **body.html**, we add the ```"allowedDevices: any"``` and ```"disableDefaultEnvironment: true"``` 
parameters to our ```xrweb``` component in ```<a-scene>``` which ensures the project opens on all 
platforms (including desktop) and the default environment is disabled.

We then wrap the hider-walls in ```<xrextras-opaque-background remove="true">``` which ensures the
hider-walls are only rendered on AR platforms (mobile + headset).

In components/**responsive-immersive.js**, the ```responsive-immersive``` component checks the 8th Wall Engine's 
```sessionAttributes``` and only adds the tap-to-place portal logic on AR platforms (mobile + headset).

---

#### ```Attribution```

All 3D models were manipulated via modeling & texturing. If you want to use the original models in your experience, download them from the provided links:

[Flag] (https://sketchfab.com/3d-models/animated-flag-3aa23ffa68cb4cbba1acfe983f8f4b4c) by ManySince910, 
[Rocks] (https://sketchfab.com/3d-models/stylized-rocks-92997819b67d47c6bc8d3363e8f45e6b) by carlosbarrera_10, 
[Platform] (https://www.cgtrader.com/free-3d-models/exterior/sci-fi/mecha-platform-design-vol-02-free) by REX-Hsu
