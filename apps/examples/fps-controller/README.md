# Studio: First Person Controller

This example studio project demonstrates how to build a simple first-person controller and shooting mechanic using custom components in Niantic Studio.

![](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXRnZmIyeDNycmJiZ3pxNDJ1MTBreHhjaTAxaG82bWVtaDM3N2VxYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sanslBxFO9Do4rKKq7/giphy.gif)

![](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzNydHZ2aXpmbnR0aHU3Mnd1MW8yOHA3cmhnM2hlaDRzNHR1ZzFudiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Bexkln3bDMomrSxGQX/giphy-downsized-large.gif)

## Overview + Controls

Navigate through the 3D environment and interact using the following controls:

### Movement:
- Forward: 'W' key or Left Joystick Up
- Backward: 'S' key or Left Joystick Down
- Left: 'A' key or Left Joystick Left
- Right: 'D' key or Left Joystick Right

### Camera Controls:
- Look Up: Mouse Move Up, Right Joystick Up
- Look Down: Mouse Move Down, Right Joystick Down
- Look Left: Mouse Move Left, Right Joystick Left
- Look Right: Mouse Move Right, Right Joystick Right

### Shooting:
- Shoot Projectile: Left Mouse Button or 'Spacebar'

This project features a first-person perspective with smooth camera control and the ability to shoot projectiles.

## Components

### 1. first-person-controller

The first-person-controller component enables first-person movement and look mechanics. It handles mouse input for looking around and keyboard input for moving the player character.

#### Schema:
- sensitivity: Controls the mouse sensitivity for looking around.
- moveSpeed: Determines the movement speed of the player.
- invertedYaw: Option to invert horizontal mouse movement (yaw).

#### Data:
- pitchAngle: Tracks the vertical angle for looking up and down.

Tip: Try adjusting the sensitivity and moveSpeed values in the component's schema to see how they impact the controls!

### 2. projectile

The projectile component adds a shooting mechanic to the player, allowing them to fire projectiles in the direction they are facing.

#### Schema:
- force: The force applied to the projectile when shot.
- radius: The size of the projectile.

#### Data:
- wasShooting: Tracks whether the shoot action was active in the previous frame to prevent continuous firing.

## Input Manager

The Input Manager handles user input for controlling the player character and shooting projectiles. It maps various input methods to specific actions, enabling seamless interaction across different devices.

### Actions:
- Shoot: Left Mouse Click, Space key, Right Trigger
- Forward: W key, Up Arrow, Left Joystick Up
- Backward: S key, Down Arrow, Left Joystick Down
- Left: A key, Left Arrow, Left Joystick Left
- Right: D key, Right Arrow, Left Joystick Right
- Look Down: Mouse Move Down, Right Joystick Down
- Look Left: Mouse Move Left, Right Joystick Left
- Look Right: Mouse Move Right, Right Joystick Right
- Look Up: Mouse Move Up, Right Joystick Up

## 3D Models (Baked Lighting Environment)

This project utilizes baked lighting for its 3D environment, offering improved performance and consistent visuals across devices. Here's an overview of the process:

### Creation and Baking

1. 3D models were edited in Blender.
2. Lighting was set up to achieve the desired ambiance.
3. [SimpleBake] (https://blendermarket.com/products/simplebake---simple-pbr-and-other-baking-in-blender-2) add-on was used to bake lighting information onto textures.

### Export and Import

1. Models were exported from Blender as .glb files, which include the baked lighting textures.
2. These .glb files were then imported into the Niantic Studio project.

### Advantages

- Reduced computational load compared to real-time lighting
- Consistent appearance across different devices
- Allows for complex lighting scenarios, especially beneficial for mobile devices

### Considerations
- Best suited for static environment elements
- Changes to lighting require re-baking and re-importing assets

By using baked lighting and SimpleBake, we created a visually appealing and performant 3D environment for our first-person controller demo in Niantic Studio.

## Asset Attribution

[Prototype Bits](https://kaylousberg.itch.io/prototype-bits) By Kay Lousberg

.