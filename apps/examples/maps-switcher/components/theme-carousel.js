const themeCarouselComponent = {
  init() {
    const {el} = this
    // custom theme materials
    const landMat = document.getElementById('land-mat')
    const buildingMat = document.getElementById('building-mat')
    const parkMat = document.getElementById('park-mat')
    const parkingMat = document.getElementById('parking-mat')
    const roadMat = document.getElementById('road-mat')
    const transitMat = document.getElementById('transit-mat')
    const sandMat = document.getElementById('sand-mat')
    const waterMat = document.getElementById('water-mat')

    // theme switcher UI
    const rainParticles = document.getElementById('rain-particles')
    const snowParticles = document.getElementById('snow-particles')
    const nextBtnWthr = document.getElementById('next-btn-wthr')
    const prevBtnWthr = document.getElementById('prev-btn-wthr')
    const wthrIcon = document.getElementById('wthr-icon')
    const weather = ['sun', 'rain', 'snow']
    let curWthr = 0
    let selectedWthr

    const camera = document.querySelector('a-camera')
    const outerSky = document.getElementById('outer-sky')
    const innerSky = document.getElementById('inner-sky')

    const character = document.getElementById('character')
    const nextBtnChar = document.getElementById('next-btn-char')
    const prevBtnChar = document.getElementById('prev-btn-char')
    const charIcon = document.getElementById('char-icon')
    const characters = ['doty', 'rpm', 'car']
    let curChar = 0
    let selectedChar

    const nextBtn = document.getElementById('next-btn')
    const prevBtn = document.getElementById('prev-btn')
    const themeTitle = document.getElementById('theme-title')
    const themes = [
      '8w dark',
      'nianticlight',
      'natural',
      'vaporwave',
      'violet sunset',
      'bubblegum',
      'home run',
      'ice',
      'roller rink',
      'lighttime',
      'mars',
      'night lime',
      'seaside',
      'swamp',
      'newspaper',
      'rust',
      'muted',
      'nighttime',
      'trails',
      'arcade',
    ]
    let curTheme = 0
    let customTheme
    let selectedTheme

    const switchWeather = (wthr) => {
      selectedWthr = wthr
      switch (wthr) {
        case 'rain':
          wthrIcon.src = require('.././assets/theme-assets/rain.svg')
          rainParticles.setAttribute('visible', true)
          snowParticles.setAttribute('visible', false)
          break
        case 'snow':
          wthrIcon.src = require('.././assets/theme-assets/snow.svg')
          rainParticles.setAttribute('visible', false)
          snowParticles.setAttribute('visible', true)
          break
        default:
          wthrIcon.src = require('.././assets/theme-assets/sun.svg')
          rainParticles.setAttribute('visible', false)
          snowParticles.setAttribute('visible', false)
      }
    }

    const switchCharacter = (char) => {
      selectedChar = char
      switch (char) {
        case 'doty':
          charIcon.src = require('.././assets/theme-assets/doty-fill.svg')  // corresponding icon
          character.setAttribute('scale', '0.1 0.1 0.1')  // set correct scale for model
          character.setAttribute('position', '0 0 0')  // place on ground
          character.setAttribute('animation__bob', 'enabled: false')  // disable bob animation
          // set 3D model
          character.setAttribute('gltf-model', require('.././assets/map-assets/doty.glb'))
          character.setAttribute('lightship-map-walk-animation', {
            idle: 'idle',
            walk: 'walk',
            run: 'walk',
          })
          camera.setAttribute('lightship-map-controls', 'target: 0 3 0')
          break
        case 'rpm':
          charIcon.src = require('.././assets/theme-assets/walk-icon.svg')
          character.setAttribute('scale', '0.023 0.023 0.023')
          character.setAttribute('position', '0 0 0')
          character.setAttribute('lightship-map-walk-animation', {
            idle: 'idle',
            walk: 'walk',
            run: 'run',
          })
          character.setAttribute('animation__bob', 'enabled: false')
          character.setAttribute('gltf-model', require('.././assets/map-assets/rpm.glb'))
          camera.setAttribute('lightship-map-controls', 'target: 0 4 0')
          break
        case 'car':
          charIcon.src = require('.././assets/theme-assets/car.svg')
          character.setAttribute('scale', '0.003 0.003 0.003')
          character.setAttribute('position', '0 0 0')
          character.setAttribute('animation__bob', 'enabled: false')
          character.setAttribute('gltf-model', require('.././assets/map-assets/car.glb'))
          character.removeAttribute('lightship-map-walk-animation')
          character.setAttribute('shadow', 'receive: false')
          camera.setAttribute('lightship-map-controls', 'target: 0 2.75 0')
          break
        default:
          console.log('no character selected')
      }
    }

    const switchTheme = (theme) => {
      // emit theme switch event
      selectedTheme = theme
      el.emit('themeSwitched', {theme: selectedTheme})

      let landColor; let buildingColor; let parkColor; let parkingColor; let roadColor
      let transitColor; let sandColor; let waterColor; let skyColor
      let fogColor

      const buildingMeters = 3
      let roadMetersS = 2
      let roadMetersM = 4
      let roadMetersL = 8
      let roadMetersXL = 32
      let transitMeters = 8
      let waterMeters = 6
      let skyExponent = 0.65
      let fogDensity = 0.018

      switch (theme) {
        case '8w dark':
          customTheme = true
          landColor = '#ad50ff'
          buildingColor = '#7611b6'
          parkColor = '#01ecaf'
          parkingColor = '#464766'
          roadColor = '#464766'
          transitColor = '#ffc828'
          sandColor = '#b6b8d0'
          waterColor = '#2d2e43'
          skyColor = '#000000'
          fogColor = '#260E3F'

          skyExponent = 0.7
          fogDensity = 0.022

          innerSky.setAttribute('animation__spin', 'dur: 500000')
          innerSky.setAttribute('material', 'src: #nimbus; repeat: 8 8; opacity: 0.35')

          // wayspot color: #57BFFF
          break
        case 'vaporwave':
          customTheme = true
          landColor = '#A6DAFF'
          buildingColor = '#42E3EB'
          parkColor = '#EF1990'
          parkingColor = '#FE7AD0'
          roadColor = '#C3A8E5'
          transitColor = '#C3A8E5'
          sandColor = '#F9EF00'
          waterColor = '#4414F3'
          skyColor = '#FFC2E9'
          fogColor = '#FFC2E9'

          innerSky.setAttribute('animation__spin', 'dur: 500000')
          innerSky.setAttribute('material', 'src: #cotton-candy; repeat: 4 4; opacity: 0.75')

          // wayspot color: #0EF096
          break
        case 'violet sunset':
          customTheme = true
          landColor = '#ff8c82'
          buildingColor = '#503953'
          parkColor = '#88c084'
          parkingColor = '#998FC7'
          roadColor = '#503953'
          transitColor = '#BE5F84'
          sandColor = '#FFAD72'
          waterColor = '#54b2af'
          skyColor = '#ffad72'
          fogColor = '#ba5688'

          skyExponent = 0.6
          fogDensity = 0.016

          roadMetersS = 3
          roadMetersM = 3
          roadMetersL = 3
          roadMetersXL = 3
          transitMeters = 0

          innerSky.setAttribute('animation__spin', 'dur: 500000')
          innerSky.setAttribute('material', 'src: #nimbus; repeat: 8 8; opacity: 0.15')

          // wayspot color: #c1e8eb
          break
        case 'bubblegum':
          customTheme = true
          landColor = '#d0a9b1'
          buildingColor = '#bfe1d4'
          parkColor = '#f7e9e1'
          parkingColor = '#e0828f'
          roadColor = '#f7e9e1'
          transitColor = '#4898b1'
          sandColor = '#f7e9e1'
          waterColor = '#4898b1'
          skyColor = '#bfe1d4'
          fogColor = '#ffffff'

          skyExponent = 0.4

          transitMeters = 4

          innerSky.setAttribute('animation__spin', 'dur: 500000')
          innerSky.setAttribute('material', 'src: #cotton-candy; repeat: 4 4; opacity: 0.5;')

          // wayspot color: #f4a4c0
          break
        case 'home run':
          customTheme = true
          landColor = '#ecebe1'
          buildingColor = '#efeff0'
          parkColor = '#ecebe1'
          parkingColor = '#f1f3f4'
          roadColor = '#1f4e8c'
          transitColor = '#ca4541'
          sandColor = '#ecebe1'
          waterColor = '#ecebe1'
          skyColor = '#1f4e8c'
          fogColor = '#eceef0'

          skyExponent = 0.8
          fogDensity = 0.017

          innerSky.setAttribute('xrextras-spin', 'speed: 500000')
          innerSky.setAttribute('material', 'src: #clouds; repeat: 4 4; opacity: 0.4')

          // wayspot color: #ca4541
          break
        case 'ice':
          customTheme = true
          landColor = '#cbf0ff'
          buildingColor = '#93e3fd'
          parkColor = '#ffffff'
          parkingColor = '#ffffff'
          roadColor = '#ffffff'
          transitColor = '#52d6fc'
          sandColor = '#fefcdd'
          waterColor = '#0042a9'
          skyColor = '#93e3fd'
          fogColor = '#ffffff'

          fogDensity = 0.025

          // wayspot color: #d9c9fe
          break
        case 'roller rink':
          customTheme = true
          landColor = '#70f1d5'
          buildingColor = '#e065b2'
          parkColor = '#9260de'
          parkingColor = '#fae561'
          roadColor = '#54b8f3'
          transitColor = '#fae561'
          sandColor = '#e065b2'
          waterColor = '#54b8f3'
          skyColor = '#54b8f3'
          fogColor = '#ffffff'

          skyExponent = 0.9
          fogDensity = 0.015

          innerSky.setAttribute('animation__spin', 'dur: 500000')
          innerSky.setAttribute('material', 'src: #cotton-candy; repeat: 6 6; opacity: 0.2')

          // wayspot color: #fae561
          break
        case 'lighttime':
          customTheme = true
          landColor = '#ebebeb'
          buildingColor = '#dfdfdf'
          parkColor = '#d3e9d7'
          parkingColor = '#ebebeb'
          roadColor = '#ffffff'
          transitColor = '#f2c55a'
          sandColor = '#fbf0c8'
          waterColor = '#a3bff4'
          skyColor = '#a7c6ff'
          fogColor = '#ffffff'

          innerSky.setAttribute('animation__spin', 'dur: 500000')
          innerSky.setAttribute('material', 'src: #clouds; repeat: 4 4; opacity: 0.35')

          // wayspot color: #628fee
          break
        case 'mars':
          customTheme = true
          landColor = '#a35928'
          buildingColor = '#814d25'
          parkColor = '#985c2e'
          parkingColor = '#a94922'
          roadColor = '#ed8b40'
          transitColor = '#67432d'
          sandColor = '#67432d'
          waterColor = '#ef9654'
          skyColor = '#831100'
          fogColor = '#ef9e4c'

          fogDensity = 0.019
          skyExponent = 0.9

          innerSky.setAttribute('animation__spin', 'dur: 500000')
          innerSky.setAttribute('material', 'src: #nimbus; repeat: 8 8; opacity: 0.5')

          // wayspot color: #503e3e
          break
        case 'night lime':
          customTheme = true
          landColor = '#11053b'
          buildingColor = '#1a0a52'
          parkColor = '#1a0a52'
          parkingColor = '#1a0a52'
          roadColor = '#d6fe5e'
          transitColor = '#1a0a52'
          sandColor = '#2c0977'
          waterColor = '#012f7b'
          skyColor = '#7a219e'
          fogColor = '#11053b'

          roadMetersS = 0
          roadMetersM = 0
          roadMetersL = 0
          roadMetersXL = 0
          transitMeters = 0
          waterMeters = 3

          innerSky.setAttribute('animation__spin', 'dur: 0')
          innerSky.setAttribute('material', 'src: #stars; repeat: 12 12; opacity: 0.75')

          // wayspot color: #b0ee4f
          break
        case 'seaside':
          customTheme = true
          landColor = '#efeff1'
          buildingColor = '#ffdbd8'
          parkColor = '#22708d'
          parkingColor = '#3e89a9'
          roadColor = '#7ec0c1'
          transitColor = '#2f61da'
          sandColor = '#e1e1ea'
          waterColor = '#59b5e2'
          skyColor = '#0a23a4'
          fogColor = '#ffffff'

          fogDensity = 0.014
          skyExponent = 1

          innerSky.setAttribute('animation__spin', 'dur: 500000')
          innerSky.setAttribute('material', 'src: #clouds; repeat: 4 4; opacity: 0.15')

          // wayspot color: #93dbe5
          break
        case 'swamp':
          customTheme = true
          landColor = '#425930'
          buildingColor = '#162d10'
          parkColor = '#c3c78f'
          parkingColor = '#4c611f'
          roadColor = '#7f8c3b'
          transitColor = '#101e11'
          sandColor = '#56512c'
          waterColor = '#26504f'
          skyColor = '#376d6c'
          fogColor = '#cbdd6e'

          fogDensity = 0.038
          skyExponent = 1

          innerSky.setAttribute('animation__spin', 'dur: 500000')
          innerSky.setAttribute('material', 'src: #nimbus; repeat: 8 8; opacity: 0.5')

          // wayspot color: #4c442a
          break
        case 'newspaper':
          customTheme = true
          landColor = '#d6d6d6'
          buildingColor = '#c2c2c2'
          parkColor = '#adadad'
          parkingColor = '#707070'
          roadColor = '#000000'
          transitColor = '#000000'
          sandColor = '#707070'
          waterColor = '#858585'
          skyColor = '#000000'
          fogColor = '#ebebeb'

          innerSky.setAttribute('animation__spin', 'dur: 500000')
          innerSky.setAttribute('material', 'src: #nimbus; repeat: 8 8; opacity: 0.35')

          // wayspot color: #000000
          break
        default:
          customTheme = false
      }

      if (customTheme) {
        el.removeAttribute('lightship-map-theme')
        nextBtnWthr.style.opacity = 1
        prevBtnWthr.style.opacity = 1

        landMat.setAttribute('material', `color: ${landColor}`)
        buildingMat.setAttribute('material', {
          color: `${buildingColor}`,
          opacity: 0.9,
        })
        parkMat.setAttribute('material', `color: ${parkColor}`)
        parkingMat.setAttribute('material', `color: ${parkingColor}`)
        roadMat.setAttribute('material', `color: ${roadColor}`)
        transitMat.setAttribute('material', `color: ${transitColor}`)
        sandMat.setAttribute('material', `color: ${sandColor}`)
        waterMat.setAttribute('material', `color: ${waterColor}`)

        el.setAttribute('building-meters', buildingMeters)
        el.setAttribute('road-s-meters', roadMetersS)
        el.setAttribute('road-m-meters', roadMetersM)
        el.setAttribute('road-l-meters', roadMetersL)
        el.setAttribute('road-xl-meters', roadMetersXL)
        el.setAttribute('transit-meters', transitMeters)
        el.setAttribute('water-meters', waterMeters)

        outerSky.setAttribute('material', `topColor: ${skyColor}; bottomColor: ${fogColor}; exponent: ${skyExponent}`)

        el.sceneEl.setAttribute('fog', {
          color: `${fogColor}`,
          density: `${fogDensity}`,
        })

        el.setAttribute('land-material', '#land-mat')
        el.setAttribute('building-material', '#building-mat')
        el.setAttribute('park-material', '#park-mat')
        el.setAttribute('parking-material', '#parking-mat')
        el.setAttribute('road-material', '#road-mat')
        el.setAttribute('transit-material', '#transit-mat')
        el.setAttribute('sand-material', '#sand-mat')
        el.setAttribute('water-material', '#water-mat')
      } else {
        el.setAttribute('lightship-map-theme', `theme: ${theme}`)
        innerSky.setAttribute('animation__spin', 'dur: 500000')
        innerSky.setAttribute('material', 'src: #clouds; repeat: 4 4; opacity: 0.4')
      }
      themeTitle.innerText = theme
    }

    switchTheme(themes[0])
    this.el.sceneEl.addEventListener('wayspotAdded', (e) => {
      document.getElementById('start-btn').style.backgroundColor = e.detail.color
    })

    nextBtnWthr.addEventListener('click', () => {
      curWthr === weather.length - 1 ? curWthr = 0 : curWthr++
      switchWeather(weather[curWthr % weather.length])
    })

    prevBtnWthr.addEventListener('click', () => {
      curWthr > 0 ? curWthr-- : curWthr = weather.length - 1
      switchWeather(weather[curWthr % weather.length])
    })

    nextBtnChar.addEventListener('click', () => {
      curChar === characters.length - 1 ? curChar = 0 : curChar++
      switchCharacter(characters[curChar % characters.length])
    })

    prevBtnChar.addEventListener('click', () => {
      curChar > 0 ? curChar-- : curChar = characters.length - 1
      switchCharacter(characters[curChar % characters.length])
    })

    nextBtn.addEventListener('click', () => {
      curTheme === themes.length - 1 ? curTheme = 0 : curTheme++
      switchTheme(themes[curTheme % themes.length])
    })

    prevBtn.addEventListener('click', () => {
      curTheme > 0 ? curTheme-- : curTheme = themes.length - 1
      switchTheme(themes[curTheme % themes.length])
    })
  },
}

const mapLoadingScreenComponent = {
  init() {
    const scene = this.el.sceneEl
    const gradient = document.getElementById('gradient')
    const poweredby = document.getElementById('poweredby')

    const dismissLoadScreen = () => {
      setTimeout(() => {
        poweredby.classList.add('fade-out')
        gradient.classList.add('fade-out')
      }, 1500)

      setTimeout(() => {
        poweredby.style.display = 'none'
        gradient.style.display = 'none'
      }, 2000)
    }

    const getPosition = function (options) {
      return new Promise(((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      }))
    }

    getPosition()
      .then((position) => {
        scene.hasLoaded ? dismissLoadScreen() : scene.addEventListener('loaded', dismissLoadScreen)
      })
      .catch((err) => {
        console.error(err.message)
      })
  },
}

const mapDebugControlsComponent = {
  schema: {
    distance: {default: 0.0001},
  },
  init() {
    this.char = this.el.children[0]

    const handleKeyDown = (e) => {
      this.el.setAttribute('enable-gps', false)
      this.latlng = this.el.getAttribute('lat-lng')
      this.locArr = this.latlng.split(' ')

      if (e.key === 'ArrowUp' || e.key === 'w') {
        this.fwd = true
      }

      if (e.key === 'ArrowDown' || e.key === 's') {
        this.back = true
      }

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        this.left = true
      }

      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.right = true
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        this.fwd = false
      }

      if (e.key === 'ArrowDown' || e.key === 's') {
        this.back = false
      }

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        this.left = false
      }

      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.right = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  },
  tick() {
    // diagonal controls
    if (this.fwd && this.left) {  // NW
      const plusLat = parseFloat(this.locArr[0]) + this.data.distance
      const plusLng = parseFloat(this.locArr[1]) + this.data.distance
      this.el.setAttribute('lat-lng', `${plusLat} ${plusLng}`)
      if (this.char !== undefined) {
        this.char.setAttribute('rotation', '0 120 0')
      }
    }

    if (this.fwd && this.right) {  // NE
      const minusLat = parseFloat(this.locArr[0]) - this.data.distance
      const plusLng = parseFloat(this.locArr[1]) + this.data.distance
      this.el.setAttribute('lat-lng', `${minusLat} ${plusLng}`)
      if (this.char !== undefined) {
        this.char.setAttribute('rotation', '0 45 0')
      }
    }

    if (this.back && this.left) {  // SW
      const plusLat = parseFloat(this.locArr[0]) + this.data.distance
      const minusLng = parseFloat(this.locArr[1]) - this.data.distance
      this.el.setAttribute('lat-lng', `${plusLat} ${minusLng}`)
      if (this.char !== undefined) {
        this.char.setAttribute('rotation', '0 -120 0')
      }
    }

    if (this.back && this.right) {  // SE
      const minusLat = parseFloat(this.locArr[0]) - this.data.distance
      const minusLng = parseFloat(this.locArr[1]) - this.data.distance
      this.el.setAttribute('lat-lng', `${minusLat} ${minusLng}`)
      if (this.char !== undefined) {
        this.char.setAttribute('rotation', '0 -45 0')
      }
    }

    // cardinal controls
    if (this.fwd && !this.left && !this.right) {  // N
      const plusLng = parseFloat(this.locArr[1]) + this.data.distance
      this.el.setAttribute('lat-lng', `${this.locArr[0]} ${plusLng}`)
      if (this.char !== undefined) {
        this.char.setAttribute('rotation', '0 90 0')
      }
    }

    if (this.back && !this.left && !this.right) {  // S
      const minusLng = parseFloat(this.locArr[1]) - this.data.distance
      this.el.setAttribute('lat-lng', `${this.locArr[0]} ${minusLng}`)
      if (this.char !== undefined) {
        this.char.setAttribute('rotation', '0 -90 0')
      }
    }

    if (this.left && !this.fwd && !this.back) {  // E
      const plusLat = parseFloat(this.locArr[0]) + this.data.distance
      this.el.setAttribute('lat-lng', `${plusLat} ${this.locArr[1]}`)
      if (this.char !== undefined) {
        this.char.setAttribute('rotation', '0 180 0')
      }
    }

    if (this.right && !this.fwd && !this.back) {  // W
      const minusLat = parseFloat(this.locArr[0]) - this.data.distance
      this.el.setAttribute('lat-lng', `${minusLat} ${this.locArr[1]}`)
      if (this.char !== undefined) {
        this.char.setAttribute('rotation', '0 0 0')
      }
    }
  },
}

export {themeCarouselComponent, mapLoadingScreenComponent, mapDebugControlsComponent}
