# AR/3D Model Viewer 

This example project shows how to view a model in AR view and a 3D model viewer.

![](https://media.giphy.com/media/PqbvjrcHYzUDlaaQWD/giphy.gif?cid=790b7611546eb137f23a1f87e8bd813056cecda876fb183e&rid=giphy.gif&ct=g)

### Scene Components

```change-scene (/components/change-scene.js)```

- This component when toggled, disables xrweb and initiates orbit mode for 3D model viewing, then re-initiates xrweb and disables orbit mode when toggled to AR mode.

```color-change.js (/components/color-change.js)```

- This component traverses the 3D model and finds a named mesh, then replaces the current mesh color with the correlating button press

### How do I change surface properties of my 3D model?

Please refer to the 3D model Configurator [project] (https://www.8thwall.com/8thwall/configurator-aframe) for more information 

### Attribution

3D model by Lexyc16 https://sketchfab.com/Lexyc16

