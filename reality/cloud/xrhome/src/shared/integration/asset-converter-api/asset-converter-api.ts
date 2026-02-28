import {entry} from '../../registry'

import type {createAssetConverterApi} from './asset-converter-api-impl'

const AssetConverterApi = entry<ReturnType<typeof createAssetConverterApi>>('asset-converter-api')

export {AssetConverterApi}
