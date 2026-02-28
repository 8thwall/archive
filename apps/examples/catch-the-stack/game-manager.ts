import * as ecs from '@8thwall/ecs'

import {GameEvents} from './event-ids'
import {GlobalStackHeight} from './global-stack-height'
import {createIngredientHandler} from './ingredient'
import {
  isMobile, vibrate,
  getHighScore, saveHighScore, isIOS, isNAE,
  getSafeAreaInsets,
} from './utils'
import {Scenes} from './scenes'

const CAMERA_DEFAULT_HEIGHT = 5.8

const ITEM_SCORE_TEXT_Y_OFFSET = 1.4
const ITEM_SCORE_TEXT_Y_OFFSET_STREAK = 1.9

const getFontSize = (score: number): number => {
  const minScore = 50
  const maxScore = 4000
  const minFontSize = 40
  const maxFontSize = 120

  // Clamp score within bounds
  const clampedScore = Math.max(minScore, Math.min(score, maxScore))

  // Linear interpolation
  const fontSize = minFontSize +
    ((clampedScore - minScore) / (maxScore - minScore)) * (maxFontSize - minFontSize)

  return fontSize
}

const getGameOverString = (score: number): string => {
  if (score === 0) {
    return 'YIKES'
  } else if (score < 3000) {
    return 'That\'s all?'
  } else if (score < 6000) {
    return 'Do better.'
  } else if (score < 8000) {
    return 'Nice practice run!'
  } else if (score < 10000) {
    return 'Getting there!'
  } else if (score < 50000) {
    return 'Now we\'re stacking!'
  } else if (score < 100000) {
    return 'Amazing!'
  } else if (score < 150000) {
    return 'Certified pro gamer.'
  }
  return 'You are a legend!'
}

const getSpawnInterval = (numStack: number): number => {
  // fastest spawn speed (in ms)
  const minInterval = 300
  // starting interval (in ms)
  const maxInterval = 750
  // cap how fast it can get
  const maxStack = 50

  const clampedStack = Math.min(numStack, maxStack)
  const interval = maxInterval - ((maxInterval - minInterval) * (clampedStack / maxStack))
  return interval
}

const GameManager = ecs.registerComponent({
  name: 'GameManager',  // Define the name of this component
  schema: {
    pointDisplay: ecs.eid,  // Entity ID for the score UI element
    highScoreDisplay: ecs.eid,  // Entity ID for the high score UI element
    bonusDisplay: ecs.eid,  // Entity ID for the bonus UI element
    scoreBoardFrame: ecs.eid,
    gameOver: ecs.eid,
    gameOverPlayAgainButton: ecs.eid,
    gameOverMainMenuButton: ecs.eid,
    gameOverTitle: ecs.eid,
    gameOverScoreText: ecs.eid,
    desktopVerticalScroll: ecs.eid,
    mobileVerticalScroll: ecs.eid,
    camera: ecs.eid,
    baseOfStack: ecs.eid,
    // The score text we pop up each time you catch an item.
    itemScoreText: ecs.eid,
  },
  schemaDefaults: {
  },
  data: {
    // Player's score
    score: ecs.f32,
    // Record score
    highScore: ecs.f32,
    // Streak bonus
    streak: ecs.f32,
    // Last item caught
    lastItem: ecs.string,
    // Number of items stacked
    numStack: ecs.f32,
    // If we just set the camera height, it's very jerky. So instead we interpolate to it.
    targetCameraHeight: ecs.f32,
    // The time that the last ingredient was spawned.
    lastIngredientSpawnTime: ecs.f32,
  },
  stateMachine: ({world, eid, dataAttribute, schemaAttribute}) => {
    if (!dataAttribute) {
      return
    }
    dataAttribute.cursor(eid).targetCameraHeight = CAMERA_DEFAULT_HEIGHT

    const targetFrameHeight = parseInt(
      ecs.Ui.get(world, schemaAttribute.cursor(eid).scoreBoardFrame).height, 10
    )
    const handleWindowResize = () => {
      // NAE doesn't have CSS polyfilled
      if (isNAE()) {
        return
      }

      const safeAreaInsets = getSafeAreaInsets()

      ecs.Ui.set(world, schemaAttribute.cursor(eid).scoreBoardFrame, {
        height: (safeAreaInsets.top + targetFrameHeight).toString(),
      })
    }
    window.addEventListener('resize', handleWindowResize)

    const handleIngredientCaught = (event: any) => {
      if (!dataAttribute) {
        return
      }

      vibrate(60)

      dataAttribute.cursor(eid).numStack += 1

      const onStreak = event.data.item === dataAttribute.cursor(eid).lastItem
      if (onStreak) {
        world.events.dispatch(world.events.globalId, 'StreakBonus')
        dataAttribute.cursor(eid).streak += 4
      } else {
        world.events.dispatch(world.events.globalId, 'ItemCollected')
        // Else, reset the streak to the total number of caught items.
        dataAttribute.cursor(eid).streak = dataAttribute.cursor(eid).numStack
      }

      const ingredientScore = 50 * dataAttribute.cursor(eid).streak
      dataAttribute.cursor(eid).score += ingredientScore
      dataAttribute.cursor(eid).lastItem = event.data.item

      ecs.Ui.set(world, schemaAttribute.cursor(eid).pointDisplay, {
        text: dataAttribute.cursor(eid).score.toString(),
      })
      ecs.Ui.set(world, schemaAttribute.cursor(eid).bonusDisplay, {
        text: `${dataAttribute.cursor(eid).streak.toString()}x`,
      })

      // Get the height of the top item on the stack, and set the top item to that height.
      const height = GlobalStackHeight.getStackHeight()
      dataAttribute.cursor(eid).targetCameraHeight = height + CAMERA_DEFAULT_HEIGHT

      // Show some floating score text right on top of the item we caught. Hide after some time.
      const {itemScoreText} = schemaAttribute.cursor(eid)
      ecs.Position.set(world, itemScoreText, {
        x: ecs.Position.get(world, schemaAttribute.get(eid).baseOfStack).x,
        y: height + (onStreak ? ITEM_SCORE_TEXT_Y_OFFSET_STREAK : ITEM_SCORE_TEXT_Y_OFFSET),
      })

      let text = `+${ingredientScore}`
      if (onStreak) {
        text += '\nOn a streak!'
      }
      ecs.Ui.set(world, itemScoreText, {
        text,
        fontSize: getFontSize(ingredientScore),
      })
      ecs.Hidden.remove(world, itemScoreText)
      setTimeout(() => {
        ecs.Hidden.set(world, itemScoreText)
      }, 6000)
    }

    const handleTopBunCaught = () => {
      vibrate([30, 60, 30, 60, 30, 60, 1000])
      world.events.dispatch(eid, 'GameOver')  // Trigger game over when a top bun is caught
    }

    const ingredientHandler = createIngredientHandler(world)

    const handleReset = () => {
      if (!dataAttribute) {
        return
      }

      const {
        itemScoreText,
        pointDisplay,
        bonusDisplay,
        camera,
        baseOfStack,
      } = schemaAttribute.cursor(eid)

      // Reset score.
      ecs.Hidden.set(world, itemScoreText)
      dataAttribute.cursor(eid).score = 0
      dataAttribute.cursor(eid).streak = 0
      dataAttribute.cursor(eid).numStack = 0
      ecs.Ui.set(world, pointDisplay,
        {text: dataAttribute.cursor(eid).score.toString()})
      ecs.Ui.set(world, bonusDisplay, {text: '1x'})

      // Reset camera.
      dataAttribute.cursor(eid).targetCameraHeight = CAMERA_DEFAULT_HEIGHT
      ecs.Position.mutate(world, camera, (cursor) => {
        cursor.y = CAMERA_DEFAULT_HEIGHT
        // Return false to indicate that we changed the height.
        return false
      })

      ingredientHandler.resetIngredients()

      GlobalStackHeight.updateStackHeight(0)

      ecs.Collider.set(world, baseOfStack, {
        mass: 0,
        eventOnly: false,
      })
    }

    const doneLoadingTrigger = ecs.defineTrigger()

    const checkLoadingProgress = () => {
      if (!ecs.assets.getStatistics) {
        doneLoadingTrigger.trigger()
        return
      }
      const {pending} = ecs.assets.getStatistics()
      if (pending === 0) {
        doneLoadingTrigger.trigger()
      }
    }

    let timer = 0

    ecs.defineState('loadingGame')
      .initial()
      .onEnter(() => {
        handleWindowResize()

        // Make sure that the Game Over UI is hidden.
        ecs.Hidden.set(world, schemaAttribute.get(eid).gameOver, {})

        checkLoadingProgress()
        timer = world.time.setInterval(checkLoadingProgress, 100)
      })
      .onExit(() => {
        world.time.clearTimeout(timer)
      })
      .onTrigger(doneLoadingTrigger, 'inGame')

    ecs.defineState('inGame')
      .onEvent('GameOver', 'gameOver', {target: world.events.globalId})
      .listen(world.events.globalId, GameEvents.INGREDIENT_CAUGHT, handleIngredientCaught)
      .listen(world.events.globalId, 'TopBunCaught', handleTopBunCaught)
      .onEnter(() => {
        dataAttribute.cursor(eid).highScore = getHighScore()

        const highScoreText = `High Score: ${dataAttribute.cursor(eid).highScore.toString() || '0'}`
        ecs.Ui.set(world, schemaAttribute.cursor(eid).highScoreDisplay,
          {text: highScoreText})

        world.events.dispatch(eid, 'StartGame')

        dataAttribute.cursor(eid).lastIngredientSpawnTime = 0

        // Reset score and streak at game start.
        handleReset()

        // Show either the mobile or desktop vertical scroll images.
        if (isMobile()) {
          ecs.Hidden.set(world, schemaAttribute.get(eid).desktopVerticalScroll, {})
          ecs.Hidden.remove(world, schemaAttribute.get(eid).mobileVerticalScroll)
        } else {
          ecs.Hidden.set(world, schemaAttribute.get(eid).mobileVerticalScroll, {})
          ecs.Hidden.remove(world, schemaAttribute.get(eid).desktopVerticalScroll)
        }

        // Reset baseOfStack (bottom bun)
        world.events.dispatch(schemaAttribute.get(eid).baseOfStack, GameEvents.RESET_BASE_OF_STACK)
      })
      .onTick(() => {
        const deltaTime = world.time.delta

        // Smoothly move the camera upwards. Go half the distance to the camera, with a max.
        const {camera} = schemaAttribute.cursor(eid)
        const currentHeight = ecs.Position.get(world, camera).y
        const deltaHeight = dataAttribute.cursor(eid).targetCameraHeight - currentHeight
        // Damping constant (smaller = smoother, but slower)
        const damping = 0.3  // Try something between 0.05 and 0.25
        // Lerp factor scales with frame time
        const lerpFactor = 1 - Math.pow(1 - damping, deltaTime / 1000)
        // Interpolate camera height
        const targetY = dataAttribute.cursor(eid).targetCameraHeight
        const newHeight = currentHeight + (targetY - currentHeight) * lerpFactor
        ecs.Position.mutate(world, schemaAttribute.cursor(eid).camera, (cursor) => {
          cursor.y = newHeight
          // Return false to indicate that we changed the height.
          return false
        })

        // Move time forward, and perhaps spawn item.
        dataAttribute.cursor(eid).lastIngredientSpawnTime += deltaTime
        const spawnInterval = getSpawnInterval(currentHeight)
        if (dataAttribute.cursor(eid).lastIngredientSpawnTime >= spawnInterval) {
          dataAttribute.cursor(eid).lastIngredientSpawnTime = 0
          ingredientHandler.instantiateIngredient(schemaAttribute.cursor(eid).baseOfStack)
        }
      })
      .onExit(() => {
        ecs.Hidden.set(world, schemaAttribute.cursor(eid).itemScoreText)
      })

    ecs.defineState('gameOver')
      .onEnter(() => {
        if (!dataAttribute) {
          return
        }

        if (isIOS() && !isNAE()) {
          ecs.Hidden.set(world, schemaAttribute.cursor(eid).gameOverMainMenuButton)
        }

        // Update the high score.
        if (dataAttribute.cursor(eid).score > dataAttribute.cursor(eid).highScore) {
          saveHighScore(dataAttribute.cursor(eid).score)
          dataAttribute.cursor(eid).highScore = dataAttribute.cursor(eid).score
        }

        // Update the score.
        ecs.Ui.set(world, schemaAttribute.cursor(eid).pointDisplay,
          {text: dataAttribute.cursor(eid).score.toString()})

        const highScoreText = `High Score: ${dataAttribute.cursor(eid).highScore.toString() || '0'}`
        ecs.Ui.set(world, schemaAttribute.cursor(eid).highScoreDisplay,
          {text: highScoreText})

        ecs.Ui.set(
          world,
          schemaAttribute.get(eid).gameOverTitle,
          {text: `${getGameOverString(dataAttribute.cursor(eid).score)}`}
        )
        ecs.Ui.set(
          world,
          schemaAttribute.get(eid).gameOverScoreText,
          {text: `Score: ${dataAttribute.cursor(eid).score.toString()}`}
        )

        // Show the Game Over UI.
        ecs.Hidden.remove(world, schemaAttribute.get(eid).gameOver)
      })

      // Play again button:
      .onEvent(
        ecs.input.UI_CLICK,
        'loadingGame',
        {
          target: schemaAttribute.get(eid).gameOverPlayAgainButton,
        }
      )

      // Main Menu button:
      .onEvent(
        ecs.input.UI_CLICK,
        'goBackToMainMenu',
        {
          target: schemaAttribute.get(eid).gameOverMainMenuButton,
        }
      )

      .onExit(() => {
        // Hide the Game Over UI.
        ecs.Hidden.set(world, schemaAttribute.get(eid).gameOver, {})

        // Reset the state of the game.
        handleReset()
      })

    ecs.defineState('goBackToMainMenu')
      .onEnter(() => {
        handleReset()
        ingredientHandler.cleanupIngredients()
        world.events.dispatch(eid, GameEvents.GO_BACK_TO_MAIN_MENU)
        window.removeEventListener('resize', handleWindowResize)
        world.spaces.loadSpace(Scenes.MAIN_MENU)
      })

    // NOTE(paris): You can add this to test the Game Over UI.
    // world.events.dispatch(eid, 'GameOver')
  },
})

export {
  GameManager,
}
