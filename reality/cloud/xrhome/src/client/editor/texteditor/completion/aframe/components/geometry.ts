/* eslint-disable max-len */
import type {AFrameAttribute} from '../aframe-primitives'

const segmentHeight = (def: string) => ({
  name: 'segments-height',
  detail: 'geometry.segmentsHeight',
  description: 'Number of segmented faces on the y-axis',
  default: def,
})

const CYLINDER_DEFAULT = {
  radius: '1',
  height: '2',
  segmentsRadial: '36',
  segmentsHeight: '18',
  openEnded: 'false',
  thetaStart: '0',
  thetaLength: '360',
}

const CURVED_IMAGE_DEFAULT = {
  radius: '2',
  height: '1',
  segmentsRadial: '48',
  segmentsHeight: '18',
  openEnded: 'true',
  thetaStart: '0',
  thetaLength: '270',
}

const getCylinderGeometryAttributes = (isCylinder: boolean): AFrameAttribute[] => {
  const defaults = isCylinder ? CYLINDER_DEFAULT : CURVED_IMAGE_DEFAULT
  return [
    {
      name: 'radius',
      detail: 'geometry.radius',
      description: 'Radius of the cylinder.',
      default: defaults.radius,
    },
    {
      name: 'height',
      detail: 'geometry.height',
      description: 'Height of the cylinder.',
      default: defaults.height,
    },
    {
      name: 'segments-radial',
      detail: 'geometry.segmentsRadial',
      description: 'Number of segmented faces around the circumference of the cylinder.',
      default: defaults.segmentsRadial,
    },
    {
      name: 'segments-height',
      detail: 'geometry.segmentsHeight',
      description: 'Number of rows of faces along the height of the cylinder.',
      default: defaults.segmentsHeight,
    },
    {
      name: 'open-ended',
      detail: 'geometry.openEnded',
      description: 'Whether the ends of the cylinder are open (true) or capped (false).',
      default: defaults.openEnded,
    },
    {
      name: 'theta-start',
      detail: 'geometry.thetaStart',
      description: 'Starting angle in degrees.',
      default: defaults.thetaStart,
    },
    {
      name: 'theta-length',
      detail: 'geometry.thetaLength',
      description: 'Central angle in degrees.',
      default: defaults.thetaLength,
    },
  ]
}

const GEOMETRY_ATTRIBUTES: Record<string, AFrameAttribute[]> = {
  box: [
    {
      name: 'width',
      detail: 'geometry.width',
      description: 'Width (in meters) of the sides on the X axis.',
      default: '1',
    },
    {
      name: 'height',
      detail: 'geometry.height',
      description: 'Height (in meters) of the sides on the Y axis.',
      default: '1',
    },
    {
      name: 'depth',
      detail: 'geometry.depth',
      description: 'Width (in meters) of the sides on the X axis.',
      default: '1',
    },
    {
      name: 'depth',
      detail: 'geometry.segmentsDepth',
      description: 'Depth (in meters) of the sides on the Z axis.',
      default: '1',
    },
    {
      name: 'segments-depth',
      detail: 'geometry.segmentsDepth',
      description: 'Number of segmented faces on the z-axis',
      default: '1',
    },
    segmentHeight('1'),
    {
      name: 'segments-width',
      detail: 'geometry.segmentsWidth',
      description: 'Number of segmented faces on the x-axis',
      default: '1',
    },
  ],
  circle: [
    {
      name: 'radius',
      detail: 'geometry.radius',
      description: 'Radius (in meters) of the circle.',
      default: '1',
    },
    {
      name: 'segments',
      detail: 'geometry.segments',
      description: 'Number of triangles to construct the circle, like pizza slices. A higher number of segments means the circle will be more round.',
      default: '32',
    },
    {
      name: 'theta-start',
      detail: 'geometry.thetaStart',
      description: 'Start angle for first segment. Can be used to define a partial circle.',
      default: '0',
    },
    {
      name: 'theta-length',
      detail: 'geometry.thetaLength',
      description: 'The central angle (in degrees). Defaults to 360, which makes for a complete circle.',
      default: '360',
    },
  ],
  cone: [
    {
      name: 'height',
      detail: 'geometry.height',
      description: 'Height of the cone.',
      default: '2',
    },
    {
      name: 'open-ended',
      detail: 'geometry.openEnded',
      description: 'Whether the ends of the cone are open (true) or capped (false).',
      default: 'false',
    },
    {
      name: 'radius-bottom',
      detail: 'geometry.radiusBottom',
      description: 'Radius of the bottom end of the cone.',
      default: '1',
    },
    {
      name: 'radius-top',
      detail: 'geometry.radiusTop',
      description: 'Radius of the top end of the cone.',
      default: '1',
    },
    {
      name: 'segments-radial',
      detail: 'geometry.segmentsRadial',
      description: 'Number of segmented faces around the circumference of the cone.',
      default: '36',
    },
    segmentHeight('18'),
    {
      name: 'theta-start',
      detail: 'geometry.thetaStart',
      description: 'Starting angle in degrees.',
      default: '0',
    },
    {
      name: 'theta-length',
      detail: 'geometry.thetaLength',
      description: 'Central angle in degrees.',
      default: '360',
    },
  ],
  dodecahedron: [
    {
      name: 'open-ended',
      detail: 'geometry.openEnded',
      description: 'Whether the ends of the dodecahedron are open (true) or capped (false).',
      default: 'false',
    },
    {
      name: 'radius-bottom',
      detail: 'geometry.radiusBottom',
      description: 'Radius of the bottom end of the dodecahedron.',
      default: '1',
    },
    {
      name: 'radius-top',
      detail: 'geometry.radiusTop',
      description: 'Radius of the top end of the dodecahedron.',
      default: '1',
    },
    {
      name: 'segments-radial',
      detail: 'geometry.segmentsRadial',
      description: 'Number of segmented faces around the circumference of the dodecahedron.',
      default: '36',
    },
    segmentHeight('18'),
    {
      name: 'theta-start',
      detail: 'geometry.thetaStart',
      description: 'Starting angle in degrees.',
      default: '0',
    },
    {
      name: 'theta-length',
      detail: 'geometry.thetaLength',
      description: 'Central angle in degrees.',
      default: '360',
    },
  ],
  icosahedron: [
    {
      name: 'detail',
      detail: 'geometry.detail',
      description: '',
      default: '0',
    },
    {
      name: 'radius',
      detail: 'geometry.radius',
      description: 'Radius (in meters) of the icosahedron.',
      default: '1',
    },
  ],
  image: [
    {
      name: 'width',
      detail: 'geometry.width',
      description: 'Width (in meters) of the sides on the X axis.',
      default: '1',
    },
    {
      name: 'height',
      detail: 'geometry.height',
      description: 'Height (in meters) of the sides on the Y axis.',
      default: '1',
    },
    segmentHeight('1'),
    {
      name: 'segments-width',
      detail: 'geometry.segmentsWidth',
      description: 'Number of segmented faces on the x-axis',
      default: '1',
    },
  ],
  octahedron: [
    {
      name: 'detail',
      detail: 'geometry.detail',
      description: '',
      default: '0',
    },
    {
      name: 'radius',
      detail: 'geometry.radius',
      description: 'Radius (in meters) of the octahedron.',
      default: '1',
    },
  ],
  ring: [
    {
      name: 'radius-inner',
      detail: 'geometry.radiusInner',
      description: 'Radius of the inner hole of the ring.',
      default: '1',
    },
    {
      name: 'radius-outer',
      detail: 'geometry.radiusOuter',
      description: 'Radius of the outer edge of the ring.',
      default: '1',
    },
    {
      name: 'segments-phi',
      detail: 'geometry.segmentsPhi',
      description: 'Number of triangles within each face defined by segmentsTheta.',
      default: '8',
    },
    {
      name: 'segments-theta',
      detail: 'geometry.segmentsTheta',
      description: 'Number of segments. A higher number means the ring will be more round.',
      default: '32',
    },
    {
      name: 'theta-start',
      detail: 'geometry.thetaStart',
      description: 'Starting angle in degrees.',
      default: '0',
    },
    {
      name: 'theta-length',
      detail: 'geometry.thetaLength',
      description: 'Central angle in degrees.',
      default: '360',
    },
  ],
  sky: [
    {
      name: 'phi-length',
      detail: 'geometry.phiLength',
      description: 'Horizontal sweep angle size.',
      default: '360',
    },
    {
      name: 'phi-start',
      detail: 'geometry.phiStart',
      description: 'Horizontal starting angle.',
      default: '0',
    },
    {
      name: 'radius',
      detail: 'geometry.radius',
      description: 'Radius of the sphere.',
      default: '500',
    },
    segmentHeight('32'),
    {
      name: 'segments-width',
      detail: 'geometry.segmentsWidth',
      description: 'Number of horizontal segments.',
      default: '64',
    },
    {
      name: 'theta-start',
      detail: 'geometry.thetaStart',
      description: 'Starting angle in degrees.',
      default: '0',
    },
    {
      name: 'theta-length',
      detail: 'geometry.thetaLength',
      description: 'Central angle in degrees.',
      default: '180',
    },
  ],
  torusKnot: [
    {
      name: 'p',
      detail: 'geometry.p',
      description: 'How many times the geometry winds around its axis of rotational symmetry.',
      default: '2',
    },
    {
      name: 'q',
      detail: 'geometry.q',
      description: 'How many times the geometry winds around a circle in the interior of the torus.',
      default: '3',
    },
    {
      name: 'radius',
      detail: 'geometry.radius',
      description: 'Radius that contains the torus knot.',
      default: '5000',
    },
    {
      name: 'radius-tubular',
      detail: 'geometry.radiusTubular',
      description: 'Radius of the tubes of the torus knot.',
      default: '0.2',
    },
    {
      name: 'segments-radial',
      detail: 'geometry.segmentsRadial',
      description: 'Number of segments along the circumference of the tube ends. A higher number means the tube will be more round.',
      default: '8',
    },
    {
      name: 'segments-tubular',
      detail: 'geometry.segmentsTubular',
      description: 'Number of segments along the circumference of the tube face. A higher number means the tube will be more round.',
      default: '100',
    },
  ],
  torus: [
    {
      name: 'arc',
      detail: 'geometry.arc',
      description: 'Central angle.',
      default: '360',
    },
    {
      name: 'radius',
      detail: 'geometry.radius',
      description: 'Radius of the outer edge of the torus.',
      default: '5000',
    },
    {
      name: 'radius-tubular',
      detail: 'geometry.radiusTubular',
      description: 'Radius of the tube.',
      default: '0.2',
    },
    {
      name: 'segments-radial',
      detail: 'geometry.segmentsRadial',
      description: 'Number of segments along the circumference of the tube ends. A higher number means the tube will be more round.',
      default: '8',
    },
    {
      name: 'segments-tubular',
      detail: 'geometry.segmentsTubular',
      description: 'Number of segments along the circumference of the tube face. A higher number means the tube will be more round.',
      default: '100',
    },
  ],
  videoSphere: [
    {
      name: 'radius',
      detail: 'geometry.radius',
      description: 'Radius of the sphere.',
      default: '5000',
    },
    segmentHeight('64'),
    {
      name: 'segments-width',
      detail: 'geometry.segmentsWidth',
      description: 'Number of segmented faces on the x-axis',
      default: '64',
    },
  ],
  triangle: [
    {
      name: 'vertex-a',
      detail: 'geometry.vertexA',
      description: 'Coordinates of one of the three vertices',
      default: '0 0.5 0',
    },
    {
      name: 'segments-vertexB',
      detail: 'geometry.vertexB',
      description: 'Coordinates of one of the three vertices',
      default: '-0.5 -0.5 0',
    },
    {
      name: 'segments-vertexC',
      detail: 'geometry.vertexC',
      description: 'Coordinates of one of the three vertices',
      default: '0.5 -0.5 0',
    },
  ],
  video: [
    {
      name: 'height',
      detail: 'geometry.height',
      description: 'Height of the cylinder.',
      default: '1.75',
    },
    segmentHeight('1'),
    {
      name: 'segments-width',
      detail: 'geometry.segmentsWidth',
      description: 'Number of segmented faces on the x-axis',
      default: '1',
    },
    {
      name: 'width',
      detail: 'geometry.width',
      description: 'Width (in meters) of the sides on the X axis.',
      default: '1',
    },
  ],
  curvedImage: [...getCylinderGeometryAttributes(false)],
  cylinder: [...getCylinderGeometryAttributes(true)],
}

export {
  GEOMETRY_ATTRIBUTES,
}
