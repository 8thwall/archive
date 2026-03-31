## Reflections Module

![](https://media.giphy.com/media/M7mqsZshiOs5eWP4FX/giphy.gif)

This module adds two components to your project that improve the realism of GLB models in your scene: *reflections* and *xr-light*.

`reflections="type: realtime"` generates a realtime cubemap from the camera feed texture and applies it as an environment map to a glb model.

`reflections="type: static"` generates a static cubemap from a series of image assets and applies it as an environment map to a glb model.

### How to Use

`reflections` applies static and realtime environment cubemaps to your glb models. Its primary parameter is called *type*:

`type: static or realtime (default: 'realtime')`

You may use multiple `"type: static"` or `"type: realtime"` reflections components in your scene. 
By default, `"type: static"` will use a built-in cubemap but you can override this in the
module config or by specifying posx, posy, etc in code.

Example:
```
<a-entity
  gltf-model="#model"
  reflections="type: realtime"
  shadow>
</a-entity>    

<a-entity
  gltf-model="#model"
  reflections="type: static"
  shadow>
</a-entity>    
```

These parameters only affect static cubemaps and will override module config values if set: 
```
posx: url or <img> id 
posy: url or <img> id 
posz: url or <img> id 
negx: url or <img> id 
negy: url or <img> id 
negz: url or <img> id
```

Example:
```
<a-assets>
  <img id="posx-id" src="./assets/cubemap-field/posx.png">
  <img id="posy-id" src="./assets/cubemap-field/posy.png">
  <img id="posz-id" src="./assets/cubemap-field/posz.png">
  <img id="negx-id" src="./assets/cubemap-field/negx.png">
  <img id="negy-id" src="./assets/cubemap-field/negy.png">
  <img id="negz-id" src="./assets/cubemap-field/negz.png">    
</a-assets>

<a-entity
  gltf-model="#model"
  reflections="
    type: static; 
    posx: posx-id;                    // using image id
    posy: https://myimg.com/posy.jpg; // using direct url
    posz: posz-id;
    negx: negx-id;
    negy: negy-id;
    negz: negz-id;" 
  shadow>
</a-entity> 
```

**PRO TIP**: An easy workflow for getting new static cubemaps is downloading an image from [this website](https://polyhaven.com/hdris) (all the images are public domain), 
dropping it into [this website](https://j-zeitler.github.io/cubemap-toastmap-generator/), compressing if necessary, and uploading the output images to a folder in your project.

`xr-light` adjusts a light's intensity value to best match the camera feed. This is often referred to as "light estimation".
```
min: minimum light intensity (default: 0)
max: maximum light intensity (default: 2)
```

Learn more in our [documentation](https://www.8thwall.com/docs/web/#xr8xrcontrollerpipelinemodule).

### Videos

https://youtu.be/H-f40M2Ap_g

https://youtu.be/wZzwWfEdNNU?t=195
