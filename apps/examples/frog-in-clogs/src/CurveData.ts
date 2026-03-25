// Define multiple curve data sets for use with CurveAnimator component
const curveDataSets = {
  default: {
    type: 'SplineCurve',
    points: [
      { x: -10, y: 0, z: 0 },
      { x: 5, y: -5, z: -2 },
    ],
  },
  cruiseShip: {
    type: 'SplineCurve',
    points: [
      { x: 75, y: 0, z: 10 },
      { x: -120, y: 0, z: -100 },
      { x: -100, y: 0, z: 100 },
    ],
  },
  cruiseShip2: {
    type: 'SplineCurve',
    points: [
      { x: 60, y: 0, z: -215 },
      { x: -215, y: 0, z: -175 },
      { x: 5, y: 0, z: -30 },
    ],
  },
  cruiseShip3: {
    type: 'SplineCurve',
    points: [
      { x: -200, y: 0, z: 180 },
      { x: 130, y: 0, z: 143 },
      { x: 10, y: 0, z: 220 },
    ],
  },
  bargeShip: {
    type: 'SplineCurve',
    points: [
      { x: -5, y: 0, z: -229 },
      { x: -121, y: 0, z: -194 },
      { x: 0, y: 0, z: -83 },
      { x: -27, y: 0, z: 200 },
    ],
  },
  smallShip: {
    type: 'SplineCurve',
    points: [
      { x: 200, y: 0, z: -15 },
      { x: 38, y: 0, z: 0 },
      { x: 63, y: 0, z: 163 },
      { x: 200, y: 0, z: -15 },
    ],
  },
  sailShip: {
    type: 'SplineCurve',
    points: [
      { x: 215, y: 0, z: -35 },
      { x: -20, y: 0, z: 95 },
      { x: 0, y: 0, z: -4 },
      { x: -44, y: 0, z: -91 },
    ],
  },
  frog: {
    type: 'SplineCurve',
    points: [
      { x: 155, y: 0, z: -2 },
      { x: 109, y: 0, z: 134 },
      { x: -166, y: 0, z: 94 },
      { x: -122, y: 0, z: -143 },
    ],
  },
}

export { curveDataSets }
