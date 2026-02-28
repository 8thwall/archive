// See: https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_pvrtc
// https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_pvrtc/
class WebGLCompressedTexturePVRTC {
  constructor () {
    this.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00
    this.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01
    this.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02
    this.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03
  }
}

function getWebGLCompressedTexturePVRTC(context) {
  let result = null
  const exts = context.getSupportedExtensions()

  if (exts && exts.indexOf('WEBGL_compressed_texture_pvrtc') >= 0) {
    result = new WebGLCompressedTexturePVRTC(context)
  }

  return result
}

export {getWebGLCompressedTexturePVRTC, WebGLCompressedTexturePVRTC}
