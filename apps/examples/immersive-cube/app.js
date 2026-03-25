/* globals ResponsiveImmersive */
import {runThree} from './run-three'
import './components'

const t = true

console.log('hi')

const run = () => (
  t ? runThree() : document.body.insertAdjacentHTML('beforeend', require('./ascene.html'))
)

window.XR8 ? run() : window.addEventListener('xrloaded', run)
