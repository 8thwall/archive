import fetch from 'node-fetch'
import {maxConcurrentWithRateLimit} from './max-concurrent'
import {Language, TranslationEngine} from './translation-engine'

let cost_ = 0

const translate = async (content: string, language: Language): Promise<string> => {
  const fetched = await fetch('https://openai.niantichackathon.dev/chatgpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        prompt: `<|im_start|>system\nTranslate to ${language}.\n<|im_end|>\n<|im_start|>user\n${content}\n<|im_end|>\n<|im_start|>assistant`,
        max_tokens: 800,
        temperature: 0.3,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1.0,
        stop: ['<|im_end|>'],
    }),
  })

  const response = await fetched.json()

  const {choices, usage} = response

  if (usage && usage.total_tokens) {
    cost_ += usage.total_tokens
  }

  if (!(choices && choices.length)) {
    console.error('ChatGPT bad response', response)
    return content
  }

  const {finish_reason, text} = choices[0]

  if (finish_reason !== 'stop') {
    console.error('ChatGPT had bad finish reason', finish_reason, ', content: ', text)
    if (finish_reason) {
      // sometimes finish reason is null but it seems complete, so only error if non-null.
      return content
    }
  }

  return text.trim()
}

const translationEngineChatGPT = (): TranslationEngine => {
  const rateLimit = maxConcurrentWithRateLimit<string>(1, 0.5)
  const doTranslate = (content: string, language: Language) => (
    rateLimit.add(() => {
      console.log(`Translating ${content} to ${language}, previous cost: ${cost_}`)
      return translate(content, language)
    })
  )
  return {
    translate: doTranslate,
  }
}

const chatGPTCost = () => cost_

export {
  translationEngineChatGPT,
  chatGPTCost,
}
