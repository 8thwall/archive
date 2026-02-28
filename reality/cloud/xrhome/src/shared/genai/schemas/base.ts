import {z} from 'zod'
import {zfd} from 'zod-form-data'

import {MIN_PROMPT_LEN} from '../constants'

import {
  GenerateType, ImageAspectRatio, ImageStyle, OutputFormat, RerollOrientation,
} from '../types/base'

const promptSchema = z.string().trim().min(MIN_PROMPT_LEN)

const baseSchema = {
  numRequests: zfd.numeric(z.number().optional()),
}

const uuidAssetInputSchema = z.object({
  type: z.literal('uuid'),
  // NOTE(kyle): For user images that were accidentally uploaded with a .png extension in the
  // S3 path, we should not validate the value is a UUID.
  value: z.string(),
})

const fileAssetInputSchema = z.object({
  type: z.literal('file'),
  // The value should have been stripped from the request and the file blob written to "image-files"
  // on the form.
  value: z.literal(''),
})

const assetInputSchema = z.discriminatedUnion('type', [uuidAssetInputSchema, fileAssetInputSchema])

const toImageSchema = {
  ...baseSchema,
  prompt: zfd.text(promptSchema),
  // NOTE(kyle): Form submissions turn null into the string "null". We should accept "null"
  // as a valid value but transform it to undefined before passing the request to asset-generator.
  style: zfd.text(z.nativeEnum(ImageStyle).or(z.literal('null').transform(() => undefined))),
  aspectRatio: zfd.text(z.nativeEnum(ImageAspectRatio)),
  outputFormat: zfd.text(z.nativeEnum(OutputFormat)),
}

const textToImageBaseSchema = {
  ...toImageSchema,
  type: zfd.text(z.literal(GenerateType.TEXT_TO_IMAGE)),
}

const imageToImageBaseSchema = {
  ...toImageSchema,
  type: zfd.text(z.literal(GenerateType.IMAGE_TO_IMAGE)),
  images: zfd.repeatable(z.array(z.string().transform((str, ctx) => {
    try {
      return assetInputSchema.parse(JSON.parse(str))
    } catch (err) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid images',
      })
      return z.NEVER
    }
  })).min(1)),
  ParentRequestUuid: zfd.text(z.string().uuid().optional()),
  orientation: zfd.text(z.nativeEnum(RerollOrientation).optional()),
}

const imageToMeshBaseSchema = {
  type: zfd.text(z.literal(GenerateType.IMAGE_TO_MESH)),
  images: zfd.repeatable(z.array(z.string().transform((str, ctx) => {
    try {
      return assetInputSchema.parse(JSON.parse(str))
    } catch (err) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid images',
      })
      return z.NEVER
    }
  })).min(1)),
  ParentRequestUuid: zfd.text(z.string().uuid().optional()),
}

const meshToAnimationBaseSchema = {
  ...baseSchema,
  type: zfd.text(z.literal(GenerateType.MESH_TO_ANIMATION)),
  mesh: zfd.text(z.string().transform((str, ctx) => {
    try {
      return assetInputSchema.parse(JSON.parse(str))
    } catch (err) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid mesh',
      })
      return z.NEVER
    }
  })),
  ParentRequestUuid: zfd.text(z.string().uuid().optional()),
}

export {
  baseSchema,
  promptSchema,
  assetInputSchema,
  toImageSchema,
  imageToImageBaseSchema,
  textToImageBaseSchema,
  imageToMeshBaseSchema,
  meshToAnimationBaseSchema,
}
