import * as React from 'react'

import {createUseStyles} from 'react-jss'

import {StandardModal} from '../standard-modal'
import {StandardModalActions} from '../standard-modal-actions'
import {StandardModalHeader} from '../standard-modal-header'
import {BasicModalContent} from '../basic-modal-content'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {MODULE_NAME_PATTERN} from '../../../shared/module/module-constants'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {useDependencyContext} from '../dependency-context'

const useStyles = createUseStyles({
  centerText: {
    textAlign: 'center',
  },
})

const FORMAT_ERROR_TEXT = 'A module alias must be at least 4 characters long ' +
'and cannot contain any spaces, uppercase letters, or special characters.'

const DUPLICATE_ERROR_TEXT = 'A module alias must not be a duplicate of any existing module ' +
'aliases in project'

interface IChangeModuleAliasModal {
  onAliasResolution: (newAlias: string) => Promise<void>
  existingAlias: string
  loading?: boolean
}

const ChangeModuleAliasModal: React.FC<IChangeModuleAliasModal> = ({
  onAliasResolution, existingAlias, loading,
}) => {
  const classes = useStyles()
  const dependencyContext = useDependencyContext()

  const [didBlurAlias, setDidBlurAlias] = React.useState(false)
  const [moduleAlias, setModuleAlias] = React.useState('')

  const moduleAliasFormatError = !MODULE_NAME_PATTERN.test(moduleAlias)
  const aliasConflictError = !!dependencyContext.aliasToPath[moduleAlias]

  const getModuleErrorText = () => {
    if (didBlurAlias) {
      if (moduleAliasFormatError) {
        return FORMAT_ERROR_TEXT
      } else if (aliasConflictError) {
        return DUPLICATE_ERROR_TEXT
      }
    }
    return ''
  }

  return (
    <StandardModal
      size='small'
      closeOnDimmerClick={false}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onAliasResolution(moduleAlias)
        }}
      >
        <StandardModalHeader><h2>Change Module Alias</h2></StandardModalHeader>
        <BasicModalContent>
          <p className={classes.centerText}>
            There is already a module with alias (<b>{existingAlias}</b>) in this project.
            Please change it before import and click to confirm.
          </p>
          <StandardTextField
            id='module-alias-input'
            required
            label={null}
            aria-label='Change Module Alias'
            placeholder='Enter new name'
            errorMessage={getModuleErrorText()}
            onChange={e => setModuleAlias(e.target.value)}
            onFocus={() => setDidBlurAlias(false)}
            onBlur={() => setDidBlurAlias(true)}
            value={moduleAlias}
            disabled={loading}
          />
        </BasicModalContent>
        <StandardModalActions>
          <TertiaryButton
            disabled={moduleAliasFormatError || aliasConflictError}
            loading={loading}
            type='submit'
          >
            Confirm &amp; Import
          </TertiaryButton>
        </StandardModalActions>
      </form>
    </StandardModal>
  )
}

export default ChangeModuleAliasModal
