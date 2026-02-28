import {ImageStyle} from '../../src/shared/genai/types/base'
import {Db} from '../../src/shared/integration/db/db-api'
import type {AssetRequest} from '../../src/shared/integration/db/models'

// There's some urls that have "asset-generation.s3.us-west-2.amazonaws.com" as the
// hostname, I think from internal testing.
const getValidHostName = () => (
  process.argv[2] === 'prod' ? 'cdn.8thwall.com' : 'cdn-dev.8thwall.com'
)

const parseUrl = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl)
    const validHostName = getValidHostName()

    if (url.hostname !== validHostName) {
      throw new Error('Invalid hostname')
    }

    return url
  } catch {
    return null
  }
}

const getUuidFromUrl = (url: URL) => {
  if (url.pathname.endsWith('/optimized.glb')) {
    return url.pathname.split('/').slice(-2, -1)[0]
  }

  // The split on '.' is to handle URLs with extension suffixes.
  return url.pathname.split('/').pop().split('.').shift()
}

const getImageToImageParent = async (assetReq: AssetRequest) => {
  const imageUrls = assetReq.input?.imageUrls as string[]
  if (!imageUrls?.length) {
    return null
  }

  if (
    assetReq.input?.style !== ImageStyle.MULTIVIEW &&
      assetReq.input?.style !== ImageStyle.ANIMATED_MULTIVIEW
  ) {
    return null
  }

  const imageUrl = parseUrl(imageUrls[0])
  const genUuid = getUuidFromUrl(imageUrl)
  const gen = await Db.use().AssetGeneration.findByPk(genUuid)

  if (!gen) {
    return null
  }

  return gen.RequestUuid
}

const getImageToMeshParent = async (assetReq: AssetRequest) => {
  const imageUrls = (assetReq.input?.imageUrls as string[])
    ?.map(url => parseUrl(url))
    .filter(Boolean)

  if (!imageUrls?.length) {
    return null
  }

  // This is a mesh generated from a single front-view image.
  if (imageUrls.length === 1) {
    const frontViewGenUuid = getUuidFromUrl(imageUrls[0])
    const frontViewGen = await Db.use().AssetGeneration.findByPk(frontViewGenUuid)

    if (!frontViewGen) {
      return null
    }

    return frontViewGen.RequestUuid
  }

  // This is a mesh generated from 4 multi-view images.
  if (imageUrls.length === 4) {
    const fblrUuids = imageUrls.map(getUuidFromUrl)
    const fblrGens = await Db.use().AssetGeneration.findAll({
      where: {
        uuid: fblrUuids,
      },
    })

    if (fblrGens?.length !== 4) {
      return null
    }

    const frontViewGenRequestUuid = fblrGens[0].RequestUuid
    const backViewGenRequestUuid = fblrGens[1].RequestUuid
    const isBlrFromSameReq = fblrGens.slice(2).every(e => e.RequestUuid === backViewGenRequestUuid)

    if (!isBlrFromSameReq) {
      return null
    }

    return frontViewGenRequestUuid
  }

  return null
}

const getMeshToAnimationParent = async (assetReq: AssetRequest) => {
  const meshUrl = parseUrl(assetReq.input?.meshUrl as string)

  if (!meshUrl) {
    return null
  }

  const meshGenUuid = getUuidFromUrl(meshUrl)
  const meshGen = await Db.use().AssetGeneration.findByPk(meshGenUuid)

  if (!meshGen) {
    return null
  }

  return meshGen.RequestUuid
}

export {
  getImageToImageParent,
  getImageToMeshParent,
  getMeshToAnimationParent,
}
