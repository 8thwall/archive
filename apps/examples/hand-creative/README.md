# A-Frame: Hand/Wrist/Finger Tracking Beta

Get started with 8th Wall Hand/Wrist/Finger Tracking! This A-Frame beta project attaches a watch and ring to the hand, creates a purple hand mesh,
 and uses hider-material to create a hand occluder.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjU3MTRkYWUyYThlYmJjNDEzOTIyNDJiMDZjOWZjNjViNTE2NWMxMiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/5fn0JYVZ6f99j93MOP/giphy-downsized-large.gif)

### Hand Components & Primitives

```xrhand``` is required in your ```<a-scene>``` for hand/wrist/finger tracking.

- cameraDirection: Desired camera to use. Choose from: 'back' or 'front'. (default: back)
- allowedDevices: Supported device classes. Choose from: 'mobile' or 'any'. Use 'any' to enable 
laptop- or desktop-type devices with built-in or attached webcams. (default: mobile)

```<xrextras-handanchor>``` inherits the detected hand transforms. Entities inside will move with 
the hand.

```xrextras-hider-material``` is applied to any mesh or primitive that you would like to be 
transparent while blocking the rendering of models behind it. In the scene, this is applied to the
hand occluder mesh.

```<xrextras-hand-mesh>``` generates a hand mesh in your scene.

```<xrextras-hand-attachment>``` inherits the detected attachment point transforms. Entities inside
will move with the assigned attachment point.  

- point: name of attachment point.

Attachment points include: 
* wrist
* ringMcp

---  
Learn more about Hand/Fingers/Wrist Tracking in our [beta documentation](https://docs.google.com/document/d/1WkZfSFypczLYBnIU0Gdq_Uoyy6fj_ptseFTaXuVOGLM/edit?usp=sharing).

### Reference Assets
Feel free to use these reference images to create your own attachment points using vertex indices on the `xrextras-hand-mesh` ([helpful thread](https://discourse.threejs.org/t/how-can-we-get-world-position-of-a-vertex/13275)).  
To reference the indices in higher quality, download the hand model (`handModel.glb`) from the sidebar to reference the vertex indices in your 3D modeling software ([display vertex indices in blender](https://devtalk.blender.org/t/how-to-enable-the-vertex-indices-overlay-over-each-vertex/15491/6)).  

![](https://i.imgur.com/NKX39SD.png)
![](https://i.imgur.com/vQ2qQ0b.png)
![](https://i.imgur.com/nn6h8o6.png)
![](https://i.imgur.com/rmRXNSv.png)
![](https://i.imgur.com/wSTYXre.png)
![](https://i.imgur.com/gdL29mH.png)
