# A-Frame: Lightship VPS Procedural

Basic scene that uses the `detect-mesh` component to download and position a VPS mesh over any detected VPS Activated Location.
It includes an opacity slider for the mesh and wireframe toggle.

![](https://media.giphy.com/media/lGLoasNVXiQ3r4oI8L/giphy.gif)

For detailed documentation, visit the [Lightship VPS docs](https://www.8thwall.com/docs/web/#lightship-vps) 🔗

#### Lightship VPS Procedural Overview

- **detect-mesh.js** uses the `xrmeshfound` event to localize against any nearby VPS Activated Locations
- **main.css** styling rules for `detect-mesh` scene UI

### About Lightship VPS

https://www.youtube.com/watch?v=PTgtuBrJaOc

With the Lightship Visual Positioning System (VPS) 8th Wall developers now have the power to determine
a user's position and orientation with centimeter-level accuracy - in seconds. Using the 8th Wall platform,
you can use Lightship VPS in your WebAR projects to create location-based web AR experiences that connect
the real world with the digital one. WebAR content can be anchored to locations, enabling virtual objects
to interact with the space they are in. This makes the augmented reality experience feel more personal,
more meaningful, more real, and gives users new reasons to explore the world around them.

Learn how to create your own public Locations and Test Scans in the [docs](https://www.8thwall.com/docs/guides/lightship-vps/#create-new-location).
