import * as ecs from '@8thwall/ecs'
import {PlayAudio} from '../helpers/audioController'

const SimpleButton = ecs.registerComponent({
  name: 'SimpleButton',
  schema: {
    // @asset
    imageUrl: ecs.string,
    top: ecs.string,
    right: ecs.string,
    height: ecs.string,
    width: ecs.string,
  },
  schemaDefaults: {
    top: '10px',  // Default top position
    right: '10px',  // Default left position
    height: '36px',  // Default height
    width: '36px',  // Default width
  },
  add: (world, component) => {
    console.log(`SimpleButton added with EID: ${component.eid}`)

    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = component.schema.top
    container.style.right = component.schema.right
    container.style.height = component.schema.height
    container.style.width = component.schema.width
    container.style.overflow = 'hidden'  // Ensures content fits within the dimensions

    document.body.append(container)

    const img = document.createElement('img')
    img.src = component.schema.imageUrl
    img.style.height = '100%'  // Fill the container height
    img.style.width = '100%'  // Fill the container width

    container.append(img)

    img.addEventListener('click', () => {
      console.log('SimpleButton tapped!')
      PlayAudio(world, component.eid)
      world.events.dispatch(world.events.globalId, 'buttonTap', {})
    })
  },
  remove: (world, component) => {
    console.log(`SimpleButton removed with EID: ${component.eid}`)
  },
})

export {SimpleButton}
