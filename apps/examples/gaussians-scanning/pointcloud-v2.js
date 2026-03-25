// AFRAME.registerComponent('cover-box', {
//   schema: {
//     sphereSize: {type: 'number', default: 0.05},
//     sphereColor: {type: 'color', default: '#FF0000'},
//     gap: {type: 'number', default: 0.1},  // Gap between spheres
//     randomize: {type: 'boolean', default: false},  // Option to randomize spacing
//     boxOpacity: {type: 'number', default: 1.0},  // Control opacity of the box
//   },

//   init() {
//     this.createCover()
//   },

//   createCover() {
//     const {el} = this
//     const box = el.getAttribute('geometry')
//     const scale = el.getAttribute('scale')

//     if (!box || box.primitive !== 'box') {
//       console.error('The entity is not a box.')
//       return
//     }

//     const width = (box.width || 1) * (scale.x || 1)
//     const height = (box.height || 1) * (scale.y || 1)
//     const depth = (box.depth || 1) * (scale.z || 1)

//     const positions = []
//     const step = this.data.sphereSize * 2 + this.data.gap  // Calculate step including gap

//     const randomOffset = () => (this.data.randomize ? (Math.random() - 0.5) * step : 0)

//     // Function to add spheres to a face
//     const addFace = (x1, x2, y1, y2, z1, z2) => {
//       for (let x = x1; x <= x2; x += step) {
//         for (let y = y1; y <= y2; y += step) {
//           for (let z = z1; z <= z2; z += step) {
//             if (x === x1 || x === x2 || y === y1 || y === y2 || z === z1 || z === z2) {
//               positions.push(x + randomOffset(), y + randomOffset(), z + randomOffset())
//             }
//           }
//         }
//       }
//     }

//     // Cover all faces of the box
//     addFace(-width / 2, width / 2, -height / 2, height / 2, -depth / 2, -depth / 2)  // Front face
//     addFace(-width / 2, width / 2, -height / 2, height / 2, depth / 2, depth / 2)    // Back face
//     addFace(-width / 2, -width / 2, -height / 2, height / 2, -depth / 2, depth / 2)  // Left face
//     addFace(width / 2, width / 2, -height / 2, height / 2, -depth / 2, depth / 2)    // Right face
//     addFace(-width / 2, width / 2, -height / 2, -height / 2, -depth / 2, depth / 2)  // Bottom face
//     addFace(-width / 2, width / 2, height / 2, height / 2, -depth / 2, depth / 2)    // Top face

//     const instancedMeshEl = document.createElement('a-entity')
//     instancedMeshEl.setAttribute('geometry', {
//       primitive: 'sphere',
//       radius: this.data.sphereSize,
//     })
//     instancedMeshEl.setAttribute('material', {
//       color: this.data.sphereColor,
//       transparent: true,
//       opacity: 0.9,
//     })
//     instancedMeshEl.setAttribute('instanced-mesh', {
//       capacity: positions.length / 3,
//     })

//     const instancedMeshId = `instanced-mesh-${Math.random().toString(36).substr(2, 9)}`
//     instancedMeshEl.setAttribute('id', instancedMeshId)

//     // Append the instanced mesh entity to the original entity
//     this.el.appendChild(instancedMeshEl)

//     for (let i = 0; i < positions.length / 3; i++) {
//       const pointEl = document.createElement('a-entity')
//       pointEl.setAttribute('position', `${positions[i * 3]} ${positions[i * 3 + 1]} ${positions[i * 3 + 2]}`)
//       pointEl.setAttribute('instanced-mesh-member', `mesh:#${instancedMeshId}`)
//       instancedMeshEl.appendChild(pointEl)
//     }

//     // Set the opacity of the box geometry
//     el.setAttribute('material', 'opacity', this.data.boxOpacity)
//     el.setAttribute('material', 'transparent', this.data.boxOpacity < 1.0)
//   },
// })
