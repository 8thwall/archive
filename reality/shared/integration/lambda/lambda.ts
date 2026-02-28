import type LambdaClient from '@aws-sdk/client-lambda'

import {entry} from '@nia/reality/cloud/xrhome/src/shared/registry'

type CommandFunction<Command> = Command extends LambdaClient.$Command<
infer I, infer O, any, any, any
> ? (input: I) => Promise<O> : never

type LambdaApi = {
  _client: LambdaClient.LambdaClient
  invoke: CommandFunction<LambdaClient.InvokeCommand>
  createFunction: CommandFunction<LambdaClient.CreateFunctionCommand>
  updateFunctionCode: CommandFunction<LambdaClient.UpdateFunctionCodeCommand>
  deleteFunction: CommandFunction<LambdaClient.DeleteFunctionCommand>
  addPermission: CommandFunction<LambdaClient.AddPermissionCommand>
  updateFunctionConfiguration: CommandFunction<LambdaClient.UpdateFunctionConfigurationCommand>
}

const Lambda = entry<LambdaApi>('lambda')

export {
  Lambda,
}

export type {
  LambdaApi,
}
