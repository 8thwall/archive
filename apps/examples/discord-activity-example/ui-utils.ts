import * as ecs from '@8thwall/ecs'

import {isMobileDevice} from './platform'

const isMobile = isMobileDevice()

// Options for creating a basic UI element with optional image and text
type BasicUiOptions = {
  text: string
  yOffset: number
  imageUrl?: string | null
}

// References to the created UI entities (parent container, optional image, and text)
type BasicUiObject = {
  eid: ecs.Eid
  imageEid?: ecs.Eid
  textEid: ecs.Eid
}

/**
 * Creates a 3D UI element with optional image and text
 * Creates a parent container with responsive sizing, optional avatar image, and text label
 * Returns entity references for future updates
 */
const addBasicUI = (world: ecs.World, options: BasicUiOptions): BasicUiObject => {
  // Create parent container entity for the UI element
  const eid = world.createEntity()

  // Configure 3D UI with responsive dimensions
  ecs.Ui.set(world, eid, {
    type: '3d',
    width: isMobile ? '250' : '500',
    height: isMobile ? '50' : '100',
  })

  // Position the UI element at the specified height
  ecs.Position.set(world, eid, {x: 0, y: options.yOffset, z: 0})

  // Optionally create an image entity (e.g., for Discord avatar)
  let imageHolder: ecs.Eid | undefined
  if (options.imageUrl) {
    imageHolder = world.createEntity()
    world.setParent(imageHolder, eid)

    // Configure image as 20% width with rounded corners for avatar display
    ecs.Ui.set(world, imageHolder, {
      type: '3d',
      width: '20%',
      height: '100%',
      image: options.imageUrl,
      borderRadius: isMobile ? 25 : 50,
    })
  }

  // Create text entity for displaying user information
  const textHolder = world.createEntity()
  world.setParent(textHolder, eid)

  // Configure text layout with responsive width based on whether image is present
  ecs.Ui.set(world, textHolder, {
    type: '3d',
    width: options.imageUrl ? '75%' : '100%',
    height: '100%',
    text: options.text,
    fontSize: 24,
    textAlign: 'center',
    verticalTextAlign: 'center',
    paddingLeft: options.imageUrl ? '5%' : '0',
  })

  // Return entity references for future updates
  return {
    eid,
    imageEid: imageHolder,
    textEid: textHolder,
  }
}

export {
  addBasicUI,
}

export type {
  BasicUiOptions,
  BasicUiObject,
}