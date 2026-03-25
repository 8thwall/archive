const gridHelperComponent = {
  schema: {
    divisions: {default: 10},
    size: {default: 10},
  },
  init() {
    this.el.object3D.add(new THREE.GridHelper(this.data.size, this.data.divisions))
  },
}

const recenterOnSelectComponent = {
  init() {
    const {el} = this
    el.addEventListener('select-8w', threejsRay => el.emit('recenter-8w'))
  },
}

const gridHelperPrimitive = {
  defaultComponents: {
    'grid-helper': {},
  },
  mappings: {
    divisions: 'grid-helper.divisions',
    size: 'grid-helper.size',
  },
}

if (window.AFRAME) {
  AFRAME.registerComponent('recenter-on-select', recenterOnSelectComponent)
  AFRAME.registerComponent('grid-helper', gridHelperComponent)
  AFRAME.registerPrimitive('grid-helper', gridHelperPrimitive)
}
