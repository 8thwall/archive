import {isAIMessage, isToolMessage, type BaseMessage} from '@langchain/core/messages'

const formatMessages = (messages: BaseMessage[]) => messages.map((message) => {
  let title = ''
  let text = ''

  if (isAIMessage(message)) {
    title = message.getType().toUpperCase()
    const toolText = message.tool_calls?.length
      ? `*Tool Calls*\n${JSON.stringify(message.tool_calls, null, 2)}`
      : ''
    if (message.text && toolText) {
      text = `${message.text}\n\n${toolText}`
    } else if (toolText) {
      text = toolText
    } else {
      text = message.text
    }
  } else if (isToolMessage(message)) {
    title = `[TOOL: ${message.name}]`
    text = message.text
  } else {
    title = message.getType().toUpperCase()
    text = message.text
  }

  return `================ ${title} ================
${text}`
}).join('\n\n')

export {
  formatMessages,
}
