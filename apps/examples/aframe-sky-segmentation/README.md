# A-Frame: Sky Effects

This Sky Effects template demonstrates how to implement Sky Effects. It showcases the sky coaching overlay, how to use the `<sky-scene>` to attach assets to the sky segmentation layer, and also how to use the skybox component to replace the sky texture.

![](https://i.imgur.com/O0LaLvb.gif)

For detailed documentation, visit the [Sky Effects docs](https://www.8thwall.com/docs/web/#lightship-vps) 🔗

#### Sky Effects Overview
* components/
  * **sky-debug.js** adds debug UI and configures functionality to swap textures, invert the segmentation mask, and to recenter the sky scene.
  * **sky-arrows.js** adds UI arrows to control the horizontal movement of the Doty model. 
  * **sky-position.js** configures an `<a-entity>` as a pivot point and reparents the attached entity to the new entity in order to position sky content in a spherical scene.
  * **sky-recenter.js** recenters the sky scene automatically when sky is initially detected to ensure that the scene forward direction is the same as where sky was found.
  * **skybox.js** creates an `<a-sky>` and attaches a texture to it to replace the sky texture.
  * **sky-coaching-overlay** configures a sky coaching overlay to instruct users to look towards the sky when they are not looking at it.

* assets/
  * **airship.glb** animated Niantic airship fixed to the world
  * **doty.glb** animated Niantic mascot that can be controlled with sky-arrows
  * **space.png** default space texture that skybox adds to the scene, has an opacity gradient applied to the bottom to help with edge feathering

![](https://i.imgur.com/ZkbvfRn.gif)

### *Developing Sky Effects Experiences*
Sky effects scenes are designed for scenes that exist only in the sky, SLAM + sky effects is currently not supported.

1. In your `<a-scene>` add the xrlayers component
2. In your scene, add a sky scene using `<sky-scene> </sky-scene>`
3. Parent objects under the sky scene to attach them to the sky layer.

Using Components for Sky Effects

* The sky-position component will help you position assets in a spherical manner, it creates a pivot that you offset your object from
and then lets you position the object by rotating the pivot on the x and y axes. You may have to alter the rotation of the object itself depending on where you
are positioning the object. If you want to move the object afterwards, make sure to apply the rotation of the pivot to the object's position first so that movement stays
on the same plane.

* The sky-debug component surfaces some useful API features which include: inverting the sky mask to expose a layer that includes everything that is not sky, swapping
the texture that replaces the sky, and recentering the sky scene.

* The sky-coaching-overlay helps instruct users to find the sky in order to start the sky effects experience.


### *Other Features* 
* Laptop Mode: Sky effects also work on laptop cameras.
* Pin to Camera: Pin sky effects to the camera instead of to the world by nesting the whole `<sky-scene>` within the `<a-camera>` or you can
append the camera to the sky-scene and append specific objects to the camera. 
* Remote Development: Currently, desktop mode doesn't support sky effects, but using a stock image of the sky on a monitor is a good way to test sky experiences
without going outside.
* Sky + SLAM is not supported at the moment so you can't use xrweb with xrlayers.

### About Sky Effects
With Sky Effects for 8th Wall, developers can now turn day into night, stage an AR alien invasion with flying UFOs 
and let users interact with larger than life characters that tower over the city skyline. 
While the sky's the limit in the use of this new feature, Sky Effects are a perfect way to celebrate a new movie release,
take an outdoor concert to the next level and augment a sports game. 
