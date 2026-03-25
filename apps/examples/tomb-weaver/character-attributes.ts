// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const CharacterAttributes = ecs.registerComponent({
  name: 'character-attributes',
  schema: {
    vitality: ecs.i32,
    endurance: ecs.i32,
    strength: ecs.i32,
  },
  schemaDefaults: {
    vitality: 0,
    endurance: 0,
    strength: 0,
  },
})

const characterLevel = (attribs: Readonly<typeof CharacterAttributes.defaults>) => (
  // Level is the sum of the configurable attributes
  attribs.vitality + attribs.endurance + attribs.strength
)

export {CharacterAttributes, characterLevel}
