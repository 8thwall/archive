# Putt Putt Paradise

Putt Putt Paradise is a modular, cross-device mini-golf game built with [8th Wall Studio](https://www.8thwall.com/), leveraging its visual editor, ECS architecture, and state machines. Each "space" serves a clear purpose in the game’s journey, and every component is designed to be highly reusable and customizable.

---

### **Start Screen**

The entrypoint for Putt Putt Paradise, presenting the "New Game" button and adapting the experience for mobile or desktop users. This space also enables sound and sets up the initial state of the game.

#### **StartGame.ts**

Controls all start screen logic, device setup, and transition into gameplay.

- **Detects mobile vs. desktop:** Adapts the UI, hides desktop controls if on mobile, and adjusts camera distance for smaller screens.
- **Handles button interactions:** "New Game" triggers sound unlock (for mobile), hover/click effects, and sets up a smooth transition.
- **Transitions to gameplay:** Loads the first playable hole (`Hole 1`) when the game starts.

![](https://static.8thwall.app/assets/Screen_Recording_2025-08-05_at_1.51.54%E2%80%AFAM-rrmyirmi6q.gif)

---

### **Hole 1** - Par 3

The first playable golf hole, where core mechanics are introduced and the player can take their first shot.

#### **LoadingScreen.ts**

While assets load, an animated loading bar and percentage indicator are shown. Once all assets are ready, the UI fades out and gameplay begins.

- **Animated progress bar & percentage label:** Smoothly interpolates percent for visual polish.
- **Ensures assets are loaded:** Waits for all pending assets and ensures a minimum visible loading time.
- **Fade-out & transition:** Fades the loading UI out, enables the overlay/game UI, and dispatches a `level-loaded` event to trigger game logic.

#### **GolfOrbitControls.ts**

Implements a highly configurable, smooth orbit camera.

- **Full schema for customization:** Supports min/max angles, invert axes, inertia, zoom, and controller support.
- **Multiple input types:** Touch, mouse, and controller with optional pointer lock.
- **Camera focus:** Can be set to focus on specific entities for drama (e.g., focuses on hole after scoring).

#### **PlayerControls.ts**

Manages all input, aiming, swinging, and physics for the golf ball.

- **Power meter UI:** Animates bar height and color based on power.
- **Aiming:** Left/right input via UI, keyboard, or gamepad rotates the golf club.
- **Swing mechanic:** Handles swing animation, launches the ball with physics impulse.
- **Respawn:** If the ball falls out-of-bounds, it is respawned at the last safe position.

#### **HoleScore.ts**

Tracks strokes, scoring, and result overlays for the current hole.

- **Collision-based scoring:** Detects when the ball reaches the hole.
- **Golf terminology:** Displays "Birdie," "Par," etc. based on player’s strokes vs par.
- **Celebratory feedback:** Shows particle effects and plays audio for scoring.
- **UI management:** Handles transitions between gameplay UI and results overlays.
- **Next hole progression:** On scoring, triggers transition to the next hole.

![](https://static.8thwall.app/assets/Screen_Recording_2025-08-05_at_1.51.54%E2%80%AFAM-bvff7npu4l.gif)

---

### **Hole 2** - Par 10

The second hole of the game, providing multi-hole gameplay with increasing complexity or hazards.

#### **LavaShader.ts**

Adds animated lava effects to course hazards or themed areas using a custom Three.js shader.

- **Procedural visuals:** Animated with time-based uniforms for flowing motion.
- **Custom textures:** Loads and repeats lava/cloud assets for seamless visuals.
- **Fog and color handling:** Integrated for extra atmosphere.

![](https://static.8thwall.app/assets/Forge_OUZ-16mfp506q8.gif)

---

### **UI**

A cross-space UI layer that shows scores and progress throughout the game.

#### **ScoreKeeper.ts**

Manages the running score log and par/score feedback UI.

- **Event-driven updates:** Listens for `hole-scored` events from `HoleScore.ts`.
- **Dynamic UI log:** Instantiates new score entries as holes are played.
- **Color feedback:** Green for under par, red for over par, white for par.

![](https://static.8thwall.app/assets/54Krn-g99lb47i2r.png)

---

### **Putt Putt Factory**

A development and prototyping space, used as a staging ground for the putt putt prefab system.

![](https://static.8thwall.app/assets/L00FQ-ge62b4bo1u.png)
