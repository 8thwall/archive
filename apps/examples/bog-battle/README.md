# Bog Battle
**Bog Battle** is a strategic game where players build structures, manage resources, and defend against enemies. Tap enemies or build a cannon structure to defeat the enemies.

![Structures](https://i.imgur.com/tiy8r8F.png)

Collect resources (coins) to build barriers to defend against the two enemy types. When selecting a barrier, you can upgrade, rotate, or delete.The final cannon structure has an attack. Structure assets can be adjusted in the `StructureConfig` component.

![Upgrade](https://i.imgur.com/QX79mPH.png)

Swap game assets in the included custom components to make the game your own. Resource asset in the `ResourceManager` component. Enemies can be adjusted in the 'EnemySpawner' component.

![ResourceManager](https://i.imgur.com/3qprSjd.png)

* **Component**: Description
* **EnemyConfig (1-2)**: Enemy character attributes
* **EnemySpawner**: Enemy 3D assets
* **StructureConfig (1-2)**: Barrier 3D assets
* **ResourceManager**: Collectable resource spawn (coins)
* **Environment**: Look of play area

## **Overview of Key Components and Their Roles**

### **1. AttackLoop**

* Purpose: Manages attack behaviors for structures and enemies.
* Behavior: Continuously checks the game state and executes attacks for structures and enemies within range.
* Configurable Inputs: None.

### **2. BuildMode**

* Purpose: Enables players to build and place structures in the game world.
* Behavior: Listens for events to set the active structure and place it on the grid, checking resource availability and deducting costs as necessary.
* Configurable Inputs: Configurations for up to three types of structures.

### **3. CameraNav**

* Purpose: Enables camera navigation using touch gestures.
* Behavior: Listens for touch events and updates the camera's position accordingly.
* Configurable Inputs: Sensitivity factor for camera movement.

### **4. EndGameOverlay**

* Purpose: Displays an overlay when the game ends, showing the level reached and providing a restart button.
* Behavior: Shows an overlay with the level reached and a restart button, and removes the overlay when the component is removed.
* Configurable Inputs: The level reached by the player.

### **5. Enemy**

* Purpose: Manages enemy behavior, including movement, attacks, state transitions, animations, and audio.
* Behavior: Controls enemy movement, attacks, and responses to being hit, as well as handling animations and audio.
* Configurable Inputs: Various inputs for health, speed, attack properties, animations, and more.

### **6. EnemyConfig**

* Purpose: Configures properties and default values for enemy entities.
* Behavior: Provides settings for enemy behavior, such as health, speed, attack properties, and animations.
* Configurable Inputs: Similar to Enemy component but used for setting default values.

### **7. EnemyGoal**

* Purpose: Manages the health of a structure targeted by enemies and updates a progress indicator.
* Behavior: Tracks and updates the structure's health, and stops enemy spawning when the structure is destroyed.
* Configurable Inputs: Progress indicator, max health, and current health.

### **8. EnemySpawnCycle**

* Purpose: Manages the cyclic activation of enemy spawners and updates the visual indicator for spawning.
* Behavior: Controls enemy spawning at intervals and updates the visual indicator with a blinking effect.
* Configurable Inputs: Cycle duration, spawn indicator icon, and other visual properties.

### **9. EnemySpawner**

* Purpose: Manages the periodic spawning of enemies with configurable properties and weights.
* Behavior: Spawns enemies at intervals, manages their properties, and handles activation and deactivation through events.
* Configurable Inputs: Audio settings, spawn rate, enemy assets and configurations, and spawn weights.

### **10. Environment**

* Purpose: Configures the visual environment settings, including skybox, shadows, ACES tone mapping, and fog.
* Behavior: Sets up the environment based on the provided configuration.
* Configurable Inputs: Skybox textures, shadow settings, ACES tone mapping, and fog properties.

### **11. GlobalConfig**

* Purpose: Defines global configuration settings for the game world, such as size dimensions.
* Behavior: Provides central configuration for world dimensions.
* Configurable Inputs: Size of the game world in X and Z dimensions.

### **12. GrassField**

* Purpose: Generates a dynamic field of grass blades to enhance the visual environment.
* Behavior: Creates and animates grass blades based on configuration settings.
* Configurable Inputs: Grass texture, plane size, blade count, and other properties.

### **13. Ground**

* Purpose: Generates a checkerboard grid to form the ground in the game world.
* Behavior: Creates a grid of plane entities with alternating colors.
* Configurable Inputs: Number of rows and columns, colors for the checkerboard pattern.

### **14. Indicator**

* Purpose: Displays a health bar to represent progress or health.
* Behavior: Creates and positions a health bar, and updates it based on progress changes.
* Configurable Inputs: Initial progress value, background texture, and vertical offset.

### **15. InfoBadge**

* Purpose: Displays a badge with an icon and text, which can be positioned and updated dynamically.
* Behavior: Creates and positions the badge, and updates the text based on events.
* Configurable Inputs: Text, icon image, position settings.

### **16. Menu**

* Purpose: Displays an interactive menu with options to rotate, upgrade, delete, or cancel actions on a target entity.
* Behavior: Handles menu actions and updates based on button presses.
* Configurable Inputs: Images for buttons and background, target entity ID, upgrade option.

### **17. Projectile**

* Purpose: Simulates the movement of projectiles with a parabolic trajectory.
* Behavior: Moves a projectile from start to end position, following a parabolic path and handling visual and audio effects.
* Configurable Inputs: Start and end coordinates, max height, duration.

### **18. Resource**

* Purpose: Represents a collectible resource that adds to the player's total and triggers an animation upon collection.
* Behavior: Adds resources to the player's total, triggers an animation, and removes the resource after collection.
* Configurable Inputs: Amount of resources, model, position settings (hidden).

### **19. ResourceManager**

* Purpose: Manages resources, including collection, display, and periodic spawning.
* Behavior: Tracks and updates resources, displays resource count, and spawns new resources.
* Configurable Inputs: Initial resources, spawn interval, multiplier, resource unit amount, resource model, info badge, scale.

### **20. Structure**

* Purpose: Represents a building or construct that can be upgraded, attacked, and managed.
* Behavior: Manages the structure's state, handles upgrades, attacks, rotations, and deletions, and provides interaction options through a menu.
* Configurable Inputs: Various inputs for audio, levels, health, attack properties, upgrade options, and more.

### **21. StructureConfig**

* Purpose: Defines the configuration and attributes for structures, including levels, costs, health, attack capabilities, and upgrade options.
* Behavior: Provides a blueprint for creating and managing structures with various properties.
* Configurable Inputs: Similar to Structure component but used for setting default values.

### **22. TrayMenu**

* Purpose: Provides a tray menu interface for selecting structures to build.
* Behavior: Displays a menu with a build button and structure selection buttons, handles button clicks to dispatch events, and adjusts button sizes responsively.
* Configurable Inputs: Icons for build button and structure selection buttons.

### **23. createGridComponent**

* Purpose: Generates a dynamic grid of tiles in the game world.
* Behavior: Listens for events to create or destroy the grid, rotates tiles, and handles tap events on grid items.
* Configurable Inputs: Number of rows and columns, texture URL for tiles, parent entity.

## **Gameplay Flow**

1. Initialization: The game initializes by configuring global settings, setting up the environment, and spawning initial resources, enemies, and structures.
2. Building and Managing Structures: Players use the BuildMode component to place and manage structures, which can be upgraded and rotated.
3. Enemy Behavior: Enemies are spawned periodically and interact with structures, attacking them based on their configurations.
4. Resource Management: Players collect resources using the Resource component, which are managed and displayed by the ResourceManager.
5. Combat and Defense: The AttackLoop component ensures that structures and enemies attack each other as per the game logic.
6. Dynamic Environment: Components like GrassField and Environment create a visually appealing and immersive game world.
7. User Interaction: The TrayMenu, Menu, and Indicator components provide interactive interfaces for players to manage game elements and receive feedback.

## Overall, Bog Battle offers a rich strategic experience where players must balance building, resource management, and defense against waves of enemies.

## **AttackLoop Component**

### Overview

The AttackLoop component is responsible for managing the attack behaviors of structures and enemies within a game world. It handles the logic for structures to attack enemies within their range and for enemies to attack structures. This component runs continuously, checking the current state of the world and
executing attacks as appropriate.

### Configurable Inputs

The AttackLoop component does not have any configurable inputs defined in its schema. The registerComponent method only registers the component's name and its tick function, which handles the main logic for executing attacks.

### Example Usage

The AttackLoop component would typically be added to a game world entity, and its logic would be executed every frame to ensure that structures and enemies perform their attack actions based on their defined parameters and states.

### Summary

* Purpose: Manages attack behaviors for structures and enemies.
* Configurable Inputs: None (no schema defined).
* Behavior: Executes attack logic for structures and enemies each frame.

This component is integral for games where entities need to engage in combat, ensuring that attack actions are carried out efficiently and according to the game's rules.

## **BuildMode Component**

### Overview

The BuildMode component allows users to enter a mode where they can place different structures in the game world. It listens for specific events to set the active structure configuration and to handle the placement of structures on a grid. When a grid item is touched, it checks if the resources are sufficient to cover the cost of the structure, places the structure, and deducts the resources accordingly.

### Configurable Inputs

The BuildMode component has three configurable inputs defined in its schema:
The `BuildMode` component has three configurable inputs defined in its schema:

* **Structure 1 Config**: References the configuration for the first type of structure.
* **Structure 2 Config**: References the configuration for the second type of structure.
* **Structure 3 Config**: References the configuration for the third type of structure.

### Example Usage

The `BuildMode` component would be used in a game where players can build and place structures on a grid. The user can switch between different structures and place them on the grid if they have enough resources.

### Summary

* **Purpose**: Enables players to build and place structures in the game world.
* **Configurable Inputs**:
  * **Structure 1 Config**: Configuration for the first structure type.
  * **Structure 2 Config**: Configuration for the second structure type.
  * **Structure 3 Config**: Configuration for the third structure type.
* **Behavior**: Listens for events to set the active structure and place it on the grid, checking resource availability and deducting costs as necessary.

This component is essential for games involving building mechanics, providing a user-friendly way to manage and place different structures within the game environment.

## **CameraNav Component**

### Overview

The `CameraNav` component allows users to navigate the camera view in the game world by using touch gestures. It responds to touch start, move, and end events to adjust the camera's position based on user input, effectively enabling smooth and intuitive camera navigation.

### Configurable Inputs

The `CameraNav` component has one configurable input defined in its schema:

* **Factor**: A multiplier that adjusts the sensitivity of the camera movement in response to touch input.

### Example Usage

The `CameraNav` component would typically be added to a camera entity in a game where the user needs to navigate or explore the environment using touch gestures. The movement is responsive to the user's swipes, making it easier to control the camera's view.

### Summary

* **Purpose**: Enables camera navigation using touch gestures.
* **Configurable Inputs**:
  * **Factor**: Adjusts the sensitivity of the camera movement.
* **Behavior**: Listens for touch events and updates the camera's position accordingly, ensuring smooth and intuitive navigation.

This component is essential for games or applications that require user-friendly camera control, enhancing the user experience by providing responsive and adjustable navigation.

## **EndGameOverlay Component**

### Overview

The `EndGameOverlay` component displays an overlay on the screen when the game ends. This overlay shows the level reached by the player and provides a button to restart the game.

### Configurable Inputs

The `EndGameOverlay` component has one configurable input defined in its schema:

* **Level**: An integer representing the level reached by the player. This is displayed on the overlay.

### Example Usage

The `EndGameOverlay` component would be used in a game to inform the player that the game has ended, showing their progress (level reached) and providing an option to restart the game. The overlay covers the entire screen with a semi-transparent background to focus the player's attention on the end-game options.

### Summary

* **Purpose**: Displays an end-game overlay with the level reached and a restart button.
* **Configurable Inputs**:
  * **Level**: The level reached by the player.
* **Behavior**: Shows an overlay with the level reached and a button to restart the game. The overlay is removed when the component is removed.

This component enhances the user experience by providing a clear and informative end-game screen, allowing players to easily restart the game.

## **Enemy Component**

### Overview

The `Enemy` component defines the behavior and properties of enemy entities in the game. It manages the enemy's movement, attack, and state transitions, ensuring that enemies can navigate the game world, engage with structures, and react to being attacked. The component also handles animations and audio associated with the enemy's actions and states.

### Configurable Inputs

The `Enemy` component has several configurable inputs defined in its schema:

* **Death Audio**: URL to the audio file played upon the enemy’s death.
* **Target**: Entity ID of the target that the enemy is pursuing.
* **Speed**: The movement speed of the enemy.
* **Health**: The health points of the enemy.
* **Attack Strength**: The damage dealt by the enemy when it attacks.
* **Attack Range**: The range within which the enemy can attack.
* **Attack Interval**: The time interval between consecutive attacks.
* **Target Focus**: The probability that the enemy will change its target when colliding.
* **Poof Texture**: URL to the texture used for visual effects upon the enemy’s defeat.
* **Scale**: The size of the enemy.
* **Idle Animation**: Name of the animation played when the enemy is idle.
* **Idle Animation Speed Scale**: Speed scale of the idle animation.
* **Move Animation**: Name of the animation played when the enemy is moving.
* **Move Animation Speed Scale**: Speed scale of the move animation.
* **Hit Animation**: Name of the animation played when the enemy is hit.
* **Hit Animation Speed Scale**: Speed scale of the hit animation.
* **Hit Animation Length**: Duration of the hit animation.
* **Attack Animation**: Name of the animation played when the enemy is attacking.
* **Attack Animation Speed Scale**: Speed scale of the attack animation.
* **State**: The current state of the enemy (e.g., move, attack, hit, defeat).
* **Defeat Active**: Boolean indicating if the defeat sequence is active.
* **Last Update**: Timestamp of the last update.

### Example Usage

The `Enemy` component would be used to create and manage enemy entities in a game. These enemies can move towards targets, attack structures, and transition between different states such as moving, attacking, being hit, and being defeated. The component ensures that enemies interact dynamically with the game world and respond appropriately to game events.

### Summary

* **Purpose**: Manages enemy behavior, including movement, attacks, state transitions, animations, and audio.
* **Configurable Inputs**:
  * **Death Audio**: Audio for enemy's death.
  * **Target**: Target entity ID.
  * **Speed**: Movement speed.
  * **Health**: Health points.
  * **Attack Strength**: Damage dealt by attacks.
  * **Attack Range**: Range of attacks.
  * **Attack Interval**: Time between attacks.
  * **Target Focus**: Probability of changing target.
  * **Poof Texture**: Texture for visual effects on defeat.
  * **Scale**: Size of the enemy.
  * **Idle Animation**: Animation for idle state.
  * **Idle Animation Speed Scale**: Speed of idle animation.
  * **Move Animation**: Animation for movement.
  * **Move Animation Speed Scale**: Speed of move animation.
  * **Hit Animation**: Animation for being hit.
  * **Hit Animation Speed Scale**: Speed of hit animation.
  * **Hit Animation Length**: Length of hit animation.
  * **Attack Animation**: Animation for attacking.
  * **Attack Animation Speed Scale**: Speed of attack animation.
  * **State**: Current state of the enemy.
  * **Defeat Active**: Indicates if the defeat sequence is active.
  * **Last Update**: Timestamp of the last update.

This component is crucial for games with enemy entities, providing detailed control over enemy behavior and interactions within the game world.

## **EnemyConfig Component**

### Overview

The `EnemyConfig` component is used to configure the properties of enemy entities. It defines the default values and properties that can be adjusted for each enemy.

### Configurable Inputs

The `EnemyConfig` component has several configurable inputs defined in its schema:

* **Death Audio**: URL to the audio file played upon the enemy’s death.
* **Target**: Entity ID of the target that the enemy is pursuing.
* **Speed**: The movement speed of the enemy.
* **Health**: The health points of the enemy.
* **Attack Strength**: The damage dealt by the enemy when it attacks.
* **Attack Range**: The range within which the enemy can attack.
* **Attack Interval**: The time interval between consecutive attacks.
* **Target Focus**: The probability that the enemy will change its target when colliding.
* **Poof Texture**: URL to the texture used for visual effects upon the enemy’s defeat.
* **Scale**: The size of the enemy.
* **Idle Animation**: Name of the animation played when the enemy is idle.
* **Idle Animation Speed Scale**: Speed scale of the idle animation.
* **Move Animation**: Name of the animation played when the enemy is moving.
* **Move Animation Speed Scale**: Speed scale of the move animation.
* **Hit Animation**: Name of the animation played when the enemy is hit.
* **Hit Animation Speed Scale**: Speed scale of the hit animation.
* **Hit Animation Length**: Duration of the hit animation.
* **Attack Animation**: Name of the animation played when the enemy is attacking.
* **Attack Animation Speed Scale**: Speed scale of the attack animation.
* **State**: The current state of the enemy (e.g. move, attack, hit, defeat).
* **Defeat Active**: Boolean indicating if the defeat sequence is active.

### Example Usage

The `EnemyConfig` component is used to set up the initial properties and default values for enemy entities in a game. This configuration is then applied when creating enemy entities with the `Enemy` component.

### Summary

* **Purpose**: Configures properties and default values for enemy entities.
* **Configurable Inputs**:
  * **Death Audio**: Audio for enemy's death.
  * **Target**: Target entity ID.
  * **Speed**: Movement speed.
  * **Health**: Health points.
  * **Attack Strength**: Damage dealt by attacks.
  * **Attack Range**: Range of attacks.
  * **Attack Interval**: Time between attacks.
  * **Target Focus**: Probability of changing target.
  * **Poof Texture**: Texture for visual effects on defeat.
  * **Scale**: Size of the enemy.
  * **Idle Animation**: Animation for idle state.
  * **Idle Animation Speed Scale**: Speed of idle animation.
  * **Move Animation**: Animation for movement.
  * **Move Animation Speed Scale**: Speed of move animation.
  * **Hit Animation**: Animation for being hit.
  * **Hit Animation Speed Scale**: Speed of hit animation.
  * **Hit Animation Length**: Length of hit animation.
  * **Attack Animation**: Animation for attacking.
  * **Attack Animation Speed Scale**: Speed of attack animation.
  * **State**: Current state of the enemy.
  * **Defeat Active**: Indicates if the defeat sequence is active.

This component is essential for defining the behavior and characteristics of enemies in a game, providing a flexible way to customize enemy entities.

## **EnemyGoal Component**

### Overview

The `EnemyGoal` component is designed to manage the health of a structure targeted by enemies and to update a progress indicator based on the structure's health. It initializes the health values, updates the progress indicator during gameplay, and handles cleanup when the component is removed.

### Configurable Inputs

The `EnemyGoal` component has the following configurable inputs defined in its schema:

* **Progress Indicator**: References the entity that displays the health progress of the structure. This field is visible to the user.
* **Max Health**: The maximum health of the structure. This field is hidden from the user.
* **Current Health**: The current health of the structure. This field is hidden from the user.

### Visibility of Schema Fields

* **Max Health**: Always hidden (`@condition true=false`).
* **Current Health**: Always hidden (`@condition true=false`).

### Example Usage

The `EnemyGoal` component would be used in a game where a structure must be defended from enemies. It keeps track of the structure's health and updates the associated progress indicator to reflect the remaining health. When the structure is destroyed, it triggers events to stop enemy spawning and removes existing enemies.

### Summary

* **Purpose**: Manages the health of a structure and updates a progress indicator.
* **Configurable Inputs**:
  * **Progress Indicator**: Entity showing the health progress.
  * **Max Health**: Maximum health (hidden).
  * **Current Health**: Current health (hidden).
* **Behavior**: Initializes and updates the structure's health, updates the progress indicator, and handles cleanup on component removal.

This component is essential for games where players need to defend a structure, providing real-time updates on the structure's health and managing enemy interactions.

## **EnemySpawnCycle Component**

### Overview

The `EnemySpawnCycle` component manages the cyclic activation and deactivation of enemy spawners in the game. It controls the visual indicator for spawning, ensuring that enemies are spawned in intervals, and updates the visual indicator's blinking effect. The component also handles starting and stopping the spawn cycle based on game events.

### Configurable Inputs

The `EnemySpawnCycle` component has several configurable inputs defined in its schema:

* **Cycle Duration**: The duration of one spawn cycle in seconds.
* **Is Active**: A boolean indicating whether the spawn cycle is currently active. Appears as “Is Active” in the UI.
* **Icon**: URL to the image used as the visual indicator for the spawning cycle.
* **Top**: CSS value for the top position of the visual indicator.
* **Right**: CSS value for the right position of the visual indicator.
* **Blink Period**: The period for the blinking effect of the visual indicator in milliseconds.
* **Spawning Active**: Always hidden (`@condition true=false`) Indicates if the spawning process is active.

### Visibility of Schema Fields

* **Spawning Active**: Always hidden (`@condition true=false`).

### Example Usage

The `EnemySpawnCycle` component would be used in a game to manage the spawning of enemies at regular intervals. It visually indicates the spawning state with a blinking icon and handles the logic to start and stop spawning cycles based on game events.

### Summary

* **Purpose**: Manages the cyclic activation of enemy spawners and updates the visual indicator for spawning.
* **Configurable Inputs**:
  * **Cycle Duration**: Duration of the spawn cycle.
  * **Is Active**: Indicates if the spawn cycle is active.
  * **Icon**: Image for the visual indicator.
  * **Top**: Top position of the indicator.
  * **Right**: Right position of the indicator.
  * **Blink Period**: Period for the blinking effect.
  * **Spawning Active**: Hidden field indicating if spawning is active.
* **Behavior**: Controls the spawning of enemies at intervals, updates the visual indicator, and handles game events to start or stop the spawn cycle.

This component is essential for games that involve periodic enemy spawning, providing a clear visual indication of the spawning state and managing the activation and deactivation of enemy spawners.

## **EnemySpawner Component**

### Overview

The `EnemySpawner` component is responsible for spawning enemies at regular intervals in the game. It can be configured to spawn different types of enemies with specified weights and controls the activation and deactivation of the spawning process through events. The component positions the spawned enemies around a defined area and sets their properties according to the given configuration.

### Configurable Inputs

The `EnemySpawner` component has several configurable inputs defined in its schema:

* **Enemy Audio**: URL to the audio file played by enemies.
* **Damage Volume**: Volume level for the enemy’s audio.
* **Parent**: Entity ID of the parent entity.
* **Enemy Target**: Entity ID of the target that spawned enemies will pursue.
* **Spawn Rate**: Number of enemies spawned per second.
* **Is Active**: A boolean indicating whether the spawner is currently active. Appears as “Is Active” in the UI.
* **Enemy Asset 1**: URL to the asset for the first type of enemy.
* **Enemy Config 1**: Configuration entity ID for the first type of enemy.
* **Spawn Weight 1**: Weight for spawning the first type of enemy.
* **Enemy Asset 2**: URL to the asset for the second type of enemy.
* **Enemy Config 2**: Configuration entity ID for the second type of enemy.
* **Spawn Weight 2**: Weight for spawning the second type of enemy.
* **Spawning Active**: Always hidden (`@condition true=false`) Indicates if the spawning process is active.

### Visibility of Schema Fields

* **Spawning Active**: Always hidden (`@condition true=false`).

### Example Usage

The `EnemySpawner` component would be used in a game to periodically spawn enemies around a defined area. It can be configured to spawn different types of enemies with specified probabilities and controls the spawning process based on game events. The component ensures that enemies are positioned and configured correctly upon spawning.

### Summary

* **Purpose**: Manages the periodic spawning of enemies with configurable properties and weights.
* **Configurable Inputs**:
  * **Enemy Audio**: Audio file for enemies.
  * **Damage Volume**: Volume level for enemy audio.
  * **Parent**: Parent entity ID.
  * **Enemy Target**: Target entity ID for spawned enemies.
  * **Spawn Rate**: Rate of enemy spawning.
  * **Is Active**: Indicates if the spawner is active.
  * **Enemy Asset 1**: Asset for the first type of enemy.
  * **Enemy Config 1**: Configuration for the first type of enemy.
  * **Spawn Weight 1**: Weight for spawning the first type of enemy.
  * **Enemy Asset 2**: Asset for the second type of enemy.
  * **Enemy Config 2**: Configuration for the second type of enemy.
  * **Spawn Weight 2**: Weight for spawning the second type of enemy.
  * **Spawning Active**: Hidden field indicating if spawning is active.
* **Behavior**: Spawns enemies at intervals, manages their properties, and handles activation and deactivation through events.

This component is essential for games involving enemy spawning, providing flexible control over the spawning process and allowing for different types of enemies to be introduced into the game world.

## **Environment Component**

### Overview

The `Environment` component configures the visual environment settings for the game world. This includes setting up the skybox textures, enabling or disabling shadows, ACES tone mapping, and fog effects. It allows for a highly customizable visual experience by adjusting these environmental elements based on the provided configurations.

### Configurable Inputs

The `Environment` component has several configurable inputs defined in its schema:

* **Sky Box Positive X Texture**: URL to the texture for the positive X side of the skybox.
* **Sky Box Negative X Texture**: URL to the texture for the negative X side of the skybox.
* **Sky Box Positive Y Texture**: URL to the texture for the positive Y side of the skybox.
* **Sky Box Negative Y Texture**: URL to the texture for the negative Y side of the skybox.
* **Sky Box Positive Z Texture**: URL to the texture for the positive Z side of the skybox.
* **Sky Box Negative Z Texture**: URL to the texture for the negative Z side of the skybox.
* **Enable Shadows**: A boolean indicating whether shadows are enabled. Appears as “Enable Shadows” in the UI.
* **Enable ACES**: A boolean indicating whether ACES tone mapping is enabled. Appears as “Enable ACES” in the UI.
* **Enable Fog**: A boolean indicating whether fog effects are enabled. Appears as “Enable Fog” in the UI.
* **Fog Exponent**: The density of the fog. This field is visible only if Enable Fog is true.
* **Fog Color Red**: The red component of the fog color. This field is visible only if Enable Fog is true.
* **Fog Color Green**: The green component of the fog color. This field is visible only if Enable Fog is true.
* **Fog Color Blue**: The blue component of the fog color. This field is visible only if Enable Fog is true.

### Visibility of Schema Fields

* **Fog Exponent**: Visible when Enable Fog is true.
* **Fog Color Red**: Visible when Enable Fog is true.
* **Fog Color Green**: Visible when Enable Fog is true.
* **Fog Color Blue**: Visible when Enable Fog is true.

### Example Usage

The `Environment` component would be used to customize the visual settings of a game scene. By adjusting skybox textures, enabling shadows, and configuring fog, developers can create a visually immersive environment that enhances the gaming experience.

### Summary

* **Purpose**: Configures the visual environment of the game scene including skybox, shadows, ACES tone mapping, and fog.
* **Configurable Inputs**:
  * **Sky Box Positive X Texture**: Texture for positive X side of the skybox.
  * **Sky Box Negative X Texture**: Texture for negative X side of the skybox.
  * **Sky Box Positive Y Texture**: Texture for positive Y side of the skybox.
  * **Sky Box Negative Y Texture**: Texture for negative Y side of the skybox.
  * **Sky Box Positive Z Texture**: Texture for positive Z side of the skybox.
  * **Sky Box Negative Z Texture**: Texture for negative Z side of the skybox.
  * **Enable Shadows**: Enable or disable shadows.
  * **Enable ACES**: Enable or disable ACES tone mapping.
  * **Enable Fog**: Enable or disable fog effects.
  * **Fog Exponent**: Density of the fog (visible if fog is enabled).
  * **Fog Color Red**: Red component of fog color (visible if fog is enabled).
  * **Fog Color Green**: Green component of fog color (visible if fog is enabled).
  * **Fog Color Blue**: Blue component of fog color (visible if fog is enabled).
* **Behavior**: Sets up the environment based on the provided configuration, including loading skybox textures and configuring fog and shadow settings.

This component is essential for creating and customizing the visual aspects of the game environment, enhancing the overall player experience.

## **GlobalConfig Component**

### Overview

The `GlobalConfig` component defines global configuration settings for the game world. These settings are used to specify the size of the game world in the X and Z dimensions. This component serves as a central configuration point that other components and systems can reference to ensure consistent world dimensions.

### Configurable Inputs

The `GlobalConfig` component has the following configurable inputs defined in its schema:

* **X Size**: An integer representing the size of the game world in the X dimension. Appears as “X Size” in the UI.
* **Z Size**: An integer representing the size of the game world in the Z dimension. Appears as “Z Size” in the UI.

### Example Usage

The `GlobalConfig` component would be used in a game to set the overall dimensions of the game world. This configuration can then be accessed by other components to ensure that they operate within the defined world boundaries.

### Summary

* **Purpose**: Defines the global dimensions of the game world.
* **Configurable Inputs**:
  * **X Size**: Size of the game world in the X dimension.
  * **Z Size**: Size of the game world in the Z dimension.
* **Behavior**: Provides a central configuration for world dimensions that other components can reference.

This component is essential for establishing the basic dimensions of the game world, ensuring consistency and providing a reference point for other game systems and components.

## **GrassField Component**

### Overview

The `GrassField` component generates a field of animated grass blades in the game world. This component uses various parameters to customize the appearance and behavior of the grass, including texture, size, and blade count. The grass blades sway over time, creating a dynamic and realistic environment.

### Configurable Inputs

The `GrassField` component has several configurable inputs defined in its schema:

* **Grass Texture**: URL to the texture used for the grass blades.
* **Plane Texture Size**: Size of the texture plane.
* **Plane Size**: Size of the plane on which grass is generated.
* **Blade Count**: Number of grass blades to generate.
* **Blade Width**: Width of each grass blade.
* **Blade Height**: Height of each grass blade.
* **Blade Height Variation**: Variation in the height of the grass blades.
* **X Bound**: Boundaries of the grass field in the X dimension.
* **Z Bound**: Boundaries of the grass field in the Z dimension.
* **Thickness**: Thickness of the grass blades.

### Example Usage

The `GrassField` component would be used in a game to create a visually appealing grass field. This can enhance the environment's realism and provide a dynamic element as the grass blades sway with time.

### Summary

* **Purpose**: Generates a dynamic field of grass blades to enhance the visual environment.
* **Configurable Inputs**:
  * **Grass Texture**: Texture for grass blades.
  * **Plane Texture Size**: Size of the texture plane.
  * **Plane Size**: Size of the grass plane.
  * **Blade Count**: Number of grass blades.
  * **Blade Width**: Width of grass blades.
  * **Blade Height**: Height of grass blades.
  * **Blade Height Variation**: Variation in grass blade height.
  * **X Bound**: Boundaries in the X dimension.
  * **Z Bound**: Boundaries in the Z dimension.
  * **Thickness**: Thickness of the grass blades.
* **Behavior**: Generates grass blades based on the configuration and animates them to sway over time.

This component is essential for creating realistic and dynamic grass fields in game environments, contributing to the overall visual appeal and immersion.

## **Ground Component**

### Overview

The `Ground` component generates a checkerboard grid of plane entities to form the ground in the game world. The grid is created with specified dimensions and colors, allowing for a visually distinct ground area. Each plane entity in the grid alternates between two colors to create a checkerboard pattern.

### Configurable Inputs

The `Ground` component has several configurable inputs defined in its schema:

* **Rows**: An unsigned integer representing the number of rows in the grid. Appears as “Rows” in the UI.
* **Columns**: An unsigned integer representing the number of columns in the grid. Appears as “Columns” in the UI.
* **Parent**: Entity ID of the parent entity that the grid will be attached to. Appears as “Parent” in the UI.
* **R1**: The red component of the first color in the checkerboard pattern. Appears as “R1” in the UI.
* **G1**: The green component of the first color in the checkerboard pattern. Appears as “G1” in the UI.
* **B1**: The blue component of the first color in the checkerboard pattern. Appears as “B1” in the UI.
* **R2**: The red component of the second color in the checkerboard pattern. Appears as “R2” in the UI.
* **G2**: The green component of the second color in the checkerboard pattern. Appears as “G2” in the UI.
* **B2**: The blue component of the second color in the checkerboard pattern. Appears as “B2” in the UI.

### Example Usage

The `Ground` component would be used in a game to create a visually distinct ground area with a checkerboard pattern. This ground can serve as a base for placing other game entities and can enhance the visual appeal of the game environment.

### Summary

* **Purpose**: Generates a checkerboard grid to form the ground in the game world.
* **Configurable Inputs**:
  * **Rows**: Number of rows in the grid.
  * **Columns**: Number of columns in the grid.
  * **Parent**: Parent entity ID.
  * **R1**: Red component of the first color.
  * **G1**: Green component of the first color.
  * **B1**: Blue component of the first color.
  * **R2**: Red component of the second color.
  * **G2**: Green component of the second color.
  * **B2**: Blue component of the second color.
* **Behavior**: Creates a checkerboard grid of plane entities with alternating colors based on the provided configuration.

This component is essential for creating a distinct and customizable ground area in the game world, providing a visually appealing base for other game elements.

## **Indicator Component**

### Overview

The `Indicator` component controls the visibility of indicator elements based on the presence of resources and the placement state. It is used to provide visual feedback to the player, indicating whether they can place a structure at the selected location.

### Configurable Inputs

The `Indicator` component has several configurable inputs defined in its schema:

* **Grid Parent**: Entity ID of the parent grid.
* **Container**: Container entity ID where the indicator elements are placed.
* **Ready**: Indicates if the placement is ready.
* **Not Ready**: Indicates if the placement is not ready.
* **Indicator Image URL**: URL to the image used as the indicator.

### Example Usage

The `Indicator` component would be used in a game to provide visual feedback to the player during the building process. It shows whether a structure can be placed at the selected location, helping the player make informed decisions.

### Summary

* **Purpose**: Controls the visibility of indicator elements for visual feedback during structure placement.
* **Configurable Inputs**:
  * **Grid Parent**: Parent grid entity ID.
  * **Container**: Container entity ID.
  * **Ready**: State indicating placement readiness.
  * **Not Ready**: State indicating placement unavailability.
  * **Indicator Image URL**: URL of the indicator image.
* **Behavior**: Displays indicator elements based on placement state and resource availability.

This component is essential for providing intuitive and informative visual feedback during the building process in a game.

## **Menu Component**

### Overview

The `Menu` component manages the display and behavior of game menus. It controls the visibility of menu elements and handles user interactions to navigate through different menu options.

### Configurable Inputs

The `Menu` component has the following configurable inputs defined in its schema:

* **UI**: Entity ID of the user interface elements.
* **Main Menu ID**: Entity ID of the main menu.
* **Instructions ID**: Entity ID of the instructions menu.
* **Resources Menu ID**: Entity ID of the resources menu.
* **Pointer Lock ID**: Entity ID of the pointer lock.

### Example Usage

The `Menu` component would be used in a game to manage the various menus, such as the main menu, instructions menu, and resources menu. It handles user interactions to show or hide these menus as needed.

### Summary

* **Purpose**: Manages game menus and user interactions.
* **Configurable Inputs**:
  * **UI**: User interface entity ID.
  * **Main Menu ID**: Main menu entity ID.
  * **Instructions ID**: Instructions menu entity ID.
  * **Resources Menu ID**: Resources menu entity ID.
  * **Pointer Lock ID**: Pointer lock entity ID.
* **Behavior**: Controls the visibility and behavior of menu elements based on user interactions.

This component is essential for providing a structured and interactive menu system in a game, enhancing the user experience by allowing easy navigation through various game menus.

## **Resource Component**

### Overview

The `Resource` component manages the collection and display of resources in the game. It updates the resource count based on player interactions and ensures that the resources are accurately reflected in the user interface.

### Configurable Inputs

The `Resource` component has several configurable inputs defined in its schema:

* **Current Resources**: The current amount of resources available to the player.
* **Parent**: Entity ID of the parent entity.
* **Container**: Entity ID of the container displaying resources.
* **Value Display**: Entity ID of the element displaying the resource value.

### Example Usage

The `Resource` component would be used in a game to manage the player's resources, such as coins or other collectable items. It updates the resource count and ensures that the user interface accurately reflects the player's current resources.

### Summary

* **Purpose**: Manages the collection and display of resources.
* **Configurable Inputs**:
  * **Current Resources**: Current resource count.
  * **Parent**: Parent entity ID.
  * **Container**: Container entity ID.
  * **Value Display**: Resource value display entity ID.
* **Behavior**: Updates the resource count and ensures accurate display in the user interface.

This component is essential for games involving resource collection, providing real-time updates and accurate display of resources in the game.

## **ResourceManager Component**

### Overview

The `ResourceManager` component is responsible for spawning collectible resources in the game world. It controls the location, quantity, and appearance of these resources, ensuring they are placed appropriately for players to collect.

### Configurable Inputs

The `ResourceManager` component has several configurable inputs defined in its schema:

* **Target Entity**: Entity ID of the target for resource placement.
* **Resource Config**: Configuration for the resources.
* **Parent**: Entity ID of the parent entity.
* **Resource Count**: Number of resources to spawn.
* **Resource Asset**: URL to the resource asset.
* **X Bound**: Boundaries in the X dimension for resource placement.
* **Z Bound**: Boundaries in the Z dimension for resource placement.

### Example Usage

The `ResourceManager` component would be used in a game to manage the spawning of collectible resources. It ensures that resources are placed within the specified boundaries and according to the given configuration.

### Summary

* **Purpose**: Manages the spawning of collectible resources.
* **Configurable Inputs**:
  * **Target Entity**: Target entity ID for resource placement.
  * **Resource Config**: Resource configuration.
  * **Parent**: Parent entity ID.
  * **Resource Count**: Number of resources to spawn.
  * **Resource Asset**: Resource asset URL.
  * **X Bound**: Boundaries in the X dimension.
  * **Z Bound**: Boundaries in the Z dimension.
* **Behavior**: Spawns resources within specified boundaries based on the configuration.

This component is essential for games involving collectible resources, ensuring that resources are placed appropriately for player interaction.

## **StructureConfig Component**

### Overview

The `StructureConfig` component is used to configure the properties of structures in the game. It defines the default values and properties that can be adjusted for each structure.

### Configurable Inputs

The `StructureConfig` component has several configurable inputs defined in its schema:

* **Structure Asset**: URL to the asset for the structure.
* **Health**: The health points of the structure.
* **Cost**: The resource cost to build the structure.
* **Scale**: The size of the structure.
* **Rotation**: The rotation of the structure.
* **Attack Strength**: The damage dealt by the structure when it attacks.
* **Attack Range**: The range within which the structure can attack.
* **Attack Interval**: The time interval between consecutive attacks.

### Example Usage

The `StructureConfig` component is used to set up the initial properties and default values for structures in a game. This configuration is then applied when creating structure entities with the `Structure` component.

### Summary

* **Purpose**: Configures properties and default values for structures.
* **Configurable Inputs**:
  * **Structure Asset**: Asset URL for the structure.
  * **Health**: Health points.
  * **Cost**: Resource cost.
  * **Scale**: Size of the structure.
  * **Rotation**: Rotation of the structure.
  * **Attack Strength**: Damage dealt by the structure.
  * **Attack Range**: Range of attacks.
  * **Attack Interval**: Time between attacks.
* **Behavior**: Sets up properties and default values for structures in the game.

This component is essential for defining the behavior and characteristics of structures in a game, providing a flexible way to customize structure entities.

## **TrayMenu Component**

### Overview

The `TrayMenu` component manages the display and behavior of the tray menu in the game. It controls the visibility of menu items and handles user interactions to navigate through different tray options.

### Configurable Inputs

The `TrayMenu` component has the following configurable inputs defined in its schema:

* **UI**: Entity ID of the user interface elements.
* **Menu Items**: Array of entity IDs for the menu items.
* **Active Item**: Entity ID of the currently active menu item.

### Example Usage

The `TrayMenu` component would be used in a game to manage the tray menu, allowing players to access different menu options and interact with them. It handles user interactions to show or hide menu items as needed.

### Summary

* **Purpose**: Manages the tray menu and user interactions.
* **Configurable Inputs**:
  * **UI**: User interface entity ID.
  * **Menu Items**: Array of menu item entity IDs.
  * **Active Item**: Active menu item entity ID.
* **Behavior**: Controls the visibility and behavior of tray menu items based on user interactions.

This component is essential for providing a structured and interactive tray menu system in a game, enhancing the user experience by allowing easy access to various menu options.

---

This README file provides an overview of the key components used in the Bog Battle game. Each component is described with its purpose, configurable inputs, example usage, and a summary of its behavior. This documentation is intended to help developers understand and utilize these components effectively to build and customize their game experiences.

