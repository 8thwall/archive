import * as ecs from '@8thwall/ecs'

const InfoBadge = ecs.registerComponent({
  name: 'InfoBadge',
  schema: {
    text: ecs.string,
    // @asset
    icon: ecs.string,
    top: ecs.string,
    right: ecs.string,
  },
  schemaDefaults: {
    text: '100',
    top: '10px',  // Default top position
    right: '10px',  // Default right position
  },
  add: (world, component) => {
    // Create a container for the image and the badge
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = component.schema.top
    container.style.right = component.schema.right
    container.style.display = 'flex'
    container.style.alignItems = 'center'
    container.style.height = '48px'  // Ensure the height matches the image size

    document.body.append(container)

    const pill = document.createElement('div')
    pill.style.backgroundColor = '#000000'  // Set to black
    pill.style.color = 'white'
    pill.style.display = 'flex'
    pill.style.alignItems = 'center'
    pill.style.justifyContent = 'center'
    pill.style.padding = '0 10px'
    pill.style.borderRadius = '999px'  // Creates the pill shape
    pill.style.height = '100%'  // Match the height of the container
    pill.style.width = '120px'  // Set the width of the pill
    pill.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'  // Optional: Add shadow for depth

    const label = document.createElement('p')
    label.innerText = component.schema.text
    label.style.margin = '0'  // Removes default margin
    label.style.fontSize = '32px'  // Adjust font size to match reference
    label.style.fontWeight = 'bold'  // Make text bold

    pill.append(label)
    container.append(pill)

    const img = document.createElement('img')
    img.src = component.schema.icon
    img.style.height = '72px'  // Set height to 36px
    img.style.width = '72px'  // Set width to 36px
    img.style.borderRadius = '50%'  // Makes the image circular
    img.style.position = 'absolute'
    img.style.left = '-36px'  // Move image left by half of its width to overlap the pill

    container.append(img)

    world.events.addListener(component.eid, 'updateText', (e) => {
      const badge = InfoBadge.cursor(world, e.target)
      badge.text = (e.data as {value: string}).value
      label.innerText = badge.text
    })
  },
  remove: (world, component) => {},
})

export {InfoBadge}
