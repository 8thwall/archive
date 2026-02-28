import {
  InvokeCommand, LambdaClient, CreateFunctionCommand, UpdateFunctionCodeCommand,
  DeleteFunctionCommand, AddPermissionCommand, UpdateFunctionConfigurationCommand,
} from '@aws-sdk/client-lambda'

import type {LambdaApi} from './lambda'

const createLambdaApi = (lambdaClient: LambdaClient): LambdaApi => ({
  _client: lambdaClient,
  invoke: async options => lambdaClient.send(new InvokeCommand(options)),
  createFunction: async options => lambdaClient.send(new CreateFunctionCommand(options)),
  updateFunctionCode: async options => lambdaClient.send(new UpdateFunctionCodeCommand(options)),
  deleteFunction: async options => lambdaClient.send(new DeleteFunctionCommand(options)),
  addPermission: async options => lambdaClient.send(new AddPermissionCommand(options)),
  updateFunctionConfiguration: async options => lambdaClient.send(
    new UpdateFunctionConfigurationCommand(options)
  ),
})

export {
  createLambdaApi,
}
