// NOTE(kyle): Used to set up LangSmith tracing.
// LangSmith tracing is meant to only be used for local devlopment until we have proper enterprise
// support. At that time, the LangSmith API key should instead be loaded from Secrets Manager.
// Add a .env file and see https://docs.smith.langchain.com/observability to set up tracing.
import 'dotenv/config'
import {HumanMessage} from '@langchain/core/messages'
import {Server} from '@modelcontextprotocol/sdk/server/index.js'
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema, ListToolsRequestSchema, Tool,
} from '@modelcontextprotocol/sdk/types.js'
import {z} from 'zod'

import {agent} from './agent'
import {formatMessages} from './utils/format-llm-messages'
import {log} from './utils/log'

const studioAgentInputSchema = z.object({
  prompt: z.string(),
})

const STUDIO_AGENT_TOOL: Tool = {
  name: 'studio_agent',
  description: 'Agentic tool for building Studio applications',
  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
      },
    },
  },
}

const server = new Server(
  {name: 'studio', version: '0.1.0'},
  {capabilities: {tools: {}}}
)

server.setRequestHandler(ListToolsRequestSchema, () => {
  log('Listing tools')
  return {
    tools: [
      STUDIO_AGENT_TOOL,
    ],
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== STUDIO_AGENT_TOOL.name) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Unknown tool name: ${request.params.name}`,
        },
      ],
    }
  }

  try {
    const input = studioAgentInputSchema.parse(request.params.arguments)
    const {messages} = await agent.invoke(
      {messages: [new HumanMessage(input.prompt)]}
    )

    return {
      content: [
        {
          type: 'text',
          text: formatMessages(messages),
        },
      ],
    }
  } catch (err) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: err instanceof Error ? err.message : 'Unknown error',
        },
      ],
    }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
