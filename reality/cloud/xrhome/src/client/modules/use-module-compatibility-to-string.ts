import {useTranslation} from 'react-i18next'

import type {ModuleCompatibility} from '../../shared/module-compatibility'

const useModuleCompatibilityToString = (): Record<ModuleCompatibility, string> => {
  const {t} = useTranslation(['module-pages'])
  return {
    'UNSET': t('module_compatibility.cloud_editor_only'),
    'ANY': t('module_compatibility.any'),
    'CLOUD_EDITOR_ONLY': t('module_compatibility.cloud_editor_only'),
    'SELF_ONLY': t('module_compatibility.self_only'),
    'CLOUD_STUDIO_ONLY': t('module_compatibility.cloud_studio_only'),
    'EDITOR_SELF': t('module_compatibility.non_studio'),
    'SELF_STUDIO': t('module_compatibility.self_studio'),
    'EDITOR_STUDIO': t('module_compatibility.editor_studio'),
  }
}

export {
  useModuleCompatibilityToString,
}
