import {entry} from '../../registry'

interface IDiscoveryApi {
  sendDiscoveryManageDocTask: (action: string, indexName: string, uuid: string) => Promise<void>
}

const DiscoveryApi = entry<IDiscoveryApi>('discovery-api')

export {DiscoveryApi}

export type {IDiscoveryApi}
