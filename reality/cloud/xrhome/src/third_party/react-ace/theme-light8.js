import ace from 'ace-builds/src-min-noconflict/ace'

import editorError from '../../client/static/icons/editor-error.svg'
import editorWarning from '../../client/static/icons/editor-warning.svg'

ace.define('ace/theme/light8', ['require', 'exports', 'module', 'ace/lib/dom'], (require2, exports, module) => {
  const isDark = false
  const cssClass = 'ace-light8'
  const cssText = `.ace-light8 .ace_gutter {\
background: #f6f6f6;\
color: #4D4D4C\
}\
.ace-light8 .ace_print-margin {\
width: 1px;\
background: #f6f6f6\
}\
.ace-light8 {\
background-color: #FFFFFF;\
color: #4D4D4C\
}\
.ace-light8 .ace_cursor {\
color: #AEAFAD\
}\
.ace-light8 .ace_marker-layer .ace_selection {\
background: #D6D6D6\
}\
.ace-light8.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #FFFFFF;\
}\
.ace-light8 .ace_marker-layer .ace_step {\
background: rgb(255, 255, 0)\
}\
.ace-light8 .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #D1D1D1\
}\
.ace-light8 .ace_marker-layer .ace_active-line {\
background: #EFEFEF\
}\
.ace-light8 .ace_gutter-layer .ace_error,\
.ace-light8 .ace_gutter-layer .ace_warning {\
background-size: auto 80%;\
background-position: left 4px center;\
background-repeat: no-repeat;\
}\
.ace-light8 .ace_gutter-layer .ace_error {\
background-image: url(${editorError});\
}\
.ace-light8 .ace_gutter-layer .ace_warning {\
background-image: url(${editorWarning});\
}\
.ace-light8 .ace_gutter-active-line {\
background-color : #dcdcdc\
}\
.ace-light8 .ace_marker-layer .ace_selected-word {\
border: 1px solid #D6D6D6\
}\
.ace-light8 .ace_invisible {\
color: #D1D1D1\
}\
.ace-light8 .ace_keyword,\
.ace-light8 .ace_meta,\
.ace-light8 .ace_storage,\
.ace-light8 .ace_storage.ace_type,\
.ace-light8 .ace_support.ace_type {\
color: #8959A8\
}\
.ace-light8 .ace_keyword.ace_operator {\
color: #3E999F\
}\
.ace-light8 .ace_constant.ace_character,\
.ace-light8 .ace_constant.ace_language,\
.ace-light8 .ace_constant.ace_numeric,\
.ace-light8 .ace_keyword.ace_other.ace_unit,\
.ace-light8 .ace_support.ace_constant,\
.ace-light8 .ace_variable.ace_parameter {\
color: #F5871F\
}\
.ace-light8 .ace_constant.ace_other {\
color: #666969\
}\
.ace-light8 .ace_invalid {\
color: #FFFFFF;\
background-color: #C82829\
}\
.ace-light8 .ace_invalid.ace_deprecated {\
color: #FFFFFF;\
background-color: #8959A8\
}\
.ace-light8 .ace_fold {\
background-color: #4271AE;\
border-color: #4D4D4C\
}\
.ace-light8 .ace_entity.ace_name.ace_function,\
.ace-light8 .ace_support.ace_function,\
.ace-light8 .ace_variable {\
color: #4271AE\
}\
.ace-light8 .ace_support.ace_class,\
.ace-light8 .ace_support.ace_type {\
color: #C99E00\
}\
.ace-light8 .ace_heading,\
.ace-light8 .ace_markup.ace_heading,\
.ace-light8 .ace_string {\
color: #718C00\
}\
.ace-light8 .ace_entity.ace_name.ace_tag,\
.ace-light8 .ace_entity.ace_other.ace_attribute-name,\
.ace-light8 .ace_meta.ace_tag,\
.ace-light8 .ace_string.ace_regexp,\
.ace-light8 .ace_variable {\
color: #C82829\
}\
.ace-light8 .ace_comment {\
color: #8E908C\
}\
.ace-light8 .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bdu3f/BwAlfgctduB85QAAAABJRU5ErkJggg==) right repeat-y\
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
  ace.require(['ace/theme/light8'], (m) => {
    if (typeof ace.module === 'object' && typeof ace.exports === 'object' && ace.module) {
      ace.module.exports = m
    }
  })
})())
