/* eslint-disable */

Object.defineProperty(exports, '__esModule', {value: true})
exports.wireTmGrammars = void 0
const monaco_textmate_1 = require('monaco-textmate')

const tm_to_monaco_token_1 = require('./tm-to-monaco-token')

// NOTE(johnny): The allowed length of the line before we disable the tokenizer for the line.
// The tokenizer can handle > 1024 length but it starts to slow down at around at this point.
// The tokenizer kills the page if it tries to tokenize a really long line (~5000 characters).
// The base tokenizer can handle this case. Maybe swap back to that one in the future for this case?
// Breaks syntax highlighting and intellisense.
const MAX_TOKENIZE_LINE_SIZE = 1024

class TokenizerState {
  _ruleStack;

  constructor(_ruleStack) {
    this._ruleStack = _ruleStack
  }

  get ruleStack() {
    return this._ruleStack
  }

  clone() {
    return new TokenizerState(this._ruleStack)
  }

  equals(other) {
    if (!other ||
            !(other instanceof TokenizerState) ||
            other !== this ||
            other._ruleStack !== this._ruleStack) {
      return false
    }
    return true
  }
}
/**
 * Wires up monaco-editor with monaco-textmate
 *
 * @param monaco monaco namespace this operation should apply to (usually the `monaco` global unless you have some other setup)
 * @param registry TmGrammar `Registry` this wiring should rely on to provide the grammars
 * @param languages `Map` of language ids (string) to TM names (string)
 */
function wireTmGrammars(monaco, registry, languages, editor) {
  return Promise.all(Array.from(languages.keys())
    .map(async (languageId) => {
      const grammar = await registry.loadGrammar(languages.get(languageId))
      monaco.languages.setTokensProvider(languageId, {
        getInitialState: () => new TokenizerState(monaco_textmate_1.INITIAL),
        tokenize: (line, state) => {
          const lineToTokenize = line.length > MAX_TOKENIZE_LINE_SIZE ? '' : line
          const res = grammar.tokenizeLine(lineToTokenize, state.ruleStack)
          return {
            endState: new TokenizerState(res.ruleStack),
            tokens: res.tokens.map(token => ({
              ...token,
              // TODO: At the moment, monaco-editor doesn't seem to accept array of scopes
              scopes: editor ? (0, tm_to_monaco_token_1.TMToMonacoToken)(editor, token.scopes) : token.scopes[token.scopes.length - 1],
            })),
          }
        },
      })
    }))
}
exports.wireTmGrammars = wireTmGrammars
// # sourceMappingURL=index.js.map
