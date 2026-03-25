import * as ecs from '@8thwall/ecs'
// import {PlayAudio, PauseAudio} from '../helpers/audioController'

function OnButtonClick(world, eventID)
{
  console.log('button click', eventID)
  world.events.dispatch(world.events.globalId, eventID, {})
}

const SimpleButton = ecs.registerComponent({
  name: 'SimpleButton',
  schema: {
    imageUrl: ecs.string,
    top: ecs.string,
    bottom: ecs.string,
    left: ecs.string,
    right: ecs.string,
    height: ecs.string,
    width: ecs.string,
    elementId: ecs.string,
    eventId: ecs.string,
    toDisable: ecs.boolean,
    toEnable: ecs.boolean,
  },
  schemaDefaults: {
    top: '10px',
    bottom: '-1px',
    left: '-1px',
    right: '10px',
    height: '36px',
    width: '36px',
  },
  add: (world, component) => {
    component.schema.toEnable = false
    component.schema.toDisable = false
    const container = document.createElement('div')
    container.style.position = 'absolute'

    if (component.schema.left !== '-1px') {
      container.style.left = component.schema.left
    }
    if (component.schema.right !== '-1px') {
      container.style.right = component.schema.right
    }
    if (component.schema.top !== '-1px') {
      container.style.top = component.schema.top
    }
    if (component.schema.bottom !== '-1px') {
      container.style.bottom = component.schema.bottom
    }
    if (component.schema.height !== '-1px') {
      container.style.height = component.schema.height
    }
    if (component.schema.width !== '-1px') {
      container.style.width = component.schema.width
    }

    container.style.overflow = 'hidden'  // Ensures content fits within the dimensions
    document.body.append(container)

    const img = document.createElement('img')
    img.id = component.schema.elementId
    img.src = component.schema.imageUrl
    img.style.height = '100%'  // Fill the container height
    img.style.width = '100%'  // Fill the container width

    container.append(img)

    //img.addEventListener('click', OnButtonClick.bind(null, world, component.schema.eventId));
  },
  tick: (world, component) => {
    if (component.schema.toEnable) {
      console.log('enabling')
      component.schema.toEnable = false
      const img = document.getElementById(component.schema.elementId)
      img.addEventListener('click', OnButtonClick.bind(null, world, component.schema.eventId));
      //img.style.visibility = 'visible'
      img.hidden = false
    }

    if (component.schema.toDisable) {
      console.log('disabling')
      component.schema.toDisable = false
      const img = document.getElementById(component.schema.elementId)
      img.removeEventListener('click', OnButtonClick.bind(null, world, component.schema.eventId));
      //img.style.visibility = 'hidden'
      img.hidden = true
    }
  },
  remove: (world, component) => {
    console.log(`SimpleButton removed with EID: ${component.eid}`)
  },
})

export {SimpleButton}
