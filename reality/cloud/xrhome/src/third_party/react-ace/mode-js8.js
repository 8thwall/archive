import ace from 'ace-builds/src-min-noconflict/ace'

const createTypedWorker = (classname, WorkerClient) => (
  (session) => {
    // classname is used here to provide a hint to the worker about the filetype, since the
    // ace session doesn't know or communicate the filename.
    const worker = new WorkerClient(['ace'], 'ace/mode/javascript_worker', classname)
    worker.attachToDocument(session.getDocument())

    worker.on('annotate', (results) => {
      session.setAnnotations(results.data)
    })

    worker.on('terminate', () => {
      session.clearAnnotations()
    })

    return worker
  }
)

// See https://github.com/ajaxorg/ace/blob/master/lib/ace/mode/typescript.js
ace.define(
  'ace/mode/typescript8',
  [
    'require',
    'exports',
    'ace/lib/oop',
    'ace/mode/javascript',
    'ace/mode/typescript_highlight_rules',
    'ace/mode/behaviour/cstyle',
    'ace/mode/folding/cstyle',
    'ace/mode/matching_brace_outdent',
    'ace/worker/worker_client',
  ],
  (require2, exports) => {
    const oop = require2('ace/lib/oop')
    const jsMode = require2('ace/mode/javascript').Mode
    const {TypeScriptHighlightRules} = require2('ace/mode/typescript_highlight_rules')
    const {CstyleBehaviour} = require2('ace/mode/behaviour/cstyle')
    const CStyleFoldMode = require2('ace/mode/folding/cstyle').FoldMode
    const {MatchingBraceOutdent} = require2('ace/mode/matching_brace_outdent')
    const {WorkerClient} = require2('ace/worker/worker_client')
    const Mode = function () {
      this.HighlightRules = TypeScriptHighlightRules
      this.$outdent = new MatchingBraceOutdent()
      this.$behaviour = new CstyleBehaviour()
      this.foldingRules = new CStyleFoldMode()
    }
    oop.inherits(Mode, jsMode);

    (function () {
      this.createWorker = createTypedWorker('TypeScriptWorker', WorkerClient)
      this.$id = 'ace/mode/typescript8'
    }).call(Mode.prototype)
    exports.Mode = Mode
  }
)

// See https://github.com/ajaxorg/ace/blob/master/lib/ace/mode/tsx.js
ace.define(
  'ace/mode/tsx8',
  [
    'require',
    'exports',
    'ace/lib/oop',
    'ace/mode/typescript8',
    'ace/worker/worker_client',
  ],
  (require2, exports) => {
    const oop = require2('ace/lib/oop')
    const tsMode = require2('ace/mode/typescript8').Mode
    const {WorkerClient} = require2('ace/worker/worker_client')
    const Mode = function () {
      tsMode.call(this)
      this.$highlightRuleConfig = {jsx: true}
    }
    oop.inherits(Mode, tsMode);

    (function () {
      this.createWorker = createTypedWorker('TsxWorker', WorkerClient)
      this.$id = 'ace/mode/tsx8'
    }).call(Mode.prototype)
    exports.Mode = Mode
  }
)

// See https://github.com/ajaxorg/ace/blob/master/lib/ace/mode/jsx.js
ace.define(
  'ace/mode/jsx8',
  [
    'require',
    'exports',
    'ace/lib/oop',
    'ace/mode/text',
    'ace/mode/jsx_highlight_rules',
    'ace/mode/behaviour/cstyle',
    'ace/mode/folding/cstyle',
    'ace/mode/matching_brace_outdent',
    'ace/worker/worker_client',
  ],
  (require2, exports) => {
    const oop = require2('ace/lib/oop')
    const TextMode = require2('ace/mode/text').Mode
    const {JsxHighlightRules} = require2('ace/mode/jsx_highlight_rules')
    const {CstyleBehaviour} = require2('ace/mode/behaviour/cstyle')
    const CStyleFoldMode = require2('ace/mode/folding/cstyle').FoldMode
    const {MatchingBraceOutdent} = require2('ace/mode/matching_brace_outdent')
    const {WorkerClient} = require2('ace/worker/worker_client')
    const Mode = function () {
      this.HighlightRules = JsxHighlightRules
      this.$outdent = new MatchingBraceOutdent()
      this.$behaviour = new CstyleBehaviour()
      this.foldingRules = new CStyleFoldMode()
    }
    oop.inherits(Mode, TextMode);

    (function () {
      this.lineCommentStart = '//'
      this.blockComment = {start: '/*', end: '*/'}

      this.getNextLineIndent = function (state, line, tab) {
        let indent = this.$getIndent(line)

        const tokenizedLine = this.getTokenizer().getLineTokens(line, state)
        const {tokens} = tokenizedLine

        if (tokens.length && tokens[tokens.length - 1].type === 'comment') {
          return indent
        }

        if (state === 'start') {
          const match = line.match(/^.*[{([]\s*$/)
          if (match) {
            indent += tab
          }
        }

        return indent
      }

      this.checkOutdent = function (state, line, input) {
        return this.$outdent.checkOutdent(line, input)
      }

      this.autoOutdent = function (state, doc, row) {
        this.$outdent.autoOutdent(doc, row)
      }

      this.createWorker = createTypedWorker('JsxWorker', WorkerClient)
      this.$id = 'ace/mode/jsx8'
    }).call(Mode.prototype)
    exports.Mode = Mode
  }
)
