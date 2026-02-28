// See: https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc_srgb
// https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_s3tc_srgb/
class WebGLCompressedTextureS3TC_SRGB {
  constructor () {
    this.COMPRESSED_SRGB_S3TC_DXT1_EXT = 0x8C4C
    this.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 0x8C4D
    this.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 0x8C4E
    this.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 0x8C4F
  }
}

function getWebGLCompressedTextureS3TC_SRGB(context) {
  let result = null
  const exts = context.getSupportedExtensions()

  if (exts && exts.indexOf('WEBGL_compressed_texture_s3tc_srgb') >= 0) {
    result = new WebGLCompressedTextureS3TC_SRGB()
  }

  return result
}

export {getWebGLCompressedTextureS3TC_SRGB, WebGLCompressedTextureS3TC_SRGB}
