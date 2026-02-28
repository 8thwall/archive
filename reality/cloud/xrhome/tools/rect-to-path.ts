/* eslint-disable no-console */
// Script to convert a rectangle with rounded corners to svg path.
// In xrhome folder, run: npx ts-node src/client/asset-lab/rect-to-path.ts

const toPath = (x: number, y: number, width: number, height: number, r: number): string => `
  M ${x + r}, ${y}
  H ${x + width - r}
  A ${r},${r} 0 0 1 ${x + width}, ${y + r}
  V ${y + height - r}
  A ${r},${r} 0 0 1 ${x + width - r}, ${y + height}
  H ${x + r}
  A ${r},${r} 0 0 1 ${x}, ${y + height - r}
  V ${y + r}
  A ${r},${r} 0 0 1 ${x + r}, ${y}
  Z
`

// Example of a rect at 0 0 with width 14, height 14 and radius 1.
const x = 2
const y = 2
const width = 12
const height = 12
const r = 2
console.log(toPath(x, y, width, height, r))

// Example of 4 rectangles in a 2x2 grid spanning a 16x16 area with a gap of 1 between them.
console.log(toPath(0, 0, 6, 6, 1))
console.log(toPath(8, 0, 6, 6, 1))
console.log(toPath(0, 8, 6, 6, 1))
console.log(toPath(8, 8, 6, 6, 1))
