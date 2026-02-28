# A-Frame: Lightship VPS Bespoke

Simple VPS example that uses the `named-location` component to attach content to a Location added to this project from the geospatial browser.

![](https://i.imgur.com/R9dk27h.gif)

#### Lightship VPS Bespoke Overview

- components/
  - **named-location.js** configures an `<a-entity>` to localize against a Project Location by name. Sets animation visible when found.
  - **shadow-shader.js** sets a shadow shader on the attached mesh. Includes polygon offset to avoid z-fighting.
- assets/
  - **california-p-anim.glb** baked physics animation aligned to the Project Location
  - **california-p.glb** Location mesh downloaded from geospatial browser

![](https://i.giphy.com/media/L05xhp8eZbRYMpr94Y/giphy.gif)

### About Lightship VPS

With the Lightship Visual Positioning System (VPS) 8th Wall developers now have the power to determine
a user's position and orientation with centimeter-level accuracy - in seconds. Using the 8th Wall platform,
you can use Lightship VPS in your WebAR projects to create location-based web AR experiences that connect
the real world with the digital one. WebAR content can be anchored to locations, enabling virtual objects
to interact with the space they are in. This makes the augmented reality experience feel more personal,
more meaningful, more real, and gives users new reasons to explore the world around them.

https://www.youtube.com/watch?v=PTgtuBrJaOc https://www.youtube.com/watch?v=laK-QxFLELw

For detailed documentation, visit the [Lightship VPS docs](https://www.8thwall.com/docs/web/#lightship-vps) 🔗
