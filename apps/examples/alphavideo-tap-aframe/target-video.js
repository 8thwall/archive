const playVideoComponent = {
  schema: {
    video: {type: 'string'},
    thumb: {type: 'string'},
    canstop: {type: 'bool'},
  },
  init() {
    const v = document.querySelector(this.data.video)
    const p = this.data.thumb && document.querySelector(this.data.thumb)

    const {el} = this
    el.setAttribute('material', 'src', p || v)
    el.setAttribute('class', 'cantap')

    let playing = false

    // Play Pause functionality
    el.addEventListener('click', () => {
      if (!playing) {
        el.setAttribute('material', {
          src: v,
          shader: 'chromakey',
          // Change the color below to match what you want to mask out in video file
          color: '0.02 0.08 0.99',
          // Check forest-video.mp4 here we are using blue as the color to mask out
        })
        v.play()
        playing = true
      } else if (this.data.canstop) {
        v.pause()
        playing = false
      }
    })
  },
}

export {playVideoComponent}
