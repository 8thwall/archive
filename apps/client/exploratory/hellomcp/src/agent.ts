import {ChatBedrockConverse} from '@langchain/aws'
import {createReactAgent} from '@langchain/langgraph/prebuilt'

import {META_TOOLS} from './tools/meta-tools'
import {SCENE_TOOLS} from './tools/scene-tools'
import {SYSTEM_PROMPT} from './prompts/system-prompt'

const llm = new ChatBedrockConverse({
  model: 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
  region: 'us-west-2',
})

const agent = createReactAgent({
  llm,
  tools: [
    ...META_TOOLS,
    ...SCENE_TOOLS,
  ],
  prompt: SYSTEM_PROMPT,
})

export {
  agent,
}
