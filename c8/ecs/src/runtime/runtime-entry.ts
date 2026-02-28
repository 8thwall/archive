// @rule(js_binary)
// @name(runtime)
// @package(npm-ecs)
// @attr(esnext = 1)

import './set-three'

import ecs from './index'

// When loaded as a script tag, make the runtime available as window.ecs

import {application} from './application'

Object.assign(window, {ecs})

Object.assign(ecs, {application})
