// @visibility(//visibility:public)

// See https://mimesniff.spec.whatwg.org/#image-type-pattern-matching-algorithm
const mimeTypeBytePatterns = [
  {
    mimeType: 'image/png',
    bytePattern: [0x89, 0x50, 0x4E, 0x47],
    mask: [0xFF, 0xFF, 0xFF, 0xFF],
  },
  {
    mimeType: 'image/jpeg',
    bytePattern: [0xFF, 0xD8, 0xFF],
    mask: [0xFF, 0xFF, 0xFF],
  },
  {
    mimeType: 'image/ktx',  // https://registry.khronos.org/KTX/specs/2.0/ktxspec.v2.html
    bytePattern: [0xAB, 0x4B, 0x54, 0x58, 0x20, 0x32, 0x30, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A],
    mask: [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
  },
  {
    mimeType: 'image/x-icon',
    bytePattern: [0x00, 0x00, 0x01, 0x00],
    mask: [0xFF, 0xFF, 0xFF, 0xFF],
  },
  {
    mimeType: 'image/x-icon',
    bytePattern: [0x00, 0x00, 0x02, 0x00],
    mask: [0xFF, 0xFF, 0xFF, 0xFF],
  },
  {
    mimeType: 'image/bmp',
    bytePattern: [0x42, 0x4d],
    mask: [0xFF, 0xFF],
  },
  {
    mimeType: 'image/gif',
    bytePattern: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    mask: [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
  },
  {
    mimeType: 'image/gif',
    bytePattern: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
    mask: [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
  },
  {
    mimeType: 'image/webp',
    bytePattern: [0x52, 0x49, 0x46, 0x46],
    mask: [0xFF, 0xFF, 0xFF, 0xFF],
  },
]

// To determine which image MIME type byte pattern a byte sequence input matches,
// if any, use the following image type pattern matching algorithm:
// https://mimesniff.spec.whatwg.org/#pattern-matching-algorithm
const mimeTypeImage = (data: Uint8Array): string | null => {
  for (const {mimeType, bytePattern, mask} of mimeTypeBytePatterns) {
    if (bytePattern.length <= data.byteLength) {
      const match = bytePattern.length <= data.byteLength && bytePattern.every(
        // eslint-disable-next-line no-bitwise
        (pattern, i) => (data[i] & mask[i]) === pattern
      )
      if (match) {
        return mimeType
      }
    }
  }
  return null
}

export {mimeTypeImage}
