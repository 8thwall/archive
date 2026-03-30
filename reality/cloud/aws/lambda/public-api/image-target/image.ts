import sharp from 'sharp'

const getImageDimensions = async (imageBuffer) => {
  const {width, height} = await sharp(imageBuffer).metadata()
  return {width, height}
}

export {
  getImageDimensions,
}
