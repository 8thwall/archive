import type {Object3D} from 'three'

declare global {
  interface HTMLElement {
    object3D: Object3D
  }
}
