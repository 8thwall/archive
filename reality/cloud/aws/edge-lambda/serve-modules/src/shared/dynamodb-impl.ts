// @attr(visibility = ["//visibility:public"])

import {
  DynamoDBClient, GetItemCommand, GetItemCommandInput, GetItemCommandOutput, PutItemCommand,
  PutItemCommandInput, PutItemCommandOutput, QueryCommand, QueryCommandInput, QueryCommandOutput,
  TransactWriteItemsCommand, TransactWriteItemsCommandInput, TransactWriteItemsCommandOutput,
  BatchGetItemCommand, BatchGetItemCommandInput, BatchGetItemCommandOutput,
  BatchWriteItemCommand, BatchWriteItemCommandInput, BatchWriteItemCommandOutput,
  DeleteItemCommand, DeleteItemCommandInput, DeleteItemCommandOutput,
  UpdateItemCommand, UpdateItemCommandInput, UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb'

import type {DynamoDbApi} from './dynamodb'

const createDdbApi = (dynamoDbClient: DynamoDBClient) => {
  const DdbApi: DynamoDbApi = {
    putItem: async (options) => {
      const command = new PutItemCommand(options)
      return dynamoDbClient.send<PutItemCommandInput, PutItemCommandOutput>(command)
    },
    getItem: async (options) => {
      const command = new GetItemCommand(options)
      return dynamoDbClient.send<GetItemCommandInput, GetItemCommandOutput>(command)
    },
    deleteItem: async (options) => {
      const command = new DeleteItemCommand(options)
      return dynamoDbClient.send<DeleteItemCommandInput, DeleteItemCommandOutput>(command)
    },
    query: async (options) => {
      const command = new QueryCommand(options)
      return dynamoDbClient.send<QueryCommandInput, QueryCommandOutput>(command)
    },
    transactWriteItems: async (options) => {
      const command = new TransactWriteItemsCommand(options)
      return dynamoDbClient.send<TransactWriteItemsCommandInput,
      TransactWriteItemsCommandOutput>(command)
    },
    batchGetItem: async (options) => {
      const command = new BatchGetItemCommand(options)
      return dynamoDbClient.send<BatchGetItemCommandInput, BatchGetItemCommandOutput>(command)
    },
    batchWriteItem: async (options) => {
      const command = new BatchWriteItemCommand(options)
      return dynamoDbClient.send<BatchWriteItemCommandInput, BatchWriteItemCommandOutput>(command)
    },
    updateItem: async (options) => {
      const command = new UpdateItemCommand(options)
      return dynamoDbClient.send<UpdateItemCommandInput, UpdateItemCommandOutput>(command)
    },
  }
  return DdbApi
}

export {
  createDdbApi,
}
