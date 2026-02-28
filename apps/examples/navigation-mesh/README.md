# A-Frame: Navigation Mesh

This example showcases how to create and import a navigation mesh into your WebAR project for a character to navigate on with the joystick component.

![](https://media.giphy.com/media/ooP8RM5J6DUgrHPIJf/giphy-downsized-large.gif)

The nav-mesh 3d model is a single mesh that constrains the character within its boundaries.
This mesh is set to visible=false within the scene so that you do not see the mesh itself. 

The environment 3d model doesn't include any logic of the navigation mesh, but instead is what is rendered within the experience.

The environment and nav-mesh were built and created using [Blender] (https://www.blender.org/)

A good workflow is to create your 3D environment and then build the nav-mesh on top of your final environment. 
Then export both the nav-mesh and 3D enviornment as TWO seperate files and import them into the project.

Please reference the photos in the readme-images folder along with the models within the project to better understand how the nav-mesh works.

![](https://i.imgur.com/SIjGYpS.png) 

![](https://i.imgur.com/mVGeESS.png) 

![](https://i.imgur.com/yRm5aRJ.png)

#### Attribution

[Navigation Mesh Component](https://github.com/AdaRoseCannon/aframe-xr-boilerplate)

[Robot 3D Model](https://threejs.org/examples/?q=morph#webgl_animation_skinning_morph)

[Platformer Kit] (https://kenney.nl/assets/platformer-kit)
