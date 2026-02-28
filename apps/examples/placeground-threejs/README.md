# three.js: Place Ground

This example allows the user to grow trees on the ground by tapping. Showcases raycasting,
creating new objects, and importing a 3D model.

![](https://media.giphy.com/media/1vcbBZMlaZ4KElLnNH/giphy.gif)

### About World Tracking

Built entirely using standards-compliant JavaScript and WebGL, 8th Wall’s Simultaneous Localization 
and Mapping (SLAM) engine is hyper-optimized for real-time AR on mobile browsers. Features include
Six Degrees of Freedom (6-DoF), Lighting estimation, instant surface detection and responsive scale.

The Y position of the camera at start effectively determines the scale of virtual content on a surface 
(e.g. smaller y, bigger content). This can be reset at any time by calling 
[```recenter()```](https://www.8thwall.com/docs/web/#recenter).

The camera should NOT be at a height (Y) of zero. It must be set to a non-zero value.

#### Attribution

Tree by [Google Poly](https://poly.google.com/view/6pwiq7hSrHr)
