import type {GetItemCommandInput, GetItemCommandOutput} from '@aws-sdk/client-dynamodb'

type DynamoDbApi = {
  getItem: (input: GetItemCommandInput) => Promise<GetItemCommandOutput>
}

let ddb: DynamoDbApi = null

const register = (impl: DynamoDbApi) => {
  ddb = impl
}

const use = () => ddb

export {
  register,
  use,
}
