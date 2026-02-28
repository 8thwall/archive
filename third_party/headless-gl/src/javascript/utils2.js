const { WebGL2Export: { gl2: gl } } = require('./native-gl')

const { WebGLUniformLocation } = require('./webgl-uniform-location')

const validCombinations = [
  // Unsigned Byte
  { internalFormat: gl.R8, format: gl.RED, type: gl.UNSIGNED_BYTE, pixelSize: 1 },
  { internalFormat: gl.RG8, format: gl.RG, type: gl.UNSIGNED_BYTE, pixelSize: 2 },
  { internalFormat: gl.RGB8, format: gl.RGB, type: gl.UNSIGNED_BYTE, pixelSize: 3 },
  { internalFormat: gl.RGBA8, format: gl.RGBA, type: gl.UNSIGNED_BYTE, pixelSize: 4 },
  { internalFormat: gl.RGB565, format: gl.RGB, type: gl.UNSIGNED_BYTE, pixelSize: 3 },
  { internalFormat: gl.RGB5_A1, format: gl.RGBA, type: gl.UNSIGNED_BYTE, pixelSize: 4 }, 
  { internalFormat: gl.RGBA4, format: gl.RGBA, type: gl.UNSIGNED_BYTE, pixelSize: 4 },
  { internalFormat: gl.SRGB8_ALPHA8, format: gl.RGBA, type: gl.UNSIGNED_BYTE, pixelSize: 4 },
  { internalFormat: gl.RG8UI, format: gl.RG_INTEGER, type: gl.UNSIGNED_BYTE, pixelSize: 2 },
  { internalFormat: gl.SRGB8, format: gl.RGB, type: gl.UNSIGNED_BYTE, pixelSize: 3 },
  { internalFormat: gl.RGBA8UI, format: gl.RGBA_INTEGER, type: gl.UNSIGNED_BYTE, pixelSize: 4 },
  { internalFormat: gl.RGB8UI, format: gl.RGB_INTEGER, type: gl.UNSIGNED_BYTE, pixelSize: 3 },
  
  // Byte
  { internalFormat: gl.R8_SNORM, format: gl.RED, type: gl.BYTE, pixelSize: 1 },
  { internalFormat: gl.RG8_SNORM, format: gl.RG, type: gl.BYTE, pixelSize: 2 },
  { internalFormat: gl.RGB8_SNORM, format: gl.RGB, type: gl.BYTE, pixelSize: 3 },
  { internalFormat: gl.RGBA8_SNORM, format: gl.RGBA, type: gl.BYTE, pixelSize: 4 },
  { internalFormat: gl.R8I, format: gl.RED_INTEGER, type: gl.BYTE, pixelSize: 1 },
  { internalFormat: gl.R8UI, format: gl.RED_INTEGER, type: gl.UNSIGNED_BYTE, pixelSize: 1 },
  { internalFormat: gl.RG8I, format: gl.RG_INTEGER, type: gl.BYTE, pixelSize: 2 },
  { internalFormat: gl.RGBA8I, format: gl.RGBA_INTEGER, type: gl.BYTE, pixelSize: 4 },
  { internalFormat: gl.RGB8I, format: gl.RGB_INTEGER, type: gl.BYTE, pixelSize: 3 },

  // Unsigned Short
  { internalFormat: gl.R16UI, format: gl.RED_INTEGER, type: gl.UNSIGNED_SHORT, pixelSize: 2 },
  { internalFormat: gl.RG16UI, format: gl.RG_INTEGER, type: gl.UNSIGNED_SHORT, pixelSize: 4 },
  { internalFormat: gl.RGB16UI, format: gl.RGB_INTEGER, type: gl.UNSIGNED_SHORT, pixelSize: 6 },
  { internalFormat: gl.RGBA16UI, format: gl.RGBA_INTEGER, type: gl.UNSIGNED_SHORT, pixelSize: 8 },

  // Short
  { internalFormat: gl.R16I, format: gl.RED_INTEGER, type: gl.SHORT, pixelSize: 2 },
  { internalFormat: gl.RG16I, format: gl.RG_INTEGER, type: gl.SHORT, pixelSize: 4 },
  { internalFormat: gl.RGB16I, format: gl.RGB_INTEGER, type: gl.SHORT, pixelSize: 6 },
  { internalFormat: gl.RGBA16I, format: gl.RGBA_INTEGER, type: gl.SHORT, pixelSize: 8 },

  // Unsigned Int
  { internalFormat: gl.R32UI, format: gl.RED_INTEGER, type: gl.UNSIGNED_INT, pixelSize: 4 },
  { internalFormat: gl.RG32UI, format: gl.RG_INTEGER, type: gl.UNSIGNED_INT, pixelSize: 8 },
  { internalFormat: gl.RGB32UI, format: gl.RGB_INTEGER, type: gl.UNSIGNED_INT, pixelSize: 12 },
  { internalFormat: gl.RGBA32UI, format: gl.RGBA_INTEGER, type: gl.UNSIGNED_INT, pixelSize: 16 },

  // Int
  { internalFormat: gl.R32I, format: gl.RED_INTEGER, type: gl.INT, pixelSize: 4 },
  { internalFormat: gl.RG32I, format: gl.RG_INTEGER, type: gl.INT, pixelSize: 8 },
  { internalFormat: gl.RGB32I, format: gl.RGB_INTEGER, type: gl.INT, pixelSize: 12 },
  { internalFormat: gl.RGBA32I, format: gl.RGBA_INTEGER, type: gl.INT, pixelSize: 16 },

  // Half Float
  { internalFormat: gl.R16F, format: gl.RED, type: gl.HALF_FLOAT, pixelSize: 2 },
  { internalFormat: gl.RG16F, format: gl.RG, type: gl.HALF_FLOAT, pixelSize: 4 },
  { internalFormat: gl.RGB16F, format: gl.RGB, type: gl.HALF_FLOAT, pixelSize: 6 },
  { internalFormat: gl.RGBA16F, format: gl.RGBA, type: gl.HALF_FLOAT, pixelSize: 8 },
  { internalFormat: gl.R11F_G11F_B10F, format: gl.RGB, type: gl.HALF_FLOAT, pixelSize: 12 },
  { internalFormat: gl.RGB9_E5, format: gl.RGB, type: gl.HALF_FLOAT, pixelSize: 6 },

  // Float
  { internalFormat: gl.R16F, format: gl.RED, type: gl.FLOAT, pixelSize: 4 },
  { internalFormat: gl.RG16F, format: gl.RG, type: gl.FLOAT, pixelSize: 8 },
  { internalFormat: gl.R32F, format: gl.RED, type: gl.FLOAT, pixelSize: 4 },
  { internalFormat: gl.RG32F, format: gl.RG, type: gl.FLOAT, pixelSize: 8 },
  { internalFormat: gl.RGB32F, format: gl.RGB, type: gl.FLOAT, pixelSize: 12 },
  { internalFormat: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT, pixelSize: 16 },
  { internalFormat: gl.R11F_G11F_B10F, format: gl.RGB, type: gl.FLOAT, pixelSize: 12 },
  { internalFormat: gl.RGB9_E5, format: gl.RGB, type: gl.FLOAT, pixelSize: 12 },
  { internalFormat: gl.RGB16F, format: gl.RGB, type: gl.FLOAT, pixelSize: 12 },
  { internalFormat: gl.RGBA16F, format: gl.RGBA, type: gl.FLOAT, pixelSize: 16 },

  // Packed
  { internalFormat: gl.RGB10_A2, format: gl.RGBA, type: gl.UNSIGNED_INT_2_10_10_10_REV, pixelSize: 4 },
  { internalFormat: gl.RGB10_A2UI, format: gl.RGBA_INTEGER, type: gl.UNSIGNED_INT_2_10_10_10_REV, pixelSize: 4 },
  { internalFormat: gl.RGBA4, format: gl.RGBA, type: gl.UNSIGNED_SHORT_4_4_4_4, pixelSize: 2 },
  { internalFormat: gl.RGB5_A1, format: gl.RGBA, type: gl.UNSIGNED_SHORT_5_5_5_1, pixelSize: 2 },
  { internalFormat: gl.RGB5_A1, format: gl.RGBA, type: gl.UNSIGNED_INT_2_10_10_10_REV, pixelSize: 4 },
  { internalFormat: gl.RGB565, format: gl.RGB, type: gl.UNSIGNED_SHORT_5_6_5, pixelSize: 2 },
  { internalFormat: gl.R11F_G11F_B10F, format: gl.RGB, type: gl.UNSIGNED_INT_10F_11F_11F_REV, pixelSize: 4 },
  { internalFormat: gl.RGB9_E5, format: gl.RGB, type: gl.UNSIGNED_INT_5_9_9_9_REV, pixelSize: 4 },

  // Depth/Stencil
  { internalFormat: gl.DEPTH_COMPONENT16, format: gl.DEPTH_COMPONENT, type: gl.UNSIGNED_SHORT, pixelSize: 2 },
  { internalFormat: gl.DEPTH_COMPONENT16, format: gl.DEPTH_COMPONENT, type: gl.UNSIGNED_INT, pixelSize: 4 },
  { internalFormat: gl.DEPTH_COMPONENT24, format: gl.DEPTH_COMPONENT, type: gl.UNSIGNED_INT, pixelSize: 4 },
  { internalFormat: gl.DEPTH_COMPONENT32F, format: gl.DEPTH_COMPONENT, type: gl.FLOAT, pixelSize: 4 },
  { internalFormat: gl.DEPTH24_STENCIL8, format: gl.DEPTH_STENCIL, type: gl.UNSIGNED_INT_24_8, pixelSize: 4 },
  { internalFormat: gl.DEPTH32F_STENCIL8, format: gl.DEPTH_STENCIL, type: gl.FLOAT_32_UNSIGNED_INT_24_8_REV, pixelSize: 5 },

  // unsized
  { internalFormat: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_BYTE, pixelSize: 4 },
  { internalFormat: gl.RGB, format: gl.RGB, type: gl.UNSIGNED_BYTE, pixelSize: 3 },
  { internalFormat: gl.RGB, format: gl.RGB, type: gl.UNSIGNED_SHORT_5_6_5, pixelSize: 6 },
  { internalFormat: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_SHORT_4_4_4_4, pixelSize: 2 },
  { internalFormat: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_SHORT_5_5_5_1, pixelSize: 2 },
  { internalFormat: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_SHORT_5_6_5, pixelSize: 2 },
  { internalFormat: gl.RGBA, format: gl.RGBA, type: gl.FLOAT, pixelSize: 16 },
  { internalFormat: gl.RGBA_INTEGER, format: gl.RGBA_INTEGER, type: gl.INT, pixelSize: 16 },
  {internalFormat: gl.RGBA_INTEGER, format: gl.RGBA_INTEGER, type: gl.UNSIGNED_INT, pixelSize: 16 },
  { internalFormat: gl.LUMINANCE_ALPHA, format: gl.LUMINANCE_ALPHA, type: gl.UNSIGNED_BYTE, pixelSize: 2 },
  { internalFormat: gl.LUMINANCE, format: gl.LUMINANCE, type: gl.UNSIGNED_BYTE, pixelSize: 1 },
  { internalFormat: gl.ALPHA, format: gl.ALPHA, type: gl.UNSIGNED_BYTE, pixelSize: 1 },
]

function lookupPixelSizeForFormatCombination(internalFormat, format, type) {
  let combination
  if (!internalFormat) {
    combination = validCombinations.find(
      combo => combo.format === format && combo.type === type)
  } else {
    combination = validCombinations.find(
      combo => combo.internalFormat === internalFormat &&
               combo.format === format &&
               combo.type === type)
  }
  return combination ? combination.pixelSize : null
}

//TODO: check if this can stay in utils.js
function checkUniform (program, location) {
  return location instanceof WebGLUniformLocation &&
    location._program === program &&
    location._linkCount === program._linkCount
}

function vertexCount (primitive, count) {
  switch (primitive) {
    case gl.TRIANGLES:
      return count - (count % 3)
    case gl.LINES:
      return count - (count % 2)
    case gl.LINE_LOOP:
    case gl.POINTS:
      return count
    case gl.TRIANGLE_FAN:
    case gl.LINE_STRIP:
      if (count < 2) {
        return 0
      }
      return count
    case gl.TRIANGLE_STRIP:
      if (count < 3) {
        return 0
      }
      return count
    default:
      return -1
  }
}

function unpackTypedArray (array) {
    return (new Uint8Array(array.buffer)).subarray(
      array.byteOffset,
      array.byteLength + array.byteOffset)
  }

function convertPixels (pixels) {
    if (typeof pixels === 'object' && pixels !== null) {
      if (pixels instanceof ArrayBuffer) {
        return new Uint8Array(pixels)
      } else if (pixels instanceof Uint8Array ||
        pixels instanceof Uint16Array ||
        pixels instanceof Uint8ClampedArray ||
        pixels instanceof Float32Array ||
        pixels instanceof Int32Array || 
        pixels instanceof Uint32Array ||
        pixels instanceof Int8Array ||
        pixels instanceof Int16Array || 
        pixels instanceof Int32Array) {
        return unpackTypedArray(pixels)
      } else if (pixels instanceof Buffer) {
        return new Uint8Array(pixels)
      }
    }
    return null
  }

function typeSize (type) {
  switch (type) {
    case gl.UNSIGNED_BYTE:
    case gl.BYTE:
      return 1
    case gl.UNSIGNED_SHORT:
    case gl.SHORT:
      return 2
    case gl.UNSIGNED_INT:
    case gl.INT:
    case gl.FLOAT:
      return 4
  }
  return 0
}

function uniformTypeSize (type) {
  switch (type) {
    case gl.BOOL_VEC4:
    case gl.INT_VEC4:
    case gl.FLOAT_VEC4:
      return 4

    case gl.BOOL_VEC3:
    case gl.INT_VEC3:
    case gl.FLOAT_VEC3:
      return 3

    case gl.BOOL_VEC2:
    case gl.INT_VEC2:
    case gl.FLOAT_VEC2:
      return 2

    case gl.BOOL:
    case gl.INT:
    case gl.FLOAT:
    case gl.SAMPLER_2D:
    case gl.SAMPLER_CUBE:
      return 1

    default:
      return 0
  }
}

function validCubeTarget (target) {
  return target === gl.TEXTURE_CUBE_MAP ||
    target === gl.TEXTURE_CUBE_MAP_POSITIVE_X ||
    target === gl.TEXTURE_CUBE_MAP_NEGATIVE_X ||
    target === gl.TEXTURE_CUBE_MAP_POSITIVE_Y ||
    target === gl.TEXTURE_CUBE_MAP_NEGATIVE_Y ||
    target === gl.TEXTURE_CUBE_MAP_POSITIVE_Z ||
    target === gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
}

function calculatePaddingBytes(bytesPerPixel, alignment, width) {
  var padding = 0;
  switch (alignment) {
    case 1:
    case 2:
    case 4:
    case 8:
      padding = (bytesPerPixel * width) % alignment;
      if (padding > 0)
        padding = alignment - padding;
      return padding;
    default:
      return padding;
  }
}

function computeImageSize2D(
  width,
  height,
  rowLength,
  pixelSize,
  alignment,
  skipPixels,
  skipRows
) {
  // See: https://registry.khronos.org/webgl/specs/latest/2.0/#PIXEL_STORE_PARAM_CONSTRAINTS
  const actualWidth = rowLength === 0 ? width : rowLength;
  const padding = calculatePaddingBytes(pixelSize, alignment, actualWidth);
  const bytesPerRow = actualWidth * pixelSize + padding;
  const bytesLastRow = pixelSize * width;
  const size = bytesPerRow * (height - 1) + bytesLastRow;
  let skipSize = 0;
  if (skipPixels > 0)
    skipSize += pixelSize * skipPixels;
  if (skipRows > 0)
    skipSize += bytesPerRow * skipRows;
  return size + skipSize
}

function computeImageSize3D(
  width,
  height,
  depth,
  rowLength,
  unpackHeight,
  pixelSize,
  alignment,
  skipPixels,
  skipRows,
  skipImages
) {
  // See: https://registry.khronos.org/webgl/specs/latest/2.0/#PIXEL_STORE_PARAM_CONSTRAINTS
  const actualWidth = rowLength === 0 ? width : rowLength;
  const actualHeight = unpackHeight === 0 ? height : unpackHeight;
  const padding = calculatePaddingBytes(pixelSize, alignment, actualWidth);
  const bytesPerRow = actualWidth * pixelSize + padding;
  const bytesLastRow = pixelSize * width;
  const bytesPerImage = bytesPerRow * actualHeight;
  const bytesLastImage = bytesPerRow * (height - 1) + bytesLastRow;
  const size = bytesPerImage * (depth - 1) + bytesLastImage;
  let skipSize = 0;
  if (skipPixels > 0)
    skipSize += pixelSize * skipPixels;
  if (skipRows > 0)
    skipSize += bytesPerRow * skipRows;
  if (skipImages > 0)
    skipSize += bytesPerImage * skipImages;

  return size + skipSize
}

function checkPixelTypeTexture(type, pixels) {
  let correctType = true
  switch(type) {
    case gl.UNSIGNED_BYTE:
        correctType = pixels instanceof Uint8Array || pixels instanceof Uint8ClampedArray
        break
    case gl.BYTE:
        correctType = pixels instanceof Int8Array
        break
    case gl.UNSIGNED_SHORT:
    case gl.UNSIGNED_SHORT_4_4_4_4:
    case gl.UNSIGNED_SHORT_5_5_5_1:
    case gl.UNSIGNED_SHORT_5_6_5:
    case gl.HALF_FLOAT:
        correctType = pixels instanceof Uint16Array
        break
    case gl.SHORT:
        correctType = pixels instanceof Int16Array
        break
    case gl.UNSIGNED_INT:
    case gl.UNSIGNED_INT_5_9_9_9_REV:
    case gl.UNSIGNED_INT_10F_11F_11F_REV:
    case gl.UNSIGNED_INT_2_10_10_10_REV:
    case gl.UNSIGNED_INT_24_8:
        correctType = pixels instanceof Uint32Array
        break
    case gl.INT:
        correctType = pixels instanceof Int32Array
        break
    case gl.FLOAT:
        correctType = pixels instanceof Float32Array
        break
    case gl.FLOAT_32_UNSIGNED_INT_24_8_REV:
        if (pixels !== null) {
          return false
        }
        break
    default:
        correctType = false
  }

  return correctType

}

function fillPixelsBuffer(type, pixels, elementSize) {
  if (pixels !== null) {
    return pixels
  }

  switch(type) {
    case gl.UNSIGNED_BYTE:
          pixels = new Uint8Array(elementSize).fill(0)
        break
    case gl.BYTE:
          pixels = new Int8Array(elementSize).fill(0)
        break
    case gl.UNSIGNED_SHORT:
    case gl.UNSIGNED_SHORT_4_4_4_4:
    case gl.UNSIGNED_SHORT_5_5_5_1:
    case gl.UNSIGNED_SHORT_5_6_5:
    case gl.HALF_FLOAT:
          pixels = new Uint16Array(elementSize).fill(0)
        break
    case gl.SHORT:
          pixels = new Int16Array(elementSize).fill(0)
        break
    case gl.UNSIGNED_INT:
    case gl.UNSIGNED_INT_5_9_9_9_REV:
    case gl.UNSIGNED_INT_10F_11F_11F_REV:
    case gl.UNSIGNED_INT_2_10_10_10_REV:
    case gl.UNSIGNED_INT_24_8:
          pixels = new Uint32Array(elementSize).fill(0)
        break
    case gl.INT:
          pixels = new Int32Array(elementSize).fill(0)
        break
    case gl.FLOAT:
          pixels = new Float32Array(elementSize).fill(0)
        break
    case gl.FLOAT_32_UNSIGNED_INT_24_8_REV:
        break
  }

  return pixels
}

const isPowerOfTwo = (value) => {
  if (value <= 0) {
    return false;
  }

  // If n is a power of 2, then bitwise AND will be 0
  // e.g. 8 (1000) & 7 (0111) = 0
  // e.g. 7 (0111) & 6 (0110) = 6
  return (value & (value - 1)) === 0
}

export {
  calculatePaddingBytes,
  checkPixelTypeTexture,
  checkUniform,
  computeImageSize2D,
  computeImageSize3D,
  convertPixels,
  fillPixelsBuffer,
  isPowerOfTwo,
  lookupPixelSizeForFormatCombination,
  typeSize,
  uniformTypeSize,
  validCubeTarget,
  vertexCount
}
