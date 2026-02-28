/* eslint-disable max-len */
import type {AFrameAttribute} from '../aframe-primitives'

const SCENE_ATTRIBUTES: AFrameAttribute[] = [
  {
    name: 'ar-hit-test',
    detail: 'component.arHitTest',
    description: 'This component uses the WebXR hit-test API to position virtual objects in the real world. Remember to request the hit-test optional feature to allow it work.',
    default: '',
  },
  {
    name: 'background',
    detail: 'component.background',
    description: 'The background component sets a basic color background of a scene that is more performant than a-sky since geometry is not created. There are no undesired frustum culling issues when a-sky is further than the far plane of the camera. There are no unexpected occlusions either with far objects that might be behind of the sphere geometry of a-sky.',
    default: '',
  },
  {
    name: 'debug',
    detail: 'component.debug',
    description: 'The debug component enables component-to-DOM serialization.',
    default: '',
  },
  {
    name: 'device-orientation-permission-ui',
    detail: 'component.DeviceOrientationPermissionUi',
    description: 'Starting with Safari on iOS 13 browsers require sites to be served over https and request user permission to access DeviceOrientation events. This component presents a permission dialog for the user to grant or deny access. The device-orientation-permission-ui component applies only to the <a-scene> element',
    default: '',
  },
  {
    name: 'loading-screen',
    detail: 'component.loadingScreen',
    description: 'The loading screen component configures the loading screen visual style. To configure the style of the loader title bar one can redefine .a-loader-title style. ',
    default: '',
  },
  {
    name: 'reflection',
    detail: 'component.reflection',
    description: 'The reflection component generates a default environment cube map for all materials, this is useful in case you find GLB models end up too dark or reflective materials don\'t look right because they are not reflecting the environment this will provide a default reflective environment.',
    default: '',
  },
  {
    name: 'renderer',
    detail: 'component.renderer',
    description: 'The renderer system configures a scene\'s THREE.WebGLRenderer instance. It also configures presentation attributes when entering WebVR/WebXR.',
    default: '',
  },
  {
    name: 'webxr',
    detail: 'component.webxr',
    description: 'The webxr system configures a scene\'s WebXR device setup, specifically the options for the requestSession call. When modifying these options, please pay attention to the browser console for diagnostic messages such as trying to use features without properly requesting them.',
    default: '',
  },
  {
    name: 'screenshot',
    detail: 'component.screenshot',
    description: 'The screenshot component lets us take different types of screenshots with keyboard shortcuts. A-Frame attaches this component to the scene by default so we don\'t have to do anything to use the component.',
    default: '',
  },
  {
    name: 'embedded',
    detail: 'component.embedded',
    description: 'The embedded component removes fullscreen CSS styles from A-Frame\'s <canvas> element, making it easier to embed within the layout of an existing webpage. Embedding removes the default fixed positioning from the canvas and makes the Enter VR button smaller.',
    default: '',
  },
  {
    name: 'fog',
    detail: 'component.fog',
    description: 'The fog component obscures entities in fog given distance from the camera. The fog component applies only to the <a-scene> element.',
    default: '',
  },
  {
    name: 'keyboard-shortcuts',
    detail: 'component.keyboardShortcuts',
    description: 'The keyboard-shortcuts component toggles global keyboard shortcuts. The keyboard-shortcuts component applies only to the <a-scene> element.',
    default: '',
  },
  {
    name: 'stats',
    detail: 'component.stats',
    description: 'The stats component displays a UI with performance-related metrics. The stats component applies only to the <a-scene> element.',
    default: '',
  },
  {
    name: 'vr-mode-ui',
    detail: 'component.vrModeUi',
    description: 'The vr-mode-ui component allows disabling of UI such as an Enter VR button, compatibility modal, and orientation modal for mobile. The vr-mode-ui component applies only to the <a-scene> element. If we wish to simply toggle the UI, use CSS instead.',
    default: '',
  },
]

export {SCENE_ATTRIBUTES}
