import React from 'react'
import UaParser from 'ua-parser-js'

import {MonacoSetup} from './monaco-setup'
import {MonacoGitSync} from './monaco-git-sync'

interface ITextEditorContext {
  editorToUse: 'Ace' | 'Monaco'
  aceEditSessions: Record<string, unknown>

  focusTextEditor: () => void
  focusCounter: number
}

const TextEditorContext = React.createContext<ITextEditorContext>(null)

// The TextEditor component can be mounted/unmounted at will and there can be multiple instances
// of it. This context keeps together common configuration for the component.
const TextEditorContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const aceEditSessions = React.useRef<ITextEditorContext['aceEditSessions']>({})

  const [focusCounter, setFocusCounter] = React.useState(0)

  const ua = UaParser()
  const editorToUse = (
    Build8.PLATFORM_TARGET === 'desktop' ||
    ['console', 'mobile', 'tablet', 'smarttv', 'wearable', 'embedded'].includes(ua.device.type)
    // eslint-disable-next-line local-rules/hardcoded-copy
  )
    ? 'Ace'
    : 'Monaco'

  const value: ITextEditorContext = React.useMemo(() => ({
    editorToUse,
    aceEditSessions: aceEditSessions.current,
    focusCounter,
    focusTextEditor: () => setFocusCounter(s => s + 1),
  }), [editorToUse, focusCounter])

  return (
    <TextEditorContext.Provider value={value}>
      {value.editorToUse === 'Monaco' &&
        <>
          {/* Since the context wraps the TextEditor, these are mounted before monaco mounts */}
          {/* This means all the models are loaded before Monaco mounts */}
          <MonacoSetup />
          <MonacoGitSync />
        </>
        }
      {children}
    </TextEditorContext.Provider>
  )
}

const useTextEditorContext = () => React.useContext(TextEditorContext)

export {
  TextEditorContextProvider,
  useTextEditorContext,
}

export type {
  ITextEditorContext,
}
