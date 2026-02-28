# A-Frame: Lightship Maps Theme Collection

This sample project showcases a wide variety of custom and built-in themes for Lightship Maps. 
Change your character and try out different weather effects like rain and snow.
Navigate to any VPS activated Wayspot to open a procedural VPS experience.

![](https://media.giphy.com/media/iXnWHoDJzRHQCBKTJz/giphy.gif)

#### Included Themes

8W Dark8️⃣, Niantic Light🚢, Natural🌳, Vaporwave🐬, Violet Sunset🌅, Bubblegum🫧, Home Run⚾️, Ice❄️ (try with snow️!), Roller Rink🛼, 
Lighttime🏙, Mars🚀, Night Lime🍋(try with rain!), Seaside🐚, Swamp🐊, Newspaper📰, Rust⛽️, Muted🔇, Nighttime🌝, Trails🪴, Arcade🎮

#### Included Weather FX:

Rain🌧, Snow🌨

#### Included Characters:

Captain Doty, [Ready Player Me](https://readyplayer.me/) Avatar, Car

To quickly build custom map themes, check out the [Maps Theme Builder sample project](https://www.8thwall.com/8thwall/maps-builder)!

#### Lightship Maps Theme Collection Overview
* components/
  * **custom-wayspot.js** manages the Wayspot geofence logic
    * `focused-wayspot`: manages which Wayspot is currently selected
    * `custom-wayspot`: component defining how Wayspots look and behave when near them
    * `<custom-wayspot>`: primitive defining how Wayspots look and behave when near them
  * **detect-mesh.js** uses the `xrmeshfound` event to localize against any nearby VPS Activated Wayspot
  * **shaders.js** contains the discoWireframe shader used in the detect-mesh scene
  * **theme-carousel.js** 
    * `theme-carousel`: handles logic for switching themes, weather and characters. Add more custom themes here.
    * `map-loading-screen`: loading screen that dismisses after scene assets have loaded and user location has been acquired
    * `map-debug-controls`: hold down WASD keys (W = North, A = West, S = South, D = East) to change the user position for debugging
      *  distance: how far the map will move in lat/long (default: 0.0001)
* scenes/
  * **detect-mesh.html** uses the detect-mesh component to download and position a VPS mesh over any detected VPS Activated Wayspot. 
  * **theme-carousel.html** Niantic-style map scene with 20 themes, 2 weather effects and 3 characters
* assets/map-assets/
  * skyboxes/ folder of skybox textures used by this project's custom themes
  * **car.glb** simple car 3D model
  * **doty.glb** Niantic's [Captain Doty](https://8w.8thwall.app/welcome/)
  * **poi-disc.glb** nearby Wayspot 3D model
  * **rpm.glb** animated [Ready Player Me](https://readyplayer.me/) model
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
