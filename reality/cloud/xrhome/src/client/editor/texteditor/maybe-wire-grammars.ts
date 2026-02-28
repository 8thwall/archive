import {Registry} from 'monaco-textmate'

import type {Monaco, MonacoEditor} from './monaco-types'
import {wireTmGrammars} from '../../../third_party/monaco-editor-textmate/src/index'
import jsxTextmateLanguage from './syntaxes/JavaScriptReact.tmLanguage.json'
import tsxTextmateLanguage from './syntaxes/TypescriptReact.tmLanguage.json'
import htmlTextmateLanguage from './syntaxes/html.tmLanguage.json'
import cssTextmateLanguage from './syntaxes/css.tmLanguage.json'
import scssTextmateLanguage from './syntaxes/scss.tmLanguage.json'
import sassdocTextmateLanguage from './syntaxes/sassdoc.tmLanguage.json'
import jsonTextmateLanguage from './syntaxes/JSON.tmLanguage.json'

let wireGrammarsPromise: Promise<void>

const wireGrammars = async (monaco: Monaco, editor: MonacoEditor) => {
  const registry = new Registry({
    getGrammarDefinition: async (scopeName) => {
      switch (scopeName) {
        case ('source.js'): {
          return {
            format: 'json',
            content: jsxTextmateLanguage,
          }
        }
        case ('source.ts'): {
          return {
            format: 'json',
            content: tsxTextmateLanguage,
          }
        }
        case ('source.css'): {
          return {
            format: 'json',
            content: cssTextmateLanguage,
          }
        }
        case ('source.scss'): {
          return {
            format: 'json',
            content: scssTextmateLanguage,
          }
        }
        case ('source.sassdoc'): {
          return {
            format: 'json',
            content: sassdocTextmateLanguage,
          }
        }
        case ('text.html.basic'): {
          return {
            format: 'json',
            content: htmlTextmateLanguage,
          }
        }
        case ('source.json'): {
          return {
            format: 'json',
            content: jsonTextmateLanguage,
          }
        }
        default: {
          return null
        }
      }
    },
  })

  // NOTE(johnny): Map of monaco "language id's" to TextMate scopeNames
  const grammars = new Map()
  grammars.set('javascript', 'source.js')
  grammars.set('typescript', 'source.ts')
  grammars.set('css', 'source.css')
  grammars.set('scss', 'source.scss')
  grammars.set('html', 'text.html.basic')
  grammars.set('json', 'source.json')

  await wireTmGrammars(monaco, registry, grammars, editor)
}

const maybeWireGrammars = async (monaco: Monaco, editor: MonacoEditor) => {
  if (!wireGrammarsPromise) {
    wireGrammarsPromise = wireGrammars(monaco, editor)
  }
  await wireGrammarsPromise
}

export {
  maybeWireGrammars,
}
