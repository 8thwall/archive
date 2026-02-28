# three.js: Hand Tracking Template

Get started with 8th Wall Hand Tracking! This three.js template places a cube on the palm and uses a
hider material to create a hand occluder.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWR6M3JocWZsd2dtcHJzcTd1eHB4YjJ2MXB6enlwaDJ4ZzI2OHQzNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oBGB62G3nGTKTCCjGt/giphy.gif)

### Project Files

`app.js` runs all the pipeline modules and provides a place to inject HTML before the scene loads.

`threejs-scene-init` builds a pipeline module that initializes and updates the three.js scene based
on handcontroller events.

`XR8.HandController`

- coordinates: { mirroredDisplay: bool } If true, flips camera feed horizontally in the output.

`XR8.run`

- cameraConfig: { direction } Sets device front or rear facing camera.
  XR8.XrConfig.camera().FRONT or BACK

- allowedDevices: Sets which device types supported, mobile only or all devices (including desktop)
  XR8.XrConfig.device().ANY or MOBILE

Attachment point data is provided in the `attachmentPoints` field of `event.detail`.  
![](https://imgur.com/8iQ3gtQ.png) ![](https://imgur.com/s9u0Ti6.png)

Attachment points include:

- wrist
- palm 


- pinkyBaseJoint
- pinkyLower
- pinkyMidJoint
- pinkyUpper
- pinkyTopJoint
- pinkyNail
- pinkyTip


- ringBaseJoint
- ringLower
- ringMidJoint
- ringUpper
- ringTopJoint
- ringNail
- ringTip


- middleBaseJoint
- middleLower
- middleMidJoint
- middleUpper
- middleTopJoint
- middleNail
- middleTip


- indexBaseJoint
- indexLower
- indexMidJoint
- indexUpper
- indexTopJoint
- indexNail
- indexTip


- thumbBaseJoint
- thumbMidJoint
- thumbUpper
- thumbTopJoint
- thumbNail
- thumbTip

### Hand Tracking Events
`handcontroller.handloading`
- maxDetections: The maximum number of hands that can be simultaneously processed. (Currently limited to 1)
- pointsPerDetection: Number of vertices that will be extracted per hand.
- rightIndices: Indexes into the vertices array that form the triangles of the right hand mesh. {a,b,c}
- leftIndices: Indexes into the vertices array that form the triangles of the right hand mesh. {a,b,c}

`handcontroller.handscanning`
- same as `xrhandloading`
 
`handcontroller.handfound`
- id: A numerical id of the located hand. (always 1 as we don't support multi-hand)
- transform: Transformation information of the located hand.
  - position: The 3d position of the located hand.
  - rotation: The 3d local orientation of the located hand.
  - scale: A scale factor that should be applied to objects attached to this hand. (default: 1,1,1)
- vertices: Position of hand points, relative to transform.
- normals: Normal direction of vertices, relative to transform.
- handKind: Returns whether it's a left (1) or right (2) hand in camera view.
- attachmentPoints: See above for a list of available attachment points. Position is relative to the transform.
  - name
  - position {x,y,z}
  - innerPoint {x,y,z}
  - outerPoint {x,y,z}
  - radius (meters) | not available on wrist or palm
  - minorRadius (meters) | wrist only
  - majorRadius (meters) | wrist only

`handcontroller.handupdated`
- same as `xrhandfound`

`handcontroller.handlost`
- id: A numerical id of the hand that was lost. (always 1 as we don't support multi-hand)

### Hand Tracking Best Practices & Tips
- The hand coordinate system is based on a global right-handed coordinate system, with the fingers pointing up and the palm facing the user. 
  - The positive Z-axis (Z+) extends outward from the palm of the hand.
  - The positive Y-axis (Y+) extends upward, aligned with the direction of the fingers, towards the fingertips.
  - The positive X-axis (X+) extends towards the thumb on the right hand and towards the pinky on the left hand.  
![](https://imgur.com/CNZvm5m.png)
- Because the X axis is global, to ensure objects and animations appear in the same positions on both hands, mirror them along the X-axis using the `handKind` parameter.
- Because the 3D scene is the size of the hand, objects will have to be scaled down much more than world-tracking scenes.
- Currently, hand tracking only supports one hand at a time and will not detect multiple pairs of hands.
- Hand tracking does not work with any of our other features, including, but not limited to, world effects, face effects, and image targets.
- Include a hand mesh for easier debugging in order to see if objects look off because of the tracking quality or your code.
- Because our attachment points approximate rotation and position, you may have to tweak the values slightly to get the best fit.
    - a good example is rotating rings slightly forward in the Z+ direction so that the underside of the ring doesn't show, adding to realism.
- Ideal hand tracking quality is achieved when the whole hand and wrist are in camera view, adding instructions or coaching overlays to help your user understand this can lead to a better experience.
- It is recommended to test your application on desktop and various devices. This ensures a more realistic understanding of the user experience and helps identify potential variations in tracking performance across different platforms.
- Because our tracking is based off the upper half of the wrist, our algorithm doesn't have an understanding of when your hand is parallel to your arm. This can lead to unwanted rotational behaviour when the user tilts their wrist up and down.
    - Some solutions can include onboarding instructions to keep your hand parallel with your arm or telling users to place their arm on a flat surface for the best experience.
- Our hand tracking has relative scale, meaning objects in the 3D scene will automatically scale up and down based on the detected hand size.
- Our tracking has a hard time with the vertical sides of hands (karate chop), keep the majority of your experiences based on the palm or back of hand for the best tracking quality.
- Create custom gestures by measuring the distances between our out-of-the-box attachment points or making your own attachment points with the reference vertices below.
- Don't limit yourself to attaching objects onto the hand or changing the hand texture, you can also use the user's hand as an input controller used to control scene entities or interactions.

Learn more about Hand Tracking in our [documentation](https://www.8thwall.com/docs/api/handcontroller/).

---
### Reference Assets

Feel free to use these reference images to create your own attachment points using vertex indices on the hand mesh ([helpful thread](https://discourse.threejs.org/t/how-can-we-get-world-position-of-a-vertex/13275)).  
To reference the indices in higher quality, download the hand model (`handReference.glb`) from the sidebar to reference the vertex indices in your 3D modeling software ([display vertex indices in blender](https://devtalk.blender.org/t/how-to-enable-the-vertex-indices-overlay-over-each-vertex/15491/6)).

![](https://i.imgur.com/NKX39SD.png)
![](https://i.imgur.com/vQ2qQ0b.png)
![](https://i.imgur.com/nn6h8o6.png)
![](https://i.imgur.com/rmRXNSv.png)
![](https://i.imgur.com/wSTYXre.png)
![](https://i.imgur.com/gdL29mH.png)



