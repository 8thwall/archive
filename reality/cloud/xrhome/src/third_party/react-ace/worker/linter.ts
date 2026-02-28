import {Linter} from 'eslint/lib/linter'
import * as prettier from 'prettier/standalone'
import * as parserHtml from 'prettier/parser-html'
import * as parserCss from 'prettier/parser-postcss'
import * as parserMarkdown from 'prettier/parser-markdown'
import * as parserBabel from 'prettier/parser-babel'

import jsx_wrap_multilines from 'eslint-plugin-react/lib/rules/jsx-wrap-multilines'
import jsx_indent from 'eslint-plugin-react/lib/rules/jsx-indent'
import jsx_filename_extention from 'eslint-plugin-react/lib/rules/jsx-filename-extension'

import * as parser from 'babel-eslint/lib/parse'

import * as inlineCommentSpacing from '../../../shared/rules/inline-comment-spacing'

import {getRules} from './rules'
import {isJsPath} from '../../../client/common/editor-files'
import {fileExt} from '../../../client/editor/editor-common'

const LINT_SHORTCUT = navigator?.platform?.includes('Mac')
  ? 'OPTION-SHIFT-F'
  : 'ALT-SHIFT-F'

// mapping eslint marker severity to monaco using
// https://microsoft.github.io/monaco-editor/api/enums/monaco.MarkerSeverity.html
const MONACO_ERROR_MAP = {
  0: 2,
  1: 4,
  2: 8,
}

const linter = new Linter()
linter.defineRule('react/jsx-wrap-multilines', jsx_wrap_multilines)
linter.defineRule('react/jsx-indent', jsx_indent)
linter.defineRule('react/jsx-filename-extension', jsx_filename_extention)
linter.defineRule('local-rules/inline-comment-spacing', inlineCommentSpacing)
const parser_ = {
  parse: parser.default,
}
linter.defineParser('current-babel-eslint', parser_)

const rewrites = [
  (msg) => {
    const match =
      msg.match(/Method '(.*)' has too many statements \((.*)\). Maximum allowed is (.*)\./)
    return match ? `Method length '${match[1]}' exceeds ${match[3]} statements.` : msg
  },
  (msg) => {
    const match = msg.match(
      /^Function '[^']+' has too many statements \(.*\)\. Maximum allowed is (.*)\.$/
    )
    return match ? `Function exceeds ${match[1]} statements.` : msg
  },
  (msg) => {
    const match = msg.match(
      /^Arrow function has too many statements \(.*\)\. Maximum allowed is (.*)\.$/
    )
    return match ? `Function exceeds ${match[1]} statements.` : msg
  },
  (msg) => {
    const match = msg.match(/File has too many lines \((.*)\). Maximum allowed is (.*)\./)
    return match ? `File length exceeds ${match[2]} lines.` : msg
  },
  (msg) => {
    const match = msg.match(/This line has a length of (.*). Maximum allowed is (.*)\./)
    return match ? `Line length exceeds ${match[2]} characters.` : msg
  },
  msg => (msg === 'Trailing spaces not allowed.' ? 'Line has trailing spaces.' : msg),
]

const convertErrorMessagesAce = (errs) => {
  if (errs === undefined) {
    return []
  }
  const errors = []
  const fixableRows = new Set()

  errs.forEach((element) => {
    const row = element.line - 1
    errors.push({
      row,
      column: element.column - 1,
      text: rewrites.reduce((msg, rewrite) => rewrite(msg), element.message),
      type: (element.severity <= 1 || element.fix) ? 'warning' : 'error',
      raw: element.ruleId,
    })

    if (element.fix) {
      fixableRows.add(row)
    }
  })

  Array.from(fixableRows).forEach((row) => {
    errors.push({
      row,
      column: 0,
      text: `\nFORMAT FILE TO FIX [CLICK THIS ICON OR ${LINT_SHORTCUT}]`,
    })
  })

  return errors
}

const lintAce = (text, filename) => {
  const errs = linter.verify(text, getRules(filename), {filename})
  return convertErrorMessagesAce(errs)
}

const formatWithPrettier = (text: string, filename: string) => {
  try {
    const ext = fileExt(filename)
    const formattedText = prettier.format(text, {
      parser: ext === 'md' ? 'markdown' : ext,
      plugins: [parserHtml, parserCss, parserMarkdown, parserBabel],
      singleQuote: true,
      bracketSameLine: true,
      printWidth: 100,
    })
    return ({
      fixed: text !== formattedText,
      output: formattedText,
    })
  } catch {
    // Failed to format file
    return ({
      fixed: false,
      output: text,
    })
  }
}

const lintFix = (text, filename) => {
  const {fixed, output} = isJsPath(filename)
    ? linter.verifyAndFix(text, getRules(filename), {filename}) : formatWithPrettier(text, filename)
  return {fixed, output}
}

const lintMonaco = (text, filename) => {
  const errs = linter.verify(text, getRules(filename), {filename})
  return errs.map(err => ({
    startLineNumber: err.line,
    endLineNumber: err.line,
    startColumn: err.column,
    endColumn: err.column,
    message: `${err.message} (${err.ruleId})`,
    severity: MONACO_ERROR_MAP[err.severity],
    source: 'ESLint',
  }))
}

export {
  lintAce,
  lintFix,
  lintMonaco,
}
