import type {z} from 'zod'
import {tool} from '@langchain/core/tools'

import {createWebSocketManager} from './websocket-manager-factory'

const createToolFactory = () => {
  const ws = createWebSocketManager()

  const create = <T extends z.AnyZodObject>(
    action: string,
    description: string,
    schema: T,
    handler?: (args: z.infer<T>) => any
  ) => {
    const dynamicTool = tool(
      (parameters) => {
        // Let callers provide a handler if you need to run logic before sending the request.
        if (handler && typeof handler === 'function') {
          return handler(parameters)
        }
        return ws.send({action, parameters})
      },
      {name: action, description, schema}
    )
    return dynamicTool
  }

  return {
    create,
  }
}

const Tool = createToolFactory()

export {
  Tool,
}
