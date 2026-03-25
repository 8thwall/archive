// This is a component file. You can use this file to define a custom component for your project.
// This component will appear as a custom component in the editor.

import * as ecs from '@8thwall/ecs'  // This is how you access the ecs library.

const CharacterTag = ecs.registerComponent({
  name: 'character-tag',
})

const ShieldTag = ecs.registerComponent({
  name: 'shield-tag',
})

const EnemyTag = ecs.registerComponent({
  name: 'enemy-tag',
})

export {CharacterTag, ShieldTag, EnemyTag}
