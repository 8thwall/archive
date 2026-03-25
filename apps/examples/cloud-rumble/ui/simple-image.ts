import * as ecs from '@8thwall/ecs'

const SimpleImage = ecs.registerComponent({
  name: 'SimpleImage',
  schema: {
    imageUrl: ecs.string,
    top: ecs.string,
    bottom: ecs.string,
    left: ecs.string,
    right: ecs.string,
    height: ecs.string,
    width: ecs.string,
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

    if (component.schema.height === '-1px') {
      container.style.height = component.schema.height
    }

    if (component.schema.width === '-1px') {
      container.style.width = component.schema.width
    }

    container.style.overflow = 'hidden'  // Ensures content fits within the dimensions
    document.body.append(container)

    const img = document.createElement('img')
    img.src = component.schema.imageUrl
    img.style.height = '100%'  // Fill the container height
    img.style.width = '100%'  // Fill the container width

    container.append(img)
  },
  remove: (world, component) => {
    console.log(`SimpleImage removed with EID: ${component.eid}`)
  },
})

export {SimpleImage}
