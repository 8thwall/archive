import {PLYLoader} from './ply-loader'

const loader = new PLYLoader()

const PLYModelComponent = {
  schema: {
    src: {},
    mesh: {default: true},
    size: {default: 1},
  },
  update() {
    const {data} = this
    const {el} = this

    const scene = this.el.sceneEl

    let material
    let mesh

    loader.load(data.src, (geometry) => {
      geometry.computeVertexNormals()

      if (data.mesh) {
        material = new THREE.MeshStandardMaterial({color: 0xAD50FF, flatShading: true})
        mesh = new THREE.Mesh(geometry, material)
        scene.object3D.add(mesh)
      } else {
        if (data.texture) {
          const sprite = new THREE.TextureLoader().load(data.texture)
          material = new THREE.PointsMaterial({
            size: data.size,
            vertexColors: true,
            map: sprite,
          })
        } else {
          material = new THREE.PointsMaterial({
            size: data.size,
            vertexColors: true,
          })
        }
        const pointcloud = new THREE.Points(geometry, material)
        el.setObject3D('pointcloud', pointcloud)
      }
    })
  },
}

const PLYModelPrimitive = {
  defaultComponents: {
    'ply-model': {},
  },
  mappings: {
    src: 'ply-model.src',
    mesh: 'ply-model.mesh',
    size: 'ply-model.size',
  },

}

const sizeSelectComponent = {
  init() {
    const {data} = this
    const {el} = this
    const slider = document.getElementById('sizeSelect')

    slider.addEventListener('input', (e) => {
      const scale = e.target.value / 100
      el.setAttribute('size', scale)
    })
  },
}

export {PLYModelComponent, PLYModelPrimitive, sizeSelectComponent}
