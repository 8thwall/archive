# Bunny Blitz

Bunny Blitz is an interactive environment where bunnies munch on a giant
carrot or flee from a fox. You can adjust the components to control the
fox and carrot\'s influence on the bunnies.

![Carrot](https://i.imgur.com/fRU1MMw.png)

Clicking and dragging the carrot around the scene influences the
bunnies\' animations and position. Clicking the switch button changes
the carrot to a fox, representing a repel object.

![InfluencerConfig](https://i.imgur.com/QDwLNd7.png)

The **Alert Radius** alerts the bunnies; the **Active Radius**
repels or attracts the bunnies and the **Event Radius**. You can
adjust each radii size and image asset in the InfluencerConfig
component.

![InfluencerSpawner](https://i.imgur.com/dMeoXWD.png)

Swap out any and all 2D and 3D assets in the custom components. Upload
files to your project; click and drag the assets from Files into the URL
section in the component. To change the carrot, we can click and drag
the Test_Cheese.glb into the InfluencerSpawner directly into the URL
section.

## Components

**Bunny Blitz** is an interactive simulation game where agents
(bunnies) navigate a dynamic environment, responding to various stimuli
and interacting with influencer (fox & carrot) entities. The game
comprises several key components that work together to create an
engaging and responsive world.

* **AgentSpawner**: Agents (bunnies) that are attracted or repelled by influencer.
* **AgentConfig**: Agent (bunny) animation control.
* **InfluencerConfig**: Influencer (fox & carrot) radius control.
* **Skybox**: Change sky image.
* **EventManager**: Sound and particles.
* **InfluencerSpawner**: Change influencer asset (fox or carrot).
* **GlobalConfig**: Scene Size.
* **ModeSwitchButton**: Swap between attract or repel influencer control.

## Overview of Key Components and Their Roles

### 1. Agent

* Purpose: Represents a dynamic entity (bunny) that moves and interacts
with other entities called influencers. 
* Behavior: Agents can be in different states (IDLE, ALERT, ACTIVE, EVENT) and change their state
based on proximity to influencers. They seek or avoid influencers and
can be animated to enhance visual feedback. 
* Configurable Inputs: Movement speed, rotation offset, vertical position offset, update
intervals for idle and event states, and animation clips for different
states.

### 2. AgentConfig

* Purpose: Configures the behavior and appearance of agents. 
* Function: Provides settings such as movement speed, rotation offset, and
animation states, which are used by agents to determine their behavior
and look.

### 3. Influencer

* Purpose: Creates entities that influence agent behavior within a
specific radius. 
* Behavior: Defines alert, active, and event zones
around the influencer. Agents within these zones react based on the
influencer's properties, either being attracted or repelled. 
* Configurable Inputs: Radii for different influence zones,
attraction/repulsion toggle, and textures for visualization.

### 4. InfluencerConfig

* Purpose: Configures properties of influencer entities. 
* Function: Sets parameters like radii for alert, active, and event zones, and
whether agents are attracted or repelled.

### 5. GrassField

* Purpose: Generates a field of grass in the 3D scene. 
* Function: Configures the texture, size, density, and variation of grass blades to
create a natural-looking grass field.

### 6. AgentSpawner

* Purpose: Spawns multiple agents within a specified radius. 
* Behavior: Initializes agents with models, audio properties, and other
configurations, enabling dynamic population and interaction within the
scene. 
* Configurable Inputs: Number of agents, spawn radius, models,
and audio properties.

### 7. EventManager

* Purpose: Manages interactions and events between agents and
influencers. 
* Behavior: Listens for global events, handles agent-influencer interactions, and triggers responses like playing audio
and dispatching particles.

### 8. FollowInfluencer

* Purpose: Enables an entity to follow the closest influencer. 
* Behavior: Interpolates the entity's position towards the influencer's
position, creating chasing or following behavior.

### 9. GlobalConfig

* Purpose: Defines global configuration settings such as boundary
limits and radius values for various calculations. 
* Function: Ensures consistent and centralized configuration management.

### 10. Health

* Purpose: Manages and tracks the health of an entity. 
* Behavior: Reduces health in response to events, scales the entity based on
remaining health, and deletes the entity when health reaches zero.

### 11. InfluencerSpawner

* Purpose: Spawns influencer entities that attract or repel agents. 
* Behavior: Initializes influencers with models, sounds, animations, and
health, and spawns them within a specified radius.

### 12. SimpleButton

* Purpose: Creates a customizable button on the screen. 
* Function: Triggers events and plays audio when clicked, allowing for user
interaction.

### 13. SkyBox

* Purpose: Adds a skybox to the scene, creating an immersive
background. 
* Function: Uses a texture to simulate the sky or
environment surrounding the scene.

## Gameplay Flow

1. Initialization: The game initializes by configuring global settings
and spawning agents and influencers based on the specified
configurations. 
2. Agent Behavior: Agents move around the environment,
seeking or avoiding influencers based on their proximity. Their
animations and states change dynamically to reflect their interactions.
3. Influencer Interaction: Influencers affect agents within their
defined radii, triggering behaviors like attraction, repulsion, and
event responses. 
4. Event Management: The EventManager coordinates
interactions between agents and influencers, managing audio playback,
particle effects, and lifecycle events. 
5. Dynamic Environment: The
GrassField component generates a natural landscape, and the SkyBox
creates an immersive background, enhancing the visual appeal. 
6. User
Interaction: Players can interact with the game through buttons created
by the SimpleButton component, influencing the behavior of agents and
influencers.

## Overall, Bunny Blitz provides a rich and dynamic environment where agents and influencers interact in complex ways, creating an engaging simulation experience.

## **Agent**

### Overview

The Agent component represents an entity that can move around and
interact with other entities called Influencers. Agents have different
behaviors and states, such as seeking or avoiding influencers, and can
change their state based on proximity to influencers. They can also be
animated, changing their animations according to their state.

### Configurable Inputs

The Agent component has several configurable inputs defined in its
schema:

* **Speed**: The movement speed of the agent. Appears as "Speed" in the UI.
* **Rotation Offset**: The rotation offset applied to the agent. Appears as "Rotation Offset" in the UI.
* **Y Offset**: The vertical offset for the agent's position. Appears as "Y Offset" in the UI.
* **Idle Update Interval**: Time interval (in milliseconds) for updating the agent's position while idle. Appears as "Idle Update Interval" in the UI.
* **Event Update Interval**: Time interval (in milliseconds) for updating the agent's position during an event. Appears as "Event Update Interval" in the UI.
* **Animated**: Whether the agent is animated. Appears as "Animated" (My Checkbox) in the UI.

### Conditional Inputs

* **Idle Animation**: The animation clip to use when the agent is idle. Appears as "Idle Animation" when "Animated" is true.
* **Idle Movement Animation**: The animation clip to use when the agent is moving while idle. Appears as "Idle Movement Animation" when "Animated" is true.
* **Alert Animation**: The animation clip to use when the agent is alert. Appears as "Alert Animation" when "Animated" is true.
* **Active Animation**: The animation clip to use when the agent is actively seeking or avoiding an influencer. Appears as "Active Animation" when "Animated" is true.
* **Event Animation**: The animation clip to use when the agent is in an event state. Appears as "Event Animation" when "Animated" is true.

### Visibility of Schema Fields

* The fields Idle Animation, Idle Movement Animation, Alert Animation,
Active Animation, and Event Animation are conditionally visible and will
only appear in the UI when the Animated checkbox is true. 
* The rest of the fields are always visible in the UI.

### Detailed Behavior

* State Management: The agent has various states such as IDLE,
IDLE_MOVE, ALERT, ACTIVE, and EVENT. Its state changes based on the
distance to the closest influencer. 
* Movement: The agent moves towards or away from influencers based on its behavior (SEEK or AVOID). It also
performs idle movements within a defined range. 
* Animations: If the
agent is animated, it changes its animation clip based on its current
state. 
* Influencer Interaction: The agent reacts to the proximity of
influencers by changing its state and behavior. It can emit events when
influenced by an influencer.

### Example Usage

The Agent component is useful for creating interactive and dynamic
entities that respond to environmental stimuli, such as NPCs in a game
that react to player actions or other entities.

### Summary

* Purpose: Represents a dynamic and interactive entity that moves and
changes state based on proximity to influencers. 
* Configurable Inputs:
* Speed: Movement speed. 
* Rotation Offset: Rotation offset. 
* Y Offset: Vertical position offset. 
* Idle Update Interval: Time interval
for idle updates. \* Event Update Interval: Time interval for event
updates. 
* Animated: Checkbox to enable animations. 
* Idle Animation: Animation clip for idle state (conditional). 
* Idle Movement Animation:
Animation clip for idle movement (conditional). 
* Alert Animation:
Animation clip for alert state (conditional). 
* Active Animation:
Animation clip for active state (conditional). 
* Event Animation:
Animation clip for event state (conditional). 
* Behavior: Changes state
and behavior based on proximity to influencers, moves accordingly, and
can play animations if enabled. 
* UI Visibility: Some inputs are
conditionally visible based on the state of the \"Animated\" checkbox.

This component is essential for creating lifelike and responsive
entities in a dynamic environment.

## AgentConfig

### Overview

The AgentConfig component is used to configure the behavior and
appearance of agents within the environment. It allows you to set
various parameters such as movement speed, rotation offset, and
animation states for different behaviors. This component does not
perform any actions by itself but provides configuration settings that
other components can use to control agent behavior.

### Configurable Inputs

The AgentConfig component has several configurable inputs defined in its
schema:

* **Speed**: The movement speed of the agent. Appears as "Speed" in the UI.
* **Rotation Offset**: The rotation offset applied to the agent. Appears as "Rotation Offset" in the UI.
* **Y Offset**: The vertical offset for the agent's position. Appears as "Y Offset" in the UI.
* **Idle Update Interval**: Time interval (in milliseconds) for updating the agent's position while idle. Appears as "Idle Update Interval" in the UI.
* **Event Update Interval**: Time interval (in milliseconds) for updating the agent's position during an event. Appears as "Event Update Interval" in the UI.
* **Animated**: Whether the agent is animated. Appears as "Animated" (My Checkbox) in the UI.

#### Conditional Inputs

* **Idle Animation**: The animation clip to use when the agent is idle. Appears as "Idle Animation" when "Animated" is true.
* **Idle Movement Animation**: The animation clip to use when the agent is moving while idle. Appears as "Idle Movement Animation" when "Animated" is true.
* **Alert Animation**: The animation clip to use when the agent is alert. Appears as "Alert Animation" when "Animated" is true.
* **Active Animation**: The animation clip to use when the agent is actively seeking or avoiding an influencer. Appears as "Active Animation" when "Animated" is true.
* **Event Animation**: The animation clip to use when the agent is in an event state. Appears as "Event Animation" when "Animated" is true.

### Visibility of Schema Fields

* The fields Idle Animation, Idle Movement Animation, Alert Animation,
Active Animation, and Event Animation are conditionally visible and will
only appear in the UI when the Animated checkbox is true. 
* The rest of
the fields are always visible in the UI.

### Example Usage

The AgentConfig component is useful for setting up different behaviors
and appearance settings for agents within a scene. It provides a way to
define how agents should move, respond to events, and display animations
based on their current state.

### Summary

* Purpose: Configures the behavior and appearance settings for agents.
* Configurable Inputs: \* Speed: Movement speed. 
* Rotation Offset:
Rotation offset. \* Y Offset: Vertical position offset. 
* Idle Update
Interval: Time interval for idle updates. 
* Event Update Interval: Time
interval for event updates. 
* Animated: Checkbox to enable animations.
* Idle Animation: Animation clip for idle state (conditional). 
* Idle
Movement Animation: Animation clip for idle movement (conditional). 
* Alert Animation: Animation clip for alert state (conditional). 
* Active
Animation: Animation clip for active state (conditional). 
* Event
Animation: Animation clip for event state (conditional). 
* Behavior:
Provides configuration settings that control how agents move, respond to
events, and display animations based on their current state. 
* UI
Visibility: Some inputs are conditionally visible based on the state of
the \"Animated\" checkbox.

This component is essential for setting up and customizing the behavior
and appearance of agents in a dynamic environment.

### Influencer

### Overview

The Influencer component is designed to create entities that influence
the behavior of other entities (agents) within certain radii. It defines
different zones (alert, active, and event) around the influencer entity,
and agents within these zones will react based on their proximity and
the influencer\'s properties.

### Configurable Inputs

The Influencer component has several configurable inputs defined in its
schema:

* **Alert Radius**: The radius within which agents are alerted. Appears as "Alert Radius" in the UI.
* **Active Radius**: The radius within which agents become active. Appears as "Active Radius" in the UI.
* **Event Radius**: The radius within which an event is triggered. Appears as "Event Radius" in the UI.
* **Attract**: The radius within which an event is triggered. Appears as "Attract" (My Checkbox) in the UI.
* **Display Radius**: Determines if the radii circles should be displayed. Appears as "Display Radii" (My Checkbox) in the UI.
* **Alert Radius Image**: Optional texture for the alert radius. Appears as "Alert Radius Image" in the UI.
* **Active Radius Image**: Optional texture for the active radius. Appears as "Active Radius Image" in the UI.
* **Event Radius Image**: Optional texture for the event radius. Appears as "Event Radius Image" in the UI.
* **Idle Animation**: Animation clip to play when the influencer is idle. Appears as "Idle Animation" in the UI.
* **Move Animation**: Animation clip to play when the influencer is moving. Appears as "Move Animation" in the UI.
* **Event Animation**: Animation clip to play when the influencer triggers an event. Appears as "Event Animation" in the UI.
* **Scale**: Scale factor to adjust the radius by the influencer's scale. Appears as "Scale" in the UI.

### Schema Defaults

* Alert Radius: 10.0 
* Active Radius: 5.0 \* Event Radius: 2.0 
* Attract: true 
* Display Radii: false

### Data Fields

These fields are used internally by the component and are not exposed in
the UI:

* Current Position X: The X position of the influencer. 
* Current
Position Y: The Y position of the influencer. 
* Current Position Z: The
Z position of the influencer.

### Visibility of Schema Fields

* All fields are always visible in the UI, except for the texture
fields, which are hidden unless specified otherwise.

### Behavior

When the Influencer component is added to an entity, it can display
circles representing the different influence radii if the "Display
Radii" checkbox is checked. It also sets up event listeners for
movement and proximity checks.

* Alert Radius: Agents within this radius are alerted but not
necessarily influenced. \* Active Radius: Agents within this radius are
actively influenced (attracted or repelled). 
* Event Radius: Agents
within this radius trigger events.

### Example Usage

The Influencer component is useful for creating entities that can affect
the behavior of other entities within a defined area. It can be used to
create dynamic and interactive environments where agents react to
influencers based on their proximity and the influencer's properties.

### Summary

* Purpose: Influences the behavior of other entities within defined
radii. 
* Configurable Inputs: 
* Alert Radius: Distance for alerting
agents. 
* Active Radius: Distance for active influence on agents. 
* Event Radius: Distance for triggering events. 
* Attract: Determines if
agents are attracted or repelled. 
* Display Radii: Shows or hides the
radii circles. \* Alert Radius Image: Optional texture for alert radius.
* Active Radius Image: Optional texture for active radius. 
* Event
Radius Image: Optional texture for event radius. 
* Idle Animation:
Animation for idle state. 
* Move Animation: Animation for moving state.
* Event Animation: Animation for event state. 
* Scale: Scale factor
for the influencer. \* Behavior: Creates zones that influence the
behavior of agents based on their proximity to the influencer. 
* UI
Visibility: All inputs are visible except for the texture fields, which
are conditional.

This component is essential for creating interactive and responsive
environments where agents can react to various influencers dynamically.

## InfluencerConfig

### Overview

The InfluencerConfig component is used to configure the properties of
influencer entities. These entities can influence the behavior of other
entities (such as agents) within specified radii. The configuration
includes radii for alert, active, and event zones, as well as other
properties that determine how these influences are visualized and how
they behave.

### Configurable Inputs

The InfluencerConfig component has several configurable inputs defined
in its schema:

* **Alert Radius**: The radius within which agents are alerted. Appears as "Alert Radius" in the UI.
* **Active Radius**: The radius within which agents become active. Appears as "Active Radius" in the UI.
* **Event Radius**: The radius within which an event is triggered. Appears as "Event Radius" in the UI.
* **Attract**: Determines if agents should be attracted to or repelled by the influencer. Appears as "Attract" (My Checkbox) in the UI.
* **Display Radii**: Determines if the radii circles should be displayed. Appears as "Display Radii" (My Checkbox) in the UI.
* **Alert Radius Image**: Optional texture for the alert radius. Appears as "Alert Radius Image" in the UI.
* **Active Radius Image**: Optional texture for the active radius. Appears as "Active Radius Image" in the UI.
* **Event Radius Image**: Optional texture for the event radius. Appears as "Event Radius Image" in the UI.
* **Scale**: Scale factor to adjust the radius by the influencer's scale. Appears as "Scale" in the UI.

### Schema Defaults

* Alert Radius: 10.0 \* Active Radius: 5.0 \* Event Radius: 2.0 \*
Attract: true \* Display Radii: false

### Data Fields

These fields are used internally by the component and are not exposed in
the UI:

* None: The data object is currently empty, indicating that this
component does not use any internal data fields.

### Visibility of Schema Fields

* All fields are always visible in the UI, except for the texture
fields, which are conditionally hidden unless specified otherwise.

### Behavior

When the InfluencerConfig component is added to an entity, it configures
the entity with the specified radii and other properties. This setup
influences how agents react to the influencer based on their proximity.
If "Display Radii" is enabled, circles representing the different
influence zones will be displayed around the entity.

### Example Usage

The InfluencerConfig component is useful for creating and configuring
influencer entities that affect the behavior of other entities within a
defined area. This can be used to create interactive and dynamic
environments where agents respond to influencers based on the properties
set in this configuration.

### Summary

* Purpose: Configures properties of influencer entities that affect the
behavior of other entities within specified radii. 
* Configurable
Inputs: 
* Alert Radius: Distance for alerting agents. 
* Active Radius:
Distance for active influence on agents. 
* Event Radius: Distance for
triggering events. 
* Attract: Determines if agents are attracted or
repelled. 
* Display Radii: Shows or hides the radii circles. 
* Alert
Radius Image: Optional texture for alert radius. 
* Active Radius Image:
Optional texture for active radius. 
* Event Radius Image: Optional
texture for event radius. 
* Scale: Scale factor for the influencer. 
* Behavior: Configures how influencer entities affect other entities based
on their proximity and the properties set in the configuration. 
* UI
Visibility: All inputs are visible except for the texture fields, which
are conditionally hidden.

This component is essential for setting up and managing influencer
entities that dynamically affect the behavior of other entities in the
environment.

## GrassField

### Overview

The GrassField component is responsible for generating a field of grass
within a 3D scene. The grass field is composed of numerous grass blades
that can be configured in terms of size, density, and variation. The
component allows for the creation of a visually dynamic grass field by
specifying textures and adjusting the distribution of grass blades
within a specified area.

### Configurable Inputs

The GrassField component has several configurable inputs defined in its
schema:

* **Grass Texture**: The texture to be applied to the grass blades. Appears as "Grass Texture" in the UI.
* **Plane Texture Size**: The size of the texture plane. Appears as "Plane Texture Size" in the UI.
* **Plane Size**: The overall size of the plane where the grass is generated. Appears as "Plane Size" in the UI.
* **Blade Count**: The number of grass blades to generate. Appears as "Blade Count" in the UI.
* **Blade Width**: The width of each grass blade. Appears as "Blade Width" in the UI.
* **Blade Height**: The height of each grass blade. Appears as "Blade Height" in the UI.
* **Blade Height Variation**: The variation in the height of the grass blades to create a more natural look. Appears as "Blade Height Variation" in the UI.
* **Inner Radius**: The minimum radius from the center where grass blades start to appear. Appears as "Inner Radius" in the UI.
* **Outer Radius**: The maximum radius from the center where grass blades can appear. Appears as "Outer Radius" in the UI.

### Schema Defaults

* Plane Texture Size: 20 
* Plane Size: 50 
* Blade Count: 100,000 
* Blade Width: 0.2 
* Blade Height: 0.4 
* Blade Height Variation: 0.1 
* Inner Radius: 5 
* Outer Radius: 25

### Visibility of Schema Fields

* All fields are always visible in the UI.

### Behavior

When the GrassField component is added to an entity, it initializes a
GrassGenerator that generates the grass field based on the provided
configuration. The grass field is created within the specified inner and
outer radii, with grass blades distributed randomly within this area.
The texture applied to the grass blades can be customized, and the grass
blades can have varying heights to create a natural appearance.

The component also handles the animation of the grass blades by
incrementing the time uniform in the grass material shader.

### Example Usage

The GrassField component is useful for creating large, realistic fields
of grass in a 3D environment. It can be configured to fit different
aesthetic and performance requirements by adjusting the density, size,
and distribution of the grass blades.

### Summary

* Purpose: Generates a configurable field of grass in a 3D scene. \*
Configurable Inputs: \* Grass Texture: Texture applied to grass blades.
* Plane Texture Size: Size of the texture plane. 
* Plane Size: Size of
the grass field. \* Blade Count: Number of grass blades. \* Blade Width:
Width of each grass blade. 
* Blade Height: Height of each grass blade.
* Blade Height Variation: Variation in grass blade height. \* Inner
Radius: Minimum radius for grass blade distribution. 
* Outer Radius:
Maximum radius for grass blade distribution. 
* Behavior: Configures and
generates a dynamic field of grass based on the specified parameters.
Handles the animation of grass blades. 
* UI Visibility: All inputs are
visible in the UI.

This component is essential for creating immersive and visually
appealing grass fields in 3D environments.

## AgentSpawner

### Overview

The AgentSpawner component is responsible for spawning multiple agent
entities within a specified radius in a 3D scene. It initializes each
agent with a model, audio properties, and other configurations, allowing
for dynamic population and interaction within the scene. This component
is useful for creating scenarios where a group of agents need to be
spawned and managed, such as in simulations or games.

### Configurable Inputs

The AgentSpawner component has several configurable inputs defined in
its schema:

* **Base Model**: The texture to be applied to the grass blades. Appears as "Grass Texture" in the UI.
* **Bite Audio**: The audio file to be played when the agent "bites". Appears as "Bite Audio" in the UI.
* **Bite Volume**: The volume level for the bite audio. Appears as "Bite Volume" in the UI.
* **Parent**: The parent entity within which the agents will be spawned. Appears as "Parent" in the UI.
* **Number of Agents**: The number of agents to spawn initially. Appears as "Number Of Agents" in the UI.
* **Radius**: The radius within which the agents will be spawned. Appears as "Radius" in the UI.
* **Scale**: The scale factor for the agents. Appears as "Scale" in the UI.

Schema Defaults

* Number of Agents: 20 
* Radius: 20 
* Scale: 1

### Visibility of Schema Fields

* All fields are visible in the UI.

### Behavior

When the AgentSpawner component is added to an entity, it spawns a
specified number of agents within a given radius around the parent
entity. Each agent is assigned a model, bite audio, and other
configurations based on the component\'s schema.

* Initialization: The component retrieves configuration values for the
agents from the AgentConfig and global configuration. 
* Spawning:
Agents are spawned at random positions within the specified radius. Each
agent is assigned a GLTF model and audio properties. Additional
agent-specific properties are set based on the AgentConfig. 
* Global
Events: The component listens for global spawnAgent events to
dynamically spawn more agents as needed.

### Example Usage

The AgentSpawner component is useful in scenarios where multiple agents
need to be managed dynamically, such as in simulations, games, or
interactive applications. It simplifies the process of initializing and
configuring multiple agents with consistent properties.

### Summary

* Purpose: Spawns and manages multiple agent entities within a
specified radius. 
* Configurable Inputs: 
* Base Model: Model for the
agents. 
* Bite Audio: Audio file for bite sound. 
* Bite Volume: Volume
level for bite audio. 
* Parent: Parent entity for the agents. 
* Number
of Agents: Initial number of agents to spawn. 
* Radius: Radius for
agent spawning. 
* Scale: Scale factor for agents. 
* Behavior:
Initializes agents with models and audio properties, spawns them within
a radius, and responds to global spawn events. 
* UI Visibility: All
inputs are visible in the UI.

This component is essential for creating dynamic and interactive scenes
with multiple agent entities.

## EventManager

### Overview

The EventManager component manages interactions and events between
agents and influencers in a simulation or game. It handles events such
as agents seeking or avoiding influencers, and triggers appropriate
responses like playing audio, dispatching particles, and managing entity
lifecycles. This component is essential for coordinating complex
behaviors and interactions within the 3D environment.

### Configurable Inputs

The EventManager component has several configurable inputs defined in
its schema:

* **Bunny Destroy Audio**: The audio file that plays when a bunny (agent) is destroyed. Appears as "Bunny Destroy Audio" in the UI.
* **Carrot Particle Model**: The particle model used when a bunny "eats" an influencer. Appears as "Carrot Particle Model" in the UI.
* **Bunny Particle Model**: The particle model used when a bunny is destroyed. Appears as "Bunny Particle Model" in the UI.

### Schema Defaults

The component does not specify default values for the inputs.

### Visibility of Schema Fields

* All fields are visible in the UI.

### Behavior

When the EventManager component is added to an entity, it listens for
several global events and manages interactions between agents and
influencers:

* agentInfluencerEvent: This event is triggered when an agent interacts
with an influencer. 
* If the agent's behavior is SEEK, the bunnyEat
function is called, which plays a sound and dispatches a particle burst
at the influencer's location. 
* If the agent's behavior is AVOID, the
destroyBunny function is called, which plays a destruction sound,
dispatches a particle burst at the agent's location, and then deletes
the agent entity. 
* buttonTap: This event toggles the attract state of
influencers and respawns them. 
* Deletes all existing influencers. 
* Toggles the attract property of the first InfluencerSpawner. 
* Dispatches a spawnInfluencer event to respawn influencers. 
* zeroHP:
This event triggers the spawning of a new influencer when an
influencer's health reaches zero.

### Summary

* Purpose: Manages interactions and events between agents and
influencers, including audio playback, particle effects, and entity
lifecycle management. 
* Configurable Inputs: 
* Bunny Destroy Audio:
Audio file for agent destruction. 
* Carrot Particle Model: Particle
model for the eat action. 
* Bunny Particle Model: Particle model
for agent destruction. 
* Behavior: Listens for global events, handles
agent-influencer interactions, toggles influencer states, and manages
particle effects and audio playback. 
* UI Visibility: All inputs are
visible in the UI.

This component is crucial for managing complex event-driven interactions
in simulations or games, ensuring coordinated behaviors and responses
within the virtual environment.

* Appears as Alert Animation when Animated is true.

## Follower Influencer

### Overview

The FollowInfluencer component enables an entity to follow the closest
influencer entity within the world. It achieves this by interpolating
(lerping) the entity\'s position towards the position of the influencer.
This component is useful for creating entities that exhibit chasing or
following behaviors in response to influencers.

### Configurable Inputs

The FollowInfluencer component has one configurable input defined in its
schema:

* **Lerp Amount**: Determines the interpolation factor for how quickly the entity moves towards the influencer's position. This value influences the speed of the following behavior. Appears as "Lerp Amount" in the UI.

### Schema Defaults

* Lerp Amount: The default value is set to 1, meaning the entity will
move directly to the influencer\'s position without gradual
interpolation.

### Visibility of Schema Fields

* Lerp Amount: This field is visible in the UI and can be adjusted to
control the following behavior of the entity.

### Behavior

When the FollowInfluencer component is added to an entity, it performs
the following actions:

* Initialization: When the component is added to an entity, it prepares
any necessary data. \* Tick: On each tick (frame update), the component:
* Queries the world to find influencer entities. 
* If no influencers
are found, it logs a message and exits the update. 
* If influencers are
found, it retrieves the position of the closest influencer. 
* Retrieves
the position of the entity with the FollowInfluencer component. 
*
Interpolates the entity's position towards the influencer's position
using the configured lerp amount. 
* Updates the entity\'s position in
the world to the new interpolated position. 
* Remove: When the
component is removed from an entity, it performs any necessary cleanup.

### Summary

* Purpose: Enables an entity to follow the closest influencer by
interpolating its position towards the influencer's position. 
* Configurable Input: * Lerp Amount: Controls the speed of the following
behavior. 
* Behavior: On each tick, the entity moves towards the
closest influencer using linear interpolation based on the lerp amount.
* UI Visibility: The \"Lerp Amount\" field is visible and adjustable in
the UI.

This component is essential for creating dynamic behaviors where
entities need to follow or chase influencers within a virtual
environment.

## GlobalConfig

### Overview

The GlobalConfig component is used to define and store global
configuration settings for the application. These settings typically
include boundaries and limits that affect various systems and components
within the virtual world. This component is essential for ensuring
consistent and centralized configuration management.

### Configurable Inputs

The GlobalConfig component has three configurable inputs defined in its
schema:

* **X Bound**: Defines the boundary limit along the X-axis. Appears as "X Bound" in the UI.
* **Z Bound**: Defines the boundary limit along the Z-axis. Appears as "Z Bound" in the UI.
* **Radius**: Specifies a radius value that can be used for various calculations and constraints. Appears as "Radius" in the UI.

### Schema Defaults

The GlobalConfig component does not specify default values for its
schema inputs. Each value should be provided as needed for the specific
application requirements.

### Visibility of Schema Fields

All schema fields (X Bound, Z Bound, and Radius) are visible in the UI
and can be adjusted to configure the global settings as required.

### Behavior

When the GlobalConfig component is added to an entity, it performs the
following actions:

* Initialization: Logs a message indicating that the GlobalConfig has
been added. 
* Remove: Logs a message indicating that the GlobalConfig
has been removed.

### Utility Function

The getGlobalConfig function is provided to retrieve the current global
configuration from the world. This function queries the world for the
GlobalConfig entity and returns its settings.

### Summary

* Purpose: Defines global configuration settings for the application,
such as boundary limits and radius values. 
* Configurable Inputs: 
* X
Bound: Defines the boundary limit along the X-axis. 
* Z Bound: Defines
the boundary limit along the Z-axis. 
* Radius: Specifies a radius value
for various calculations. 
* Behavior: Logs messages upon addition and
removal of the component. 
* Utility Function: getGlobalConfig retrieves
the current global configuration settings. 
* UI Visibility: All schema
fields (X Bound, Z Bound, and Radius) are visible and adjustable in the
UI.

This component is essential for managing and maintaining consistent
global settings across different parts of the application.

## Health

### Overview

The Health component is used to manage and track the health of an
entity. This component allows entities to have a health value that can
be reduced in response to events, and triggers actions such as scaling
the entity based on its remaining health and deleting the entity when
health reaches zero.

### Configurable Inputs

The Health component has one configurable input defined in its schema:

* **Health**: An integer value representing the starting health of the entity. Appears as "Health" in the UI.

Schema Defaults

* Health: 5 (default value)

### Visibility of Schema Fields

The schema field (Health) is visible in the UI and can be adjusted to
set the initial health of the entity.

### Behavior

When the Health component is added to an entity, it performs the
following actions:

* Initialization: Logs a message indicating that the Health component
has been added. \* Event Listener: Listens for the reduceHealth event to
decrease the health value. 
* Health Reduction: When the health is
reduced, the component scales the entity based on its remaining health.
* Scale Adjustment: The entity and its children are scaled
proportionally to reflect the reduced health. \* Entity Deletion: If
health reaches zero, the entity is deleted, and a zeroHP event is
dispatched.

### Summary

* Purpose: Manages the health of an entity, allowing it to be reduced
in response to events and triggering actions based on remaining health.
* Configurable Inputs: 
* Health: Initial health value of the entity.
* Schema Default: Health defaults to 5. 
* Behavior: \* Initializes
with a starting health value. 
* Listens for reduceHealth events to
decrement health. 
* Scales the entity and its children based on
remaining health. 
* Deletes the entity and dispatches a zeroHP event
when health reaches zero. 
* UI Visibility: The Health field is visible
and adjustable in the UI.

This component is essential for entities that require health management,
such as game characters or destructible objects.

## InfluencerSpawner

### Overview

The InfluencerSpawner component is responsible for spawning influencer
entities within a specified radius. Influencers can either attract or
repel agents, and they can have associated models, sounds, and
animations. This component also allows setting initial health for the
influencer and provides functionality for dragging the influencer
around.

### Configurable Inputs

The InfluencerSpawner component has several configurable inputs defined
in its schema:

* **Audio Volume**: The volume level for the influencer's audio. Appears as "Audio Volume" in the UI.
* **Attract Model**: The GLTF model to use when the influencer is set to attract. Appears as "Attract Model" in the UI.
* **Attract Audio**: The audio file to play when the influencer is set to attract. Appears as "Attract Audio" in the UI.
* **Attract Scale**: The scale of the influencer when set to attract. Appears as "Attract Scale" in the UI.
* **Repel Model**: The GLTF model to use when the influencer is set to repel. Appears as "Repel Model" in the UI.
* **Repel Audio**: The audio file to play when the influencer is set to repel. Appears as "Repel Audio" in the UI.
* **Repel Scale**: The scale of the influencer when set to repel. Appears as "Repel Scale" in the UI.
* **Parent**: The parent container entity in which to spawn influencers. Appears as "Parent" in the UI.
* **Radius**: The radius within which influencers are spawned. Appears as "Radius" in the UI.
* **Health**: The initial health value for the influencer. Appears as "Health" in the UI.
* **Attract**: A boolean indicating whether the influencer attracts or repels agents. Appears as "Attract" in the UI.
* **Attract Idle Animation**: The animation to play when the attract influencer is idle. Appears as "Attract Idle Animation" in the UI.
* **Attract Move Animation**: The animation to play when the attract influencer is moving. Appears as "Attract Move Animation" in the UI.
* **Attract Event Animation**: The animation to play during events for the attract influencer. Appears as "Attract Event Animation" in the UI.
* **Repel Idle Animation**: The animation to play when the repel influencer is idle. Appears as "Repel Idle Animation" in the UI.
* **Repel Move Animation**: The animation to play when the repel influencer is moving. Appears as "Repel Move Animation" in the UI.
* **Repel Event Animation**: The animation to play during events for the repel influencer. Appears as "Repel Event Animation" in the UI.

### Schema Defaults

* Radius: 15

### Visibility of Schema Fields

All schema fields are visible in the UI unless otherwise noted. There
are no conditionally hidden fields in this component.

### Behavior

When the InfluencerSpawner component is added to an entity, it performs
the following actions:

* Initialization: Logs a message indicating that the InfluencerSpawner
component has been added. 
* Retrieve Configurations: Attempts to
retrieve influencer and global configurations to set up influencer
properties. 
* Spawn Influencer: Spawns an influencer with the specified
properties such as model, audio, animations, scale, and health. The
influencer's position is randomized within the defined radius. 
* Event
Listener: Listens for the global spawnInfluencer event to spawn
additional influencers as needed.

### Summary

* Purpose: Spawns influencer entities that can attract or repel agents,
with customizable models, sounds, animations, and health. 
* Configurable Inputs: 
* Audio Volume 
* Attract Model 
* Attract Audio
* Attract Scale 
* Repel Model 
* Repel Audio 
* Repel Scale 
* Parent
* Radius 
* Health 
* Attract 
* Attract Idle Animation 
* Attract Move
Animation 
* Attract Event Animation 
* Repel Idle Animation 
* Repel
Move Animation 
* Repel Event Animation 
* Schema Default: Radius
defaults to 15. 
* Behavior: 
* Initializes with specified
configurations. 
* Spawns influencers based on attract or repel
settings. 
* Listens for global events to spawn additional influencers.
* UI Visibility: All schema fields are visible and adjustable in the
UI.

This component is essential for managing and spawning influencer
entities that interact with agents in different ways based on attraction
or repulsion properties.

## SimpleButton

### Overview

The SimpleButton component creates a customizable button element on the
screen, which can trigger an event and play an audio clip when clicked.
The button\'s appearance, position, and size are configurable through
the schema inputs.

### Configurable Inputs

The SimpleButton component has several configurable inputs defined in
its schema:

* **Image Url**: The URL of the image to be displayed on the button. Appears as "Image Url" in the UI.
* **Top**: The top position of the button on the screen. Appears as "Top" in the UI.
* **Right**: The right position of the button on the screen. Appears as "Right" in the UI.
* **Height**: The height of the button. Appears as "Height" in the UI.
* **Width**: The width of the button. Appears as "Width" in the UI.

Schema Defaults

* Top: 10px 
* Right: 10px 
* Height: 36px 
* Width: 36px

### Visibility of Schema Fields

All schema fields are visible in the UI. There are no conditionally
hidden fields in this component.

### Behavior

When the SimpleButton component is added to an entity, it performs the
following actions:

* Initialization: Logs a message indicating that the SimpleButton
component has been added. 
* Create Container: Creates a div container
to hold the button image, and positions it based on the schema inputs.
* Set Image: Adds an img element inside the container, setting its
source to the provided imageUrl and making it fill the container. 
* Event Listener: Adds a click event listener to the image, which plays an
audio clip and dispatches a buttonTap event when the button is clicked.

### Summary

* Purpose: Creates a button on the screen with a customizable image,
position, and size, which plays an audio clip and dispatches an event
when clicked. 
* Configurable Inputs: 
* Image Url 
* Top 
* Right 
* Height 
* Width 
* Schema Defaults: 
* Top: 10px 
* Right: 10px
* Height: 36px 
* Width: 36px 
* UI Visibility: All schema
fields are visible and adjustable in the UI.

This component is useful for adding interactive buttons to the screen
with specific visual and functional properties defined by the user.

## SkyBox

### Overview

The SkyBox component is responsible for adding a skybox to the scene. A
skybox is a large sphere surrounding the entire scene that uses a
texture to simulate the sky or environment. This component allows you to
specify a texture that will be used for the skybox, creating an
immersive background for your 3D environment.

### Configurable Inputs

The SkyBox component has one configurable input defined in its schema:

* Texture: The URL of the texture to be used for the skybox. Appears as "Texture" in the UI.

Visibility of Schema Fields

* Texture: This field is always visible in the UI.

### Behavior

When the SkyBox component is added to an entity, it performs the
following actions:

* Initialization: Logs a message indicating that the SkyBox component
has been added. 
* Load Texture: Loads the texture specified by the
texture URL. 
* Create Material: Creates a THREE.MeshBasicMaterial using
the loaded texture and sets it to render the inside of the sphere
(THREE.BackSide). 
* Create Geometry: Creates a THREE.SphereGeometry
with a large radius (500 units) to serve as the skybox. 
* Create Mesh:
Creates a THREE.Mesh using the geometry and material. 
* Add to Scene:
Adds the skybox mesh to the scene and stores a reference to it in the
component for later removal.

When the SkyBox component is removed from an entity, it performs the
following actions:

* Cleanup: Logs a message indicating that the SkyBox component has been
removed. 
* Remove from Scene: If a skybox mesh was created and stored,
it removes this mesh from the scene.

### Summary

* Purpose: Adds a skybox to the scene using a specified texture,
creating an immersive background. 
* Configurable Inputs: \* Texture:
The URL of the texture to be used for the skybox. 
* UI Visibility: The Texture field is always visible in the UI.

This component is useful for setting up a visually appealing background
in a 3D scene, enhancing the overall environment by surrounding it with
a custom texture.