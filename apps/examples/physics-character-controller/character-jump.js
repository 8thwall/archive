const jumpComponent = {
  schema: {
    jumpPower: {default: 17},  // Power of veloctiy force upwards on character
    gravity: {default: -28},   // Gravity setting. Negative for downward force.
    friction: {default: 0},    // Friction setting.
  },

  // Initialize the jump component setup.
  init() {
    const jumpZone = document.getElementById('jumpZone')
    this.character = document.getElementById('character')
    this.circularButton = document.getElementById('circularButton')

    // Event listener for when the character body is loaded and ready.
    this.character.addEventListener('body-loaded', () => {
      const body = this.character.components['ammo-body']?.body

      // Early exit if body is not available.
      if (!body) {
        console.log('Body component not found after body-loaded event.')
        return
      }

      // Define gravity and friction settings using the schema values.
      body.setGravity(new Ammo.btVector3(0, this.data.gravity, 0))
      body.setFriction(this.data.friction)

      // Visual feedback function for button activation.
      const activateButton = () => {
        this.circularButton.classList.add('simulate-active')
        setTimeout(() => {
          this.circularButton.classList.remove('simulate-active')
        }, 100)
      }

      // Play character's jump animation.
      const playJumpAnimation = () => {
        const childModel = document.getElementById('characterModel')
        if (childModel) {
          childModel.setAttribute('animation-mixer', {
            clip: 'JUMPUP',
            loop: 'once',
            crossFadeDuration: 0.5,
          })
        }
      }

      const handleJump = (event) => {
        activateButton()

        // Restrict jump if the character isn't grounded.
        if (!this.character.characterController.isGrounded) {
          return
        }

        // Configure character as jumping.
        this.character.characterController.isJumping = true

        const verticalVelocity = this.data.jumpPower
        const velocityVector = body.getLinearVelocity()

        // Apply velocity if the character can jump.
        if (velocityVector) {
          velocityVector.setY(verticalVelocity)
          body.setLinearVelocity(velocityVector)
          body.forceActivationState(Ammo.DISABLE_DEACTIVATION)
          body.activate()

          console.log('Applied jump velocity')
          playJumpAnimation()
        } else {
          console.log('Failed to retrieve velocity vector from body.')
        }

        event.isHandled = true
      }

      // Attach jump event listeners.
      jumpZone.addEventListener('touchstart', handleJump)
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
          handleJump(e)
        }
      })
    })
  },
}

export {jumpComponent}
