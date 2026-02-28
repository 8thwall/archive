import {z} from 'zod'

const FileAppUuidParams = z.object({
  appUuid: z.string(),
})

type IFileAppUuidParams = z.infer<typeof FileAppUuidParams>

const FilePullParams = z.object({
  appUuid: z.string().nonempty(),
  appKey: z.string().nonempty(),
  path: z.string().nonempty(),
})

type IFilePullParams = z.infer<typeof FilePullParams>

const FilePushParams = z.object({
  appUuid: z.string().nonempty(),
  appKey: z.string().nonempty(),
  path: z.string().nonempty(),
})

type IFilePushParams= z.infer<typeof FilePushParams>

const FileDeleteParams = z.object({
  appUuid: z.string().nonempty(),
  appKey: z.string().nonempty(),
  path: z.string().nonempty(),
})

type IFileDeleteParams= z.infer<typeof FileDeleteParams>

const FileStateParams = z.object({
  appUuid: z.string().nonempty(),
  appKey: z.string().nonempty(),
})

type IFileStateParams = z.infer<typeof FileStateParams>

const FileMetadataParams = z.object({
  appUuid: z.string().nonempty(),
  appKey: z.string().nonempty(),
  path: z.string().nonempty(),
})

type IFileMetadataParams = z.infer<typeof FileMetadataParams>

export {
  FileAppUuidParams,
  FilePullParams,
  FilePushParams,
  FileDeleteParams,
  FileStateParams,
  FileMetadataParams,
}

export type {
  IFileAppUuidParams,
  IFilePullParams,
  IFilePushParams,
  IFileDeleteParams,
  IFileStateParams,
  IFileMetadataParams,
}
