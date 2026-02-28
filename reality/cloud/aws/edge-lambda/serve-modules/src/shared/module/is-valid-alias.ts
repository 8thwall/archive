import {MAX_MODULE_ALIAS_LENGTH, MODULE_ALIAS_PATTERN} from './module-constants'

const isValidAlias = (s: string): boolean => (
  typeof s === 'string' && s.length <= MAX_MODULE_ALIAS_LENGTH) && (MODULE_ALIAS_PATTERN.test(s)
)

export {isValidAlias}
