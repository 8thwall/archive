# Studio: Hello World Effects

This Niantic Studio example allows the user to grow cacti 🌵  by tapping or clicking the ground. Showcases raycasting,
spawning new objects, creating a custom component, and importing a 3D model.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2UybHN6ZDNiNjJ5Z24xNnlnODZocTBxZTF1YTN2OXdhd3E5YjZvZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/j5nqNVm3XWR74ua4wz/giphy.gif)

---

### Project Files

```tap-place.js``` detects clicks on screen and creates a raycaster from the camera towards the ground plane;
it also spawns the selected entity at the raycasted intersection and allows for custom models and primitives.

---

### About World Tracking

Built entirely using standards-compliant JavaScript and WebGL, 8th Wall’s Simultaneous Localization 
and Mapping (SLAM) engine is hyper-optimized for real-time AR on mobile browsers. Features include
Six Degrees of Freedom (6-DoF), Lighting estimation, instant surface detection and responsive scale.

The Y position of the camera at start effectively determines the scale of virtual content on a surface 
(e.g. smaller y, bigger content).

The camera should NOT be at a height (Y) of zero. It must be set to a non-zero value.

---

#### Attribution

Toon Cactus by [PolyChromic](https://skfb.ly/6Xvws)