const button = ({content, id, attributes, offsetEpsilon, onState}) => {
  const buttonOptions = {
    borderWidth: 0,
    alignContent: 'center',
    justifyContent: 'center',
    offset: offsetEpsilon,
    padding: 0,
    fontColor: new THREE.Color(0xffffff),
  }

  // Options for component.setupState().
  // It must contain a 'state' parameter, which you will refer to with component.setState( 'name-of-the-state' ).
  const hoveredStateAttributes = {
    state: 'hovered',
    attributes: {
      offset: offsetEpsilon,
      backgroundColor: new THREE.Color(0x999999),
      backgroundOpacity: 1,
      fontColor: new THREE.Color(0xffffff),
    },
    onSet: () => {
      onState(id, 'hovered')
    },
  }

  const idleStateAttributes = {
    state: 'idle',
    attributes: {
      offset: offsetEpsilon,
      backgroundColor: new THREE.Color(0x666666),
      backgroundOpacity: 0.3,
      fontColor: new THREE.Color(0xffffff),
    },
    onSet: () => {
      onState(id, 'idle')
    },
  }

  const selectedStateAttributes = {
    state: 'selected',
    attributes: {
      offset: offsetEpsilon,
      backgroundColor: new THREE.Color(0x777777),
      backgroundOpacity: 1,
      fontColor: new THREE.Color(0x222222),
    },
    onSet: () => {
      onState(id, 'selected')
    },
  }

  const inactiveStateAttributes = {
    state: 'inactive',
    attributes: {
      offset: offsetEpsilon,
      backgroundColor: new THREE.Color(0x444444),
      backgroundOpacity: 0.3,
      fontColor: new THREE.Color(0x999999),
    },
    onSet: () => {
      onState(id, 'idle')
    },
  }

  // Buttons creation, with the options objects passed in parameters.
  const b = new ThreeMeshUI.Block({...buttonOptions, ...attributes})

  // Add text to buttons
  b.add(new ThreeMeshUI.Text({content, attributes: {offset: offsetEpsilon}}))

  b.setupState(selectedStateAttributes)
  b.setupState(hoveredStateAttributes)
  b.setupState(idleStateAttributes)
  b.setupState(inactiveStateAttributes)

  return b
}

const pushButton = ({id, content, attributes, offsetEpsilon, onState}) => {
  const block = button({id, content, attributes, offsetEpsilon, onState})
  let state_ = ''
  let active_ = true
  const setState = (newState) => {
    if (state_ === newState) {
      return
    }
    state_ = newState
    if (active_) {
      block.setState(state_)
    }
  }
  const interacted = ({hovered, pushed}) => {
    if (pushed) {
      setState('selected')
      return
    }
    if (hovered) {
      setState('hovered')
      return
    }
    setState('idle')
  }

  const activated = (active) => {
    if (active_ === active) {
      return
    }

    active_ = active
    block.setState(active_ ? state_ : 'inactive')
  }

  return {id, block, activated, interacted}
}

const toggleButton = ({id, content, attributes, offsetEpsilon, onState}) => {
  const block = button({id, content, attributes, offsetEpsilon, onState})
  let isOn_ = false
  let wasPushed_ = false
  let state_ = ''
  let active_ = true
  const setState = (newState) => {
    if (state_ === newState) {
      return
    }
    state_ = newState
    if (active_) {
      block.setState(state_)
    }
  }
  const interacted = ({hovered, pushed}) => {
    const newPush = !wasPushed_ && pushed
    wasPushed_ = pushed
    if (newPush) {
      isOn_ = !isOn_
    }
    if (isOn_) {
      if (newPush) {
        setState('selected')
      }
      return
    }

    if (hovered) {
      setState('hovered')
      return
    }
    setState('idle')
  }

  const activated = (active) => {
    if (active_ === active) {
      return
    }

    active_ = active
    block.setState(active_ ? state_ : 'inactive')
  }
  return {id, block, activated, interacted}
}

const hudManager = () => {
  const raycaster_ = new THREE.Raycaster()
  const mouse_ = new THREE.Vector2()
  let scene_ = null
  let canvas_ = null
  let w_ = 0
  let h_ = 0
  let camera_ = null
  let container_ = null
  let selectState_ = false
  let listenersAdded_ = false
  const oldState_ = {}
  const objsToTest_ = []

  const listeners_ = {
    pointermove: (event) => {
      mouse_.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse_.y = -(event.clientY / window.innerHeight) * 2 + 1
    },
    pointerdown: () => {
      selectState_ = true
    },
    pointerup: () => {
      selectState_ = false
    },
    touchstart: (event) => {
      selectState_ = true
      mouse_.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1
      mouse_.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1
    },
    touchend: () => {
      selectState_ = false
      mouse_.x = null
      mouse_.y = null
    },
  }

  const addListeners = () => {
    Object.entries(listeners_).forEach(([event, callback]) => {
      window.addEventListener(event, callback)
    })
    listenersAdded_ = true
  }

  const removeListeners = () => {
    Object.entries(listeners_).forEach(([event, callback]) => {
      window.removeEventListener(event, callback)
    })
    listenersAdded_ = false
  }

  const needsLayout = () => !canvas_ || canvas_.width !== w_ || canvas_.height !== h_

  const doLayout = () => {
    // Aspect ratio of the hud widget
    const HUD_ASPECT_W = 2
    const HUD_ASPECT_H = 3

    // Max width / height of the hud widget, as a fraction of the screen.
    const MAX_W = 0.33
    const MAX_H = 0.67

    // Aspect ratio of the hud margin to screen corner.
    const MARGIN_ASPECT_W = 1
    const MARGIN_ASPECT_H = 1

    // Max size of the margin, as a fraction of the screen.
    const MAX_MARGIN_X = 0.05
    const MAX_MARGIN_Y = 0.05

    if (!scene_) {
      scene_ = document.querySelector('a-scene')
      canvas_ = scene_.canvas
    }

    if (!listenersAdded_) {
      addListeners()
    }

    w_ = canvas_.width
    h_ = canvas_.height

    const hudAspect = HUD_ASPECT_W / HUD_ASPECT_H

    // Figure out what size (in pixels) the hud will be.
    // Try vertical constraints first.
    let targetH = MAX_H * h_
    let targetW = targetH * hudAspect
    if (targetW > MAX_W * w_) {
      // Redo with horizontal layout.
      targetW = MAX_W * w_
      targetH = targetW / hudAspect
    }

    // Figure out what the margin size (in pixels) of the hud will be.
    const marginAspect = MARGIN_ASPECT_W / MARGIN_ASPECT_H
    let marginY = MAX_MARGIN_Y * h_
    let marginX = marginY * marginAspect
    if (marginX > MAX_MARGIN_X * w_) {
      marginX = MAX_MARGIN_X * w_
      marginY = marginX / marginAspect
    }

    // Get target corners in pixels
    const lowX = w_ - marginX
    const lowY = h_ - marginY
    const highX = lowX - targetW
    const highY = lowY - targetH

    // Get target corners in NDC
    const x1 = 2 * highX / w_ - 1
    const y1 = -(2 * highY / h_ - 1)
    const x2 = 2 * lowX / w_ - 1
    const y2 = -(2 * lowY / h_ - 1)

    if (!camera_) {
      camera_ = document.querySelector('a-camera').object3D.children[0]
    }

    // Get a point along the target rays in 3d space.
    camera_.updateProjectionMatrix()
    const v1 = new THREE.Vector3(x1, y1, 0).applyMatrix4(camera_.projectionMatrixInverse)
    const v2 = new THREE.Vector3(x2, y2, 0).applyMatrix4(camera_.projectionMatrixInverse)

    // Transform to canonical ray space.
    const rx1 = v1.x / v1.z
    const ry1 = v1.y / v1.z
    const rx2 = v2.x / v2.z
    const ry2 = v2.y / v2.z

    const offsetEpsilon = 1e-4
    const z = -(camera_.near + 250 * offsetEpsilon)

    // Get positions on the front of the camera.
    const nx1 = rx1 * z
    const ny1 = ry1 * z
    const nx2 = rx2 * z
    const ny2 = ry2 * z

    const cx = 0.5 * (nx1 + nx2)
    const cy = 0.5 * (ny1 + ny2)

    const nw = Math.abs(nx1 - nx2)
    const nh = Math.abs(ny1 - ny2)
    const br = nw * 0.1
    if (container_) {
      container_.removeFromParent()
    }

    container_ = new ThreeMeshUI.Block({
      height: nh,
      width: nw,
      borderRadius: [br, br, br, br],
      borderWidth: 0,
      borderOpacity: 0,
      fontSize: nh * 0.04,
      fontFamily: `${require('./assets/roboto.msdf')}Roboto-msdf.json`,
      fontTexture: `${require('./assets/roboto.msdf')}Roboto-msdf.png`,
      justifyContent: 'center',
      contentDirection: 'column',
      padding: nw * 0.01,
    })
    container_.position.set(cx, cy, z)

    const rowAttrs = {
      // borderWidth: 0,
      // width: nw * 0.4,
      // height: nh * 0.15,
      // alignContent: 'center',
      // justifyContent: 'center',
      // offset: baseOffset,
      // margin: nw * 0.01,
      // padding: 0,
      // borderRadius: nw * 0.05,
      // fontColor: new THREE.Color(0xffffff),
      backgroundOpacity: 0,
      padding: 0,
      borderWidth: 0,
      margin: 0,
      borderOpacity: 0,
      justifyContent: 'center',
      alignContent: 'center',
      contentDirection: 'row',
    }
    const rows = [
      new ThreeMeshUI.Block(rowAttrs),
      new ThreeMeshUI.Block(rowAttrs),
      new ThreeMeshUI.Block(rowAttrs),
      new ThreeMeshUI.Block(rowAttrs),
    ]

    container_.add(rows[0], rows[1], rows[2], rows[3])

    const buttonOptions = {
      width: nw * 0.35,
      height: nh * 0.15,
      margin: nw * 0.03,
      borderRadius: nw * 0.05,
    }

    const onState = (id, newState) => {
      console.log(`button ${id} transitioned to ${newState}`)
      scene_.emit('hud-button-updatate', {id, to: newState})
      if (id === 'gps') {
        if (newState === 'selected') {
          objsToTest_.forEach((obj) => {
            if (obj.id === 'gps') {
              return
            }
            obj.activated(false)
          })
        } else {
          objsToTest_.forEach((obj) => {
            if (obj.id === 'gps') {
              return
            }
            obj.activated(true)
          })
        }
      }
    }

    const buttonUp = pushButton(
      {id: 'up', content: 'Fwd', attributes: buttonOptions, offsetEpsilon, onState}
    )

    const buttonDown = pushButton(
      {id: 'down', content: 'Bck', attributes: buttonOptions, offsetEpsilon, onState}
    )

    const buttonLeft = pushButton(
      {id: 'left', content: 'Lft', attributes: buttonOptions, offsetEpsilon, onState}
    )

    const buttonRight = pushButton(
      {id: 'right', content: 'Rgt', attributes: buttonOptions, offsetEpsilon, onState}
    )

    const buttonGps = toggleButton(
      {id: 'gps', content: 'GPS', attributes: {...buttonOptions, margin: nw * 0.1}, offsetEpsilon, onState}
    )

    rows[0].add(buttonUp.block)
    rows[1].add(buttonLeft.block, buttonRight.block)
    rows[2].add(buttonDown.block)
    rows[3].add(buttonGps.block)

    objsToTest_.length = 0
    objsToTest_.push(buttonUp, buttonLeft, buttonRight, buttonDown, buttonGps)

    camera_.add(container_)
  }

  const raycast = () => objsToTest_.reduce((closestIntersection, obj) => {
    const intersection = raycaster_.intersectObject(obj.block, true)

    if (!intersection[0]) {
      return closestIntersection
    }

    if (!closestIntersection || intersection[0].distance < closestIntersection.distance) {
      return {...intersection[0], object: obj}
    }

    return closestIntersection
  }, null)

  const updateButtons = () => {
    // // Find closest intersecting object
    raycaster_.setFromCamera(mouse_, camera_)
    const intersect = raycast()

    // // Update targeted button state (if any)
    if (intersect && intersect.object.block.isUI) {
      if (selectState_) {
        intersect.object.interacted({hovered: true, pushed: true})
      } else {
        intersect.object.interacted({hovered: true, pushed: false})
      }
    }

    // Update non-targeted buttons state
    objsToTest_.forEach((obj) => {
      if (!intersect || obj !== intersect.object) {
        obj.interacted({hovered: false, pushed: false})
      }
    })
  }

  const tick = () => {
    if (needsLayout()) {
      doLayout()
    }
    updateButtons()
    ThreeMeshUI.update()
  }

  return {
    tick,
  }
}

const hudComponent = {
  schema: {
  },
  init() {
    this.hudManager = hudManager()
  },
  tick() {
    this.hudManager.tick()
  },
}

let registered_ = false
const register = () => {
  const {AFRAME} = window
  if (!AFRAME || registered_) {
    return
  }

  AFRAME.registerComponent('scan-world-hud', hudComponent)
  registered_ = true
}

register()

const HudComponents = {
  register,
}

export {
  HudComponents,
}
