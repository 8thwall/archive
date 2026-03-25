# Studio: This or That

This project demonstrates how to create a this or that face filter effect, using head tilt as an input selection mechanism to select between two options. The quiz options dynamically change after each selection, offering a variety of choices.

![](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWllYmdtbXE4ZmoyYXQ2NnQxNWdrb3R0d2hqc3gzMHl3eXo1bXB0dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ERw8p3fyapse12mrBn/giphy.gif)

## Components

### `select.js`

The core component responsible for managing the quiz options and processing head tilts to make selections.

#### Functionality

When the `select` component is added to an entity:

- **Displays two options** (e.g., "McDonald's" vs "Chick-fil-A") using logos.
- **Head tilts are used for selection**:
  - Tilting the head to the left selects the left option.
  - Tilting the head to the right selects the right option.
- **Updates the visuals**: The selected option's color changes to indicate the user's choice.
- **Switches to new options** after a short delay once a choice is made.

#### Schema

- `left`: `ecs.eid` - Entity ID for the left choice.
- `right`: `ecs.eid` - Entity ID for the right choice.
- `leftLogo`: `ecs.eid` - Entity ID for the left option's logo.
- `rightLogo`: `ecs.eid` - Entity ID for the right option's logo.

#### Code Highlights

```javascript
const options = [
  ['mcdonalds', 'cfa'],
  ['tesla', 'mercedes'],
  ['chanel', 'lvmh'],
];
let optionIdx = 0;
const update = () => {
  setTimeout(() => {
    optionIdx = (optionIdx + 1) % options.length;
    const newOptions = options[optionIdx];
    ecs.Material.set(world, leftLogo, {
      textureSrc: `${require(`./assets/${newOptions[0]}.png`)}`,
    });
    ecs.Material.set(world, rightLogo, {
      textureSrc: `${require(`./assets/${newOptions[1]}.png`)}`,
    });
  }, 1000);
};
```

This snippet demonstrates:

- Managing quiz options.
- Updating the displayed logos for each option dynamically.

#### Event Listener

The component listens for the `facecontroller.faceupdated` event to track head movement and make selections based on the user's face rotation.
