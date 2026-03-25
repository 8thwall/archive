const mapThemeSwitcherComponent = {
  schema: {
    mode: {type: 'string', default: 'time'},
    lightTheme: {type: 'string', default: 'nianticlight'},
    darkTheme: {type: 'string', default: 'nighttime'},
  },
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

    // ocean theme
    const ocean = document.querySelector('a-toon-ocean')
    const camera = document.querySelector('a-camera')
    const outerSky = document.getElementById('outer-sky')
    const innerSky = document.getElementById('inner-sky')

    const character = document.getElementById('character')
    const nextBtnChar = document.getElementById('next-btn-char')
    const prevBtnChar = document.getElementById('prev-btn-char')
    const charIcon = document.getElementById('char-icon')
    const characters = ['doty', 'rpm', 'car', 'ship']
    let curChar = 0
    let selectedChar

    const nextBtn = document.getElementById('next-btn')
    const prevBtn = document.getElementById('prev-btn')
    const themeTitle = document.getElementById('theme-title')
    const themes = [
      'nianticlight',
      'nighttime',
      'natural',
      'rust',
      'muted',
      'trails',
      'arcade',
      'vaporwave',
      'ocean']
    let curTheme = 0
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
          charIcon.src = require('.././assets/map-assets/walk-icon.svg')
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
        case 'ship':
          charIcon.src = require('.././assets/theme-assets/ship.svg')
          character.setAttribute('scale', '0.015 0.015 0.015')

          if (selectedTheme === 'ocean') {
            character.setAttribute('position', '0 0.016 0')
            character.setAttribute('animation__bob', 'enabled: true')
            character.setAttribute('bob', '')
            camera.setAttribute('lightship-map-controls', 'target: 0 4.5 0')
          } else {
            camera.setAttribute('lightship-map-controls', 'target: 0 3 0')
          }
          character.setAttribute('gltf-model', require('.././assets/map-assets/ship.glb'))
          character.removeAttribute('lightship-map-walk-animation')
          character.setAttribute('shadow', 'receive: false')
          break
        default:
          console.log('no character selected')  // eslint-disable-line no-console
      }
    }

    const switchTheme = (theme) => {
      // emit theme switch event
      selectedTheme = theme
      el.emit('themeSwitched', {theme: selectedTheme})

      switch (theme) {
        case 'vaporwave':
          el.removeAttribute('lightship-map-theme')
          ocean.setAttribute('active', false)
          ocean.setAttribute('visible', false)
          nextBtnWthr.style.opacity = 1
          prevBtnWthr.style.opacity = 1

          landMat.setAttribute('material', 'color: #A6DAFF')
          buildingMat.setAttribute('material', {
            color: '#42E3EB',
            opacity: 0.6,
          })
          parkMat.setAttribute('material', 'color: #EF1990')
          parkingMat.setAttribute('material', 'color: #FE7AD0')
          roadMat.setAttribute('material', 'color: #C3A8E5')
          transitMat.setAttribute('material', 'color: #C3A8E5')
          sandMat.setAttribute('material', 'color: #F9EF00')
          waterMat.setAttribute('material', 'color: #4414F3')

          el.setAttribute('building-meters', 3)
          el.setAttribute('road-base', 0.004)

          el.setAttribute('land-material', '#land-mat')
          el.setAttribute('building-material', '#building-mat')
          el.setAttribute('park-material', '#park-mat')
          el.setAttribute('parking-material', '#parking-mat')
          el.setAttribute('road-material', '#road-mat')
          el.setAttribute('transit-material', '#transit-mat')
          el.setAttribute('sand-material', '#sand-mat')
          el.setAttribute('water-material', '#water-mat')

          outerSky.setAttribute('material', 'bottomColor: #FFC2E9')

          el.sceneEl.setAttribute('fog', {
            color: '#FFC2E9',
          })

          if (selectedChar === 'ship') {
            character.setAttribute('position', '0 0 0')
            character.setAttribute('animation__bob', 'enabled: false')
            camera.setAttribute('lightship-map-controls', 'target: 0 3 0')
          }

          // POI styling
          break
        case 'ocean':
          el.removeAttribute('lightship-map-theme')
          switchWeather(weather[0])
          curWthr = 0
          nextBtnWthr.style.opacity = 0.5
          prevBtnWthr.style.opacity = 0.5

          landMat.setAttribute('material', 'color: #0011D1')
          buildingMat.setAttribute('material', 'color: #FFF')
          roadMat.setAttribute('material', 'color: #FFF')
          transitMat.setAttribute('material', 'color: #FFF')

          el.setAttribute('building-meters', 10)
          el.setAttribute('road-base', 0.03)

          el.setAttribute('land-material', '#land-mat')
          el.setAttribute('building-material', '#building-mat')
          el.setAttribute('park-material', '')
          el.setAttribute('parking-material', '')
          el.setAttribute('road-material', '#road-mat')
          el.setAttribute('transit-material', '#transit-mat')
          el.setAttribute('sand-material', '')
          el.setAttribute('water-material', '')

          ocean.setAttribute('active', true)
          ocean.setAttribute('visible', true)

          if (selectedChar === 'ship') {
            character.setAttribute('position', '0 0.016 0')
            character.setAttribute('animation__bob', 'enabled: true')
            character.setAttribute('bob', '')
            camera.setAttribute('lightship-map-controls', 'target: 0 4.5 0')
          }

          outerSky.setAttribute('material', 'bottomColor: #FFF')

          el.sceneEl.setAttribute('fog', {
            color: '#FFF',
          })
          break
        default:
          el.setAttribute('lightship-map-theme', `theme: ${theme}`)
          ocean.setAttribute('active', false)
          ocean.setAttribute('visible', false)
          nextBtnWthr.style.opacity = 1
          prevBtnWthr.style.opacity = 1

          el.setAttribute('building-meters', 3)
          el.setAttribute('road-base', 0.004)

          if (selectedChar === 'ship') {
            character.setAttribute('position', '0 0 0')
            character.setAttribute('animation__bob', 'enabled: false')
            camera.setAttribute('lightship-map-controls', 'target: 0 3 0')
          }
      }
      themeTitle.innerText = theme
    }

    switchTheme(themes[0])

    nextBtnWthr.addEventListener('click', () => {
      if (selectedTheme !== 'ocean') {
        curWthr === weather.length - 1 ? curWthr = 0 : curWthr++
        switchWeather(weather[curWthr % weather.length])
      }
    })

    prevBtnWthr.addEventListener('click', () => {
      if (selectedTheme !== 'ocean') {
        curWthr > 0 ? curWthr-- : curWthr = weather.length - 1
        switchWeather(weather[curWthr % weather.length])
      }
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

    // TODO:
  },
}

export {mapThemeSwitcherComponent}
