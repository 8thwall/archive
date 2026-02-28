import * as ecs from '@8thwall/ecs'

import {isMobile, isNAE, isIOS, promptForMobilePermissions, setStatusBarColor, vibrate} from './utils'
import {Scenes} from './scenes'
import {addiOSPermissionOverlay} from './gyroscope-handler'

const mobileInstruction = 'How To Play:\n\nTilt your phone left and right to control the stack\n\nCatch all the toppings and avoid the bun!\n'
const desktopInstruction = 'How To Play:\n\nUse the left and right arrow keys to control the stack\n\nCatch all the toppings and avoid the bun!\n'

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

ecs.registerComponent({
  name: 'main-menu',
  schema: {
    // Add data that can be configured on the component.
    playButton: ecs.eid,
    gyroscopeError: ecs.eid,
    backgroundMobileImage: ecs.eid,
    backgroundDesktopImage: ecs.eid,
    instructionButton: ecs.eid,
    howToPlayText: ecs.eid,
    backButton: ecs.eid,
    mainMenuUI: ecs.eid,
    instructionUI: ecs.eid,
  },
  schemaDefaults: {
    // Add defaults for the schema fields.
  },
  data: {
    // Add data that cannot be configured outside of the component.
    canClickPlayButton: ecs.boolean,
  },
  stateMachine: ({world, eid, dataAttribute, schemaAttribute}) => {
    const toInGame = ecs.defineTrigger()
    const toInstruction = ecs.defineTrigger()

    ecs.defineStateGroup().onEnter(() => {
      ecs.Ui.set(world, schemaAttribute.get(eid).howToPlayText, {
        text: isMobile() ? mobileInstruction : desktopInstruction,
      })
    })

    const startGame = async () => {
      toInGame.trigger()
    }

    const gyroPermissionRequestCallback = async () => {
      if (!dataAttribute.cursor(eid).canClickPlayButton) {
        return false
      }

      const success = await promptForMobilePermissions()
      if (!success) {
        ecs.Hidden.remove(world, schemaAttribute.get(eid).gyroscopeError)
        return false
      }
      toInGame.trigger()
      return true
    }

    // Fixes a bug where on iOS when you click "Main Menu" after losing, sometimes we would, for
    // some reason, click on the iOS button as we add it. Adding an initial step which sends to
    // preGame fixes this.
    ecs.defineState('prePreGame')
      .initial()
      .onEvent('ToPreGame', 'preGame', {target: world.events.globalId})
      .onEnter(async () => {
        dataAttribute.cursor(eid).canClickPlayButton = false
        await wait(3)
        if (!isNAE() && isIOS()) {
          addiOSPermissionOverlay(gyroPermissionRequestCallback)
        }
        await wait(3)
        world.events.dispatch(eid, 'ToPreGame')
      })

    // Set as the initial state.
    ecs.defineState('preGame')
      // Define a trigger to move us to playing.
      .onTrigger(toInstruction, 'preGameInstruction')
      .onTrigger(toInGame, 'inGame')
      .listen(schemaAttribute.get(eid).playButton, ecs.input.UI_CLICK, startGame)
      // Runs when we start.
      .onEnter(async () => {
        await wait(30)
        dataAttribute.cursor(eid).canClickPlayButton = true
        setStatusBarColor('#599AB8')

        if (isMobile()) {
          ecs.Hidden.set(world, schemaAttribute.get(eid).backgroundDesktopImage, {})
          ecs.Hidden.remove(world, schemaAttribute.get(eid).backgroundMobileImage)
        } else {
          ecs.Hidden.set(world, schemaAttribute.get(eid).backgroundMobileImage, {})
          ecs.Hidden.remove(world, schemaAttribute.get(eid).backgroundDesktopImage)
        }
      })

    ecs.defineState('inGame')
      .onEnter(() => {
        vibrate(10)
        world.spaces.loadSpace(Scenes.MAIN_SCENE)
      })
  },
})
