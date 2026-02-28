// See: https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_astc
// https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_astc/
class WebGLCompressedTextureASTC {
  constructor (context) {
    this._ctx = context

    this.COMPRESSED_RGBA_ASTC_4x4_KHR = 0x93B0
    this.COMPRESSED_RGBA_ASTC_5x4_KHR = 0x93B1
    this.COMPRESSED_RGBA_ASTC_5x5_KHR = 0x93B2
    this.COMPRESSED_RGBA_ASTC_6x5_KHR = 0x93B3
    this.COMPRESSED_RGBA_ASTC_6x6_KHR = 0x93B4
    this.COMPRESSED_RGBA_ASTC_8x5_KHR = 0x93B5
    this.COMPRESSED_RGBA_ASTC_8x6_KHR = 0x93B6
    this.COMPRESSED_RGBA_ASTC_8x8_KHR = 0x93B7
    this.COMPRESSED_RGBA_ASTC_10x5_KHR = 0x93B8
    this.COMPRESSED_RGBA_ASTC_10x6_KHR = 0x93B9
    this.COMPRESSED_RGBA_ASTC_10x8_KHR = 0x93BA
    this.COMPRESSED_RGBA_ASTC_10x10_KHR = 0x93BB
    this.COMPRESSED_RGBA_ASTC_12x10_KHR = 0x93BC
    this.COMPRESSED_RGBA_ASTC_12x12_KHR = 0x93BD

    this.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR = 0x93D0
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR = 0x93D1
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR = 0x93D2
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR = 0x93D3
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR = 0x93D4
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR = 0x93D5
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR = 0x93D6
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR = 0x93D7
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR = 0x93D8
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR = 0x93D9
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR = 0x93DA
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR = 0x93DB
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR = 0x93DC
    this.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR = 0x93DD
  }

  // The intent of the getSupportedProfiles function is to allow easy reconstruction of
  // the underlying OpenGL or OpenGL ES extension strings for environments like Emscripten,
  // by prepending the string GL_KHR_texture_compression_astc_ to the returned profile names.
  getSupportedProfiles() {
    const supportedNativeExts = this._ctx._getNativeSupportedExtensions()
    const profiles = []
    
    if (supportedNativeExts && supportedNativeExts.indexOf('GL_KHR_texture_compression_astc_ldr') >= 0) {
      profiles.push('ldr')
    }

    if (supportedNativeExts && supportedNativeExts.indexOf('GL_KHR_texture_compression_astc_hdr') >= 0) {
      profiles.push('hdr')
    }

    return profiles
  }
}

function getWebGLCompressedTextureASTC(context) {
  let result = null
  const exts = context.getSupportedExtensions()

  if (exts && exts.indexOf('WEBGL_compressed_texture_astc') >= 0) {
    result = new WebGLCompressedTextureASTC(context)
  }

  return result
}

export {getWebGLCompressedTextureASTC, WebGLCompressedTextureASTC}
