// @attr(testonly = True)
// @attr[](data = "targets/target.jpg")
// @attr[](data = "targets/large-rotated.jpg")
// @attr[](data = "targets/large-cone.png")
// @attr[](data = "targets/pixel-cone.png")
// @attr[](data = "targets/wide.jpg")

import path from 'path'

const targetsDir = path.resolve(
  process.env.RUNFILES_DIR,
  '_main/reality/cloud/aws/lambda/public-api/test/targets'
)

const Images = {
  target: path.join(targetsDir, 'target.jpg'),
  largeRotated: path.join(targetsDir, 'large-rotated.jpg'),
  largeCone: path.join(targetsDir, 'large-cone.png'),
  pixelCone: path.join(targetsDir, 'pixel-cone.png'),
  wide: path.join(targetsDir, 'wide.jpg'),
} as const

export {
  Images,
}
