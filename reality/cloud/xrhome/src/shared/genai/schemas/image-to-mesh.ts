import {z} from 'zod'
import {zfd} from 'zod-form-data'

import {imageToMeshBaseSchema} from './base'

const trellisTextureSizeSchema = z.union([
  z.literal(512),
  z.literal(1024),
  z.literal(2048),
])

// NOTE(kyle): multiimage is not a typo.
const trellisMultiimageAlgoSchema = z.union([
  z.literal('stochastic'),
  z.literal('multidiffusion'),
])

const imageToMeshSchema = zfd.formData({
  ...imageToMeshBaseSchema,
  modelId: zfd.text(z.union([
    z.literal('fal-ai/trellis'),
    z.literal('fal-ai/trellis/multi'),
    z.literal('fal-ai/hunyuan3d/v2'),
    z.literal('fal-ai/hunyuan3d/v2/turbo'),
    z.literal('fal-ai/hunyuan3d/v2/multi-view'),
    z.literal('fal-ai/hunyuan3d/v2/multi-view/turbo'),
    z.literal('fal-ai/hunyuan3d/v2/mini'),
    z.literal('fal-ai/hunyuan3d/v2/mini/turbo'),
    z.literal('fal-ai/hunyuan3d-v21'),
  ])),
  // Trellis
  ssGuidanceStrength: zfd.numeric(z.number().optional()),
  ssSamplingSteps: zfd.numeric(z.number().optional()),
  slatGuidanceStrength: zfd.numeric(z.number().optional()),
  slatSamplingSteps: zfd.numeric(z.number().optional()),
  meshSimplify: zfd.numeric(z.number().optional()),
  textureSize: zfd.numeric(trellisTextureSizeSchema.optional()),
  multiimageAlgo: zfd.text(trellisMultiimageAlgoSchema.optional()),

  // Hunyuan
  numInferenceSteps: zfd.numeric(z.number().optional()),
  guidanceScale: zfd.numeric(z.number().optional()),
  octreeResolution: zfd.numeric(z.number().optional()),
  texturedMesh: zfd.text(z.string().transform((str, ctx) => {
    if (str === 'true') {
      return true
    } else if (str === 'false') {
      return false
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid boolean',
      })
      return z.NEVER
    }
  }).optional()),
})

export {
  imageToMeshSchema,
}
