// Copyright (c) 2022 8th Wall, Inc.

import './index.css'

import {
  shareNameComponent, nameFromParamComponent, clickMoveComponent, characterTapComponent,
  lookControllerComponent, lookAtSlerpComponent, moveControllerComponent,
} from './components/components'

AFRAME.registerComponent('share-name', shareNameComponent)
AFRAME.registerComponent('name-from-param', nameFromParamComponent)
AFRAME.registerComponent('click-move', clickMoveComponent)
AFRAME.registerComponent('character-tap', characterTapComponent)
AFRAME.registerComponent('look-controller', lookControllerComponent)
AFRAME.registerComponent('look-at-slerp', lookAtSlerpComponent)
AFRAME.registerComponent('move-controller', moveControllerComponent)

import {responsiveImmersiveComponent} from './components/responsive-immersive'
AFRAME.registerComponent('responsive-immersive', responsiveImmersiveComponent)
