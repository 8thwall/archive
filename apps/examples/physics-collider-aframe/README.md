# A-Frame: Physics Collider

This example project shows how to implement physics and colliders in your WebAR experience. 

![](https://media.giphy.com/media/vsT5WolBHGgiWn675B/giphy.gif)

### A-Frame Physics

Take a look at the A-Frame Physics documentation [here](https://github.com/n5ro/aframe-physics-system).

A-Frame Physics currently defaults to CANNON.js but this may be deprecated in the future. 
This example project uses [Ammo.js](https://github.com/kripken/ammo.js/) which A-Frame Physics 
supports when using the `driver: ammo` parameter. Take a look at the Ammo.js documentation 
[here](https://github.com/n5ro/aframe-physics-system/blob/master/AmmoDriver.md).

### gltf-physics-object component

This project uses the `gltf-physics-object` component to add physics `ammo-body` (dynamic, static, kinematic) 
and `ammo-shape` (box, cylinder, sphere, capsule, cone, hull) to a .glb model (example: bowling pins).

You can add `ammo-body` and `ammo-shape` to A-Frame geometry primitives without this component (example: soccer ball model & ground plane).

---

### Optimizing for Metaversal Deployment

With R18, the all-new 8th Wall Engine features Metaversal Deployment, enabling you to create WebAR experiences once and deploy them to smartphones, tablets, computers and both AR and VR headsets. This project has a few platform-specific customizations:

In **body.html**, we add the ```"allowedDevices: any"``` parameter to our ```xrweb``` component in ```<a-scene>``` 
which ensures the project opens on all platforms, including desktop. The ```responsive-immersive``` component 
is also added to the ```<a-scene>``` which handles custom platform-specific logic. Environment parameters 
have been customized to generate an open grassy field.

In js/**responsive-immersive.js**, the ```responsive-immersive``` component checks the 8th Wall Engine's 
```sessionAttributes``` then changes the prompt language, CSS and glove position to match the detected platform. 

---

#### Attribution 

[Boxing Glove](https://skfb.ly/6YPXK) by Pedro Perim
