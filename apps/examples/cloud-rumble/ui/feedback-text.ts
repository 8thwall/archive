import * as ecs from '@8thwall/ecs'

const FeedbackText = ecs.registerComponent({
  name: 'FeedbackText',
  schema: {
    startImageURL: ecs.string,
    gameOverImageURL: ecs.string,
    victoryImageURL: ecs.string,
    top: ecs.string,
    bottom: ecs.string,
    left: ecs.string,
    right: ecs.string,
    height: ecs.string,
    width: ecs.string,
    displayPeriod: ecs.i32,
    displayTimer: ecs.i32,
    elementId: ecs.string,
  },
  schemaDefaults: {
    top: '300px',
    bottom: '-1px',
    left: '10px',
    right: '10px',
    height: '400px',
    width: '800px',
    displayPeriod: 1000,
  },
  data: {
    timeElapsedLast: ecs.i32,
  },
  add: (world, component) => {
    const container = document.createElement('div')
    component.data.timeElapsedLast = 0
    container.style.position = 'absolute'

    container.style.top = component.schema.top
    container.style.left = component.schema.left
    container.style.right = component.schema.right
    container.style.height = component.schema.height

    container.style.overflow = 'hidden'  // Ensures content fits within the dimensions
    document.body.append(container)

    const img = document.createElement('img')
    img.id = component.schema.elementId
    img.src = component.schema.startImageURL
    img.style.height = '100%'  // Fill the container height
    img.style.width = '100%'  // Fill the container width
    img.style.visibility = 'hidden'
    container.append(img)

    const {eid} = component
    const elementID = component.schema.elementId

    world.events.addListener(world.events.globalId, 'start_game', (e) => {
      console.log('start', elementID)
      const imageURL = FeedbackText.get(world, eid).startImageURL
      const img2 = document.getElementById(elementID) as HTMLImageElement
      img2.src = ''
      img2.src = imageURL
      img2.style.visibility = 'visible'
      const feedbackPeriod = FeedbackText.get(world, eid).displayPeriod
      FeedbackText.set(world, eid, {displayTimer: feedbackPeriod})
    })

    world.events.addListener(world.events.globalId, 'victory', (e) => {
      console.log('victory', elementID)
      const imageURL = FeedbackText.get(world, eid).victoryImageURL
      const img2 = document.getElementById(elementID) as HTMLImageElement
      img2.src = ''
      img2.src = imageURL
      img2.style.visibility = 'visible'
      const feedbackPeriod = FeedbackText.get(world, eid).displayPeriod
      FeedbackText.set(world, eid, {displayTimer: feedbackPeriod})
    })

    world.events.addListener(world.events.globalId, 'game_over', (e) => {
      console.log('game over', elementID)
      const imageURL = FeedbackText.get(world, eid).gameOverImageURL
      const img2 = document.getElementById(elementID) as HTMLImageElement
      img2.src = ''
      img2.src = imageURL
      img2.style.visibility = 'visible'
      const feedbackPeriod = FeedbackText.get(world, eid).displayPeriod
      FeedbackText.set(world, eid, {displayTimer: feedbackPeriod})
    })

    console.log('init')
  },
  tick: (world, component) => {
    const timeDelta = world.time.elapsed - component.data.timeElapsedLast
    component.data.timeElapsedLast = world.time.elapsed
    if (component.schema.displayTimer > 0) {
      component.schema.displayTimer -= timeDelta
      if (component.schema.displayTimer <= 0) {
        console.log('hiding')
        const img = document.getElementById(component.schema.elementId)
        img.style.visibility = 'hidden'
      }
    }
  },
})

export {FeedbackText}
