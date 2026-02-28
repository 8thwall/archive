import {
  DynamoDBClient, DynamoDBClientConfig, PutItemCommand, DeleteItemCommand, QueryCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'

import type {DdbApi} from './dynamodb'

const createDdbApi = (option: DynamoDBClientConfig) => {
  const ddbClient = new DynamoDBClient(option)

  const ddbApi: DdbApi = {
    putItem: async input => ddbClient.send(new PutItemCommand(input)),
    deleteItem: async input => ddbClient.send(new DeleteItemCommand(input)),
    query: async input => ddbClient.send(new QueryCommand(input)),
    getItem: async input => ddbClient.send(new GetItemCommand(input)),
  }
  return ddbApi
}

export {
  createDdbApi,
}
