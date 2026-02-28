import ace from 'ace-builds/src-min-noconflict/ace'

import editorError from '../../client/static/icons/editor-error.svg'
import editorWarning from '../../client/static/icons/editor-warning.svg'

ace.define('ace/theme/dark8', ['require', 'exports', 'module', 'ace/lib/dom'], (require2, exports, module) => {
/*
Cheat sheet:

8W Highlight #AD50FF
Disabled Gray #9D9D9D
Dusty Violet #D9D0E3
8W White #FFFFF
Eggshell #F2F1F3
Moonlight #F9F9FA
Gray No. 1 #EBEBF1
Gray No. 2 #D5D7E4
Gray No. 3 #B5B8D0
Gray No. 4 #8083A2
Gray No. 5 #464766
8W Black #2D2E43
Dark blue #1C1D2A
Almost black #101118
Mango #FFC828
Go green #4CD964
Warn orange #FF9500
Danger red #D0021B
*/

  // Dark black for gutter
  const almostBlack = '#101118'

  // For editor background
  const darkBlue = '#1C1D2A'

  // True white for text
  const trueWhite = '#FFFFFF'
  const almostTrueWhite = '#FFFFFD'

  // For gutter text
  const gray2 = '#D5D7E4'

  // Current line
  const brandBlack = '#2D2E43'

  // For comments
  const disabledGray = '#9D9D9D'

  // For highlighted text
  const highlightGray = 'rgba(95, 99, 145, 0.8)'
  const mutedHighlightGray = 'rgba(95, 99, 145, 0.4)'

  // Red for reserved words and operators
  const editorRed = '#FF3B30'

  // For numbers, characters
  const editorPurple = '#AD50FF'
  const editorOrange = '#FF9500'

  // Green for system variables
  const editorGreen = '#4CD964'
  const editorYellow = '#FFC828'
  const editorBlue = '#59C8FA'

  // These are original monokai colors, update them to theme
  const stepColor = '#665200'
  const invisibleColor = '#52524d'

  // syntax highlighting text color for merge conflict markers
  const conflictMarkerSyntaxHighlight = '#00eda2'

  // For scrollbar
  const scrollbar = 'rgba(100, 100, 100, 0.8)'
  const hoveredScrollbar = 'rgba(128, 135, 139, 0.8)'

  const isDark = true
  const cssClass = 'ace-dark8'
  const cssText = `.ace-dark8 .ace_gutter {
background: ${almostBlack};
color: ${gray2}
}
.ace-dark8 .ace_print-margin {
width: 1px;
background: ${brandBlack}
}
.ace-dark8 {
background-color: ${darkBlue};
color: ${trueWhite}
}
.ace-dark8 .ace_cursor {
color: ${almostTrueWhite}
}
.ace-dark8 .ace_marker-layer .ace_selection {
background: ${highlightGray}
}
.ace-dark8.ace_multiselect .ace_selection.ace_start {
box-shadow: 0 0 3px 0px ${darkBlue};
}
.ace-dark8 .ace_marker-layer .ace_step {
background: ${stepColor}
}
.ace-dark8 .ace_marker-layer .ace_bracket {
margin: -1px 0 0 -1px;
border: 1px solid ${disabledGray}
}
.ace-dark8 .ace_marker-layer .ace_active-line {
background: ${brandBlack}
}
.ace-dark8 .ace_gutter-layer .ace_error,
.ace-dark8 .ace_gutter-layer .ace_warning {
background-size: auto 80%;
background-position: left 4px center;
background-repeat: no-repeat;
}
.ace-dark8 .ace_gutter-layer .ace_error {
background-image: url(${editorError});
}
.ace-dark8 .ace_gutter-layer .ace_warning {
background-image: url(${editorWarning});
}
.ace-dark8 .ace_gutter-active-line {
background-color: ${darkBlue}
}
.ace-dark8 .ace_marker-layer .ace_selected-word {
background: ${mutedHighlightGray}
}
.ace-dark8 .ace_invisible {
color: ${invisibleColor}
}
.ace-dark8 .ace_entity.ace_name.ace_tag,
.ace-dark8 .ace_keyword,
.ace-dark8 .ace_meta.ace_tag,
.ace-dark8 .ace_storage {
color: ${editorRed}
}
.ace-dark8 .ace_punctuation,
.ace-dark8 .ace_punctuation.ace_tag {
color: ${trueWhite}
}
.ace-dark8 .ace_constant.ace_character,
.ace-dark8 .ace_constant.ace_language,
.ace-dark8 .ace_constant.ace_numeric,
.ace-dark8 .ace_constant.ace_other {
color: ${editorPurple}
}
.ace-dark8 .ace_invalid {
color: ${almostTrueWhite};
background-color: ${editorRed}
}
.ace-dark8 .ace_invalid.ace_deprecated {
color: ${almostTrueWhite};
background-color: ${editorPurple}
}
.ace-dark8 .ace_support.ace_constant,
.ace-dark8 .ace_support.ace_function {
color: ${editorBlue}
}
.ace-dark8 .ace_fold {
background-color: ${editorGreen};
border-color: ${trueWhite}
}
.ace-dark8 .ace_storage.ace_type,
.ace-dark8 .ace_support.ace_class,
.ace-dark8 .ace_support.ace_type {
font-style: italic;
color: ${editorBlue}
}
.ace-dark8 .ace_entity.ace_name.ace_function,
.ace-dark8 .ace_entity.ace_other,
.ace-dark8 .ace_entity.ace_other.ace_attribute-name,
.ace-dark8 .ace_variable {
color: ${editorGreen}
}
.ace-dark8 .ace_variable.ace_parameter {
font-style: italic;
color: ${editorOrange}
}
.ace-dark8 .ace_string {
color: ${editorYellow}
}
.ace-dark8 .ace_comment {
color: ${disabledGray}
}
.ace-dark8 .ace_merge {
color: ${conflictMarkerSyntaxHighlight}
}
.ace-dark8 .ace_indent-guide {
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y
}
.ace-dark8 .ace_scrollbar-v::-webkit-scrollbar-thumb {
background: ${scrollbar}
}
.ace-dark8 .ace_scrollbar-v::-webkit-scrollbar-thumb:hover {
background: ${hoveredScrollbar}
}`

  /**
 * Fusebox will incorrectly replace the following function if we use `require` as the name.
 * This has been changed to `require2` as a workaround.
 */
  const dom = require2('../lib/dom')
  dom.importCssString(cssText, cssClass)

  module.exports = {
    isDark,
    cssClass,
    cssText,
  }
})
;((() => {
  ace.require(['ace/theme/dark8'], (m) => {
    if (typeof ace.module === 'object' && typeof ace.exports === 'object' && ace.module) {
      ace.module.exports = m
    }
  })
})())
