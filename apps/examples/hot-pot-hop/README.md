# A-Frame: Hot Pot Hop (Shared AR Game)

"Hot Pot Hop" uses the Shared AR module to enable a multiplayer game where players compete for the title of "Last Crab Standing!". It features a customized Lobby Pages, networked gameplay and more.

**Note**: Shared AR is supported on `Plus`, `Pro`, and `Enterprise` plans. It is **not supported**
for `Starter` plans.

![](https://static.8thwall.app/assets/hot-pot-hop-game-start-ac46ya0185.gif)

This project uses [Networked A-Frame](https://github.com/networked-aframe/networked-aframe) to sync player data like position and animations.

For detailed documentation, visit the [Shared AR module page](https://www.8thwall.com/8thwall/modules/shared-ar).

### Project Overview

- /components
  - **character-logic.js** manages the character's behavior in the game
    - `basic-collider`: Checks if an enemy is at the same z position as the player within a specified threshold,
      and if the player is not jumping, triggers the 'client-died' event.
      This component is not networked. Each player checks is responsible for their collisions.
      - enabled: determines whether the collision is running (default: false)
      - enemySelector: element selector for enemy entity to track (default: '#enemy')
      - zThreshold: the z distance threshold when checking the enemy's position against the player (default: 0.1)
      - minHeight: the min distance the player must jump to avoid collision with the enemy (default: 2.5)
    - `jump-controller`: Allows an entity to jump in response to click events, simulating physics with gravity.
      Networked AFrame is used to sync jump start time, but the whole animation
      is simulated locally on each clienty.
      - enabled: determines whether the player can jump (default: true)
      - jumpHeight: The maximum height (in A-Frame units) that the entity will reach at the peak of its jump. (default: 1.0)
      - jumpDurationMs: The total duration (in milliseconds) of the jump from start to finish.
        It includes both the ascending and descending phases of the jump. (default: 1000)
      - groundY: The base position or 'ground level' (in A-Frame units) from which the jump starts
        and to which it returns. (default: 0)
      - jumpStartTimeMs: The start time (in milliseconds from epoch) of the jump. The jump will not
        start until this time has been reached. If this value is -1, the jump will not start until
        a new value is set via networking. (default: -1)
    - `character-animator`: Manages character animations.
      Initializes and stores a set of animation actions when a model is loaded.
      This component is not networked. Each player is responsible for their animations.
      - currentAnimation: sets the current animation to play (default: 'Idle')
      - loop: determines whether the animation clip loops (default: true)
      - duration: determines the length in ms of the crossfade duration from the previous clip (default: 0)
      - stopAtEnd: sets whether animation stops at the end or resets back to the first frame; AKA clampWhenFinished (default: false)
    - `death-animation`: Plays a "death lerp" movement that simulates crab death, when play() is called.
    - `attack-pattern`: Moves an entity along a defined curve path, creating an escalating attack pattern.
      This component is not networked. It is aproximately in sync throughout all clients
      due to the fact that we sync game start time via synchronized server time.
      - enabled: determines whether the enemy can move (default: false)
      - loopsPerRound: how many animation loops the enemy plays before increasing speed (default: 2)
      - initialDuration: how long, in milliseconds, the first attack loop takes (default: 6000)
  - **multiplayer.js** configures the multiplayer experience
    - `getNameForClientId()`: retrieves and returns the name associated with a given client ID
    - `lobby-handler`: Listens to lobby events and sets the appropiate user states. Also responsible for initializing XRWeb.
      Does not use Networked AFrame properties.
      - newTabNewUser: every new browser tab is a different user, useful for development (default: false)
    - `game-starter`: Listents to lobby countdowns and starts the countdown to game start.
      It shows the appropiate UI and handles enemy state on start as needed.
      - startTimeMs: Property that is used to synchronize the game start time.
        This is synced via Shared AR API directly.
        Only one peer will set this property, using the synchronized server time. (default: 0)
    - `gameover-handler`: Tracks the players that are still "alive"
      and triggers the death UI to show on last crab standing.
      It sends death messages and listens for them.
      Does not use Networked AFrame.
    - `player-spawner`: Makes crabs visible when countdown is over, sets their position, color, and
      spawns a random fruit underneath them.
      Uses Networked AFrame to spawn crabs for all players.
    - `player-info`: Gets the player's username (set in the lobby) from lobby event details
      and creates a name tag to attach to each crab.
      Uses Networked AFrame to show name tags for all players.
- /utils
  - **along-path.js**: allows for an entity to move along a path defined by a curve. Based on [aframe-alongpath-component](https://github.com/protyze/aframe-alongpath-component)
  - **curve-component.js**: draws curves in A-Frame. Based on [aframe-curve-component](https://github.com/protyze/aframe-curve-component)

### Development Tips

- The URL and QR code generated in the lobby from a preview link ("name-client-workspace.dev.8thwall.app/app-name")
  will require authentication to access. You will need to authenticate each client device with a Cloud Editor preview QR code before using the lobby URL/QR code.
- To support multiple players on the same desktop computer (common for development), you will need to
  either open the lobby URL in different browsers on the same computer OR set the lobby-handler parameter
  `newTabNewUser` to true. This will configure the module to identify each tab (and every page reload) as a different user.
  Useful for debugging, but not recommended for production.

### Lobby Page

![](https://static.8thwall.app/assets/hot-pot-hop-30-5ja3hfu322.gif)

### Attribution

[Wooden Spoon](https://skfb.ly/oyDTX) by Speed
