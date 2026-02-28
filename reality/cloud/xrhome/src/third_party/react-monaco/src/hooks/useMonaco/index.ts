import {useState} from 'react'
import loader, {Monaco} from '@monaco-editor/loader'

import useMount from '../useMount'

const PRELOADED_LANGUAGES = ['css', 'javascript', 'typescript', 'html', 'json', 'markdown']

// NOTE(johnny): Copied over from '@monaco-editor/loader'
interface CancelablePromise<T> extends Promise<T> {
  cancel: () => void;
}

function useMonaco() {
  // NOTE(johnny): upload-monaco-editor-to-s3.ts was ran to create a 8th Wall hosted monaco-editor
  // to be used here.
  loader.config({
    paths: {
      vs: 'https://cdn.8thwall.com/web/monaco/0.33.0-lk7dpsrh/min/vs',
    },
  })
  const [monaco, setMonaco] = useState(loader.__getMonacoInstance())

  useMount(() => {
    let initMonaco: CancelablePromise<Monaco>

    if (!monaco) {
      initMonaco = loader.init()

      initMonaco.then(async (initializedMonaco) => {
        setMonaco(initializedMonaco)

        // NOTE(johnny): Preload the languages to ensure they are loaded before the textmate
        // grammars. The last tokenizer to load for a language is the one that takes effect.
        await Promise.all(initializedMonaco.languages.getLanguages().map(async (lang) => {
          if (PRELOADED_LANGUAGES.includes(lang.id)) {
            // @ts-ignore loader is not included in the type definition but we see it in the web
            // inspector. Need `?` because json does not have a loader.
            await lang.loader?.()
          }
        }))
      })
    }

    return () => initMonaco?.cancel()
  })

  return monaco
}

export default useMonaco
