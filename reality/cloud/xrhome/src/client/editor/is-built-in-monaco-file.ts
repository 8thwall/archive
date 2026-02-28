import {ALL_DEFINITION_MODALS} from '../common/editor-files'

const DEFINITION_MODALS_WITHOUT_SLASH = ALL_DEFINITION_MODALS.map(modal => modal.slice(1))

const isBuiltInMonacoFile = (filePath: string) => DEFINITION_MODALS_WITHOUT_SLASH.includes(filePath)

export {
  isBuiltInMonacoFile,
}
