# A-Frame: Lightship VPS World Explorer

This sample project combines Lightship Maps with Lightship VPS to create a Niantic-style 3D map where
users navigate to any VPS activated Wayspot and open a procedural VPS experience.

![](https://media.giphy.com/media/R6d4OF8hyC8DeDH1IE/giphy.gif)

For detailed documentation, visit the [Lightship VPS docs](https://www.8thwall.com/docs/web/#lightship-vps) 🔗

#### Lightship VPS World Explorer Overview
* components/
  * **custom-wayspot.js** manages the Wayspot geofence logic
    * `focused-wayspot`: manages which wayspot is currently selected
    * `custom-wayspot`: primitive defining how wayspots look and behave when near them
    * `responsive-map-theme`: sets different map themes either based on time of day or device's current light/dark mode.
      *  mode: `time` (default) or `device`. '`time`' sets theme based on user location & time of day using [Sunrise-Sunset.org](https://sunrise-sunset.org/). '`device`' uses device's current light/dark mode.
      *  light-theme: the name of the theme to display during the day or when device is in light mode
      *  dark-theme: the name of the theme to display at night or when device is in dark mode
    * `map-loading-screen`: loading screen that dismisses after scene assets have loaded and user location has been acquired
    * `map-debug-controls`: hold down WASD keys (W = North, A = West, S = South, D = East) to change the user position for debugging
      *  distance: how far the map will move in lat/long (default: 0.0001)
  * **detect-mesh.js** uses the `xrmeshfound` event to localize against any nearby VPS Activated Wayspots
* scenes/
  * **detect-mesh.html** uses the detect-mesh component to download and position a VPS mesh over any detected VPS Activated Wayspot. 
  * **world-map.html** Niantic-style map scene where you walk in the real world to different Wayspots to launch a procedural VPS experience
* assets/map-assets/
  * **doty.glb** Niantic's [Captain Doty](https://8w.8thwall.app/welcome/)
  * **poi-disc.glb** Wayspot 3D model
  * **walk-icon.svg** SVG image of a pedestrian
* modules/
  * **lightship-maps** adds Niantic Lightship Maps to your project

### Using the Niantic Lightship Maps for Web Module

Niantic Lightship Maps for Web provides easy-to-use and customizable real-world maps to build your location-based WebAR experiences. 

Click on the module to read the documentation.

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
