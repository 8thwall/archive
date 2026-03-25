const overrideImageTargetsComponent = {
  schema: {
    names: {type: 'array', default: []},
    geometry: {type: 'string'},
  },
  init() {
    const {names} = this.data
    XR8.XrController.configure({imageTargets: names})
  },
}

export default overrideImageTargetsComponent
