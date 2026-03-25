# Botanical Blasters

Botanical Blaster features a woodland-themed shooting mechanic. Each of the three launchers offers a distinct style: single, scatter, and gravity.

![Shooter](https://i.imgur.com/xdn9FXb.png)

## Overview of Key Components and Their Roles

### 1. Projectile Spawner, Projectile Direction Point, & Projectile

This component provides functionality for projectiles. Used by the Projectile Gun Controller and the Water Gun Controller. The ProjectileSpawner handles the actual creation of projectile entities. The ProjectileDirectionPoint component is used to create a direction for the projectile based on its relationship to the spawner.

### 2. Gun Recoil Animation & Gun Model

Create the animation for the recoil of the gun being fired. The component searches its children for an entity with the GunModel component to use as the actual model to animate.

### Properties

- **recoilDuration**: The duration in seconds of the recoil animation.
- **recoilDistance**: The distance the gun will travel backwards.
- **recoilAngle**: The angle the gun will jet upwards to.
- **bounceDuration**: The duration in seconds of the bounce animation.
- **bounceAngle**: The angle the gun will bounce down to.

### 3. Projectile Gun Controller

This component provides functionality for the acorn projectile gun.

### Properties

- **bulletAsset**: The asset for the projectile.
- **colliderDataType**: The collider type to be set on the ColliderData component.
- **colliderDataName**: The collider name to be set on the ColliderData component.
- **force**: The force the projectile will be shot out at.
- **mass**: The mass of the projectile.
- **singleShot**: Whether single shot is enabled.
- **spreadShot**: Whether spread shot is enabled.
- **projectileScaleX**: The x scale of the projectile.
- **projectileScaleY**: The y scale of the projectile.
- **projectileScaleZ**: The z scale of the projectile.

### Dependencies:

- ProjectileSpawner
- ProjectileDirectionPoint
- Projectile
- ProjectileTail
- ColliderData

### 4. Water Gun Controller

This component provides functionality for the water gun.

### Properties

- **bulletAsset**: The asset for the projectile.
- **colliderDataType**: The collider type to be set on the ColliderData component.
- **colliderDataName**: The collider name to be set on the ColliderData component.
- **force**: The force the projectile will be shot out at.
- **mass**: The mass of the projectile.

### Dependencies:

- ProjectileSpawner
- ProjectileDirectionPoint
- Projectile
- ColliderData

### 5. Gravity Gun Controller

This component provides functionality for the gravity gun.

### Properties

- **forceTime**: The amount of time force will be applied to the object.
- **throwForce**: The force the object will be thrown at.
- **torqueForce**: The torque force the object will be thrown at.
- **showRayIntersectSphere**: Whether or not to show a sphere where the user clicked with the gravity gun.
- **rayIntersectSphereLifeTime**: The life time of the sphere in milliseconds.

### Dependencies:

- GravityGunAttractor
- GravityGunAffected

### 6. Terrain

Controls the terrain mesh and allows for other effects. It will search its children for an object with the given terrain object name. It takes the mesh and creates a heightmap from it.

### Properties

- **terrainObjectName**: The name of the terrain object to look for.

### Dependencies:

- Terrain

### 7. Terrain Grass

This component generates grass on the terrain mesh.

### Properties

- **grassTexture**: The texture to use for the grass.
- **planeTextureSize**: The plane size to use for setting texture uvs for the grass.
- **planeSize**: The total area for the grass to cover.
- **bladeCount**: The amount of grass blades to make.
- **bladeWidth**: The grass blade width.
- **bladeHeight**: The grass blade height.
- **bladeHeightVariation**: The grass blade height variation.

### Dependencies:

- Terrain

### 8. Forest

Generate trees and rocks with a given random number seed on the terrain within a given start and end radius.

### Properties

- **radiusStart**: The starting radius to generate the forest in.
- **radiusEnd**: The ending radius to generate the forest in.
- **treeSeed**: The number of seeds used for the number generator to randomly place trees.
- **rockSeed**: The number of seeds used for the number generator to randomly place rocks.
- **tree[1-8]**: The asset for this tree.
- **tree[1-8]Amount**: The amount of this tree to place.
- **rock[1-8]**: The asset for this rock.
- **rock[1-8]Amount**: The amount of this rock to place.

### Dependencies:

- Terrain

### 9. Scene Manager

This component controls the active scene.

### Properties

- **startingScene**: The starting scene id.

### 10. Scene

This component defines a section of the node graph as a scene.

### Properties

- **name**: The name/id of the scene.

### Dependencies:

- Scene Manager

### 11. Active Scene Only

This component defines a section of the node graph that will only display when a certain scene is active.

### Properties

- **sceneId**: The id of the scene to allow.

### Dependencies:

- Scene

### 12. Audio Bank and Audio Clip

The AudioBank component defines a section of the node graph as an audio bank. The AudioBank component searches its children for nodes with an AudioClip component to add to the audio bank.

### AudioBank Properties

### Properties

- **name**: The name/id of the audio bank.

### AudioClip Properties

### Properties

- **name**: The name/id of the audio clip.
- **length**: The length of the audio clip in milliseconds.

## Editing Scenes

Each of the scenes of the game can be edited. They are subsections of the entity graph that are simply turned off and on. Each scene has a unique set of components too that make it work.

### 1. Planter Target Scene

To add more targets to the scene you just need to duplicate any of the targets under the main Targets node. You can transform the target as a whole from the top node.

The targets must stay under the Targets node in order for the game to pick up that they are meant to be targets.

### Associated Components

### Properties

- **PlanterTargets**: This component is tied to the parent node of the targets. It grabs all the planter entities and manages them.
- **PlanterTargetModel**: This component signifies the node as the model for the target.
- **PlanterTarget**: This component signifies the node as the actual physics object for the target.
- **PlanterPot**: This component signifies the node as the location the plant will sprout from when the target is hit.

### 2. Watering Plants Scene

![Water](https://i.imgur.com/y44gt61.png)

### Adding plants

To add more plants to the watering plants scene you just need to copy a plant node. All the plants must be under the Crops node for it to be picked up by the game. The plant node has the CropEntity component attached to it as well so the game knows that it is a plant.

At runtime the game replaces the place holders boxes with efficient clones of the plants.

### Associated Components

### Properties

- **CropEntities**: The component is tied to the parent node of all the crops. It gathers and manages all the crop entities.
- **CropEntity**: This component is used to signify a node as a crop entity.

### 3. Gravity Gun Scene

### Adding Throwable And Hitable Items

![Gravity](https://i.imgur.com/aQwJVGS.png)

To add more hitable items you can place any node with a physics collider under the GravityGunScene. To add more throwable items you can duplicate a stone or add the `GravityGunAffected' component to a node with a physics collider. Please note though they must be under the Pickup Items node and that node itself must stay at 0,0,0. If moved it can break the scene.

### Associated Components

### Properties

- **GravityGunAffected**: The component signifies a node that the gravity gun can pickup.

## Systems

The game has several extra systems built to make it function.

### 1. Scenes

The game consists of several “game screens” or scenes. This is done through the scene system. Scenes are defined in the graph using the Scene component. The SceneManager
component handles the entering and exiting of scenes. When a scene is entered the main object is made visible and the physics colliders restored. When a scene is exited its main object is made invisible and its physics colliders are cached and removed.

### Associated Components

- **SceneManager**: This component contains the SceneManager object that registers all scenes. The component is also responsible for entering the starting scene.
- **Scene**: This component is used to identify part of the node graph as a scene.
- **ActiveSceneOnly**: This component is used to show or hide parts of the scene graph based on the current scene.
- **ScenePosition**: Used to define the starting position for a scene.
- **SceneTarget**: Used to define the target position for the scene.

### API

#### **SceneManager | Found in scene-manager.js**

#### Functions

- **enterScene**

  - **Args**: id: string
  - **Returns**: void
  - **Description**: Enter the scene with the given Id.

- **exitScene**
  - **Args**: id: string
  - **Returns**: void
  - **Description**: Exit the scene with the given id.

#### Events

- **enter-scene**

  - **Event Type**: CustomEvent:<{ id: string; }>
  - **Description**: Triggers when entering into a scene.

- **exit-scene**
  - **Event Type**: CustomEvent:<{ id: string; }>
  - **Description**: Triggers when exiting a scene.

### 2. Audio

The game uses an audio bank system to play all the sounds and the ambience. An audio bank is defined in the graph as a node with an AudioBank component. Under that node nodes with an AudioClip component are placed. The AudioBank component goes through its children and fills the bank with AudioClip objects. The AudioClip objects take the data from the AudioClip component to spawn more nodes with that audio.

### Associated Components

- **AudioBank**: This component defines part of the graph as an audio bank.
- **AudioClip**: This component defines the node as an AudioClip. It will grab the AudioSource component of the node.

### API

#### **AudioBankManager | Found in audio-bank.js**

#### Functions

- **getAudioBank**
  - **Args**: id: string
  - **Returns**: AudioBank
  - **Description**: Gets the AudioBank with the given id.

#### **AudioBank | Found in audio-bank.js**

#### Functions

- **getClip**
  - **Args**: id: string
  - **Returns**: AudioClip
  - **Description**: Gets the AudioClip with the given id.

#### **AudioClip| Found in helpers/Audio**

#### Functions

- **play**

  - **Args**: None
  - **Returns**: void
  - **Description**: Play the audio clip.

- **stop**
  - **Args**: None
  - **Returns**: void
  - **Description**: Stop the audio clip.

### 3. Controls

The game has a control system for both mouse/keyboard controls and virtual gamepad controls. There is also a system for camera controls as a camera needs a rig or set of parents to do “looking around” more naturally.

### Associated Components

- **CameraControls**: Handles the controls for the camera.
- **KeyBoardControls**: Handles the controls for the keyboard.
- **MouseControls**: Handles the controls for the mouse.
- **PointerLock**: Handles the pointer lock controls.
- **PlayerController**: Handles controlling the player.

### API

#### **CameraManager | Found in camera.js**

#### Functions

- **getForwardDirection**

  - **Args**: None
  - **Returns**: Vector3
  - **Description**: Gets the camera's current forward direction.

- **getSideDirection**

  - **Args**: None
  - **Returns**: Vector3
  - **Description**: Gets the camera's current side direction.

- **pick**

  - **Args**: Event: MouseEvent, scene: Scene
  - **Returns**: Intersection<Object3D<Object3DEventMap>>[]
  - **Description**: Picks objects in the scene using the camera and mouse position.

- **pickFromCenter**
  - **Args**: scene: Scene
  - **Returns**: Intersection<Object3D<Object3DEventMap>>[]
  - **Description**: Picks from the center of the canvas.

#### **PlayerController | Found in player-controller.js**

#### Functions

- **teleportTo**

  - **Args**: x: number, y: number, z: number
  - **Returns**: void
  - **Description**: Teleports the player to the given location.

- **lookAt**
  - **Args**: x: number, y: number, z: number, tx: number, ty: number, tz: number
  - **Returns**: void
  - **Description**: Makes the player look at position from a given position and target.

#### **PointerLockHelper | Found in pointer-lock.js**

#### Functions

- **enterLock**

  - **Args**: None
  - **Returns**: void
  - **Description**: Enter pointer lock.

- **exitLock**
  - **Args**: None
  - **Returns**: void
  - **Description**: Exit pointer lock.

#### Events

- **enter-lock**

  - **Event Type**: CustomEvent
  - **Description**: Triggers when entering pointer lock.

- **exit-lock**

  - **Event Type**: CustomEvent
  - **Description**: Triggers when exiting pointer lock.

- **mouse-move**
  - **Event Type**: Event & {
    movementX: number,
    movementY: number,
    }
  - **Description**: Event triggered to the world object when the mouse moves while in pointer lock.

#### **VirtualGamepadManager | Found in virtual-gamepad-controls.js**

#### Functions

- **triggerAnalogStickMove**

  - **Args**: x: number, y: number
  - **Returns**: void
  - **Description**: Trigger the analog movement.

- **triggerButtonDown**

  - **Args**: None
  - **Returns**: void
  - **Description**: Trigger the button down.

- **triggerButtonUp**
  - **Args**: None
  - **Returns**: void
  - **Description**: Trigger the button up.

#### Events

- **button-down**

  - **Event Type**: CustomEvent
  - **Description**: Triggers when the button is pressed.

- **button-up**

  - **Event Type**: CustomEvent
  - **Description**: Triggers when the button is released.

- **analog-move**
  - **Event Type**: Event & {
    movementX: number,
    movementY: number,
    }
  - **Description**: Triggers when the analog stick moves.

### 4. UI

The game uses a screen-based UI system. Game UI screens are registered using the Screen html component. The component will auto-register the screen into the ScreenManager object when it is mounted. From there the ScreenManager can be used to show and hide scenes.

### Associated Components

- **UI**: Handles mounting the UI to the dom.

### API

#### **ScreenManager | Found in UI/ScreenManager.js**

#### Functions

- **enterScreen**
  - **Args**: id: string
  - **Returns**: Promise<void>
  - **Description**: Enter the screen with the given id.

#### Events

- **enter-screen**

  - **Event Type**: Event & { data: { id: string } }
  - **Description**: Triggers when entering into a screen.

- **exit-screen**
  - **Event Type**: Event & { data: { id: string } }
  - **Description**: Triggers when exiting a screen.
