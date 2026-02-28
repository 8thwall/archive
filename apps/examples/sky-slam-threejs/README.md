# three.js: Sky Effects + World Tracking

This three.js Sky Effects + World Tracking sample project showcases a modified sky coaching overlay, explains how to attach assets to the sky and world scenes, 
and illustrates how to transition assets from one scene to another.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDc2OTM1ZjQyYTM5ZDdiYzc1MmNkZTA3OGVmY2IyOTE4MjEzODg0YSZjdD1n/qzqytGGAkfGMHWDsaR/giphy-downsized-large.gif)

For detailed documentation, visit the [Sky Effects + World Tracking Docs](https://www.8thwall.com/docs/api/layerscontroller/) 🔗 

#### Sky Effects + World Tracking Overview
* assets/models/
  * **balloon.glb** low-poly hot air balloon
* assets/textures/
  * **foreground.svg** used by the `sky-remote-authoring` componenent to mimic foreground objects such as buildings and textures
  * **ground.svg** used by the `sky-remote-authoring` component to attach a grid-style texture to the ground

### *Developing Sky Effects + World Tracking Experiences*
Sky effects + World Tracking is designed for scenes that incorporate Sky Segmentation and SLAM.

1. In your `app.js` add `XR8.LayersController.pipelineModule(),` and  `XR8.Threejs.configure({layerScenes: ['sky']})` to enable Sky Effects
2. In your `app.js` add `XR8.XrController.pipelineModule(),` to enable World Tracking
3. In your custom scene pipeline module, in the `return` add `const {scene, layerScenes, camera, renderer} = XR8.Threejs.xrScene()` and use `layerScenes.sky.scene` to retrieve the Sky and World scenes.
4. After configuring the camera in your scene, sync the xr layer controller's 6DoF position and camera paremeters with our scene. Using:
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
5. After configuring the camera in your scene, sync the xr controller's 6DoF position and camera paremeters with our scene. Using:
```
    XR8.XrController.updateCameraProjectionMatrix({
        origin: camera.position,
        facing: camera.quaternion,
      })
```

Using Components for Sky Effects
* The sky-coaching-overlay helps instruct users to find the sky in order to start the sky effects experience, you can add it to your scene with `SkyCoachingOverlay.pipelineModule()`
* Transition objects from the Sky scene to the World scene by using `scene.add(object)` or `layerScenes.sky.scene.add(object)` to reparent objects.

### *Best Practices & Tips* 
* Ensure that there is a focal point within the sky scene so the user isn't overwhelmed by the contents; it's also helpful to create a leading line to guide your user's eyes using the motion of objects that transition from one scene to another.
* Ensure that lighting is the same between the sky Scene and the world Scene. You will have to have the same number of lights in both scenes to ensure that objects look the same when transitioned from one to the other.
* RGB Encoding is currently not supported in Sky Effects + World Tracking, we reccomend not setting `renderer.outputEncoding = THREE.sRGBEncoding` to ensure consistent colors between both scenes.
* Ensure the z value of the transition point is less than 0 when transitioning from the sky scene to the world scene; if not, the object will appear behind you in the world scene once it has transitioned out of the sky scene.
* Ensure the y value of the transition point is a higher value if you are unsure of where your users will be opening the experience, if not, objects can appear to "clip" through the foreground as they transition from one scene to another.
* When animating models for the scene transition, either use a component like TWEEN and set explicit animations before and after the transition, or bake an animation within a GLB model and play it before you transition the asset.
* Use the `edgeSmoothness` property of the `XR8.LayersController.pipelineModule()` to feather the segmentation mask so that the edge between sky and not sky is more natural.
* Use the `invertLayerMask` property of the `XR8.LayersController.pipelineModule()` to overlay everything but sky pixels within the sky scene.
* Additive and other Advanced Blending modes are currently not supported in the Sky scene; instead, you can use a video texture with a lighter background, transparency, and with a lower opacity.

### About Sky Effects + World Tracking
Sky Effects brings Niantic’s Sky Segmentation technology to the browser to identify and segment the sky, 
creating a canvas for AR content or for you to replace completely. 

World Tracking (sometimes referred to as World Effects) is the act of building the map or scene in front of the camera and relocalizing as the user moves. 
It is what allows for AR on the “Ground.” It is powered by 8th Wall’s proprietary SLAM engine, \
which is the first SLAM engine built for the web and optimized for real-time interaction in the browser. 
When launched, it helps a user quickly understand the scene by building a machine-readable representation of the physical world. 
It finds the flat plane, accounts for realistic lighting, and localizes / relocalizes the users. 

8th Wall developers can now simultaneously use Sky Effects + World Tracking, two powerful AR features, 
to fully augment the scene and create immersive, fantastical AR experiences - a first for any platform. 

### Asset Attribution
- Hot air balloon by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza] (https://poly.pizza/m/8azSIUgP0ow)