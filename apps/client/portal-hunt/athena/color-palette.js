AFRAME.registerComponent('color-palette', {
  init: function() {
    this.handleButtonTouchStart = this.handleButtonTouchStart.bind(this)
    this.handleButtonTouchEnd = this.handleButtonTouchEnd.bind(this)
    this.handlePaletteTouchEnd = this.handlePaletteTouchEnd.bind(this)

    this.doTouch = this.doTouch.bind(this)

    this.isExpanded = false
    this.expandPalette = this.expandPalette.bind(this)
    this.collapsePalette = this.collapsePalette.bind(this)
    this.setActiveColor = this.setActiveColor.bind(this)
    this.getPositionFromEvent = this.getPositionFromEvent.bind(this)
    this.getColorFromPosition = this.getColorFromPosition.bind(this)

    this.button = document.getElementById('paletteButton')
    this.palette = document.getElementById('palette')

    this.colors = [
      ['#ffa6c9', '#fd0e35', '#f3f2f4','#02A4d3','#c5e17a'],
      ['#af593e','#ff8833', '#818199', '#7611b7', '#3aa655'],
      ['#fdd5b1','#fcee21', '#323232', '#ad50ff', '#00edaf'],
    ]

    this.setActiveColor(this.colors[1][2])

    this.button.addEventListener('touchstart', this.handleButtonTouchStart)
    this.button.addEventListener('touchend', this.handleButtonTouchEnd)

    this.button.addEventListener('touchmove', this.doTouch)
    this.palette.addEventListener('touchmove', this.doTouch)

    this.palette.addEventListener('touchend', this.handlePaletteTouchEnd)
    this.el.sceneEl.addEventListener('touchstart', this.collapsePalette)
    this.el.sceneEl.addEventListener('touchend', this.collapsePalette)
  },
  handleButtonTouchStart: function(event) {
    if(!this.isExpanded) {
      this.startColor = this.activeColor
      this.touchStart = performance.now()

      clearTimeout(this.expandTimeout)
      this.expandTimeout = setTimeout(()=>{
        this.expandTimeout = null
        this.expandPalette()
      }, 100)
    } else {
      this.collapsePalette()
    }

  },
  handleButtonTouchEnd: function(event) {
    if (this.isExpanded) {
      this.doTouch(event)
      this.collapsePalette()
      return
    }
  },
  handlePaletteTouchEnd: function(event) {
    this.doTouch(event)
    this.collapsePalette()
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
    this.isExpanded = true
    this.palette.classList.add('palette-expanded')
  },
  collapsePalette: function() {
    this.isExpanded = false
    this.palette.classList.remove('palette-expanded')
  },
  setActiveColor: function(color) {
    this.activeColor = color
    this.button.style.backgroundColor = color
    this.el.sceneEl.emit('palettecolorchange', color)
  },
  getPositionFromEvent: function(event) {
    return {
      x:(event.changedTouches[0].clientX - this.palette.offsetLeft )  / this.palette.offsetWidth,
      y:(event.changedTouches[0].clientY - this.palette.offsetTop )  / this.palette.offsetHeight,
    }
  },
  getColorFromPosition: function(position) {
    const numRows = this.colors.length
    const numCols = this.colors[0].length

    const col = Math.floor(numCols * position.x)
    const row = Math.floor(numRows * position.y)

    return this.colors[row][col] || 'black'
  },
})

