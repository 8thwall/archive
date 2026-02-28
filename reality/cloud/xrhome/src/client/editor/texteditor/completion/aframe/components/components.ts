/* eslint-disable max-len */
import type {AFrameAttribute} from '../aframe-primitives'

const ALL_COMPONENTS: AFrameAttribute[] = [
  {
    name: 'animation',
    detail: 'component.animation',
    description: 'The animation component lets us animate and tween values.',
    default: '',
  },
  {
    name: 'camera',
    detail: 'component.camera',
    description: 'The camera component defines from which perspective the user views the scene. The camera is commonly paired with controls components that allow input devices to move and rotate the camera.',
    default: '',
  },
  {
    name: 'cursor',
    detail: 'component.cursor',
    description: 'The cursor component provides hover and click states for interaction on top of the raycaster component. The cursor component can be used for both gaze-based and controller-based interactions, but the appearance needs to be configured depending on the use case.',
    default: '',
  },
  {
    name: 'geometry',
    detail: 'component.geometry',
    description: 'The geometry component provides a basic shape for an entity. The primitive property defines the general shape. Geometric primitives, in computer graphics, are irreducible basic shapes. A material component is commonly defined to provide an appearance alongside the shape to create a complete mesh.',
    default: '',
  },
  {
    name: 'gltf-model',
    detail: 'component.gltfModel',
    description: 'The gltf-model component loads a 3D model using a glTF (.gltf or .glb) file.',
    default: '',
  },
  {
    name: 'hide-on-enter-ar',
    detail: 'component.hideOnEnterAr',
    description: 'When the user enters AR this component will hide the component by toggling it\'s visible state.',
    default: '',
  },
  {
    name: 'laser-controls',
    detail: 'component.LaserControls',
    description: 'The laser-controls component provides tracked controls with a laser or ray cursor shooting out to be used for input and interactions. DoF stands for degrees of freedom. Because they only require rotation and some form of input, laser-based interactions scale well across 0 DoF (gaze-based, Cardboard), 3 DoF (Daydream, GearVR with controllers), and 6 DoF (Vive, Oculus Touch). If desired, we can get a consistent form of interaction that works across all VR platforms with a single line of HTML.',
    default: '',
  },
  {
    name: 'layer',
    detail: 'component.layer',
    description: 'The layer component renders images, videos or cubemaps into a WebXR compositor layer on supported browsers.',
    default: '',
  },
  {
    name: 'light',
    detail: 'component.light',
    description: 'The light component defines the entity as a source of light. Light affects all materials that have not specified a flat shading model with shader: flat. Note that lights are computationally expensive we should limit number of lights in a scene.',
    default: '',
  },
  {
    name: 'line',
    detail: 'component.line',
    description: 'The line component draws a line given a start coordinate and end coordinate using THREE.Line. The raycaster component uses the line component for its showLine property, which is then used by the laser-controls component.',
    default: '',
  },
  {
    name: 'link',
    detail: 'component.link',
    description: 'The link component connects between experiences and allows for traversing between VR web pages. When activated via an event, the link component sends the user to a different page, just like a normal web page redirect.',
    default: '',
  },
  {
    name: 'material',
    detail: 'component.material',
    description: 'The material component gives appearance to an entity. We can define properties such as color, opacity, or texture. This is often paired with the geometry component which provides shape. We can register custom materials to extend the material component to provide a wide range of visual effects.',
    default: '',
  },
  {
    name: 'obj-model',
    detail: 'component.objModel',
    description: 'The obj-model component loads a 3D model and material using a Wavefront (.OBJ) file and a .MTL file.',
    default: '',
  },
  {
    name: 'pool',
    detail: 'component.pool',
    description: 'The pool component allows for object pooling. This gives us a reusable pool of entities to avoid creating and destroying the same kind of entities in dynamic scenes. Object pooling helps reduce garbage collection pauses. Note that entities requested from the pool are paused by default and you need to call .play() in order to activate their components\' tick functions.',
    default: '',
  },
  {
    name: 'position',
    detail: 'component.position',
    description: 'The position component places entities at certain spots in 3D space. Position takes a coordinate value as three space-delimited numbers. All entities inherently have the position component.',
    default: '',
  },
  {
    name: 'raycaster',
    detail: 'component.raycaster',
    description: 'The raycaster component provides line-based intersection testing with a raycaster. Raycasting is the method of extending a line from an origin towards a direction, and checking whether that line intersects with other entities. The raycaster component uses the three.js raycaster. The raycaster checks for intersections at a certain interval against a list of objects, and will emit events on the entity when it detects intersections or clearing of intersections (i.e., when the raycaster is no longer intersecting an entity). We prescribe that the set of objects that the raycaster tests for intersection is explicitly defined via the objects selector property described below. Raycasting is an expensive operation, and we should raycast against only targets that need to be interactable at any given time. The cursor component and laser-controls components both build on top of the raycaster component.',
    default: '',
  },
  {
    name: 'rotation',
    detail: 'component.rotation',
    description: 'The rotation component defines the orientation of an entity in degrees. It takes the pitch (x), yaw (y), and roll (z) as three space-delimited numbers indicating degrees of rotation. All entities inherently have the rotation component.',
    default: '',
  },
  {
    name: 'scale',
    detail: 'component.scale',
    description: 'The scale component defines a shrinking, stretching, or skewing transformation of an entity. It takes three scaling factors for the X, Y, and Z axes. All entities inherently have the scale component.',
    default: '',
  },
  {
    name: 'shadow',
    detail: 'component.shadow',
    description: 'The shadow component enables shadows for an entity and its children. Receiving shadows from surrounding objects and casting shadows onto other objects may (and often should) be enabled independently. Without this component, an entity will not cast nor receive shadows.',
    default: '',
  },
  {
    name: 'sound',
    detail: 'component.sound',
    description: 'The sound component defines the entity as a source of sound or audio. The sound component is positional and is thus affected by the components-position.',
    default: '',
  },
  {
    name: 'text',
    detail: 'component.text',
    description: 'The text component renders signed distance field (SDF) font text.',
    default: '',
  },
  {
    name: 'visible',
    detail: 'component.visible',
    description: 'The visible component determines whether to render an entity. If set to false, then the entity will not be visible nor drawn. Visibility effectively applies to all children. If an entity\'s parent or ancestor entity has visibility set to false, then the entity will also not be visible nor draw. It\'s a common pattern to create container entities that contain an entire group of entities that you can flip on an off with visible.',
    default: '',
  },
]

const ID = {
  name: 'id',
  detail: 'component.id',
  description: '',
  default: '',
}

export {ALL_COMPONENTS, ID}
