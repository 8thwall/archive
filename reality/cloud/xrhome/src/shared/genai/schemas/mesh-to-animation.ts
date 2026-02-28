import {z} from 'zod'
import {zfd} from 'zod-form-data'

import {meshToAnimationBaseSchema} from './base'

const meshToAnimationSchema = zfd.formData({
  ...meshToAnimationBaseSchema,
  modelId: zfd.text(z.literal('meshy-ai')),
})

export {
  meshToAnimationSchema,
}
