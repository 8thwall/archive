// Tap the lights to change their colors
const tapLightsComponent = {
  init() {
    // blue, red, green, yellow
    const colorList = ['#5ac8fa', '#ff3b30', '#4CD964', '#ffcc00']
    let index = 0
    this.el.addEventListener('click', (event) => {
      index = (index + 1) % colorList.length
      this.el.setAttribute('material', {
        color: `${colorList[index]}`,
      })
      this.el.setAttribute('light', {
        color: `${colorList[index]}`,
      })
    })
  },
}
export {tapLightsComponent}
