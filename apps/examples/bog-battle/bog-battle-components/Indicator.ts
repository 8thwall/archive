import * as ecs from '@8thwall/ecs'

const {THREE} = (window as any)

// Function to create a gradient texture
const createGradientTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const context = canvas.getContext('2d')

  const gradient = context.createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, '#3164C9')
  gradient.addColorStop(1, '#783FF6')
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  return new THREE.CanvasTexture(canvas)
}

// Function to create a health bar
const createHealthBar = (initialHealth, backgroundTextureUrl) => {
  const healthBar = new THREE.Object3D()

  // Load background texture
  const textureLoader = new THREE.TextureLoader()
  const backgroundTexture = textureLoader.load(backgroundTextureUrl)

  // Create the background (container)
  const backgroundGeometry = new THREE.PlaneGeometry(1.5, 0.4)
  const backgroundMaterial = new THREE.MeshBasicMaterial({map: backgroundTexture, transparent: true})
  const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
  background.position.z = 0
  healthBar.add(background)

  // // Create the foreground (health level)
  // const foregroundGeometry = new THREE.PlaneGeometry(1.4, 0.3)  // Slightly smaller than the background to fit within
  // const gradientTexture = createGradientTexture()
  // const foregroundMaterial = new THREE.MeshBasicMaterial({map: gradientTexture, transparent: true})
  // const foreground = new THREE.Mesh(foregroundGeometry, foregroundMaterial)
  // foreground.position.z = 0.01  // Slightly in front of the background
  // foreground.position.y = -0.03
  // foreground.scale.x = initialHealth  // Scale based on initial health
  // foreground.position.x = -(1.4 - (1.4 * initialHealth)) / 2  // Adjust position to keep it aligned
  // healthBar.add(foreground)

  // Create the foreground (health level)
  const foregroundGeometry = new THREE.CapsuleGeometry(0.17, 1.15, 8, 16)  // Capsule oriented along X-axis
  foregroundGeometry.rotateZ(Math.PI / 2)  // Rotate capsule to align with the health bar direction
  foregroundGeometry.rotateX(Math.PI)
  const gradientTexture = createGradientTexture()
  const foregroundMaterial = new THREE.MeshBasicMaterial({map: gradientTexture, transparent: true})
  const foreground = new THREE.Mesh(foregroundGeometry, foregroundMaterial)
  foreground.position.z = 0.01  // Slightly in front of the background
  foreground.scale.set(initialHealth, 1, 0.02)  // Scale based on initial health
  foreground.position.x = -0.7 * (1 - initialHealth)  // Adjust position to keep it aligned
  healthBar.add(foreground)

  // Function to update the health bar
  healthBar.updateHealth = (health) => {
    foreground.scale.x = health
    foreground.position.x = -(1.4 - (1.4 * health)) / 2
  }

  return healthBar
}

const Indicator = ecs.registerComponent({
  name: 'Indicator',
  schema: {
    progress: ecs.f32,  // Progress value between 0 and 1
    // @asset
    barBackground: ecs.string,
    yOffset: ecs.f32,
  },
  schemaDefaults: {
    progress: 0.5,  // Default progress value
    yOffset: 3,
  },
  add: (world, component) => {
    // Create and add the health bar to the scene
    const healthBar = createHealthBar(component.schema.progress, component.schema.barBackground)
    healthBar.position.set(0, component.schema.yOffset, 0)
    healthBar.rotation.set(0, THREE.MathUtils.degToRad(45), 0)  // Rotate 45 degrees to the left and 45 degrees up
    world.scene.add(healthBar)

    // Listen for progress updates
    world.events.addListener(component.eid, 'updateProgress', (e) => {
      const indicator = Indicator.cursor(world, e.target)
      indicator.progress = (e.data as {value: number}).value
      healthBar.updateHealth(indicator.progress)
    })
  },
  remove: (world, component) => {
    // Clean up DOM elements if necessary
  },
})

export {Indicator}
