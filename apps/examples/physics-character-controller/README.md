# A-Frame: Physics Character Controller Project

This project provides a physics based character controller for A-Frame using the ammo.js physics engine. 
The controller features a joystick for movement and a button for jumping functionality, complete with accompanying animations.

More information about the physics engine can be found in the [Ammo.js Docs](https://www.8thwall.com/docs/web/#lightship-vps) 🔗

![](https://media.giphy.com/media/JE1GMu6aqxetePwoAs/giphy.gif)

### Features

**Joystick-based character movement:** Drag the on-screen joystick to move the character.

**Jump functionality:** Tap the 'A' button or left side of the screen (for desktop use space key) to make the character jump.

**Dynamic animations:** The character animates based on the current state (IDLE, RUNNING, JUMPUP, FALL, LAND). 

**Physics bodies:** Easily assign dynamic, kinematic, and static physics properties to GLB models.

![](https://media.giphy.com/media/hGEKGUvgsNq3duFACf/giphy.gif)

### Physics Character Controller Overview

* files/
  * **character-joystick.js** logic for velocity to enable character movement and checks for animation states. 
  * **character-jump.js** logic for adding upwards velocity to character when jumping.
  * **glb-physics-object.js** logic for adding physics body to a .glb entity in your scene. (For A-frame primitives you can use default ammo.js implemntation) 
  * **responsive-immersive** logic for adding camera as child of character if openend on desktop 3D.
* assets/
  * **character-model.glb** 3D model of character with all baked animations (IDLE, RUNNING, JUMPUP, FALL, LAND) please reference model in viewer for animations.
  * **level-design.glb** 3D model of static level environment.
  * **black-box.glb** 3D model of kinematic game object which are then animated dynamically in the scene as moving platforms.
  * **green-box.glb** 3D model of dynamic game object which the character can interact with and push around

### Development & Debug Suggestions

* For faster development it's advisable to use Desktop mode for debugging and open the experience in a seperate desktop 3D preview window. **xrweb="allowedDevices: any"**

* To visualize the physics debug mode simply set **debug: false** to **debug: true** in your **<a-scene>**. For example setting **physics="driver: ammo; debug: true; gravity: 0, -28, 0"**. 
This can be very helpful when trying to understand and visualize the physics shapes of objects in your scene. More information in [Ammo.js Docs](https://www.8thwall.com/docs/web/#lightship-vps) 🔗

*  When using the A-frame inspector for positioning or inspecting entities in the scene (when you don't need to debug UI elements) it's advisable to comment out all user interface elements, such as lines 1-12 in the current scene. 
This ensures proper interaction with the A-frame inspector debug camera. More information about the inspector here [Visual Inspector Docs](https://www.8thwall.com/docs/web/#lightship-vps) 🔗

*  To adjust the size of the character, it's advisable to modify the y-value of the camera to change the scene scale, rather than directly scaling the character. When you scale the character itself, its physics calculations remain unchanged and don't adjust proportionally.
If you must scale the character, ensure you also adjust the **forceMagnitude** and **decelerationFactor** schema values in the character-joystick.js file using the same scale ratio. The same principle applies to **jumpPower** and **gravity** in the character.jump.js script.

![](https://media.giphy.com/media/NIyIWEEPdZlNlG0SHr/giphy.gif)

### Project Tips

Add **class="ground"** to any entities in your scene you want the character to be able to interact with and jump off of. The jump raycast (which is a child of the character) checks for this class.

When exporting a 3D .glb model intended for dynamic or kinematic physics interactions from a 3D modeling software, ensure the center of the model is positioned at coordinates (0, 0, 0). Then you can position the object in your A-frame scene accordingly.
Additionally, before exporting, confirm that all rotation, scale, and position data for the model have been applied. 
Failing to do so may result in improper ammo-body settings for .glb models. Blender is a great 3D software to use for this.

![](https://media.giphy.com/media/xetiYIj6NyG8CFppwa/giphy.gif)

### Replacing Character 3D Model and Animations

To replace the **character-model** in the project, ensure you have animations named IDLE, RUNNING, JUMPUP, FALL, and LAND, as these are referenced directly in the code.
If you prefer a different naming convention for the animations, you can adjust the code accordingly.

You can view the animations in the 8th Wall viewer under the **character-model.glb** under ./assets folder. These animations were sourced from Mixamo (A free online character auto-rigging tool), which you are also free to utilize.
When exporting a walking or running animation from Mixamo make sure to check "In Place". Below is a video showcasing the exact animations we used from mixamo along with the specific names. 

For more information about how to combine multiple animations into a single 3D model we would suggest searching for "Combining Mixamo Animations in Blender" 

![](https://media.giphy.com/media/IjbgeWMDfVI8BqYm3I/giphy.gif)

### Attributions

Character Model by [ChamberSu1996](https://sketchfab.com/chambersu1996)

Textures for Level by [Kenney]( https://www.kenney.nl/assets/prototype-textures)