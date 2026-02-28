# three.js: Sky Effects

This Sky Effects template demonstrates how to implement Sky Effects. It showcases the sky coaching overlay, how to attach assets to the sky segmentation layer, and also how to use the skybox component to replace the sky texture.

![](https://i.imgur.com/O0LaLvb.gif)

For detailed documentation, visit the [Sky Effects docs](https://www.8thwall.com/docs/web/#xr8layerscontroller) 🔗

#### Sky Effects Overview
* components
  * **sky-scene-pipeline-module.js - line 31 | sky debug mode** configures sky debug functionality to swap textures, invert the segmentation mask, and to recenter the sky scene.
  * **sky-scene-pipeline-module.js - line 123 | skybox** creates a sphere/sky dome and attaches a texture to it to replace the sky texture.
  * **sky-scene-pipeline-module.js - line 155 | sky positioning** configures an `THREE.Group` as a pivot point and adds objects to it in order to position sky content in a spherical scene.
  * **sky-scene-pipeline-module.js - line 245 | sky recenter** recenters the sky scene automatically when sky is initially detected to ensure that the scene forward direction is the same as where sky was found.
  * **sky-coaching overlay** configures a sky coaching overlay to instruct users to look towards the sky when they are not looking at it.

* assets/sky-models/
  * **airship.glb** animated Niantic airship fixed to the world
  * **doty.glb** animated Niantic mascot that can be controlled with arrows-pipeline-module
* assets/sky-textures/
  * **space.png** default space texture that skybox adds to the scene, has an opacity gradient applied to the bottom to help with edge feathering
* assets/UI/
  * **invertMask.svg** used by the `sky-debug` component as the icon for the Invert button
  * **recenter.svg** used by the `sky-debug` component as the icon for the Reset button
  * **swapTexture.svg** used by the `sky-debug` component as the icon for the Swap button
  * **triangle.svg** used by the `sky-arrows` component as the icon for the arrows

![](https://i.imgur.com/ZkbvfRn.gif)

### *Developing Sky Effects Experiences*
Sky effects scenes are designed for scenes that exist only in the sky, SLAM + sky effects is currently not supported.

1. In your app.js add `XR8.LayersController.configure({layers: {sky: {invertLayerMask: false}}})` and  `XR8.Threejs.configure({layerScenes: ['sky']})`
2. After you've made a scene pipeline module, in the `return` add `const {layerScenes, camera, renderer} = XR8.Threejs.xrScene()` and `initSkyScene({scene: layerScenes.sky.scene, camera, renderer})`
3. After configuring the camera in your scene, sync the xr controller's 6DoF position and camera paremeters with our scene. Using:
```
      XR8.LayersController.configure({
        coordinates: {
          origin: {
            position: camera.position,
            rotation: camera.quaternion,
          },
        },
      })
```

Using Components for Sky Effects

* The sky positioning component will help you position assets in the spherical manner, it creates a pivot that you offset your object from
and then lets you position the object by rotating the pivot on the x and y axes. You may have to alter the rotation of the object itself depending on where you
are positioning the object. If you want to move the object afterwards, make sure to apply the rotation of the pivot to the object's position first so that movement stays
on the same plane.

* Sky Debug Mode surfaces some useful API features which include: inverting the sky mask to expose a layer that includes everything that is not sky, swapping
the texture that replaces the sky, and recentering the sky scene. Toggle it to true/false on line 31 of `sky-scene-pipeline-module.js`

* The sky-coaching-overlay helps instruct users to find the sky in order to start the sky effects experience, you can add it to your scene with `SkyCoachingOverlay.pipelineModule()`


### *Other Features* 
* Laptop Mode: Sky effects also work on laptop cameras.
* Pin to Camera: Pin to Camera is not supported in three.js currently, but is supported in A-Frame.
* Remote Development: Currently, only A-frame Sky Effects has desktop development, but using a stock image of the sky ([example](https://wallpapercave.com/wp/wp2894344.jpg)) on a monitor is a good way to test sky experiences
without going outside.

### About Sky Effects

With Sky Effects for 8th Wall, developers can now turn day into night, stage an AR alien invasion with flying UFOs 
and let users interact with larger than life characters that tower over the city skyline. 
While the sky's the limit in the use of this new feature, Sky Effects are a perfect way to celebrate a new movie release,
take an outdoor concert to the next level and augment a sports game.