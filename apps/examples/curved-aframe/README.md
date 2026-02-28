# A-Frame: Curved Image Targets

This A-Frame example project showcases two curved image targets in a single scene: a cylindrical 
wine label and a conical coffee sleeve.

![](https://media.giphy.com/media/yX1ZDaAUM9lWu1Zkt2/giphy.gif)
![](https://media.giphy.com/media/jYhhF7Vm5WMvnfQkih/giphy.gif)

### Using Curved Image Targets

If you have spent time developing with flat image targets, curved image targets should feel familiar to you.
They add two more image target types: cylindrical and conical. The upload flow for these new target types
includes adding curvature information about the shape your image target is wrapped around. You have the 
flexibility to either input measurements directly or use the sliders to dial the values in without measuring.
You can even test without physical objects by using the target tester and simulator.

If you would like to test this project's image targets on your own curved surfaces, you can print out 
the sample page on either [Letter (8.5" x 11")](https://cdn.8thwall.com/web/assets/curved-target-printable-Letter.pdf) 
or [A4 (210 x 297mm)](https://cdn.8thwall.com/web/assets/curved-target-printable-A4.pdf) paper and cut
out the targets. There's even a ruler (mm) to help you measure circumference with ease!

### Tutorial Video

[![How to Create Flat and Curved Image Targets](https://i.imgur.com/J272chP.jpg)](https://youtu.be/wiga9zGesZY?t=509)

### Curved Image Target Components & Primitives

```<xrextras-named-image-target>``` tracks an image target. Add content inside to copy the 
transforms from the tracked target to its children.

- name: the name of the image target as it appears on the "Image Targets" page

```<xrextras-curved-target-container>``` generates a series of curved meshes that form a portal-like
container that 3D content can be placed inside. The effect works through a combination of "interior"
geometry that is visible to the user and "hider" geometry that blocks rendering outside the 
interior's opening. The generated cylinder proportions match that of the uploaded target curvature. 

- color: The color of the interior geometry (default: #464766)
- height: scale the generated geometry height by this value (default: 1)
- width: scale the generated geometry width by this value (default: 1)

```<xrextras-target-mesh>``` generates a mesh that matches an image target's curvature properties. 
Easy way to create accurate 3D label geometry to use in your scene. You can use an
[A-Frame material](https://aframe.io/docs/1.0.0/components/material.html) to customize.

- material-resource: reference xrextras materials by id. 
Example [here](https://www.8thwall.com/8thwall/face-effects-custom/master/views/scene.html). (optional)
- target-geometry: specify "full" or "label" geometry (default: label)
  - "full" ignores the arc length of the curved target and generates a full open-faced cylinder or cone
  - "label" generates a cylinder or cone that matches the arc length of the full, uploaded image target
- height: scale the generated geometry height by this value (default: 1)
- width: scale the generated geometry width by this value (default: 1)

```<xrextras-target-video-fade>``` automatically fades video in and begins playback (muted only).

- video: the id of the <video> element used for playback
- height: scale the generated geometry height by this value (default: 1)
- width: scale the generated geometry width by this value (default: 1)

```<xrextras-target-video-sound>``` displays a thumbnail image and waits for user tap to begin 
playback (for videos with sound).

- video: the id of the <video> element used for playback
- thumb: the id of the <img> element to serve as a thumbnail (optional)
- height: scale the generated geometry height by this value (default: 1)
- width: scale the generated geometry width by this value (default: 1)

```<xrextras-spin>``` rotates an object around its y-axis.

- speed: sets speed of full spin in milliseconds (default: 2000)
- direction: direction of spin. Options include "normal", "reverse", "alternate"
(default: 'normal')

Check out the source code for these XRExtras components on 
[Github](https://github.com/8thwall/web/blob/master/xrextras/src/aframe/xr-components.js).

#### Attribution

Coffee Bean by [Google Poly](https://poly.google.com/view/7ONZQTx9Tuz)

"BMO the Cat" coffee sleeve logo by Kaci Lambeth

---

Learn more about Curved Image Targets in our 
[documentation](https://www.8thwall.com/docs/web/#image-targets).
