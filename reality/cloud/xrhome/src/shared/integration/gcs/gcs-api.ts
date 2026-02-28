import {entry} from '../../registry'

type GcsConfig = {
  bucket: string
  root: string
  secret: 'ardkGcsServiceAccountKey' | 'eposGcsServiceAccountKey'
}

interface IGcsApi {
  getSignedUrl: (filename: string, config: GcsConfig) => Promise<string>
}

const Gcs = entry<IGcsApi>('gcs')

export {Gcs}
export type {GcsConfig}
