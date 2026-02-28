import React from 'react'

import {Trans} from 'react-i18next'

import {Link} from 'react-router-dom'

import type {IDeployableModule} from '../../common/types/models'
import {TertiaryButton} from '../../ui/components/tertiary-button'
import moduleVersionActions from '../module-version-actions'
import useActions from '../../common/use-actions'
import {useSelector} from '../../hooks'
import {
  getNewestPatch, createNewVersionTarget, getNewVersionSpecifier, getVersionSpecifier,
} from '../../../shared/module/module-version-patches'
import {useAbandonableFunction} from '../../hooks/use-abandonable-function'
import {StandardCheckboxField} from '../../ui/components/standard-checkbox-field'
import {StandardRadioButton, StandardRadioGroup} from '../../ui/components/standard-radio-group'
import {InfoSvg} from '../../uiWidgets/info-svg'
import type {ModuleVersionTarget} from '../../../shared/module/module-target'
import {StandardTextField} from '../../ui/components/standard-text-field'
import {ModuleVersionFinalModal} from './module-version-final-modal'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../../shared/module/module-constants'
import {deriveModuleCoverImageUrl} from '../../../shared/module-cover-image'
import moduleActions from '../actions'
import editorActions from '../../editor/editor-actions'
import {versionStateReducer} from './version-state-reducer'
import {StandardModalContent} from '../../editor/standard-modal-content'
import {StandardModalActions} from '../../editor/standard-modal-actions'
import {StandardModalHeader} from '../../editor/standard-modal-header'
import {StandardModal} from '../../editor/standard-modal'
import {SYSTEM_STREAM_NAME} from '../../editor/logs/log-constants'
import {LinkButton} from '../../ui/components/link-button'
import {ModuleCommitDropdown} from './module-commit-dropdown'
import {VersionDescriptionField} from './version-description-field'
import {useModuleVersionModalStyles} from './module-version-modal-styles'
import {ModuleVersionPlaceholderModal} from './module-version-placeholder-modal'
import {EditPreReleaseModal} from './edit-pre-release-modal'
import {TooltipIcon} from '../../widgets/tooltip-icon'
import moduleDeploymentActions from '../module-deployment-actions'
import {StaticBanner} from '../../ui/components/banner'
import {ModulePathEnum, getPathForModule} from '../../common/paths'
import useCurrentAccount from '../../common/use-current-account'
import {useDismissibleModal} from '../../editor/dismissible-modal-context'

const Step1 = 'initial'
const Step2 = 'final'

type Step = typeof Step1 | typeof Step2

interface IModuleVersionModal {
  module: IDeployableModule
  onClose: () => void
  onDeploy?: () => void
}

const targetLabelCopies = {
  'patch': 'Bug Fixes',
  'minor': 'New Features',
  'major': 'Major Release',
  'initial': 'Initial Version',
}
// eslint-disable-next-line max-len
const VERSION_TYPE_TOOLTIP = 'Choose the version type that best fits your update. Major Releases should only be used for breaking changes.'

const makeTargetLabel = (
  patch: ModuleVersionTarget, target: 'patch' | 'minor' | 'major' | 'initial'
) => {
  const versionSpecifier = getNewVersionSpecifier(patch, target === 'initial' ? 'major' : target)
  return (`${versionSpecifier} (${targetLabelCopies[target]})`)
}

const ModuleVersionModal: React.FC<IModuleVersionModal> = ({onClose, module, onDeploy}) => {
  useDismissibleModal(onClose)
  const classes = useModuleVersionModalStyles()
  const account = useCurrentAccount()
  const {deployModuleVersion, fetchModuleVersions} = useActions(moduleVersionActions)
  const {fetchModuleHistory} = useActions(moduleDeploymentActions)
  const {patchModule} = useActions(moduleActions)
  const {addEditorLogs} = useActions(editorActions)
  const [{
    publishing, commit: selectedCommit, isPreRelease, versionType, versionDescription, moduleTitle,
    moduleDescription, coverImagePreviewUrl, cropResult,
  }, updateVersionState] =
  React.useReducer(versionStateReducer, {
    publishing: false,
    commit: null,
    isPreRelease: false,
    versionType: 'major',
    versionDescription: '',
    moduleTitle: module.title,
    moduleDescription: module.description || '',
    coverImagePreviewUrl: deriveModuleCoverImageUrl(module, COVER_IMAGE_PREVIEW_SIZES[400]),
    cropResult: null,
  })
  const [step, setStep] = React.useState<Step>(Step1)

  const moduleSettingsUrl = getPathForModule(account, module, ModulePathEnum.settings)

  const patchData = useSelector(
    s => s.modules.versions[module.uuid]?.patchData
  )
  const patchList = patchData?.map(p => p.patchTarget)
  const newestPatch = getNewestPatch(patchList) || {
    type: 'version',
    level: 'patch',
    major: 0,
    minor: 0,
    patch: 0,
  }
  const isReduxLoaded = useSelector(s => !!(
    s.modules.versions[module.uuid] &&
    s.modules.history[module.uuid]
  ))

  React.useEffect(() => {
    fetchModuleVersions(module.uuid)
    fetchModuleHistory(module.uuid)
  }, [module.uuid])

  const deployModuleVersionAbandonable = useAbandonableFunction(deployModuleVersion)
  const patchModuleAbandonable = useAbandonableFunction(patchModule)

  const hasVersions = patchList && patchList.length !== 0

  const latestCommit = useSelector(s => s.modules.history[module.uuid]?.[0]?.commitId)
  const commit = selectedCommit || latestCommit

  const canPublish = !!(
    commit && versionType && versionDescription && (hasVersions || moduleTitle) && !module.archived
  )
  const canPreRelease = !!hasVersions

  const activePreRelease = useSelector(s => (
    s.modules.versions[module.uuid]?.prePatchData.find(e => !e.deprecated)
  ))

  const deployVersion = React.useCallback(
    async (version: ModuleVersionTarget, description: string, targetCommit: string) => {
      await deployModuleVersionAbandonable(
        module.uuid,
        '',
        description,
        version,
        {
          type: 'commit',
          branch: 'master',
          commit: targetCommit,
        }
      )

      const specifier = getVersionSpecifier(version)
      addEditorLogs(module.repoId, [{
        streamName: SYSTEM_STREAM_NAME,
        log: {
          type: 'success',
          text: `${version.pre ? 'Pre-release' : 'Version'} ${specifier} Deployed`,
        },
      }])

      onClose()
      onDeploy?.()
    }, [addEditorLogs, module, deployModuleVersionAbandonable, onClose, onDeploy]
  )

  if (!isReduxLoaded) {
    return <ModuleVersionPlaceholderModal onClose={onClose} />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    updateVersionState({publishing: true})

    const newVersion = createNewVersionTarget(newestPatch, versionType)
    if (canPreRelease && isPreRelease) {
      newVersion.pre = true
    }

    if (!hasVersions) {
      await patchModuleAbandonable(module.uuid, {
        title: moduleTitle,
        description: moduleDescription,
        ...(cropResult
          ? {
            file: cropResult.original.file,
            crop: cropResult.cropAreaPixels,
          }
          : {}),
      })
    }

    deployVersion(newVersion, versionDescription, commit)
  }

  const versionTypeMessages = {
    'patch': 'Projects subscribed to Bug Fixes or New Features will be automatically updated.',
    'minor': 'Projects subscribed to New Features will be automatically updated.',
    'major': 'Projects are not automatically updated for Major Releases.',
  }

  if (activePreRelease) {
    return (
      <EditPreReleaseModal
        module={module}
        onClose={onClose}
        onDeploy={deployVersion}
        activePreRelease={activePreRelease}
      />
    )
  }

  if (step === Step2) {
    return (
      <ModuleVersionFinalModal
        onClose={onClose}
        onBack={() => setStep(Step1)}
        onSubmit={handleSubmit}
        publishing={publishing}
        moduleTitle={moduleTitle}
        moduleDescription={moduleDescription || ''}
        coverImagePreviewUrl={coverImagePreviewUrl}
        updateVersionState={updateVersionState}
      />
    )
  }

  return (
    <StandardModal onClose={onClose}>
      <StandardModalHeader>
        <h2>Deploy {hasVersions ? 'New' : 'Initial'} Version</h2>
      </StandardModalHeader>
      <form onSubmit={handleSubmit}>
        <StandardModalContent>
          {!hasVersions &&
            <StandardTextField
              id='module-title'
              label={<span className={classes.required}>Module Title</span>}
              value={moduleTitle || ''}
              onChange={e => updateVersionState({moduleTitle: e.target.value})}
            />
          }
          <ModuleCommitDropdown
            module={module}
            value={commit}
            onChange={v => updateVersionState({commit: v})}
          />
          <div className={classes.columnFlex}>
            <VersionDescriptionField
              value={versionDescription}
              onChange={s => updateVersionState({versionDescription: s})}
            />
            <span className={classes.note}>
              These notes cannot be edited after deployment.
            </span>
          </div>
          <div>
            <StandardRadioGroup label={(
              <>
                <span className={classes.required}>Version Type</span>
                <TooltipIcon wide content={VERSION_TYPE_TOOLTIP} />
              </>
            )}
            >
              <div className={classes.formGroup}>
                {hasVersions && (
                  <>
                    <StandardRadioButton
                      id='patch-radio'
                      label={makeTargetLabel(newestPatch, 'patch')}
                      checked={versionType === 'patch'}
                      onChange={() => updateVersionState({versionType: 'patch'})}
                    />
                    <StandardRadioButton
                      id='minor-radio'
                      label={makeTargetLabel(newestPatch, 'minor')}
                      checked={versionType === 'minor'}
                      onChange={() => updateVersionState({versionType: 'minor'})}
                    />
                  </>
                )}
                <StandardRadioButton
                  id='major-radio'
                  label={makeTargetLabel(newestPatch, hasVersions ? 'major' : 'initial')}
                  checked={versionType === 'major'}
                  onChange={() => updateVersionState({versionType: 'major'})}
                />
              </div>
            </StandardRadioGroup>
            <span className={classes.versionText}>
              <InfoSvg />
              &nbsp;&nbsp;{versionTypeMessages[versionType]}
            </span>
          </div>
          {canPreRelease &&
            <div className={classes.columnFlex}>
              <StandardCheckboxField
                id='set-as-beta-input'
                label='Set as Pre-Release'
                checked={isPreRelease}
                onChange={() => updateVersionState({isPreRelease: !isPreRelease})}
              />
              <span className={classes.note}>
                We’ll point out that this version is in pre-release and non-production ready.
              </span>
            </div>
          }
          {module.archived &&
            <StaticBanner type='warning'>
              <p>
                <Trans
                  ns='cloud-editor-pages'
                  i18nKey='editor_page.module_version_modal.warning.module_archived'
                  components={{linkTo: <Link to={moduleSettingsUrl} />}}
                />
              </p>
            </StaticBanner>
          }
        </StandardModalContent>
        <StandardModalActions>
          <LinkButton type='button' onClick={onClose}>Cancel</LinkButton>
          {hasVersions
            ? (
              <TertiaryButton type='submit' disabled={!canPublish || publishing}>
                {publishing ? 'Publishing' : 'Publish'}
              </TertiaryButton>
            )
            : (
              <TertiaryButton
                type='button'
                disabled={!canPublish}
                onClick={() => setStep(Step2)}
              >
                Next
              </TertiaryButton>
            )
          }
        </StandardModalActions>
      </form>
    </StandardModal>
  )
}

export {
  ModuleVersionModal,
}
