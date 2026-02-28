import type DynamoDB from '@aws-sdk/client-dynamodb'

import {entry} from '../../registry'

type CommandFunction<Command> = Command extends DynamoDB.$Command<
infer I, infer O, any, any, any
> ? (input: I) => Promise<O> : never

type DdbApi = {
  putItem: CommandFunction<DynamoDB.PutItemCommand>
  deleteItem: CommandFunction<DynamoDB.DeleteItemCommand>
  query: CommandFunction<DynamoDB.QueryCommand>
  getItem: CommandFunction<DynamoDB.GetItemCommand>
}

const Ddb = entry<DdbApi>('dynamodb')

export {
  Ddb,
}

export type {
  DdbApi,
}
