import type {Monaco} from '../../../third_party/react-monaco/src/types'
import {LINTABLE_FILES} from '../../common/editor-files'
import {fileExtToMonacoLanguage} from '../editor-common'
import {EditorFileLocation, deriveLocationFromKey} from '../editor-file-location'

let wiredFormatter = false

// NOTE(johnny): We can add a more robust format on paste here if we want it. Look at
// the registerDocumentRangeFormattingEditProvider api for implementation details.
const wireLanguages = (monaco: Monaco, onFormat: (fileLocation: EditorFileLocation) => void) => {
  LINTABLE_FILES.forEach((ext) => {
    const language = fileExtToMonacoLanguage(ext)
    monaco.languages.registerDocumentFormattingEditProvider(language, {
      async provideDocumentFormattingEdits(model) {
        onFormat(deriveLocationFromKey(model.uri.path))
        return null
      },
    })
  })
}

// TODO(johnny): Add `Format Document` commands for css and scss files.
const maybeWireFormatter = (
  monaco: Monaco, onFormat: (fileLocation: EditorFileLocation) => void
) => {
  if (wiredFormatter) {
    return
  }
  wiredFormatter = true
  monaco.languages.html.htmlDefaults.setModeConfiguration({
    ...monaco.languages.html.htmlDefaults.modeConfiguration,
    documentFormattingEdits: false,
  })
  monaco.languages.json.jsonDefaults.setModeConfiguration({
    ...monaco.languages.json.jsonDefaults.modeConfiguration,
    documentFormattingEdits: false,
  })

  wireLanguages(monaco, onFormat)
}

export {maybeWireFormatter}
