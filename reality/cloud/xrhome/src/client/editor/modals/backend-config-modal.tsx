import * as React from 'react'
import uuid from 'uuid/v4'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {getTitleError, getFileNameError} from '@nia/reality/shared/gateway/validate-function-config'

import {
  MAX_IDENTIFIER_LENGTH, MAX_BACKEND_NAME_LENGTH, MAX_DESCRIPTION_LENGTH,
} from '@nia/reality/shared/gateway/limits'

import {StandardModal} from '../standard-modal'
import {StandardModalActions} from '../standard-modal-actions'
import {StandardModalHeader} from '../standard-modal-header'
import {BasicModalContent} from '../basic-modal-content'
import {LinkButton} from '../../ui/components/link-button'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import {useDismissibleModal} from '../dismissible-modal-context'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {
  BACKEND_FOLDER_PREFIX, BACKEND_FILE_EXT,
} from '../../common/editor-files'
import useActions from '../../common/use-actions'
import coreGitActions from '../../git/core-git-actions'
import {StandardTextAreaField} from '../../ui/components/standard-text-area-field'
import {
  EditorFileLocation, extractFilePath, extractRepoId, stripPrimaryRepoId,
} from '../editor-file-location'
import {extractBackendFilename} from '../backend-config/backend-config-files'
import type {IGitFile} from '../../git/g8-dto'
import type {
  FunctionDefinition, GatewayDefinition, ProxyDefinition,
} from '../../../shared/gateway/gateway-types'
import {useScopedGit} from '../../git/hooks/use-current-git'
import {useCurrentRepoId} from '../../git/repo-id-context'

import {StandardRadioButton, StandardRadioGroup} from '../../ui/components/standard-radio-group'

const useStyles = createUseStyles({
  row: {
    display: 'flex',
    gap: '2rem',
  },
  modalContentContainer: {
    display: 'block',
    width: '100%',
    lineHeight: '2rem',
  },
  radioDescriptionHeader: {
    color: '#797c8f',
    fontStyle: 'italic',
  },
  starredFieldContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  starredField: {
    '&::after': {
      content: '"*"',
      color: 'red',
      marginLeft: '4px',
    },
  },
})

const deriveNameFromTitle = (backendTitle: string) => backendTitle.toLowerCase()
  .replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')

interface IBackendConfigModal {
  onClose: (filePath?: EditorFileLocation) => void
  location: EditorFileLocation
}

const BackendConfigModal: React.FC<IBackendConfigModal> = ({onClose, location}) => {
  const classes = useStyles()
  useDismissibleModal(onClose)

  const path = extractFilePath(location)
  const repoId = extractRepoId(location)

  const {mutateFile} = useActions(coreGitActions)
  const currentRepoId = useCurrentRepoId()
  const fileRepoId = repoId || currentRepoId
  const git = useScopedGit(fileRepoId)
  const {t} = useTranslation(['cloud-editor-pages', 'common'])

  const activeFile = path && git.filesByPath[path]
  const backendConfig: GatewayDefinition = activeFile ? JSON.parse(activeFile.content) : null

  const isEdit = !!path

  const [backendProxyName, setBackendProxyName] = React.useState(extractBackendFilename(path))
  const [isNameChanged, setIsNameChanged] = React.useState(isEdit)
  const [newTitle, setNewTitle] = React.useState(backendConfig?.title || '')
  const [newDescription, setNewDescription] = React.useState(backendConfig?.description || '')
  const [didBlurName, setDidBlurName] = React.useState(false)
  const [didBlurTitle, setDidBlurTitle] = React.useState(false)
  const [backendType, setBackendType] = React.useState('function')

  const visibleName = isNameChanged ? backendProxyName : deriveNameFromTitle(newTitle)

  const fileNameError = getFileNameError(visibleName)
  const titleError = getTitleError(newTitle)

  const titleLabelText = t('editor_page.backend_proxy_modal.title')
  const fileNameLabelText = t('editor_page.backend_proxy_modal.name')
  const titleBackendTypeText = t('editor_page.backend_proxy_modal.backend_type')
  const titleBackendFunctionOption = t('editor_page.backend_proxy_modal.backend_function_option')
  const titleBackendProxyOption = t('editor_page.backend_proxy_modal.backend_proxy_option')

  const filenameErrorText = didBlurName &&
    t(fileNameError, {fieldName: fileNameLabelText, maxLength: MAX_BACKEND_NAME_LENGTH})

  const titleErrorText = didBlurTitle &&
    t(titleError, {fieldName: titleLabelText, maxLength: MAX_IDENTIFIER_LENGTH})

  const headerText = isEdit
    ? t('editor_page.backend_proxy_modal.edit_backend')
    : t('editor_page.backend_proxy_modal.new_backend')

  const submitText = isEdit
    ? t('button.save', {ns: 'common'})
    : t('button.create', {ns: 'common'})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setDidBlurName(true)
    setDidBlurTitle(true)

    if (fileNameError || titleError) {
      return
    }

    const applyUpdate = (latestConfig: GatewayDefinition) => {
      latestConfig.title = newTitle
      latestConfig.description = newDescription
      return JSON.stringify(latestConfig, null, 2)
    }

    const filePath = `${BACKEND_FOLDER_PREFIX}${visibleName}${BACKEND_FILE_EXT}`
    if (!git.repo) {
      // eslint-disable-next-line no-console
      console.error('Cannot create file with missing repo for', BACKEND_FOLDER_PREFIX)
      return
    }

    const functionConfig: FunctionDefinition = {
      type: 'function',
      entry: '',
      headers: {},
      envVariables: {},
    }

    const proxyConfig: ProxyDefinition = {
      type: 'proxy',
      baseUrl: '',
      headers: {},
      routes: [{name: '', id: uuid(), url: '', methods: ['GET'], headers: {}}],
    }

    await mutateFile(git.repo, {
      filePath: isEdit ? path : filePath,
      transform: (latestFile: IGitFile) => applyUpdate(JSON.parse(latestFile.content)),
      generate: () => applyUpdate(backendType === 'function' ? functionConfig : proxyConfig),
      newPath: isEdit ? filePath : '',
    })

    onClose(stripPrimaryRepoId({filePath, repoId: fileRepoId}, currentRepoId))
  }

  return (
    <StandardModal onClose={() => { onClose() }} size='small'>
      <StandardModalHeader>
        <h2>{headerText}</h2>
        <p>{t('editor_page.backend_proxy_modal.header.config_description')}</p>
      </StandardModalHeader>
      <form onSubmit={handleSubmit}>
        <BasicModalContent className={classes.modalContentContainer}>
          <StandardRadioGroup label={titleBackendTypeText}>
            <div className={classes.row}>
              <StandardRadioButton
                id='backend-function'
                label={titleBackendFunctionOption}
                onChange={(e) => { setBackendType(e.target.value) }}
                checked={backendType === 'function'}
                value='function'
                disabled={isEdit}
              />
              <StandardRadioButton
                id='backend-proxy'
                label={titleBackendProxyOption}
                onChange={(e) => { setBackendType(e.target.value) }}
                checked={backendType === 'proxy'}
                value='proxy'
                disabled={isEdit}
              />
            </div>
          </StandardRadioGroup>
          <p className={classes.radioDescriptionHeader}>
            {backendType === 'function'
              ? t('editor_page.backend_proxy_modal.header.function_description')
              : t('editor_page.backend_proxy_modal.header.proxy_description')
            }
          </p>
          <StandardTextField
            id='backend-proxy-name-input'
            label={titleLabelText}
            placeholder={t('editor_page.backend_proxy_modal.title_placeholder')}
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={() => setDidBlurTitle(true)}
            onFocus={() => setDidBlurTitle(false)}
            errorMessage={titleErrorText}
          />
          <StandardTextField
            id='backend-proxy-name-input'
            label={fileNameLabelText}
            placeholder='backend-name'
            value={visibleName}
            onChange={(e) => {
              setBackendProxyName(e.target.value)
              setIsNameChanged(true)
            }}
            onFocus={() => setDidBlurName(false)}
            onBlur={() => setDidBlurName(true)}
            errorMessage={filenameErrorText}
            width='medium'
            starredLabel
          />
          <StandardTextAreaField
            id='backend-proxy-description-input-area'
            label={t('editor_page.backend_proxy_modal.description')}
            placeholder={t('editor_page.backend_proxy_modal.description_placeholder')}
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
            resize
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
        </BasicModalContent>
        <StandardModalActions>
          <LinkButton
            onClick={() => { onClose() }}
          >
            {t('button.cancel', {ns: 'common'})}
          </LinkButton>
          <TertiaryButton disabled={!visibleName} type='submit'>
            {submitText}
          </TertiaryButton>
        </StandardModalActions>
      </form>
    </StandardModal>
  )
}

export default BackendConfigModal
