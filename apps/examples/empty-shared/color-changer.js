/* globals NAF */
const colorChangerComponent = {
  init() {
    this.getRandomColor = this.getRandomColor.bind(this)
  },
  events: {
    'click': function (evt) {
      this.el.setAttribute('rotation', `0 ${Math.random() * 360} 0`)
      // this works in vanilla aframe but does not work in our environment
      // this.el.setAttribute('material', {color: this.getRandomColor()})
      NAF.utils.takeOwnership(this.el)
    },
  },
  getRandomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`
  },
}
export {colorChangerComponent}
