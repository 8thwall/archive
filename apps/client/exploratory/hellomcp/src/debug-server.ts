import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'
import type {z} from 'zod'

import {SCENE_TOOLS} from './tools/scene-tools'
import {META_TOOLS} from './tools/meta-tools'

const server = new McpServer({
  name: 'Demo',
  version: '0.1.0',
})

const ALL_TOOLS = [
  ...SCENE_TOOLS,
  ...META_TOOLS,
]

ALL_TOOLS.forEach((tool) => {
  server.tool(
    tool.name,
    tool.description,
    tool.schema.shape as z.ZodRawShape,
    async (parameters: any) => {
      const result = await tool.func(parameters)
      return {content: [{type: 'text', text: JSON.stringify(result)}]}
    }
  )
})

const transport = new StdioServerTransport()
await server.connect(transport)
