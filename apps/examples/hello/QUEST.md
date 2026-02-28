# Hello 8th Wall: Your First Quest 🏝️

Welcome to **8th Wall Studio**, your playground for creating, designing, and publishing your own web games and AR experiences.

In this quest, you’ll explore 8th Wall island, learn the basics of building in Studio, and publish your first experience to the web.

---

## Explore the Interface

Before we start building, take a quick tour of Studio.

![](./assets/quest/interface.png)

The interactive tour will launch automatically the first time you open your project.

If you skipped it, you can relaunch the tour anytime from **Help → Get Started → Studio Product Tour**.

For a deeper dive into the interface, see [here](https://www.8thwall.com/docs/studio/getting-started/navigate-interface/).

---

## Navigate the Viewport

Use these shortcuts to move around your 3D scene:

- **Orbit** – `Option + Left Click + Drag`
- **Pan** – `Right Click + Drag`
- **Zoom** – `Scroll`

![](./assets/quest/viewport.gif)

Try orbiting around your island and locating the **golden key** in the scene!

---

## Play the Experience

Click **Play** to launch the simulator.

![](./assets/quest/simulator-button.png)

Use your keyboard to explore:

- **Arrow Keys** → Move the ball
- **Space Bar** → Jump

Collect the key to unlock the treasure chest and reveal the 8th Wall jewel!

When you're done, press **Stop** to return to the editor.

![](./assets/quest/simulator.gif)

---

## Switch Spaces

Each project can contain multiple **Spaces** — like levels or scenes.

In the **top-left corner**, open the **Space Selector**.

![](./assets/quest/space-selector.png)

Switch from **8th Wall Island** → **My Island** _(a blank starter island)_.

![](./assets/quest/switch-space.gif)

In **Project Settings**, make "My Island" the **Entry Space**.

![](./assets/quest/entry-space.png)

**Tip:** Spaces can share persistent objects (like UI or lights). Learn more [here](https://www.8thwall.com/docs/studio/guides/spaces/).

---

## Add and Position Entities

Now it’s your turn to create!

Open the **Models** folder from the Assets pane in the left sidebar to explore the 3D models in the project. Click on any model to preview it in the inspector.

![](./assets/quest/assets.png)

Drag objects like crates, platforms, and palm trees into your scene.

![](./assets/quest/position.gif)

Use the transform gizmos in the top left to **move (W)**, **rotate (E)**, and **scale (R)** objects.

![](./assets/quest/gizmos.png)

Experiment by building your own mini obstacle course to the key!

![](https://static.8thwall.app/assets/Screenshot_2025-10-13_at_3.59.50%E2%80%AFPM-cm7s8cic25.png)

---

## Add Colliders and Animations

Let’s make your obstacles interactive:

1. Select an object → Click **Add Component** → Choose **Physics Collider**

   - Use **Static** for walls and ground.
   - Use **Kinematic** or **Dynamic** for moving parts.

2. Add a **Position Animation** to create simple motion (like a floating platform).  
   Adjust duration and easing for smooth results.

[INSERT GIFS]

---

## Customize Materials and Models

Feeling creative?

- Open **Asset Viewer** to change material colors.
- Try uploading your own textures or models into **Asset Lab**.
- Explore the **Materials Tab** to tweak colors, metallic, and roughness values.

[INSERT GIFS]

TODO: ADD SOMETHING ABOUT ASSET LAB

---

## Land and Publish

You’ve built your own island — now share it!

Click **Land** to commit your changes.

![](./assets/quest/land-button.png)

Add a short commit message (e.g., "Created my first island!").

![](./assets/quest/land-message.png)

Click **Land Files + Publish** to make your experience live on the web.

🎉 **Congrats! You’ve built and published your first 8th Wall experience.**
Share your link and explore what others create in the 8th Wall Community!

---

**Next Steps:**

Join the [8th Wall Discord](https://8th.io/discord) to share your island and connect with other creators!

Visit the [8th Wall Documentation](https://8thwall.com/docs) to learn more about components and scripting.

.
