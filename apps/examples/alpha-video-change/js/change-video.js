const changeVideoComponent = {
  init() {
    const container = document.getElementById('container')
    const alphaVideo = document.getElementById('alphaVideo')

    // Define video configurations for scalability and reduced repetition.
    const videoConfigs = {
      'custom-texture1': {
        video: '#alpha-video1',
        src: '#alpha-video1',
        img: require('../assets/textures/alpaca.jpg'),
      },
      'custom-texture2': {
        video: '#alpha-video2',
        src: '#alpha-video2',
        img: require('../assets/textures/chicken.jpg'),
      },
      'custom-texture3': {
        video: '#alpha-video3',
        src: '#alpha-video3',
        img: require('../assets/textures/cow.jpg'),
      },
    }

    const setVideo = ({newVideo, button}) => {
      const config = videoConfigs[newVideo]
      if (config) {
        // Set opacity to 0 for fade-in effect
        alphaVideo.setAttribute('material', 'opacity', 0)

        alphaVideo.removeAttribute('play-video')
        alphaVideo.removeAttribute('material')
        alphaVideo.setAttribute('play-video', {video: config.video, autoplay: 'true'})
        alphaVideo.setAttribute('material', {shader: 'chromakey', src: config.src, color: '0.1 0.9 0.2', side: 'double', depthTest: 'true', opacity: 0})

        // Add animation to fade in video over 1 second
        alphaVideo.setAttribute('animation', {
          property: 'material.opacity',
          from: 0,
          to: 1,
          dur: 1500,  // 1 second
          easing: 'easeInOutQuad',
          startEvents: 'fadein',
        })

        // Trigger the fade-in animation
        alphaVideo.emit('fadein')

        button.focus()
      }
    }

    // Loop through videoConfigs to create UI buttons.
    for (const key in videoConfigs) {
      const videoButton = document.createElement('button')
      videoButton.classList.add('carousel')

      // Set button background using CSS class rather than inline style.
      videoButton.style.backgroundImage = `url(${videoConfigs[key].img})`

      container.appendChild(videoButton)

      videoButton.addEventListener('click', () => setVideo({
        newVideo: key,
        button: videoButton,
      }))
    }

    this.el.sceneEl.addEventListener('realityready', () => {
      // Select first button in list.
      const firstButton = container.getElementsByTagName('button')[0]
      // Set first video in list.
      setVideo({newVideo: Object.keys(videoConfigs)[0], button: firstButton})
    })

    // Support horizontal scroll for more than 5 buttons.
    if (Object.keys(videoConfigs).length > 5) {
      container.style.pointerEvents = 'auto'
    }
  },
}

export {changeVideoComponent}
