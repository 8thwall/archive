const voidFaceTranslate = {
  schema: {
    offset: {type: 'number', default: 0},
    startOrder: {type: 'string', default: 'first'},
  },
  init() {
    const face = this.el
    const start = this.data.startOrder

    setTimeout(() => {
      face.emit(this.data.startOrder)
    }, this.data.offset)

    face.addEventListener('animationcomplete', (event) => {
      // console.log(`${start} animation complete!`)
      face.emit(start)
    })
  },
}

export {voidFaceTranslate}
