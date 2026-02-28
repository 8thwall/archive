import ace from 'ace-builds/src-min-noconflict/ace'

const RE_ORIGINAL = />>>> ORIGINAL .*$/
const RE_THEIRS = /==== THEIRS .*$/
const RE_YOURS = /==== YOURS .*$/
const RE_END = /<<<<$/

// This regex matches any of the markers.
const RE_MARKERS = /(>>>> ORIGINAL|==== (THEIRS|YOURS)) .*$|<<<<$/

// NOTE(pawel) when updating this mode, the corresponding file to keep in sync is
// //src/client/editor/editor-common.ts

const modeToHighlightRuleExportName = mode => ({
  'javascript': 'JavaScriptHighlightRules',
  'javascript-merge': 'JavaScriptMergeHighlightRules',
  'text': 'TextHighlightRules',
  'text-merge': 'TextMergeHighlightRules',
})[mode] || mode

// Here we specify where to look for the merge markers
const additionalRules = {
  'javascript': ($rules) => {
    $rules.no_regex.unshift({
      token: 'merge',
      regex: RE_MARKERS,
    })

    $rules['string.quasi.start'].unshift({
      token: 'merge',
      regex: RE_MARKERS,
      next: 'string.quasi.start',
    })

    $rules.comment.unshift({
      token: 'merge',
      regex: RE_MARKERS,
    })
  },
  'text': ($rules) => {
    $rules.start.unshift({
      token: 'merge',
      regex: RE_MARKERS,
    })
  },
}

const addMergeConflictMarkerRules = (oldModeName) => {
  const newModeName = `${oldModeName}-merge`
  const oldHighlightRuleName = `ace/mode/${oldModeName}_highlight_rules`
  const newHighlightRuleName = `ace/mode/${newModeName}_highlight_rules`

  ace.define(newHighlightRuleName, ['require', 'exports', 'ace/lib/oop', oldHighlightRuleName], (require2, exports) => {
    const oop = require2('ace/lib/oop')
    const OldHighlightRules = require2(oldHighlightRuleName)[modeToHighlightRuleExportName(oldModeName)]

    const OverrideHighlightRules = function () {
      this.$rules = new OldHighlightRules().getRules()
      // Here we specify the merge type regex
      this.$rules.merge_type = [
        {
          token: 'merge.original',
          regex: RE_ORIGINAL,
        },
        {
          token: 'merge.theirs',
          regex: RE_THEIRS,
        },
        {
          token: 'merge.yours',
          regex: RE_YOURS,
        },
        {
          token: 'merge.end',
          regex: RE_END,
        },
      ]
      // NOTE specify an additional rule to use these tokens in the right place
      additionalRules[oldModeName](this.$rules)
    }

    oop.inherits(OverrideHighlightRules, OldHighlightRules)
    exports[modeToHighlightRuleExportName(newModeName)] = OverrideHighlightRules
  })

  ace.define(`ace/mode/${newModeName}`, [
    'require', 'exports', 'ace/lib/oop',
    'ace/mode/matching_brace_outdent', `/ace/mode/${oldModeName}`, newHighlightRuleName,
  ], (require2, exports) => {
    const oop = require2('ace/lib/oop')
    const OldMode = require2(`ace/mode/${oldModeName}`).Mode
    const Outdent = require2('ace/mode/matching_brace_outdent').MatchingBraceOutdent
    const OverrideHighlightRules = require2(newHighlightRuleName)[modeToHighlightRuleExportName(newModeName)]

    const Mode = function () {
      this.HighlightRules = OverrideHighlightRules
      this.$outdent = new Outdent()
    }

    oop.inherits(Mode, OldMode)
    exports.Mode = Mode
  })
}

addMergeConflictMarkerRules('javascript')
addMergeConflictMarkerRules('text')
