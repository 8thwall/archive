# A-Frame: Lightship Maps Theme Builder

Quickly customize and share custom map themes with this sample project. Navigate to any VPS activated Wayspot to open a procedural VPS experience.

![](https://media.giphy.com/media/TlCAvzJdDyrXZ6uehN/giphy.gif)

Customize the colors and parameters for each map feature type using the UI at the bottom. 
Clicking the link 🔗 button copies a custom URL you can share with someone else.
Clicking the `</>` icon copies the theme code to paste in your own project.

Fully customize:
- land color
- building color and height
- park color
- parking lot color
- road color and width
- transit color and width
- sand color
- water color and width (streams, rivers, etc)
- sky color and gradient exponent
- fog color and density
- wayspot color

PRO TIP: try this project on mobile to build themes on the go!

Example: [Theme from Cover Image](https://8thwall.8thwall.app/maps-builder/?theme=%23d687f4,%23f96bc4,%23bff367,%23fe8885,%23dcd953,%23ff918f,%23d2cf52,%2367eeec,%2366eeec,%23ffffff,%23878af0,6,4,8,6,0.65,0.018)

For inspiration, weather FX and more: check out the [Maps Theme Collection sample project](https://www.8thwall.com/8thwall/maps-collection)!

#### Lightship Maps Theme Builder Overview
* components/
  * **custom-wayspot.js** manages the Wayspot geofence logic
    * `custom-wayspot`: component defining how Wayspots look and behave when near them
    * `<custom-wayspot>`: primitive defining how Wayspots look and behave when near them
    * `focused-wayspot`: manages which Wayspot is currently selected
  * **detect-mesh.js** uses the `xrmeshfound` event to localize against any nearby VPS Activated Wayspot
  * **theme-builder.js** uses `xrmeshfound` and `xrmeshupdated` events to localize against any nearby VPS Activated Wayspot
    * `theme-builder`: logic for customizing themes and copying the code/url
    * `map-loading-screen`: loading screen that dismisses after scene assets have loaded and user location has been acquired
    * `map-debug-controls`: hold down WASD keys (W = North, A = West, S = South, D = East) to change the user position for debugging
      *  distance: how far the map will move in lat/long (default: 0.0001)
* scenes/
  * **detect-mesh.html** uses the detect-mesh component to download and position a VPS mesh over any detected VPS Activated Wayspot. 
  * **theme-builder.html** Niantic-style map scene you can fully customize and share. Walk in the real world to different Wayspots to launch a procedural VPS experience.
* assets/map-assets/
  * **doty.glb** Niantic's [Captain Doty](https://8w.8thwall.app/welcome/)
  * **poi-disc.glb** Wayspot 3D model
  * **clouds.jpg** skybox texture
* assets/theme-assets/ folder of svg images used for carousel UI
* modules/
  * **lightship-maps** adds Niantic Lightship Maps to your project

### Using the Niantic Lightship Maps for Web Module

Niantic Lightship Maps for Web provides easy-to-use and customizable real-world maps to build your location-based WebAR experiences. 

Click on the module to read its documentation.

### *Developing Procedural VPS Experiences*

Procedural VPS scenes are designed to use any detected Wayspot (as opposed to specific Project Wayspots). Once detected, the Wayspot's mesh 
is available to you to generate procedurally-generated VPS experiences. This example includes two mesh visualizations: Color with opacity slider and Wireframe.

There are two procedural-related events:
- [xrmeshfound](https://www.8thwall.com/docs/web/#xrmeshfound): emitted when a mesh is first found either after start or after a recenter()
- [xrmeshlost](https://www.8thwall.com/docs/web/#xrmeshlost): emitted when recenter() is called.

After a mesh is detected, the AR engine will continue to track against that mesh until recenter() is called.

### About Lightship VPS

https://www.youtube.com/watch?v=PTgtuBrJaOc

With the Lightship Visual Positioning System (VPS) 8th Wall developers now have the power to determine
a user's position and orientation with centimeter-level accuracy - in seconds. Using the 8th Wall platform, 
you can use Lightship VPS in your WebAR projects to create location-based web AR experiences that connect 
the real world with the digital one. WebAR content can be anchored to locations, enabling virtual objects 
to interact with the space they are in. This makes the augmented reality experience feel more personal, 
more meaningful, more real, and gives users new reasons to explore the world around them.

Learn how to create your own public and private Wayspots in the [docs](https://www.8thwall.com/docs/web/#create-new-wayspot).

For detailed documentation, visit the [Lightship VPS docs](https://www.8thwall.com/docs/web/#lightship-vps) 🔗
