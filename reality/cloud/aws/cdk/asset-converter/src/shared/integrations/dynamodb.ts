import type DynamoDB from '@aws-sdk/client-dynamodb'
import {
  DynamoDBClient, UpdateItemCommand, GetItemCommand, PutItemCommand,
} from '@aws-sdk/client-dynamodb'

import {entry} from '../../../../../../xrhome/src/shared/registry'

type CommandFunction<Command> = Command extends DynamoDB.$Command<
infer I, infer O, any, any, any
> ? (input: I) => Promise<O> : never

type DynamoDBApi = {
  getItem: CommandFunction<DynamoDB.GetItemCommand>
  putItem: CommandFunction<DynamoDB.PutItemCommand>
  updateItem: CommandFunction<DynamoDB.UpdateItemCommand>
}

const Ddb = entry<DynamoDBApi>('dynamodb')

const createDynamoDbApi = (ddbClient: DynamoDBClient): DynamoDBApi => ({
  getItem: async input => ddbClient.send(new GetItemCommand(input)),
  putItem: async input => ddbClient.send(new PutItemCommand(input)),
  updateItem: async input => ddbClient.send(new UpdateItemCommand(input)),
})

export {
  Ddb,
  createDynamoDbApi,
}

export type {
  DynamoDBApi,
}
