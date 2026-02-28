# Catch The Stack

A fun and addictive burger-stacking game built with 8th Wall Studio. Players control a stack of burger ingredients, catching falling toppings while avoiding the dreaded top bun that ends the game.

![](https://static.8thwall.app/assets/Screen_Recording_2025-09-30_at_4.16.00%E2%80%AFPM-yhvfnme69h.gif)

## Game Overview

Catch The Stack is a 3D skill-based game where players:

- Control a burger stack using device tilt (mobile) or arrow keys (desktop)
- Catch falling ingredients (patty, lettuce, tomato, cheese, onion) to build their burger
- Avoid the top bun which ends the game
- Build score streaks by catching the same ingredient consecutively
- Compete for high scores with dynamic difficulty scaling

### Core Gameplay Mechanics

- **Movement**: Stack moves left/right based on device orientation or keyboard input
- **Ingredient Spawning**: Random ingredients fall from above at increasing speed
- **Collision Detection**: Ingredients stack on top of each other when caught
- **Scoring System**: Base score of 50 points per ingredient, multiplied by current streak
- **Streak Bonus**: Catching consecutive identical ingredients increases the multiplier
- **Camera Tracking**: Camera smoothly follows the growing stack upward
- **Game Over**: Triggered when the top bun is caught

## Project Structure

### Core Components

#### [`GameManager`](./game-manager.ts)

The main orchestrator of the game, responsible for:

**Schema Configuration:**

- UI element references (score display, game over screens, etc.)
- Camera and stack base references
- Visual elements (scroll backgrounds, score texts)

**Game State Management:**

```typescript
// Main game states
- loadingGame → inGame → gameOver → goBackToMainMenu
```

**Key Responsibilities:**

- **Scoring System**: Manages score calculation with streak multipliers
- **Camera Control**: Smooth interpolation following the growing stack
- **Ingredient Spawning**: Time-based spawning
- **UI Updates**: Real-time score, streak, and high score display
- **Game Over Logic**: Handles end-game conditions and cleanup

**Key Events:**

- `GameEvents.INGREDIENT_CAUGHT` - Triggered when ingredients are caught, updates score and streak
- `'TopBunCaught'` - Ends the game when top bun is caught
- `'GameOver'` - Transitions to game over state
- `'StartGame'` - Begins gameplay from loading state
- `GameEvents.GO_BACK_TO_MAIN_MENU` - Returns to main menu
- `ecs.input.UI_CLICK` - Handles play again and main menu button clicks

#### [`StackMovementController`](./stack-movement-controller.ts)

Handles player input and stack movement:

**Input Methods:**

- **Desktop**: Left/Right arrow keys with smooth movement
- **Mobile**: Device orientation (gyroscope) with tilt-based control

**Movement Logic:**

- Bounded movement within camera frustum limits
- Smooth gamma filtering to reduce tilt jitter
- Dynamic boundary calculation based on camera position

```typescript
// Movement bounds calculation
const {minX, maxX} = getHorizontalLimitsAtZ(camera, cameraZ, stackZ)
```

**Key Events:**

- `'GameOver'` - Transitions to game over state and stops movement
- `'StartGame'` - Returns to active movement state from game over
- `'deviceorientation'` - Listens for mobile device tilt input

#### [`StackItemCollider`](./stack-item-collider.ts)

Manages the physics and stacking mechanics:

**State Machine:**

```typescript
falling → stackTop → stackBelow
```

**Collision Handling:**

- Detects when falling ingredients hit the stack
- Positions ingredients with slight offsets for natural stacking
- Updates global stack height for camera tracking
- Manages ingredient parenting to the bottom bun

**Key Events:**

- `ecs.physics.COLLISION_START_EVENT` - Detects ingredient collisions
- `'hit'` - Handles when ingredients hit the stack top
- `'stack top'` - Triggers when ingredient becomes top of stack
- `GameEvents.RESET_FALLING_STATE` - Resets ingredients to falling state
- `GameEvents.RESET_BASE_OF_STACK` - Resets bottom bun state
- `GameEvents.GO_BACK_TO_MAIN_MENU` - Cleans up ingredients when returning to menu

#### [`ingredient.ts`](./ingredient.ts) - Ingredient Management System

Ingredient spawning and pooling system:

**Ingredient Types:**

- Regular ingredients: Patty, Lettuce, Tomato, Cheese, Onion (90% spawn rate)
- Game-ending: TopBun (10% spawn rate)

**Entity Pooling:**

- Pre-instantiated ingredient entities for performance
- Efficient recycling of ingredients between games
- Configurable pool sizes per ingredient type

**Physics Configuration:**

- Dynamic colliders with locked rotation axes
- Collision detection optimized for stacking

#### [`main-menu.ts`](./main-menu.ts) - Menu System

Handles the main menu experience:

**Responsive Design:**

- Different instructions for mobile vs desktop
- Adaptive background images based on device type
- iOS-specific permission handling for gyroscope access

**Permission Management:**

- Device orientation permission prompts for iOS
- Graceful fallback when permissions denied

**Key Events:**

- `'ToPreGame'` - Internal transition from pre-pre-game to pre-game state
- `ecs.input.UI_CLICK` - Handles play button clicks to start game
- `toInGame` trigger - Transitions to gameplay
- `toInstruction` trigger - Shows instruction screen

#### [`audio-controller.ts`](./audio-controller.ts) - Audio Management

Comprehensive audio system:

**Sound Effects:**

- Item collection sounds with streak differentiation
- Game over audio feedback
- Haptic vibration patterns for mobile devices

**Music Management:**

- Intro music for main menu
- Background music during gameplay
- Smooth transitions between game states

**Key Events:**

- `'StartGame'` - Transitions from intro music to background music
- `GameEvents.GO_BACK_TO_MAIN_MENU` - Returns to intro music state
- `'ItemCollected'` - Plays item collection sound effect
- `'StreakBonus'` - Plays streak bonus sound effect
- `'TopBunCaught'` - Plays game over sound effect

### Utility Systems

#### [`utils.ts`](./utils.ts) - Cross-Platform Utilities

Essential helper functions:

**Device Detection:**

- Mobile/desktop platform identification
- iOS/Android specific handling

**Permissions & UI:**

- Device orientation permission requests
- Safe area inset calculations
- Status bar color theming
- Viewport configuration

**Game Utilities:**

- Camera frustum calculations for movement bounds
- High score persistence with localStorage
- Haptic feedback integration

#### [`global-stack-height.ts`](./global-stack-height.ts) - Stack Height Tracking

Simple but crucial height management:

```typescript
const GlobalStackHeight = {
  updateStackHeight: (newHeight: number) => { stackHeight = newHeight },
  getStackHeight: () => stackHeight
}
```

#### [`entity-pool.ts`](./entity-pool.ts) - Performance Optimization

Entity pooling system for efficient memory management:

- Pre-allocated entity pools by type
- Automatic recycling and cleanup
- Performance-optimized for mobile devices

#### [`event-ids.ts`](./event-ids.ts) - Event System

Centralized event constants for type-safe communication:

```typescript
const GameEvents = {
  GO_BACK_TO_MAIN_MENU: 'GoBackToMainMenu',
  INGREDIENT_CAUGHT: 'IngredientCaught',
  RESET_BASE_OF_STACK: 'ResetBaseOfStack',
  RESET_FALLING_STATE: 'RestFallingState',
}
```

## Game Flow Architecture

### 1. Main Menu Phase

- Device-appropriate instructions display
- Permission handling for mobile devices
- Background music and theming
- Transition to gameplay

### 2. Loading Phase

- Asset loading verification
- UI initialization
- Camera and world setup

### 3. Gameplay Phase

```typescript
// Core gameplay loop
onTick() {
  // Update camera position following stack
  // Check for ingredient spawning timing
  // Handle player input and movement
  // Process collision detection
}
```

### 4. Scoring System

Advanced scoring with streak mechanics:

```typescript
const ingredientScore = 50 * currentStreak
// Streak increases with consecutive identical ingredients
// Resets to stack height when breaking streak
```

### 5. Game Over Handling

- High score comparison and storage
- Personalized game over messages based on score
- Option to restart or return to main menu

## Technical Implementation Details

### Performance Optimizations

- **Entity Pooling**: Pre-allocated ingredient entities for zero-allocation spawning
- **Smooth Camera**: Exponential smoothing for jitter-free camera movement
- **Efficient Collision**: Event-only colliders for stacked ingredients
- **Asset Preloading**: All models and audio loaded before gameplay

### Cross-Platform Compatibility

- **Mobile**: Gyroscope tilt controls with permission handling
- **Desktop**: Keyboard arrow key controls
- **Responsive UI**: Adaptive layouts for different screen sizes
- **iOS Specific**: Full-screen support and permission overlays

### State Management

The game uses 8th Wall Studio's state machine system extensively:

- Component-level state machines for complex behaviors
- Event-driven communication between components
- Clean state transitions with proper cleanup

### Physics Integration

- **Dynamic Ingredients**: Mass-based falling physics
- **Static Stack**: Ingredients become static when stacked
- **Bounded Movement**: Physics-aware movement constraints

## Assets Structure

```
assets/
├── Models/           # 3D ingredient models (.glb)
│   ├── patty.glb
│   ├── lettuce.glb
│   ├── tomato.glb
│   ├── cheese.glb
│   ├── onion.glb
│   └── bun-top.glb
├── Audio/            # Game audio files
│   ├── background-music.mp3
│   ├── intro-music.mp3
│   ├── item-collected.mp3
│   ├── streak-bonus.mp3
│   └── game-over.mp3
├── VerticalScroll/   # Background scroll images
│   └── scroll_*.jpg
└── *.jpg            # UI background images
```

## Development Notes

### Component Dependencies

- GameManager orchestrates overall game flow
- StackMovementController requires camera reference
- StackItemCollider needs bottom bun reference
- All components communicate via centralized events

### Extensibility Points

- **New Ingredients**: Add to `TYPES` array and `MODEL_PATHS`
- **Scoring Variations**: Modify score calculation in `GameManager`
- **Movement Modes**: Extend input handling in `StackMovementController`
- **Audio Events**: Add new sound triggers in `audio-controller`

### Mobile Considerations

- Gyroscope permissions must be requested on iOS
- Haptic feedback enhances mobile experience
- Different scaling factors for mobile vs desktop
- Safe area handling for notched devices

## Getting Started

1. **Scene Setup**: The game has two scenes (Main Menu and Game Scene)
2. **Component Assignment**: Attach appropriate components to entities
3. **Asset References**: Configure all asset references in component schemas
4. **UI Setup**: Connect UI elements to component references
5. **Testing**: Test both mobile tilt and desktop keyboard controls

The modular architecture makes it easy to modify individual aspects of the game while maintaining the core mechanics. Each component handles its own state and communicates through the event system, ensuring clean separation of concerns.

For setting up your own components in a Studio projects see the [docs](https://www.8thwall.com/docs/studio/guides/custom-components/#registering-a-custom-component)

---

---

---
