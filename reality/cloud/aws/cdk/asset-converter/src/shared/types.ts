import type {APIGatewayProxyEventV2} from 'aws-lambda'
import type {AttributesForRaw} from '@nia/reality/shared/typed-attributes'
import type {
  ConversionStatus,
} from '@nia/reality/cloud/xrhome/src/client/studio/hooks/use-asset-converter'

type APIEvent = APIGatewayProxyEventV2

type PostUploadUrlQueryParams = {
  filename: string
  conversionType: string
  conversionParams?: BaseItem
}

type BaseType = string | number | boolean | BaseItem | Array<BaseType>
type BaseItem = {[k: string]: BaseType}

type KeyRaw = {pk: string, sk: string}
type Key = AttributesForRaw<KeyRaw>

type ConversionRequest = {
  conversionType: string,
  conversionParams?: BaseItem,
  status: ConversionStatus,
  downloadFileKey: string,
  uploadFileKey: string,
  error?: string,
  createdAt: number,
  expireAt: number,
}

const getDdbKey = (pk: string, sk?: string): Key => ({
  pk: {S: pk},
  sk: {S: sk ?? '-'},
})

export {
  getDdbKey,
}

export type {
  ConversionRequest,
  PostUploadUrlQueryParams,
  APIEvent,
}
