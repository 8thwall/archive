/* eslint-disable max-len */
import {LIGHT_ATTRIBUTES} from './components/light'
import {SOUND_ATTRIBUTES} from './components/sound'
import {TEXT_ATTRIBUTES} from './components/text'
import {VIDEO_ATTRIBUTES} from './components/video'
import {GEOMETRY_ATTRIBUTES} from './components/geometry'
import {SCENE_ATTRIBUTES} from './components/scene'
import {
  BASE_MATERIAL_ATTRIBUTES, MATERIAL_ATTRIBUTES, MATERIAL_HEIGHT,
  MATERIAL_ROUGHNESS, MATERIAL_WIDTH,
} from './components/material'
import {ID} from './components/components'

type AFrameAttribute = {
  name: string
  detail: string
  description: string
  default: string
}

type AFramePrimitive = {
  label: string
  detail: string
  documentation: string
  attributes: AFrameAttribute[]
}

const A_FRAME_PRIMITIVES: AFramePrimitive[] = [
  {
    label: 'a-box',
    detail: 'primitives.aBox',
    documentation: 'The box primitive creates shapes such as boxes, cubes, or walls.',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.box],
  },
  {
    label: 'a-camera',
    detail: 'primitives.aCamera',
    documentation: 'The camera primitive determines what the user sees. We can change the viewport by modifying the camera entity\'s position and rotation.',
    attributes: [
      {
        name: 'far',
        detail: 'camera.far',
        description: 'Camera frustum far clipping plane.',
        default: '10000',
      },
      {
        name: 'fov',
        detail: 'geometry.thetaLength',
        description: 'Field of view (in degrees).',
        default: '80',
      },
      {
        name: 'look-controls-enabled',
        detail: 'look-controls.enabled',
        description: 'Whether look controls are enabled.',
        default: 'true',
      },
      {
        name: 'near',
        detail: 'camera.near',
        description: 'Camera frustum near clipping plane.',
        default: '0.5',
      },
      {
        name: 'reverse-mouse-drag',
        detail: 'look-controls.reverseMouseDrag',
        description: 'Whether to reverse mouse drag.',
        default: 'false',
      },
      {
        name: 'wasd-controls-enabled',
        detail: 'wasd-controls.enabled',
        description: 'Whether the WASD controls are enabled.',
        default: 'true',
      },
    ],
  },
  {
    label: 'a-circle',
    detail: 'primitives.aCircle',
    documentation: 'The circle primitive creates circles surfaces using the geometry component with the type set to circle.',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.circle,
      MATERIAL_WIDTH, MATERIAL_HEIGHT],
  },
  {
    label: 'a-cone',
    detail: 'primitives.aCone',
    documentation: 'The cone primitive creates a cone shape.',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.cone,
      MATERIAL_WIDTH],
  },
  {
    label: 'a-cursor',
    detail: 'primitives.aCursor',
    documentation: 'The cursor primitive is a reticle that allows for clicking and basic interactivity with a scene on devices that do not have a hand controller. The default appearance is a ring geometry. The cursor is usually placed as a child of the camera.',
    attributes: [
      {
        name: 'far',
        detail: 'raycaster.far',
        description: 'Maximum distance under which resulting entities are returned. Cannot be lower than near.',
        default: '1000',
      },
      {
        name: 'fuse',
        detail: 'cursor.fuse',
        description: 'Whether cursor is fuse-based.',
        default: 'false',
      },
      {
        name: 'fuse-timeout',
        detail: 'cursor.fuseTimeout',
        description: 'How long to wait (in milliseconds) before triggering a fuse-based click event.',
        default: '1500',
      },
      {
        name: 'interval',
        detail: 'raycaster.interval',
        description: 'Number of milliseconds to wait in between each intersection test. Lower number is better for faster updates. Higher number is better for performance. Intersection tests are performed at most once per frame.',
        default: '100',
      },
      {
        name: 'objects',
        detail: 'raycaster.objects',
        description: 'Query selector to pick which objects to test for intersection. If not specified, all entities will be tested. Note that only objects attached via .setObject3D and their recursive children will be tested.',
        default: '100',
      },
    ],
  },
  {
    label: 'a-curvedimage',
    detail: 'primitives.aCurvedimage',
    documentation: 'The curved image primitive creates images that bend around the user. Curved images arranged around the camera can be pleasing for legibility since each pixel sits at the same distance from the user. They can be a better choice than angled flat planes for complex layouts because they ensure a smooth surface rather than a series of awkward seams between planes.',
    attributes: [...GEOMETRY_ATTRIBUTES.curvedImage, ...BASE_MATERIAL_ATTRIBUTES],
  },
  {
    label: 'a-cylinder',
    detail: 'primitives.aCylinder',
    documentation: 'The cylinder primitive is used to create tubes and curved surfaces.',
    attributes: [...GEOMETRY_ATTRIBUTES.cylinder, ...MATERIAL_ATTRIBUTES, MATERIAL_WIDTH],
  },
  {
    label: 'a-dodecahedron',
    detail: 'primitives.aDodecahedron',
    documentation: '',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.dodecahedron,
      MATERIAL_HEIGHT, MATERIAL_WIDTH],
  },
  {
    label: 'a-gltf-model',
    detail: 'primitives.aGltfModel',
    documentation: 'The glTF model primitive displays a 3D glTF model created from a 3D modeling program or downloaded from the web.',
    attributes: [{
      name: 'src',
      detail: 'gltf-model.src',
      description: 'url()-enclosed path to a glTF file',
      default: 'null',
    }],
  },
  {
    label: 'a-icosahedron',
    detail: 'primitives.aIcosahedron',
    documentation: '',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.icosahedron,
      MATERIAL_HEIGHT, MATERIAL_WIDTH],
  },
  {
    label: 'a-image',
    detail: 'primitives.aImage',
    documentation: 'The image primitive shows an image on a flat plane.',
    attributes: [...BASE_MATERIAL_ATTRIBUTES, MATERIAL_ROUGHNESS,
      ...GEOMETRY_ATTRIBUTES.image],
  },
  {
    label: 'a-light',
    detail: 'primitives.aLight',
    documentation: 'A light changes the lighting and shading of the scene.',
    attributes: LIGHT_ATTRIBUTES,
  },
  {
    label: 'a-link',
    detail: 'primitives.aLink',
    documentation: 'The link primitive provides a compact API to define links that resembles the traditional <a> tag.',
    attributes: [{
      name: 'href',
      detail: 'link.href',
      description: 'Destination URL where the link points to.',
      default: '',
    }, {
      name: 'title',
      detail: 'link.title',
      description: 'Text displayed on the link. The href or page URL is used if not defined.',
      default: '',
    }, {
      name: 'src',
      detail: 'link.src',
      description: '',
      default: '',
    }],
  },
  {
    label: 'a-object-model',
    detail: 'primitives.aObjectModel',
    documentation: 'The .OBJ model primitive displays a 3D Wavefront model.',
    attributes: [{
      name: 'mtl',
      detail: 'obj-model.mtl',
      description: 'Selector to an <a-asset-item> pointing to a .MTL file or an inline path to a .MTL file. Optional if you wish to use the material component instead.',
      default: 'null',
    }, {
      name: 'src',
      detail: 'obj-model.obj',
      description: '',
      default: 'null',
    }],
  },
  {
    label: 'a-octahedron',
    detail: 'primitives.aOctahedron',
    documentation: '',
    attributes: [...MATERIAL_ATTRIBUTES, MATERIAL_HEIGHT, MATERIAL_WIDTH,
      ...GEOMETRY_ATTRIBUTES.octahedron],
  },
  {
    label: 'a-plane',
    detail: 'primitives.aPlane',
    documentation: '',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.image],
  },
  {
    label: 'a-ring',
    detail: 'primitives.aRing',
    documentation: 'The ring primitive creates a ring or disc shape.',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.ring,
      MATERIAL_HEIGHT, MATERIAL_WIDTH],
  },
  {
    label: 'a-ring',
    detail: 'primitives.aRing',
    documentation: 'The ring primitive creates a ring or disc shape.',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.ring,
      MATERIAL_HEIGHT, MATERIAL_WIDTH],
  },
  {
    label: 'a-sky',
    detail: 'primitives.aSky',
    documentation: 'The sky primitive adds a background color or 360° image to a scene. A sky is a large sphere with a color or texture mapped to the inside.',
    attributes: [...BASE_MATERIAL_ATTRIBUTES, MATERIAL_ROUGHNESS,
      ...GEOMETRY_ATTRIBUTES.sky],
  },
  {
    label: 'a-sound',
    detail: 'primitives.aSound',
    documentation: 'The sound primitive wraps the sound component.',
    attributes: SOUND_ATTRIBUTES,
  },
  {
    label: 'a-sphere',
    detail: 'primitives.aSphere',
    documentation: 'The sphere primitive creates a spherical or polyhedron shapes. It wraps an entity that prescribes the geometry component with its geometric primitive set to sphere.',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.sky,
      MATERIAL_HEIGHT, MATERIAL_WIDTH],
  },
  {
    label: 'a-tetrahedron',
    detail: 'primitives.aTetrahedron',
    documentation: 'The sphere primitive creates a spherical or polyhedron shapes. It wraps an entity that prescribes the geometry component with its geometric primitive set to sphere.',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.octahedron,
      MATERIAL_HEIGHT, MATERIAL_WIDTH],
  },
  {
    label: 'a-text',
    detail: 'primitives.aText',
    documentation: 'Wraps the text component.',
    attributes: TEXT_ATTRIBUTES,
  },
  {
    label: 'a-torus-knot',
    detail: 'primitives.aTorusKnot',
    documentation: 'The torus knot primitive creates pretzel shapes using the geometry component with the type set to torusKnot.',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.torusKnot,
      MATERIAL_HEIGHT, MATERIAL_WIDTH],
  },
  {
    label: 'a-torus',
    detail: 'primitives.aTorus',
    documentation: 'The torus primitive creates donut or tube shapes using the geometry component with the type set to torus.',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.torus,
      MATERIAL_HEIGHT, MATERIAL_WIDTH],
  },
  {
    label: 'a-triangle',
    detail: 'primitives.aTriangle',
    documentation: 'The triangle primitive creates triangle surfaces using the geometry component with the type set to triangle.',
    attributes: [...MATERIAL_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.triangle,
      MATERIAL_HEIGHT, MATERIAL_WIDTH],
  },
  {
    label: 'a-video',
    detail: 'primitives.aVideo',
    documentation: '',
    attributes: [...BASE_MATERIAL_ATTRIBUTES, MATERIAL_ROUGHNESS,
      ...GEOMETRY_ATTRIBUTES.video],
  },
  {
    label: 'a-videosphere',
    detail: 'primitives.aVideosphere',
    documentation: 'The videosphere primitive plays 360° videos in the background of the scene. Videospheres are a large sphere with the video texture mapped to the inside.',
    attributes: [...VIDEO_ATTRIBUTES, ...GEOMETRY_ATTRIBUTES.videoSphere],
  },
  {
    label: 'a-scene',
    detail: 'core.aScene',
    documentation: 'A scene is represented by the <a-scene> element. The scene is the global root object, and all entities are contained within the scene. The scene inherits from the Entity class so it inherits all of its properties, its methods, the ability to attach components, and the behavior to wait for all of its child nodes (e.g., <a-assets> and <a-entity>) to load before kicking off the render loop.',
    attributes: [...SCENE_ATTRIBUTES],
  },
  {
    label: 'a-entity',
    detail: 'core.aEntity',
    documentation: 'A-Frame represents an entity via the <a-entity> element. As defined in the entity-component-system pattern, entities are placeholder objects to which we plug in components to provide them appearance, behavior, and functionality. In A-Frame, entities are inherently attached with the position, rotation, and scale components.',
    attributes: [ID, {
      name: 'mixin',
      detail: 'core.mixin',
      description: '',
      default: '',
    }],
  },
  {
    label: 'a-mixins',
    detail: 'core.aMixins',
    documentation: 'Mixins provide a way to compose and reuse commonly-used sets of component properties. They are defined using the <a-mixin> element and are placed in <a-assets>. Mixins should be set with an id, and when an entity sets that id as its mixin attribute, the entity will absorb all of the mixin’s attributes.',
    attributes: [ID],
  },
]

export {A_FRAME_PRIMITIVES}

export type {
  AFrameAttribute,
  AFramePrimitive,
}
