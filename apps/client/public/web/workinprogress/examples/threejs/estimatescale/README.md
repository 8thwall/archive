# 8th Wall Web Examples - three.js - Estimate Scale

This interactive example demonstrates enabling scale estimation to allow the user to place
onto the tracked ground surface spheres the size of golf balls or rectangles the size of letter paper.

![estimatescale-threejs-screenshot](../../../images/screenshot-estimatescale.jpg)

[Try the live demo here](https://apps.8thwall.com/8thWall/threejs_estimatescale)

## Overview

Scaling the coordinate system to meters requires the user to slowly move their device side-to-side until 
an estimate for scale has been obtained, at which point a ground plane is placed at the tracking surface.
If the user taps on on the screen a THREE.Raycaster() is used to determine the intersection with this ground
plane and a golf ball or a letter paper sized rectangle is placed at that location.

