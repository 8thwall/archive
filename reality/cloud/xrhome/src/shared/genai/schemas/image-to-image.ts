import {z} from 'zod'
import {zfd} from 'zod-form-data'

import {imageToImageBaseSchema} from './base'
import {ImageBackground} from '../types/base'

const imageToImageSchema = zfd.formData({
  ...imageToImageBaseSchema,
  modelId: zfd.text(z.union([
    z.literal('gpt-image-1'),
    z.literal('fal-ai/flux-pro/kontext'),
  ])),
  background: zfd.text(z.nativeEnum(ImageBackground).optional()),
})

export {
  imageToImageSchema,
}
