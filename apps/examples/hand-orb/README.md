# three.js: Hand/Wrist/Finger Tracking Beta

Get started with 8th Wall Hand/Wrist/Finger Tracking! This three.js example places a cube on the palm and uses hider-material to create a hand occluder.
 

### Project Files

```hand-scene.js```

```run-hand-pipeline.js``` runs all the pipeline modules and provides a place to inject HTML before
the scene loads.

Attachment point data is provided in the ```attachmentPoints``` field of ```event.detail```.

View all available attachment points in the [documentation](https://8thwall.com/docs).

```XR8.HandController```

- coordinates: { mirroredDisplay: bool } If true, flips camera feed horizontally in the output.


### Reference Assets

Feel free to use these reference images to create your own attachment points using vertex indices hand mesh ([helpful thread](https://discourse.threejs.org/t/how-can-we-get-world-position-of-a-vertex/13275)).  
To reference the indices in higher quality, download the hand model (`handModel.glb`) from the sidebar to reference the vertex indices in your 3D modeling software ([display vertex indices in blender](https://devtalk.blender.org/t/how-to-enable-the-vertex-indices-overlay-over-each-vertex/15491/6)).  

![](https://i.imgur.com/NKX39SD.png)
![](https://i.imgur.com/vQ2qQ0b.png)
![](https://i.imgur.com/nn6h8o6.png)
![](https://i.imgur.com/rmRXNSv.png)
![](https://i.imgur.com/wSTYXre.png)
![](https://i.imgur.com/gdL29mH.png)