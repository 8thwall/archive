import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Countdown Timer',
  schema: {
    // Reference to UI text entity that will display the countdown
    timerTextEntity: ecs.eid,
    // Reference to UI text entity for game over message
    centerTextEntity: ecs.eid,
    // Reference to UI button entity for play again button
    playAgainButton: ecs.eid,
    // Reference to UI text entity for play again button text (child of button)
    playAgainButtonText: ecs.eid,
    // Reference to UI logo entity for start menu
    logoEntity: ecs.eid,
    // Starting countdown value in seconds
    startTime: ecs.i32,
    // Time bonus added when crossing a checkpoint (seconds)
    checkpointBonus: ecs.i32,
  },
  schemaDefaults: {
    startTime: 10,
    checkpointBonus: 5,
  },
  data: {
    // Current countdown value (remaining seconds)
    currentTime: ecs.i32,
    // Time when countdown started (used to track elapsed time)
    startTimestamp: ecs.f32,
    // Whether countdown has reached zero
    isComplete: ecs.boolean,
    // Intro countdown tracking
    introCountdown: ecs.i32,
    introTimestamp: ecs.f32,
    // Play again button click handler reference
    playAgainClickHandler: ecs.f32,  // Using f32 as a placeholder for handler tracking
    // Bonus text animation tracking
    bonusTextStartTime: ecs.f32,
    showingBonusText: ecs.boolean,
    // Track if gamepad is connected
    gamepadConnected: ecs.boolean,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute, defineState}) => {
    console.log('[countdown-timer] State machine initialized for entity:', eid)
    
    // Helper function to format time with leading zero
    const formatTime = (seconds: number): string => {
      return seconds < 10 ? `0${seconds}` : `${seconds}`
    }

    // Helper function to update the UI text
    const updateTimerDisplay = (seconds: number) => {
      const {timerTextEntity} = schemaAttribute.get(eid)
      if (timerTextEntity) {
        // Set color to red when countdown is 3, 2, or 1; black otherwise
        const color = (seconds === 1 || seconds === 2 || seconds === 3) ? '#FF0000' : '#000000'
        ecs.Ui.set(world, timerTextEntity, {
          text: formatTime(seconds),
          color: color,
        })
      }
    }

    // Helper function to add time to the countdown
    const addTime = (seconds: number) => {
      const data = dataAttribute.cursor(eid)
      const {centerTextEntity} = schemaAttribute.get(eid)
      
      // To add time, we move the startTimestamp forward (later in time)
      // This reduces the elapsed time, giving us more remaining time
      data.startTimestamp += seconds * 1000
      
      // Calculate and update the new current time immediately
      const elapsedTime = world.time.elapsed - data.startTimestamp
      const elapsedSeconds = Math.floor(elapsedTime / 1000)
      const {startTime} = schemaAttribute.get(eid)
      const newTime = Math.max(0, startTime - elapsedSeconds)
      
      data.currentTime = newTime
      updateTimerDisplay(data.currentTime)
      
      // Show bonus text starting at top: '225'
      if (centerTextEntity) {
        ecs.Ui.set(world, centerTextEntity, {
          opacity: 1,
          text: `+${seconds}`,
          color: '#00FF00',  // Green
          top: '225',
        })
        data.showingBonusText = true
        data.bonusTextStartTime = world.time.elapsed
      }
      
      console.log(`[countdown-timer] Added ${seconds} seconds bonus! New time: ${formatTime(data.currentTime)}`)
    }

    // Helper function to update button text based on gamepad connection
    const updateStartButtonText = (isGamepadConnected: boolean) => {
      const {playAgainButtonText} = schemaAttribute.get(eid)
      const newText = isGamepadConnected ? 'Press Start' : 'Start Game'
      console.log(`[countdown-timer] Updating start button text to: "${newText}" (gamepad: ${isGamepadConnected})`)
      if (playAgainButtonText) {
        ecs.Ui.set(world, playAgainButtonText, {
          text: newText,
        })
        console.log('[countdown-timer] Start button text updated successfully')
      } else {
        console.warn('[countdown-timer] playAgainButtonText entity not found')
      }
    }

    const updatePlayAgainButtonText = (isGamepadConnected: boolean) => {
      const {playAgainButtonText} = schemaAttribute.get(eid)
      const newText = isGamepadConnected ? 'Press Start' : 'Play Again'
      console.log(`[countdown-timer] Updating play again button text to: "${newText}" (gamepad: ${isGamepadConnected})`)
      if (playAgainButtonText) {
        ecs.Ui.set(world, playAgainButtonText, {
          text: newText,
        })
        console.log('[countdown-timer] Play again button text updated successfully')
      } else {
        console.warn('[countdown-timer] playAgainButtonText entity not found')
      }
    }

    // State: Start Menu - initial state showing logo and start button
    defineState('start-menu')
      .initial()
      .onTick(() => {
        const data = dataAttribute.cursor(eid)
        
        // Check if any gamepad is being used by looking at the input state
        const gamepadsConnected = navigator.getGamepads && Array.from(navigator.getGamepads()).some(gp => gp !== null)
        if (gamepadsConnected && !data.gamepadConnected) {
          console.log('[countdown-timer] Gamepad detected via navigator.getGamepads()')
          data.gamepadConnected = true
          updateStartButtonText(true)
        } else if (!gamepadsConnected && data.gamepadConnected) {
          console.log('[countdown-timer] No gamepad detected, reverting text')
          data.gamepadConnected = false
          updateStartButtonText(false)
        }
        
        // Check for 'start' input action
        if (world.input.getAction('start')) {
          console.log('[countdown-timer] Start action triggered from input!')
          world.events.dispatch(eid, 'start-game')
        }
      })
      .onEnter(() => {
        console.log('[countdown-timer] Entering start-menu state')
        const {logoEntity, playAgainButton, playAgainButtonText, centerTextEntity, timerTextEntity} = schemaAttribute.get(eid)
        const data = dataAttribute.cursor(eid)
        console.log('[countdown-timer] Start menu entities - logo:', logoEntity, 'button:', playAgainButton, 'buttonText:', playAgainButtonText)
        console.log('[countdown-timer] Gamepad connected state:', data.gamepadConnected)
        
        // Show logo
        if (logoEntity) {
          ecs.Ui.set(world, logoEntity, {
            opacity: 1,
          })
        }
        
        // Hide timer display
        if (timerTextEntity) {
          ecs.Ui.set(world, timerTextEntity, {
            opacity: 0,
          })
        }
        
        // Hide center text
        if (centerTextEntity) {
          ecs.Ui.set(world, centerTextEntity, {
            opacity: 0,
          })
        }
        
        // Show play again button
        if (playAgainButton) {
          ecs.Ui.set(world, playAgainButton, {
            opacity: 1,
          })
        }
        
        // Set button text based on gamepad connection
        updateStartButtonText(data.gamepadConnected)
        
        // Set up click listener for start button
        if (playAgainButtonText) {
          const startGameClickHandler = () => {
            console.log('[countdown-timer] Start Game button clicked!')
            world.events.dispatch(eid, 'start-game')
          }
          
          world.events.addListener(playAgainButton, ecs.input.SCREEN_TOUCH_START, startGameClickHandler)
          console.log('[countdown-timer] Start menu displayed with "Start Game" button')
        }
        
        // Disable controls during start menu
        world.events.dispatch(world.events.globalId, 'controls-disabled')
        console.log('[countdown-timer] Start menu displayed (controls disabled)')
      })
      .listen(eid, ecs.input.GAMEPAD_CONNECTED, (event) => {
        console.log('[countdown-timer] Gamepad connected: ', event.data.gamepad)
        const data = dataAttribute.cursor(eid)
        data.gamepadConnected = true
        updateStartButtonText(true)
      })
      .listen(eid, ecs.input.GAMEPAD_DISCONNECTED, (event) => {
        console.log('[countdown-timer] Gamepad disconnected: ', event.data.gamepad)
        const data = dataAttribute.cursor(eid)
        data.gamepadConnected = false
        updateStartButtonText(false)
      })
      .listen(world.events.globalId, 'gamepad-button-down', (event) => {
        // Detect gamepad button press
        const data = dataAttribute.cursor(eid)
        if (!data.gamepadConnected) {
          console.log('[countdown-timer] Gamepad input detected (button)')
          data.gamepadConnected = true
          updateStartButtonText(true)
        }
      })
      .listen(world.events.globalId, 'gamepad-axis-change', (event) => {
        // Detect gamepad axis movement
        const data = dataAttribute.cursor(eid)
        if (!data.gamepadConnected) {
          console.log('[countdown-timer] Gamepad input detected (axis)')
          data.gamepadConnected = true
          updateStartButtonText(true)
        }
      })
      .onEvent('start-game', 'intro')

    // State: Intro - dramatic "3, 2, 1, Start!" countdown before game begins
    defineState('intro')
      .onEnter(() => {
        const {logoEntity, centerTextEntity, timerTextEntity, startTime} = schemaAttribute.get(eid)
        const data = dataAttribute.cursor(eid)
        
        // Hide logo when entering intro
        if (logoEntity) {
          ecs.Ui.set(world, logoEntity, {
            opacity: 0,
          })
        }
        
        // Show timer display with initial time (10 seconds)
        if (timerTextEntity) {
          ecs.Ui.set(world, timerTextEntity, {
            opacity: 1,
            text: formatTime(startTime),
            color: '#000000',
          })
        }
        
        // Initialize intro countdown from 3
        data.introCountdown = 3
        data.introTimestamp = world.time.elapsed
        
        // Disable controls during intro
        world.events.dispatch(world.events.globalId, 'controls-disabled')
        
        // Hide play again button during intro
        const {playAgainButton} = schemaAttribute.get(eid)
        if (playAgainButton) {
          ecs.Ui.set(world, playAgainButton, {
            opacity: 0,
          })
        }
        
        // Show game over text for intro countdown (white color)
        if (centerTextEntity) {
          ecs.Ui.set(world, centerTextEntity, {
            opacity: 1,
            text: '3',
            color: '#FFFFFF',  // White
            top: '400',
          })
        }
        
        console.log('[countdown-timer] Starting intro countdown: 3... (controls disabled)')
      })
      .onTick(() => {
        const data = dataAttribute.cursor(eid)
        const {centerTextEntity} = schemaAttribute.get(eid)
        
        // Calculate elapsed time since intro started
        const elapsedTime = world.time.elapsed - data.introTimestamp
        const elapsedSeconds = Math.floor(elapsedTime / 1000)
        
        // Update intro countdown display
        if (elapsedSeconds === 1 && data.introCountdown === 3) {
          data.introCountdown = 2
          if (centerTextEntity) {
            ecs.Ui.set(world, centerTextEntity, {
              text: '2',
              color: '#FFFFFF',  // White
              top: '400',
            })
          }
          console.log('[countdown-timer] Intro countdown: 2...')
        } else if (elapsedSeconds === 2 && data.introCountdown === 2) {
          data.introCountdown = 1
          if (centerTextEntity) {
            ecs.Ui.set(world, centerTextEntity, {
              text: '1',
              color: '#FFFFFF',  // White
              top: '400',
            })
          }
          console.log('[countdown-timer] Intro countdown: 1...')
        } else if (elapsedSeconds === 3 && data.introCountdown === 1) {
          data.introCountdown = 0
          if (centerTextEntity) {
            ecs.Ui.set(world, centerTextEntity, {
              text: 'Start!',
              color: '#00FF00',  // Green
              top: '400',
            })
          }
          // Enable controls when "Start!" appears
          world.events.dispatch(world.events.globalId, 'controls-enabled')
          console.log('[countdown-timer] Intro countdown: Start! (controls enabled)')
        } else if (elapsedSeconds >= 4) {
          // Transition to countdown state after "Start!" has been displayed for ~1 second
          world.events.dispatch(eid, 'intro-complete')
        }
      })
      .onEvent('intro-complete', 'countdown')

    // State: Countdown - actively counting down from start time to 0
    defineState('countdown')
      .onEnter(() => {
        const {startTime, centerTextEntity} = schemaAttribute.get(eid)
        const data = dataAttribute.cursor(eid)
        
        // Initialize countdown state
        data.currentTime = startTime
        data.startTimestamp = world.time.elapsed
        data.isComplete = false
        
        // Hide center text at start
        if (centerTextEntity) {
          ecs.Ui.set(world, centerTextEntity, {
            opacity: 0,
          })
        }
        
        // Display initial time
        updateTimerDisplay(data.currentTime)
        
        console.log(`[countdown-timer] Game countdown started from ${startTime}`)
        
        // Listen for checkpoint-advanced events to add bonus time
        // Note: This is set up AFTER initialization to prevent any initial bonus
        const checkpointAdvancedHandler = (event: any) => {
          // Use dynamic time bonus from event data if available, otherwise fall back to schema default
          const {checkpointBonus} = schemaAttribute.get(eid)
          const timeBonus = event.data?.timeBonus ?? checkpointBonus
          
          console.log('[countdown-timer] Checkpoint advanced!')
          console.log(`[countdown-timer] Distance: ${event.data?.distance?.toFixed(2)} units, Time bonus: ${timeBonus.toFixed(2)}s`)
          addTime(Math.round(timeBonus))
        }
        world.events.addListener(world.events.globalId, 'checkpoint-advanced', checkpointAdvancedHandler)
      })
      .onTick(() => {
        const data = dataAttribute.cursor(eid)
        const {centerTextEntity} = schemaAttribute.get(eid)
        
        // Handle bonus text fade-out and position animation
        if (data.showingBonusText && centerTextEntity) {
          const timeSinceBonusShown = world.time.elapsed - data.bonusTextStartTime
          const fadeDuration = 1500 // 1.5 seconds total display time
          
          if (timeSinceBonusShown < fadeDuration) {
            // Fade out and animate position over the duration
            const fadeProgress = timeSinceBonusShown / fadeDuration
            const opacity = 1 - fadeProgress
            
            // Interpolate position from 225 to 150 over 1.5 seconds
            const startTop = 225
            const endTop = 150
            const currentTop = startTop + (endTop - startTop) * fadeProgress
            
            ecs.Ui.set(world, centerTextEntity, {
              opacity: Math.max(0, opacity),
              top: Math.round(currentTop).toString(),
            })
          } else {
            // Hide completely after fade duration
            ecs.Ui.set(world, centerTextEntity, {
              opacity: 0,
            })
            data.showingBonusText = false
          }
        }
        
        // Calculate elapsed time since countdown started
        const elapsedTime = world.time.elapsed - data.startTimestamp
        const elapsedSeconds = Math.floor(elapsedTime / 1000)
        
        // Calculate remaining time
        const {startTime} = schemaAttribute.get(eid)
        const remainingTime = Math.max(0, startTime - elapsedSeconds)
        
        // Update display only when the second value changes
        if (remainingTime !== data.currentTime) {
          data.currentTime = remainingTime
          updateTimerDisplay(data.currentTime)
          
          console.log(`[countdown-timer] Time remaining: ${formatTime(data.currentTime)}`)
          
          // Check if countdown has reached zero
          if (data.currentTime <= 0) {
            data.isComplete = true
            world.events.dispatch(eid, 'countdown-complete')
            world.events.dispatch(world.events.globalId, 'countdown-complete')
            console.log('[countdown-timer] Countdown complete!')
          }
        }
      })
      .onEvent('countdown-complete', 'complete')

    // State: Complete - countdown has reached zero
    defineState('complete')
      .onEnter(() => {
        console.log('[countdown-timer] Entered complete state')
        const data = dataAttribute.cursor(eid)
        
        // Ensure display shows '00'
        updateTimerDisplay(0)
        
        // Disable controls when game over
        world.events.dispatch(world.events.globalId, 'controls-disabled')
        console.log('[countdown-timer] Controls disabled - game over')
        
        // Show game over text (red color)
        const {centerTextEntity, playAgainButton, playAgainButtonText} = schemaAttribute.get(eid)
        if (centerTextEntity) {
          ecs.Ui.set(world, centerTextEntity, {
            opacity: 1,
            text: 'Game Over',
            color: '#FF0000',  // Red
            top: '400',
          })
          console.log('[countdown-timer] Game over text displayed')
        } else {
          console.warn('[countdown-timer] No game over text entity configured')
        }
        
        // Show play again button
        if (playAgainButton) {
          ecs.Ui.set(world, playAgainButton, {
            opacity: 1,
          })
        }
        
        // Set button text based on gamepad connection
        updatePlayAgainButtonText(data.gamepadConnected)
        
        // Set up click listener for play again button
        if (playAgainButtonText) {
          const playAgainClickHandler = () => {
            console.log('[countdown-timer] Play again button clicked!')
            // Dispatch game restart event (to both global and this entity)
            world.events.dispatch(world.events.globalId, 'game-restart')
            world.events.dispatch(eid, 'game-restart')
          }
          
          world.events.addListener(playAgainButton, ecs.input.SCREEN_TOUCH_START, playAgainClickHandler)
          console.log('[countdown-timer] Play again button displayed with text "Play Again" and click listener attached')
        } else {
          console.warn('[countdown-timer] No play again button entity configured')
        }
      })
      .listen(eid, ecs.input.GAMEPAD_CONNECTED, (event) => {
        console.log('[countdown-timer] Gamepad connected: ', event.data.gamepad)
        const data = dataAttribute.cursor(eid)
        data.gamepadConnected = true
        updatePlayAgainButtonText(true)
      })
      .listen(eid, ecs.input.GAMEPAD_DISCONNECTED, (event) => {
        console.log('[countdown-timer] Gamepad disconnected: ', event.data.gamepad)
        const data = dataAttribute.cursor(eid)
        data.gamepadConnected = false
        updatePlayAgainButtonText(false)
      })
      .listen(world.events.globalId, 'gamepad-button-down', (event) => {
        // Detect gamepad button press
        const data = dataAttribute.cursor(eid)
        if (!data.gamepadConnected) {
          console.log('[countdown-timer] Gamepad input detected (button)')
          data.gamepadConnected = true
          updatePlayAgainButtonText(true)
        }
      })
      .listen(world.events.globalId, 'gamepad-axis-change', (event) => {
        // Detect gamepad axis movement
        const data = dataAttribute.cursor(eid)
        if (!data.gamepadConnected) {
          console.log('[countdown-timer] Gamepad input detected (axis)')
          data.gamepadConnected = true
          updatePlayAgainButtonText(true)
        }
      })
      .onEvent('game-restart', 'intro')
      .onTick(() => {
        const data = dataAttribute.cursor(eid)
        
        // Check if any gamepad is being used by looking at the input state
        const gamepadsConnected = navigator.getGamepads && Array.from(navigator.getGamepads()).some(gp => gp !== null)
        if (gamepadsConnected && !data.gamepadConnected) {
          console.log('[countdown-timer] Gamepad detected via navigator.getGamepads()')
          data.gamepadConnected = true
          updatePlayAgainButtonText(true)
        } else if (!gamepadsConnected && data.gamepadConnected) {
          console.log('[countdown-timer] No gamepad detected, reverting text')
          data.gamepadConnected = false
          updatePlayAgainButtonText(false)
        }
        
        // Check for 'start' input action to act as play again
        if (world.input.getAction('start')) {
          console.log('[countdown-timer] Start action triggered from input (play again)!')
          world.events.dispatch(world.events.globalId, 'game-restart')
          world.events.dispatch(eid, 'game-restart')
        }
      })
  },
})