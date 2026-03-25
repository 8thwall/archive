// AFRAME.registerComponent('pointcloud', {
//   schema: {
//     size: { type: 'number', default: 0.01 }
//   },

//   init: function () {
//     this.el.addEventListener('model-loaded', this.createPointCloud.bind(this));
//   },

//   createPointCloud: function () {
//     const targetEl = this.el;
//     const model = targetEl.getObject3D('mesh');
//     if (!model) {
//       console.error('Target element does not have a mesh');
//       return;
//     }

//     const modelMatrixWorld = new THREE.Matrix4();
//     targetEl.object3D.updateMatrixWorld();
//     modelMatrixWorld.copy(targetEl.object3D.matrixWorld);

//     const positions = [];
//     const colors = [];

//     model.traverse((child) => {
//       if (child.isMesh) {
//         const positionArray = child.geometry.attributes.position.array;
//         const colorArray = child.geometry.attributes.color?.array;

//         for (let i = 0; i < positionArray.length; i += 3) {
//           const vertex = new THREE.Vector3(positionArray[i], positionArray[i + 1], positionArray[i + 2]);
//           vertex.applyMatrix4(modelMatrixWorld);
//           positions.push(vertex.x, vertex.y, vertex.z);

//           if (colorArray) {
//             colors.push(colorArray[i], colorArray[i + 1], colorArray[i + 2]);
//           } else {
//             colors.push(1, 1, 1); // default color if no vertex color
//           }
//         }
//       }
//     });

//     const instancedMeshEl = document.createElement('a-entity');
//     instancedMeshEl.setAttribute('geometry', {
//       primitive: 'sphere',
//       radius: this.data.size
//     });
//     instancedMeshEl.setAttribute('material', {
//       vertexColors: 'vertex',
//       transparent: true,
//       opacity: 0.7
//     });
//     instancedMeshEl.setAttribute('instanced-mesh', {
//       capacity: positions.length / 3
//     });

//     const instancedMeshId = 'instanced-mesh-' + Math.random().toString(36).substr(2, 9);
//     instancedMeshEl.setAttribute('id', instancedMeshId);

//     // Append the instanced mesh entity to the scene
//     this.el.sceneEl.appendChild(instancedMeshEl);

//     for (let i = 0; i < positions.length / 3; i++) {
//       const pointEl = document.createElement('a-entity');
//       pointEl.setAttribute('position', `${positions[i * 3]} ${positions[i * 3 + 1]} ${positions[i * 3 + 2]}`);
//       pointEl.setAttribute('instanced-mesh-member', `mesh:#${instancedMeshId}`);
//       pointEl.setAttribute('material', `color: rgb(${colors[i * 3] * 255}, ${colors[i * 3 + 1] * 255}, ${colors[i * 3 + 2] * 255})`);
//       instancedMeshEl.appendChild(pointEl);
//     }

//     // Hide the original model
//     targetEl.setAttribute('visible', 'false');
//   }
// });
