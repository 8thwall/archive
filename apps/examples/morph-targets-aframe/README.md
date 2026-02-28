# A-Frame: Morph Targets

This project showcases how to set and animate morph targets (blend shapes) on a model while also
transitioning through animation states.

![](https://media.giphy.com/media/QX7F1PvMkotxkWpx4H/giphy.gif)

It uses the [glTF Morph Component](https://github.com/elbobo/aframe-gltf-morph-component) and 
[animation-mixer Component](https://github.com/donmccurdy/aframe-extras/tree/master/src/loaders#animation).

It also includes 'morph-target-drag.js' which works with xr-extras-gesture-detector to lift the
robot up and drag it around with your finger.

```xrextras-attach``` copies the position of a target entity to its entity. In this example, it
keeps the light above the robot at all times so it doesn't lose its shadow. Source 
[here](https://github.com/8thwall/web/blob/master/xrextras/src/aframe/xr-components.js#L519).
- target: the id of the <a-entity> element to copy position from
- offset: the relative offset from the target element (default: 0 0 0)

#### Attribution

[Robot](https://threejs.org/examples/?q=morph#webgl_animation_skinning_morph)
