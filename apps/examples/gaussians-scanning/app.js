AFRAME.registerComponent('voxel-generator', {
  schema: {
    voxelSize: {type: 'number', default: 0.1},  // Size of the voxel
    noiseFactor: {type: 'number', default: 0.05},  // Factor to add noise to the voxel generation
    radius: {type: 'number', default: 0.5},  // Radius for the raycasting circle
    rayCount: {type: 'int', default: 50},  // Number of rays in the chunk
  },

  init() {
    this.voxelPositions = new Set()
    this.raycasters = []  // Array to hold multiple raycasters
    this.mouseCoords = []  // Array to hold mouse coordinates for each raycaster
    this.camera = document.querySelector('[camera]')
    this.threeCamera = this.camera.getObject3D('camera')
    this.isGenerating = false

    // Create multiple raycasters for amorphous chunk pattern
    for (let i = 0; i < this.data.rayCount; i++) {
      this.raycasters.push(new THREE.Raycaster())
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * this.data.radius
      const offsetX = Math.cos(angle) * distance
      const offsetY = Math.sin(angle) * distance
      this.mouseCoords.push(new THREE.Vector2(offsetX, offsetY))
    }

    this.el.sceneEl.addEventListener('click', this.startGeneration.bind(this))
  },

  startGeneration(event) {
    if (this.isGenerating) return

    this.isGenerating = true
    this.generateVoxels()
  },

  generateVoxels() {
    const {voxelSize, noiseFactor} = this.data

    // Set an interval to perform raycasting repeatedly
    this.interval = setInterval(() => {
      // Perform multiple raycasts in an amorphous chunk pattern
      this.raycasters.forEach((raycaster, index) => {
        const mouse = this.mouseCoords[index]
        raycaster.setFromCamera(mouse, this.threeCamera)

        const intersects = raycaster.intersectObjects(this.el.sceneEl.object3D.children, true)

        if (intersects.length > 0) {
          const intersect = intersects[0]

          // Get the intersected object
          const intersectedObject = intersect.object.el

          // Check if intersectedObject and its object3D are defined
          if (intersectedObject && intersectedObject.object3D) {
            // Calculate the position for the voxel in local space of the intersected object
            const intersectPoint = intersect.point
            const localIntersectPoint = intersectedObject.object3D.worldToLocal(intersectPoint.clone())

            // Snap the position to the voxel grid
            const voxelPosition = {
              x: Math.round(localIntersectPoint.x / voxelSize) * voxelSize,
              y: Math.round(localIntersectPoint.y / voxelSize) * voxelSize + noiseFactor,  // Slightly elevate to avoid z-fighting
              z: Math.round(localIntersectPoint.z / voxelSize) * voxelSize,
            }

            const voxelKey = `${voxelPosition.x},${voxelPosition.y},${voxelPosition.z}`

            // Check if the voxel position is already occupied
            if (!this.voxelPositions.has(voxelKey)) {
              console.log('Generating voxel at:', voxelPosition)

              // Create the voxel entity
              const voxel = document.createElement('a-box')
              voxel.setAttribute('position', voxelPosition)
              voxel.setAttribute('color', 'white')
              voxel.setAttribute('depth', voxelSize)
              voxel.setAttribute('height', voxelSize)
              voxel.setAttribute('width', voxelSize)
              voxel.setAttribute('material', 'shader: flat; side: double; transparent: false; opacity: 1; polygonOffset: true; polygonOffsetFactor: 1; polygonOffsetUnits: 1')
              voxel.setAttribute('class', 'voxel')  // Add class to identify voxels

              // Append the voxel to the intersected object
              intersectedObject.appendChild(voxel)

              // Add the voxel position to the set
              this.voxelPositions.add(voxelKey)
            }
          }
        }
      })
    }, 100)  // Adjust the interval time as needed
  },

  remove() {
    // Clear the interval when the component is removed
    clearInterval(this.interval)
  },
})
