import * as ecs from '@8thwall/ecs'

const {THREE} = window as any
const direction = new THREE.Vector3()
const cameraPosition = new THREE.Vector3()
const upVector = new THREE.Vector3(0, 1, 0)  // For adding arc to the shot

ecs.registerComponent({
  name: 'basketball-shooter',
  schema: {
    maxForce: ecs.f32,                    // Maximum power/speed of the shot
    radius: ecs.f32,                      // Size of basketball collider
    arcFactor: ecs.f32,                   // How much upward arc to add to the shot
    chargeTime: ecs.f32,                  // Time to reach maximum force (seconds)
    useGltfModel: ecs.boolean,            // Whether to use a 3D model instead of a sphere
    modelUrl: ecs.string,                 // URL to the basketball model
    modelScale: ecs.f32,                  // Scale factor for the model
    spinFactor: ecs.f32,                  // How much spin to apply (0-1)
  },
  schemaDefaults: {
    maxForce: 22,                         // Maximum force when fully charged
    radius: 0.25,                         // Basketball size
    arcFactor: 0.8,                       // Higher arc for better basketball feel
    chargeTime: 1.4,                      // Time to reach maximum force (seconds)
    useGltfModel: false,                  // Default to sphere for compatibility
    modelUrl: './assets/basketball.glb',  // Default path, update to your model location
    modelScale: 1.0,                      // Default scale factor for the model
    spinFactor: 0.5,                      // Default spin intensity
  },
  data: {
    isCharging: ecs.boolean,              // Whether currently charging a shot
    pressStartTime: ecs.f32,              // When the button was pressed (for charge timing)
  },

  tick: (world, component) => {
    const mouseDown = world.input.getMouseButton(0)  // Left mouse button
    const mousePressed = world.input.getMouseDown(0)  // Just pressed
    const mouseReleased = world.input.getMouseUp(0)  // Just released

    // Start charging on mouse down
    if (mousePressed && !component.data.isCharging) {
      component.data.isCharging = true
      component.data.pressStartTime = world.time.elapsed / 1000
    }

    // Shoot on mouse up if was charging
    if (mouseReleased && component.data.isCharging) {
      // Get timing data for shot power
      const currentTime = world.time.elapsed / 1000
      const holdDuration = Math.min(currentTime - component.data.pressStartTime, component.schema.chargeTime)
      const chargePercent = holdDuration / component.schema.chargeTime
      const shotForce = component.schema.maxForce * (0.2 + chargePercent * 0.8)

      // Shooting logic
      const o3d = world.three.entityToObject.get(world.camera.getActiveEid())
      o3d.getWorldPosition(cameraPosition)
      o3d.getWorldDirection(direction)

      const offsetDistance = 1
      const spawnPosition = cameraPosition.clone().add(direction.clone().multiplyScalar(offsetDistance))
      const ball = world.createEntity()

      // Set position
      ecs.Position.set(world, ball, {
        x: spawnPosition.x,
        y: spawnPosition.y,
        z: spawnPosition.z,
      })

      // Apply model or sphere geometry based on settings
      if (component.schema.useGltfModel) {
        // Use GLB model
        ecs.GltfModel.set(world, ball, {
          url: component.schema.modelUrl,
        })

        // Scale the model
        world.setScale(ball,
          component.schema.modelScale,
          component.schema.modelScale,
          component.schema.modelScale)

        // Try to apply shadows directly on model load
        world.events.addListener(ball, ecs.events.GLTF_MODEL_LOADED, (eventData) => {
          console.log('GLTF model loaded, applying shadows')

          // Apply shadow component
          ecs.Shadow.set(world, ball, {
            castShadow: true,
            receiveShadow: false,
          })

          // For GLB models, we may need to manually set shadow-casting on the Three.js object
          const ballObject = world.three.entityToObject.get(ball)
          if (ballObject) {
            // Make the object and all its children cast shadows
            ballObject.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = false
              }
            })
          }
        })
      } else {
        // Use sphere geometry
        ecs.SphereGeometry.set(world, ball, {radius: component.schema.radius})
        ecs.Material.set(world, ball, {
          r: 255,
          g: 140,          // Orange basketball color
          b: 0,            // Orange basketball color
          roughness: 0.7,  // Basketball has a slight texture
        })

        // Add shadow for spheres
        ecs.Shadow.set(world, ball, {
          castShadow: true,
          receiveShadow: false,
        })
      }

      // Add physics with better rotation properties
      ecs.Collider.set(world, ball, {
        shape: ecs.physics.ColliderShape.Sphere,
        mass: 0.625,            // Standard basketball mass
        radius: component.schema.radius,
        rollingFriction: 0.05,  // Very low rolling friction to encourage rolling
        friction: 0.7,          // High surface friction to convert sliding to rolling
        gravityFactor: 1.1,
        restitution: 0.8,       // Basketballs bounce well
        angularDamping: 0.05,   // Minimal angular damping for long-lasting spin
        spinningFriction: 0.1,  // Minimal spinning friction
        linearDamping: 0.1,     // Low linear damping to maintain momentum
      })

      // Calculate velocity with arc to create basketball-like trajectory
      const shotDirection = direction.clone()

      // Add upward component based on arcFactor
      shotDirection.add(upVector.clone().multiplyScalar(component.schema.arcFactor))

      // Normalize to maintain consistent force
      shotDirection.normalize()

      // Apply linear velocity (for the shot)
      ecs.physics.setLinearVelocity(
        world,
        ball,
        shotDirection.x * shotForce,
        shotDirection.y * shotForce,
        shotDirection.z * shotForce
      )

      // Calculate realistic basketball spin
      // For a proper basketball shot, we want backspin around the horizontal axis
      // This means rotation around an axis perpendicular to both the shot direction and world up

      // Calculate the right vector (perpendicular to shot direction and world up)
      const rightVector = new THREE.Vector3().crossVectors(shotDirection, upVector).normalize()

      // Apply backspin (rotation around the right vector)
      // This creates the proper basketball backspin effect
      const spinIntensity = shotForce * component.schema.spinFactor * 3
      ecs.physics.applyTorque(
        world,
        ball,
        rightVector.x * spinIntensity,
        rightVector.y * spinIntensity,
        rightVector.z * spinIntensity
      )

      // Optional: Add small random component for variation
      ecs.physics.applyTorque(
        world,
        ball,
        (Math.random() * 0.2 - 0.1) * spinIntensity,
        (Math.random() * 0.2 - 0.1) * spinIntensity,
        (Math.random() * 0.2 - 0.1) * spinIntensity
      )

      // Optional collision handling and cleanup
      world.events.addListener(ball, ecs.physics.COLLISION_START_EVENT, (e) => {
        setTimeout(() => {
          ecs.ScaleAnimation.set(world, ball, {
            autoFrom: true,
            loop: false,
            toX: 0,
            toY: 0,
            toZ: 0,
            duration: 1200,
            easingFunction: 'Elastic',
            easeOut: true,
          })
          setTimeout(() => {
            world.deleteEntity(ball)
          }, 1200)
        }, 10000)  // 10 seconds until ball starts to disappear
      })

      // Reset charging state
      component.data.isCharging = false
    }
  },
})
