import * as ecs from '@8thwall/ecs'
import {ScavengerHuntPoi} from './scavenger-hunt-poi'

ecs.registerComponent({
  name: 'World Map UI',
  schema: {
    displayNameLabel: ecs.eid,
    startButton: ecs.eid,
  },
  schemaDefaults: {
  },
  data: {
    spaceName: ecs.string,
    displayName: ecs.string,
    thumbnailImage: ecs.string,
  },
  stateMachine: ({world, eid, dataAttribute, schemaAttribute}) => {
    ecs.defineState('default')
      .initial()
      .listen(schemaAttribute.get(eid).startButton, ecs.input.UI_CLICK, () => {
        try {
          world.spaces.loadSpace(`${dataAttribute.get(eid).spaceName}`)
        } catch (e) {
          console.error(e)
        }
      })
      .listen(world.events.globalId, 'geofence-entered', (e) => {
        // @ts-ignore
        const {spaceName, displayName, thumbnailImage} = ScavengerHuntPoi.get(world, e.data.eid)
        const {displayNameLabel} = schemaAttribute.get(eid)

        dataAttribute.set(eid, {
          spaceName,
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
