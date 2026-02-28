# A-Frame: Absolute Scale Model Configurator

This project template demonstrates how to implement Absolute Scale. Showcases coaching overlay, changing surface properties of a 3D model, proximity triggers, and hotspots.

![](https://media.giphy.com/media/es6sabqB0HMnDdNoSk/giphy.gif)

### Using Absolute Scale

With R19, 8th Wall introduced a new capability to our already powerful SLAM system — Absolute Scale. Absolute Scale brings interactive, cross-platform, real-world scale AR to the web. 

In **body.html**, we add the ```"scale: absolute"``` parameter to our ```xrweb``` component in ```<a-scene>``` 
which ensures the project utilizes Absolute Scale instead of the default Responsive Scale. 

Setting the scale to “absolute” will dynamically set the virtual camera height to the actual height of the device camera. 
To estimate scale, the 8th Wall Engine needs data to determine the height of the camera, this requires users to move their device to generate data for determining scale. 
To guide your user through this flow, we have created a new pipeline module called Coaching Overlay which can easily be added to your project.

In **head.html**, we add the ```<meta name="8thwall:package" content="@8thwall.coaching-overlay">``` meta tag which makes the coaching overlay module available to the project.
Then in **body.html**, we add the ```"coaching-overlay``` component to our ```<a-scene>```. 

Full details on configuration and customization options for the coaching overlay are available in the [docs](https://www.8thwall.com/docs/web). 

---
### Tutorial Video
https://www.youtube.com/watch?v=Dw1Ds4X6IdU

---

### Scene Components

```color-change``` (*/js/components.js*)

Creates a button carousel that changes the color of the car when clicked. Also supports animated custom textures!

```annotation``` (*/js/components.js*)

Generates labels and handles proximity behavior for hotspots.

- text: text the label displays (default: '')
- labeldistance: distance to element before label appears (default: 1)
- hsdistance: distance to element before hotspot appears (default: 2.85)
- offsetY: y offset of label from hotspot (default: 0.1)

```absolute-pinch-scale``` (*/js/components.js*)

Modified version of `xrextras-pinch-scale` that displays a percentage above and below 100%. Useful for absolute scale.

- min: smallest multiplier the user can scale the model (default: 0.1)
- max: largest multiplier the user can scale the model (default: 5)
- scale: If scale is set to zero here, the object's initial scale is used (default: 0)

```proximity``` (*/js/components.js*)

Manages proximity behavior of the car's window animations.

- target: id of the object to check proximity on (default: 'camera')
- distance: distance to object before trigger (default: 3.5)

```gltf-morph``` (*/js/components.js*)

Sets morph targets (blend shapes) on the model.

- morphtarget: name of morph target (default: '')
- value: morph target value (default: '0')

```ignore-raycast``` (*/js/components.js*)

Prevents raycasts from intersecting the attached model. Dramatically improves perf in VR for complex models.

```responsive-immersive``` (*/js/responsive-immersive.js*)

This component separates behavior by device category using 8th Wall Engine `sessionAttributes`.

```xrextras-pinch-scale``` (*from xrextras*)

To change scale:
- Mobile and VR/AR hands: pinch in or out with fingers.
- Desktop: scroll in or out with mouse/trackpad.
- VR Controllers: squeeze triggers and pull apart with arms.

```xrextras-hold-drag``` (*from xrextras*)

Click/tap + drag object to move it across the ground.

```xrextras-two-finger-rotate``` (*from xrextras*)

To rotate object:
- Mobile and VR/AR hands: drag two fingers horizontally across screen.
- Desktop: hold option key while click + dragging mouse.
- VR Controllers: squeeze triggers and drag horizontally.

---

### Optimizing for Metaversal Deployment

With R18, the all-new 8th Wall Engine features Metaversal Deployment, enabling you to create WebAR experiences once and deploy them to smartphones, tablets, computers and both AR and VR headsets. This project has a few platform-specific customizations:

In **body.html**, we add the ```"allowedDevices: any"``` parameter to our ```xrweb``` component in ```<a-scene>``` 
which ensures the project opens on all platforms, including desktop. By default, this is ```mobile-and-headsets```.
The ```responsive-immersive``` component is also added to the ```<a-scene>``` which handles custom platform-specific logic.

In js/**responsive-immersive.js**, the ```responsive-immersive``` component checks the 8th Wall Engine's 
```sessionAttributes``` then uses ```cubemap-static``` on VR/Desktop and ```cubemap-realtime```
on mobile AR. It also resizes the car on non-mobile platforms.

---

### About GLB Models

#### ```What surface properties can I change?```

This depends on the 3D software the model was originally modeled in and or how it was converted if downloaded from online. 

Our best suggestion is to either build your 3D models in blender and or upload them to blender, add a Blender material (if material information isn't already present) and export as a .glb file. 
You can then edit surface properties via code such as color, roughness, metalness, transmission, etc.

![](https://cdn.8thwall.com/web/img/readme/surface-material.jpg)

#### ```Naming Conventions```

When traversing to a specific surface material the best route is to select the specified 3D model mesh via javascript. 

For this example, in the color-change.js file we getobject3D('mesh').getObjectByName('Car') as shown in the image below. We have named the specified mesh within the Blender mdoel, 
'Car' which is the mesh specifically for the cars exterior/paint. Then we traverse to the material.color and change this to the desired color.

NOTE: WHEN GRABBING A MESH NAME, ANY PERIOD USED IN THE NAMING CONVENTION IS IGNORED BY THREE.JS, AS AN EXAMPLE A MESH NAMED "CAR.001" IN BLENDER WOULD BE GRABBED VIA THE NAME "CAR001" INSTEAD

![](https://cdn.8thwall.com/web/img/readme/blender-naming.jpg)

#### ```Checking to see how your model looks```

We suggest using dommccurdy's 3D model viewer [here] (https://gltf-viewer.donmccurdy.com/) to compare how your model will look within the 8th Wall Project. 

Make sure to include either realtime and or static cubemaps to your project to get a more realistic experience. Here is a view of the car model used in this project.

![](https://i.imgur.com/seAkpxR.jpeg)

---

### ```Attribution```

Model by Xlay3D https://skfb.ly/onCrI
