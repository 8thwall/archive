// @dep(:image-decoding-addon)
// @visibility(//visibility:public)

/* eslint-disable import/no-unresolved */
import imageAddon from '@nia/c8/dom/image-decoding/image-decoding-addon'
/* eslint-enable import/no-unresolved */

interface NativeImage {
  width: number,
  height: number,
  rowBytes: number,
  components: number,
  hasAlpha: boolean,
  data: Uint8Array,
}

const loadImage = async (
  buffer: Uint8Array
): Promise<NativeImage> => imageAddon.loadImage(buffer)

type ImageDecodingAddon = {
  loadImage: typeof loadImage,
}

export {ImageDecodingAddon, NativeImage, loadImage}
