// Import the ECS module from 8th Wall Studio
import * as ecs from '@8thwall/ecs'

// Register a new custom component called 'Score Keeper'
ecs.registerComponent({
  name: 'Score Keeper',

  // Schema defines configurable references to UI elements and a container entity
  schema: {
    // @label Prefab: HoleEntryRow
    holeEntryPrefab: ecs.eid,  // Prefab entity to clone for each hole entry
    // @label Prefab: HoleEntryText
    holeEntryText: ecs.eid,  // Prefab UI element to display current hole number
    // @label Prefab: ParEntryText
    parEntryText: ecs.eid,  // Prefab UI element to display par value
    // @label Prefab: ScoreEntryText
    scoreEntryText: ecs.eid,  // Prefab UI element to display score
    // @label UI: GameStatus
    gameStatus: ecs.eid,  // Entity to which new hole entries will be added as children
  },

  // Define the component's state machine
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    // Create a default state that starts immediately
    ecs.defineState('default').initial()

      // listen for when the user scores (this is dispatched by HoleScore)
      .listen(world.events.globalId, 'hole-scored', (event) => {
        const schema = schemaAttribute.get(eid)

        // Update the UI elements with gameplay data
        ecs.Ui.set(world, schema.holeEntryText, {text: event.data.hole})
        ecs.Ui.set(world, schema.parEntryText, {text: event.data.par})
        ecs.Ui.set(world, schema.scoreEntryText, {
          text: event.data.score,
          color:
            event.data.score < event.data.par
              ? '#00FF00'     // green
              : event.data.score > event.data.par
                ? '#FF0000'   // red
                : '#FFFFFF',  // white
        })

        // Create a new instance of the hole entry prefab
        const newHoleEntry = world.createEntity(schema.holeEntryPrefab)

        // Add the new entry as a child of the gameStatus entity to track gameplay progress
        world.getEntity(schema.gameStatus).addChild(newHoleEntry)
      })
  },
})
