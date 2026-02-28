import * as ecs from '@8thwall/ecs'
import {WorldMapLocation} from './world-map-location'

ecs.registerComponent({
  name: 'World Map UI',
  schema: {
    // @required
    displayNameLabel: ecs.eid,
    // @required
    startButton: ecs.eid,
  },
  schemaDefaults: {
  },
  data: {
    displayName: ecs.string,
    thumbnailImage: ecs.string,
  },
  stateMachine: ({world, eid, dataAttribute, schemaAttribute}) => {
    ecs.defineState('default')
      .initial()
      .listen(schemaAttribute.get(eid).startButton, ecs.input.UI_CLICK, () => {
        try {
          world.spaces.loadSpace('AR Scene')
        } catch (e) {
          console.error(e)
        }
      })
      .listen(world.events.globalId, 'geofence-entered', (e: any) => {
        const {displayName, thumbnailImage} = WorldMapLocation.get(world, e.data.eid)
        const {displayNameLabel} = schemaAttribute.get(eid)

        dataAttribute.set(eid, {
          displayName,
          thumbnailImage,
        })

        ecs.Ui.mutate(world, displayNameLabel, (cursor) => {
          cursor.text = `${dataAttribute.get(eid).displayName}`
        })

        ecs.Hidden.remove(world, eid)
      })
      .listen(world.events.globalId, 'geofence-exited', (e) => {
        ecs.Hidden.set(world, eid)
      })
  },
  add: (world, component) => {
    ecs.Hidden.set(world, component.eid)
  },
})
