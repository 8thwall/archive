# Studio: Vehicle Controller

This example studio project demonstrates how to build a simple vehicle controller for a Mars rover-style vehicle using state machines.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2RlemZrNTlycDJ1eWFoZ3drZWk4ZGcxZzNuN3lldmU5dGg5dnVyYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cRagpdmrCgNo8PqzQt/giphy-downsized-large.gif)

### Overview + Controls

Control the Mars rover using the following keys:

- 'W' or Up Arrow: Move forward
- 'S' or Down Arrow: Move backward
- 'A' or Left Arrow: Turn left
- 'D' or Right Arrow: Turn right

This project features a Mars-like terrain and a controllable rover vehicle.

### Components

#### **vehicle-controller**

The vehicleController component allows the player to control a Mars rover using the keyboard. It includes movement and rotation mechanics, with a state machine to manage the rover's idle and moving states.

Schema:

- speed: The speed at which the rover moves forward or backward.
- rotationSpeed: The speed at which the rover rotates left or right.

Data:

- currentAngle: Tracks the current rotation angle of the rover.
- currentState: Stores the current state of the rover (idle or moving).

State Machine:
The vehicleController uses a simple state machine to manage the rover's behavior:

1. Idle State: The initial state when the rover is not moving.

   - Transitions to 'moving' state when movement input is detected.

2. Moving State: Activated when the rover is in motion.
   - Transitions back to 'idle' state when no movement input is detected.

The state machine enhances the component's organization and allows for easy expansion of rover behaviors. It provides a clear structure for managing different states and transitions, making the code more maintainable and easier to understand.

In this example, the state machine primarily logs state changes, but in more complex scenarios, it could be used to trigger animations, adjust physics properties, or manage power consumption of the rover.

### Input Manager

The Input Manager handles user input for controlling the Mars rover. It maps various input methods to specific actions, allowing for seamless interaction across different devices.

Actions:

- forward: Moves the rover forward (W key, Up arrow, gamepad left joystick up, gamepad D-pad up)
- backward: Moves the rover backward (S key, Down arrow, gamepad left joystick down, gamepad D-pad down)
- left: Rotates the rover left (A key, Left arrow, gamepad left joystick left, gamepad D-pad left)
- right: Rotates the rover right (D key, Right arrow, gamepad left joystick right, gamepad D-pad right)

#### Asset Attribution

[Space Base Bits](https://kaylousberg.itch.io/space-base-bits) By Kay Lousberg
