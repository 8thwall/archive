import React from 'react'

import {useTranslation} from 'react-i18next'
import type {DeepReadonly} from 'ts-essentials'

import {Icon} from '../ui/components/icon'
import {createThemedStyles} from '../ui/theme'
import type {
  SlotParameter, GatewayDefinition, ParameterValue,
} from '../../shared/gateway/gateway-types'
import {StandardFieldLabel} from '../ui/components/standard-field-label'
import {StandardTextInput} from '../ui/components/standard-text-input'
import {useId} from '../hooks/use-id'
import {useDependencyContext} from './dependency-context'
import useCurrentApp from '../common/use-current-app'
import useActions from '../common/use-actions'
import type {ModuleDependency} from '../../shared/module/module-dependency'
import coreGitActions from '../git/core-git-actions'
import appsActions from '../apps/apps-actions'
import {useCurrentGit} from '../git/hooks/use-current-git'
import {Loader} from '../ui/components/loader'
import BackendConfigViewModal from './modals/backend-config-view-modal'
import {FileActionsContext} from './files/file-actions-context'
import {getPathForBackend} from './backend-config/backend-config-files'
import {getSecretDisplayText} from '../../shared/gateway/get-secret-display-text'
import {combine} from '../common/styles'

const useStyles = createThemedStyles(theme => ({
  groupSection: {
    border: `1px solid ${theme.subtleBorder}`,
    borderRadius: '0.5rem',
    background: theme.mainEditorPane,
    margin: '1rem 0',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  keyField: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  keyInput: {
    flex: '1 1 auto',
    minWidth: '300px',
  },
  groupHeading: {
    fontSize: '14px',
    fontWeight: '600',
    position: 'relative',
    color: theme.fgMuted,
  },
  slotsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(20em, 1fr))',
    gap: '1.5rem 5rem',
    margin: '1.5rem 0 0 0',
  },
  hidden: {
    visibility: 'hidden',
  },
  secretIcon: {
    display: 'flex',
    alignItems: 'center',
    width: '16px',
    height: '16px',
  },
  backendLinkButton: {
    position: 'absolute',
    right: '0',
    top: '0.25rem',
    border: '0',
    padding: '0',
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.fgMuted,
    textDecoration: 'underline',
  },
  headingContainer: {
    maxWidth: 'calc(100% - 11rem)',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  headingPadding: {
    padding: '0.25rem 0.5rem',
  },
}))

type GatewayEntry = DeepReadonly<[SlotParameter[], GatewayDefinition]>

const getBackendSlots = (templates: DeepReadonly<GatewayDefinition[]>): GatewayEntry[] => {
  // ending format
  const backendSlots: GatewayEntry[] = []
  templates.forEach((template) => {
    const slotParameters: SlotParameter[] = []
    Object.entries(template.headers).forEach(([headerName, header]) => {
      if (header.type === 'secretslot' || header.type === 'literalslot') {
        slotParameters.push(header.label ? header : {...header, label: headerName})
      }
    })
    if (template.type !== 'function') {
      Object.values(template.routes).forEach((route) => {
        Object.entries(route.headers).forEach(([headerName, header]) => {
          if (header.type === 'secretslot' || header.type === 'literalslot') {
            slotParameters.push(header.label ? header : {...header, label: headerName})
          }
        })
      })
    }

    if (template.type === 'function') {
      const definedEnvVariables = template.envVariables || {}
      Object.entries(definedEnvVariables).forEach(([key, parameterValue]) => {
        if (parameterValue.type === 'literalslot') {
          slotParameters.push(parameterValue.label
            ? parameterValue
            : {...parameterValue, label: key})
        }
      })
    }
    backendSlots.push([slotParameters, template])
  })
  return backendSlots
}

interface IBackendSlot {
  slot: SlotParameter
  dependencyPath: string
  urlOrigin?: string
}

const BackendSlot: React.FC<IBackendSlot> = ({
  slot, dependencyPath, urlOrigin,
}) => {
  const classes = useStyles()
  const {transformFile} = useActions(coreGitActions)
  const {addBackendSecret} = useActions(appsActions)

  const repo = useCurrentGit(e => e.repo)
  const app = useCurrentApp()

  const dependencyContext = useDependencyContext()
  const dependency = dependencyContext.dependenciesByPath[dependencyPath]

  const existingValue = dependency.backendSlotValues?.[slot.slotId]

  const isSecret = slot.type === 'secretslot'

  const [slotValue, setSlotValue] = React.useState(
    existingValue?.type === 'literal' ? existingValue.value : ''
  )

  const [shouldSaveSlotValue, setShouldSaveSlotValue] = React.useState(false)
  const [savingSlotValue, setSavingSlotValue] = React.useState(false)

  const slotId = useId().toString()
  const inputId = useId().toString()

  const getPlaceHolder = () => {
    if (existingValue?.type === 'secret') {
      return getSecretDisplayText(existingValue)
    }
    return undefined
  }

  const updateSlot = async (newValue: ParameterValue) => {
    await transformFile(repo, dependencyPath, (file) => {
      const updatedDependency: ModuleDependency = JSON.parse(file.content)
      updatedDependency.backendSlotValues = updatedDependency.backendSlotValues || {}
      updatedDependency.backendSlotValues[slot.slotId] = newValue
      return JSON.stringify(updatedDependency, null, 2)
    })
  }

  const handleChangeSlotValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlotValue(e.target.value)
    if (isSecret) {
      setShouldSaveSlotValue(true)
    }
  }

  const handleSaveKey = async () => {
    if (!isSecret) {
      await updateSlot({type: 'literal', value: slotValue})
    } else if (shouldSaveSlotValue) {
      setSavingSlotValue(true)
      const {secretId} = await addBackendSecret(`${slot.prefix || ''}${slotValue}`, app.uuid)
      if (slotValue === '') {
        await updateSlot(undefined)
      } else {
        await updateSlot({
          type: 'secret',
          secretId,
          length: slotValue.length,
          lastCouple: slotValue.substring(slotValue.length - 4),
          allowedOrigin: urlOrigin,
        })
      }
      setShouldSaveSlotValue(false)
      setSavingSlotValue(false)
      setSlotValue('')
    }
  }

  const secretIcon = (
    <div className={classes.secretIcon}>
      {savingSlotValue
        ? (<Loader size='tiny' inline />)
        : (<Icon stroke='lock' block />)}
    </div>
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSaveKey()
      }}
    >
      <label htmlFor={slotId}>
        <div>
          <StandardFieldLabel
            label={(
              <div className={!slot.label ? classes.hidden : null}>
                {slot.label}
              </div>
            )}
            bold
          />
          <div className={classes.keyField}>
            {/* TODO (Dale): Update Tooltip Icon to take different strokes */}
            {isSecret && secretIcon}
            <div className={classes.keyInput}>
              <StandardTextInput
                id={inputId}
                placeholder={getPlaceHolder()}
                value={slotValue}
                onChange={handleChangeSlotValue}
                onBlur={handleSaveKey}
              />
            </div>
          </div>
        </div>
      </label>
    </form>
  )
}

interface IBackendApiCard {
  backendSlots: DeepReadonly<SlotParameter[]>
  backendTemplate: DeepReadonly<GatewayDefinition>
  isDevelopmentMode: boolean
  dependencyPath: string
  repoId: string
}

const tryParseUrl = (url: string) => {
  try {
    return new URL(url)
  } catch (err) {
    return null
  }
}

const BackendApiCard: React.FC<IBackendApiCard> = ({
  backendSlots, backendTemplate, isDevelopmentMode, dependencyPath, repoId,
}) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  const classes = useStyles()

  const {onSelect} = React.useContext(FileActionsContext)
  const [showReadOnlyModal, setShowReadOnlyModal] = React.useState(false)

  const hasSlots = backendSlots.length > 0
  const titleText = `${backendTemplate.title || backendTemplate.name}`

  let urlOrigin = ''
  let urlText = ''
  if (backendTemplate.type !== 'function') {
    urlOrigin = tryParseUrl(backendTemplate.baseUrl)?.origin
    urlText = ` (${urlOrigin || t('editor_page.dependency_pane.backend_card.invalid_base_url')})`
  }

  const headingText = `${titleText}${urlText}`
  const cardHeading = (
    <div className={combine(classes.headingContainer, hasSlots && classes.headingPadding)}>
      {headingText}
    </div>
  )

  const viewButtonText = isDevelopmentMode
    ? t('editor_page.dependency_pane.backend_card.backend_link.edit_backend')
    : t('editor_page.dependency_pane.backend_card.backend_link.view_backend')

  const onClick = () => {
    if (isDevelopmentMode) {
      onSelect({filePath: getPathForBackend(backendTemplate.name), repoId})
    } else {
      setShowReadOnlyModal(true)
    }
  }

  const viewButton = (
    <button type='button' className={classes.backendLinkButton} onClick={onClick}>
      {viewButtonText}
    </button>
  )

  return (
    <>
      {hasSlots
        ? (
          <details className={classes.groupSection} open>
            <summary
              className={classes.groupHeading}
            >
              {cardHeading}
              {viewButton}
            </summary>
            <div className={classes.slotsContainer}>
              {backendSlots.map(slot => (
                <BackendSlot
                  slot={slot}
                  key={slot.slotId}
                  dependencyPath={dependencyPath}
                  urlOrigin={urlOrigin}
                />
              ))}
            </div>
          </details>)
        : (
          <div className={classes.groupSection}>
            <div className={classes.groupHeading}>
              {cardHeading}
              {viewButton}
            </div>
          </div>
        )}
      {showReadOnlyModal &&
        <BackendConfigViewModal
          onClose={() => setShowReadOnlyModal(false)}
          backendTemplate={backendTemplate}
        />}
    </>
  )
}

interface IBackendApiCardList {
  backendTemplates: DeepReadonly<GatewayDefinition[]>
  isDevelopmentMode: boolean
  dependencyPath: string
  repoId: string
}

const BackendApiCardList: React.FC<IBackendApiCardList> = ({
  backendTemplates, isDevelopmentMode, dependencyPath, repoId,
}) => {
  const backendSlots = getBackendSlots(backendTemplates)
  return (
    <>
      {backendSlots.map(([slots, template]) => (
        <BackendApiCard
          backendSlots={slots}
          backendTemplate={template}
          key={template.name}
          isDevelopmentMode={isDevelopmentMode}
          dependencyPath={dependencyPath}
          repoId={repoId}
        />
      ))}
    </>
  )
}

export {
  BackendApiCardList,
}
