AFRAME.registerComponent('color-palette', {
  init: function() {
    this.handleButtonTouchStart = this.handleButtonTouchStart.bind(this)
    this.handleButtonTouchEnd = this.handleButtonTouchEnd.bind(this)
    this.handlePaletteTouchEnd = this.handlePaletteTouchEnd.bind(this)

    this.doTouch = this.doTouch.bind(this)

    this.expandPalette = this.expandPalette.bind(this)
    this.collapsePalette = this.collapsePalette.bind(this)
    this.setActiveColor = this.setActiveColor.bind(this)
    this.getPositionFromEvent = this.getPositionFromEvent.bind(this)
    this.getColorFromPosition = this.getColorFromPosition.bind(this)

    this.button = document.getElementById('paletteButton')
    this.palette = document.getElementById('palette')

    this.setActiveColor('cyan')

    this.button.addEventListener('touchstart', this.handleButtonTouchStart)
    this.button.addEventListener('touchend', this.handleButtonTouchEnd)

    this.button.addEventListener('touchmove', this.doTouch)
    this.palette.addEventListener('touchmove', this.doTouch)

    this.palette.addEventListener('touchend', this.handlePaletteTouchEnd)
    this.el.sceneEl.addEventListener('touchstart', this.collapsePalette)
    this.el.sceneEl.addEventListener('touchend', this.collapsePalette)
  },
  handleButtonTouchStart: function(event) {
    this.startColor = this.activeColor
    this.expandPalette()
    this.touchStart = performance.now()
  },
  handleButtonTouchEnd: function(event) {
      this.doTouch(event)
    if (performance.now() - this.touchStart > 200) {
      this.doTouch(event)
      this.collapsePalette()
    }
  },
  handlePaletteTouchEnd: function(event) {
    this.doTouch(event)
    this.collapsePalette()
    console.log("released on palette")
  },
  doTouch(event) {
    const targetedElement = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
    if(targetedElement != this.palette) {
      this.setActiveColor(this.startColor)
      return
    }
    this.setActiveColor(this.getColorFromPosition(this.getPositionFromEvent(event)))
  },
  expandPalette: function() {
    this.palette.classList.add('palette-expanded')
    console.log("Expanding")
  },
  collapsePalette: function() {
    this.palette.classList.remove('palette-expanded')
  },
  setActiveColor: function(color) {
    this.activeColor = color
    this.button.style.backgroundColor = color
    this.el.sceneEl.emit('palettecolorchange', color)
    console.log(color)
  },
  getPositionFromEvent: function(event) {
    return {
      x:(event.changedTouches[0].clientX - this.palette.offsetLeft )  / this.palette.offsetWidth,
      y:(event.changedTouches[0].clientY - this.palette.offsetTop )  / this.palette.offsetHeight,
    }
  },
  getColorFromPosition: function(position) {

    const colors = [
      ['lightblue', 'red', 'green'],
      ['white', '#323232', 'gray'],
      ['brown', '#7611b7', 'yellow'],
    ]

    const numRows = 3
    const numCols = 3

    const col = Math.floor(numCols * position.x)
    const row = Math.floor(numRows * position.y)

    return colors[col][row] || 'black'
  },
})
