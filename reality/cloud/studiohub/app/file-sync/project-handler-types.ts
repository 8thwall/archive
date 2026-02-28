import {z} from 'zod'

const ProjectAppUuidParams = z.object({
  appUuid: z.string(),
})

type IProjectAppUuidParams = z.infer<typeof ProjectAppUuidParams>

const ProjectRequestParams = z.object({
  appUuid: z.string(),
  appKey: z.string(),
})

type IProjectRequestParams = z.infer<typeof ProjectRequestParams>

const InitializeProjectParams = z.object({
  appUuid: z.string(),
  appKey: z.string(),
  appName: z.string().nonempty().optional(),
  location: z.string().nonempty().optional(),
})

type IInitializeProjectParams = z.infer<typeof InitializeProjectParams>

const MoveProjectParams = z.object({
  appUuid: z.string(),
  appKey: z.string(),
  newLocation: z.string().nonempty().optional(),
})

type IMoveProjectParams = z.infer<typeof MoveProjectParams>

export {
  ProjectAppUuidParams,
  ProjectRequestParams,
  InitializeProjectParams,
  MoveProjectParams,
}

export type {
  IProjectAppUuidParams,
  IProjectRequestParams,
  IInitializeProjectParams,
  IMoveProjectParams,
}
