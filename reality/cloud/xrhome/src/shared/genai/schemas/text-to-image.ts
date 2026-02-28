import {z} from 'zod'
import {zfd} from 'zod-form-data'

import {promptSchema, textToImageBaseSchema} from './base'
import {ImageBackground} from '../types/base'

const textToImageSchema = zfd.formData({
  ...textToImageBaseSchema,
  modelId: zfd.text(z.union([
    z.literal('stability.stable-image-core-v1:1'),
    z.literal('flux-pro-1.1'),
    z.literal('flux-kontext-pro'),
    z.literal('gpt-image-1'),
    z.literal('fal-ai/flux-1/schnell'),
    z.literal('fal-ai/imagen4/preview'),
  ])),
  negativePrompt: zfd.text(promptSchema.optional()),
  background: zfd.text(z.nativeEnum(ImageBackground).optional()),
})

export {
  textToImageSchema,
}
