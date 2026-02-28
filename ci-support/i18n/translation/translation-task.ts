import { translateJson } from "./translate-json"
import { translateMd } from "./translate-md"
import { translationConfig } from "./translation-config"
import { Language } from "./translation-engine"
import { outputPathForInputPath } from "./translation-paths"

interface TranslationTaskInput {
  path: string,
  content: string,
  language: Language,
}

interface TranslationTaskOutput {
  path: string,
  content: string,
}

const runTranslationTask = async (input : TranslationTaskInput): Promise<TranslationTaskOutput> => {
  switch (translationConfig.contentType()) {
    case 'json':
      return {
        path: outputPathForInputPath(input.path, input.language),
        content: await translateJson(input.content, input.language)
      }
    case 'md':
      return {
        path: outputPathForInputPath(input.path, input.language),
        content: await translateMd(input.content, input.language)
      }
    default:
      throw new Error(`Unsupported translation content type ${translationConfig.contentType}`)
  }
}

const runTranslationTasks = (tasks: TranslationTaskInput[]): Promise<TranslationTaskOutput[]> => (
  Promise.all(tasks.map(runTranslationTask))
)

export {
  runTranslationTask,
  runTranslationTasks,
}
