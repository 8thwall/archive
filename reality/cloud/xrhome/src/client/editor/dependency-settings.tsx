import React from 'react'
import type {DeepReadonly} from 'ts-essentials'

import {useTranslation} from 'react-i18next'

import type {ModuleTarget, ModuleVersionTarget} from '../../shared/module/module-target'
import type {ModuleDependency} from '../../shared/module/module-dependency'
import {useSelector} from '../hooks'
import {
  getNewestPatch, getVersionSpecifier, getVersionSpecifierAtLevel,
} from '../../shared/module/module-version-patches'
import {Levels, updateVersionTarget} from '../../shared/module/update-version-target'
import {getTruncatedHash} from '../git/g8-commit'
import {timeSince} from '../common/time-since'
import {StandardDropdownField, DropdownOption} from '../ui/components/standard-dropdown-field'
import {createThemedStyles} from '../ui/theme'
import {compareVersionInfo, isSameBaseVersion} from '../../shared/module/compare-module-target'
import {Badge} from '../ui/components/badge'
import {StaticBanner} from '../ui/components/banner'
import {ModuleTargetOption} from '../modules/widgets/module-target-option'
import {TooltipIcon} from '../widgets/tooltip-icon'
import {useForkTarget} from './use-fork-target'
import {
  filterResolvableVersions, resolveSelectedVersion,
} from '../../shared/module/version-resolution'
import {licenseIsForkable} from './licenses'
import {combine} from '../common/styles'

const UPDATES = [
  {content: 'None', value: 'patch'},
  {content: 'Bug Fixes', value: 'minor'},
  {content: 'New Features', value: 'major'},
] as const

const DEFAULT_VERSION_LEVEL = 'minor'
const PINNING_TARGET_TOOLTIP = 'Pinning your module will set it to a particular version'
// eslint-disable-next-line max-len
const ALLOWED_UPDATES_TOOLTIP = 'Allowed updates subscribes your module to updates within your pinned version.'
// eslint-disable-next-line max-len
const WARNING_MESSAGE = 'The current version has been deprecated by the module owner, we recommend that you upgrade to a newer version.'

const makeVersionString = (target: ModuleVersionTarget) => (
  `${getVersionSpecifier(target)}${target.pre ? '-pre' : ''}`
)

const parseVersionString = (value: string): ModuleVersionTarget => {
  const [versionSpecifier, suffix] = value.split('-')
  const version: number[] = versionSpecifier.split('.').map(s => Number(s))

  const res: ModuleVersionTarget = {
    type: 'version',
    level: DEFAULT_VERSION_LEVEL,
    major: version[0],
    minor: version[1],
    patch: version[2],
    pre: undefined,
  }

  if (suffix === 'pre') {
    res.pre = true
  }

  return res
}

const useStyles = createThemedStyles(theme => ({
  targetSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: '0.5rem',
  },
  smallDropdown: {
    flex: '0 1 12.75rem',
  },
  largeDropdown: {
    flex: '1 1 12.75rem',
    maxWidth: '25rem',
  },
  marginRight: {
    marginRight: '2rem',
  },
  invisible: {
    color: 'transparent',
    userSelect: 'none',
  },
  forkButtonContainer: {
    display: 'flex',
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  forkButton: {
    cursor: 'pointer',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0 2rem',
    height: '32px',
    boxShadow: `0 0 0 1px inset ${theme.fgMain}`,
  },
}))

interface ITargetSelector {
  dependency: DeepReadonly<ModuleDependency>
  dependencyPath?: string
  onChange: (newTarget: ModuleTarget) => void

  moduleIsForkable?: boolean
  onDoFork?: (commitId: string) => void
}

const TargetSelector: React.FC<ITargetSelector> = ({
  dependency, dependencyPath, onChange: updateTarget, onDoFork, moduleIsForkable,
}) => {
  const {t} = useTranslation(['cloud-editor-pages'])

  const classes = useStyles()

  const availableTargets = useSelector(s => s.modules.targets[dependency?.moduleId])

  const {target} = dependency
  const forkTarget = useForkTarget(dependencyPath)

  const forkTargetLoading = forkTarget.status === 'loading'

  const setBranch = (newBranch: string) => {
    updateTarget({type: 'branch', branch: newBranch})
  }

  const setCommit = (newCommit: string) => {
    updateTarget({type: 'commit', branch: 'master', commit: newCommit})
  }

  const setChannel = (newChannel: string) => {
    updateTarget({type: 'channel', channel: newChannel})
  }

  const setVersion = (versionSpecifier: string) => {
    const baseVersion = parseVersionString(versionSpecifier)

    const finalVersion = target.type === 'version'
      ? updateVersionTarget(baseVersion, target.level)
      : baseVersion

    updateTarget(finalVersion)
  }

  const setVersionUpdate = (update: Levels) => {
    if (target.type !== 'version') {
      return
    }
    // The current target with new level as selected
    const newTarget = updateVersionTarget(target, update)

    // The latest version that matches the new level
    const resolvedVersion = resolveSelectedVersion(
      newTarget, availableTargets?.versions, availableTargets?.preVersions
    )
    if (!resolvedVersion) {
      return
    }

    // Use the latest patch, with the selected level
    const finalTarget = updateVersionTarget(resolvedVersion.patchTarget, update)
    updateTarget(finalTarget)
  }

  const setType = (newType: string) => {
    switch (newType) {
      case 'branch':
      case 'commit':
        setBranch('master')
        break
      case 'version':
        if (availableTargets.versions.length) {
          setVersion(getVersionSpecifier(
            getNewestPatch(availableTargets.versions.map(v => v.patchTarget))
          ))
        } else if (availableTargets.betaChannel) {
          setChannel('beta')
        }
        break
      default:
        break
    }
  }

  const selectedType: string = (() => {
    switch (target.type) {
      case 'channel':
        return 'version'
      case 'branch':
        if (target.branch !== 'master') {
          return 'branch'
        }
        return 'commit'
      default:
        return target.type
    }
  })()

  const shouldShowVersion = (availableTargets?.versions.length) ||
                            selectedType === 'version'
  const shouldShowBeta = (availableTargets && availableTargets.betaChannel) ||
                         (target.type === 'channel' && target.channel === 'beta')
  const shouldShowCommits = (availableTargets?.commits) || selectedType === 'commit'

  const typesToShow: DeepReadonly<string[][]> = (() => {
    const optionalTypes: string[][] = []

    // NOTE(Johnny): Switching between branches in the target selector is not
    // currently supported. But the edge case needs to be dealt with.
    if (target.type === 'branch' && target.branch !== 'master') {
      optionalTypes.push([`Branch: ${target.branch}`, 'branch'])
    }
    if (shouldShowVersion || shouldShowBeta) {
      optionalTypes.push(['Version', 'version'])
    }
    if (shouldShowCommits) {
      optionalTypes.push(['Commit', 'commit'])
    }
    return optionalTypes
  })()

  const typeSelect = (
    <div className={classes.smallDropdown}>
      <StandardDropdownField
        id='module-pinning-target'
        height='small'
        disabled={!availableTargets}
        value={selectedType}
        onChange={setType}
        label={(
          <>
            Set Pinning Target
            <TooltipIcon
              position='bottom left'
              content={
               `${PINNING_TARGET_TOOLTIP}${shouldShowCommits ? ', commit, or development.' : '.'}`
              }
            />
          </>
        )}
        options={typesToShow.map(([content, value]) => ({content, value}))}
      />
    </div>
  )

  switch (selectedType) {
    case 'commit': {
      const commitOptions: DropdownOption[] = []

      const selectedValue = target.type === 'commit' ? target.commit : 'latest'

      if (availableTargets && availableTargets.commits) {
        commitOptions.push({content: 'Latest', value: 'latest'})
        availableTargets.commits.forEach((c) => {
          commitOptions.push({
            content: (
              <ModuleTargetOption
                selected={selectedValue === c.commitId}
                description={(
                  <>
                    {getTruncatedHash(c.commitId)}{' \''}
                    {c.commitMessage}{'\''}
                  </>
                )}
                rightContent={`${timeSince(c.buildTime)} ago`}
              />
            ),
            value: c.commitId,
          })
        })
      }
      return (
        <div className={classes.targetSelector}>
          {typeSelect}
          <div className={classes.largeDropdown}>
            <StandardDropdownField
              id='module-commit-target'
              height='small'
              value={selectedValue}
              onChange={(value) => {
                if (value === 'latest') {
                  setBranch('master')
                  return
                }
                setCommit(value)
              }}
              label={<span className={classes.invisible}>Select commit</span>}
              options={commitOptions}
            />
          </div>
        </div>
      )
    }
    case 'version':
    case 'channel': {
      const visibleVersions: DropdownOption[] = []
      const sortedVersions = availableTargets?.versions?.slice(0).sort(compareVersionInfo)
      const selectedVersion = resolveSelectedVersion(
        target, sortedVersions, availableTargets?.preVersions
      )
      const showDeprecatedWarning = selectedVersion?.deprecated

      const commitIsForkable = licenseIsForkable(selectedVersion?.license)

      const selectedValue = target.type === 'version'
        ? makeVersionString(selectedVersion?.patchTarget || target)
        : 'beta'

      const specificity = target.type === 'version' ? target.level : 'patch'

      if (availableTargets?.betaChannel) {
        visibleVersions.push({content: 'Beta Channel', value: 'beta'})
      }
      if (sortedVersions) {
        const latestVersion = sortedVersions[0]
        const allVersions = [
          ...availableTargets.preVersions || [],
          ...filterResolvableVersions(specificity, sortedVersions),
        ]

        allVersions.forEach((vi) => {
          const value = makeVersionString(vi.patchTarget)
          const selected = selectedVersion === vi

          if (vi.deprecated && !selected) {
            const shouldShow = !forkTargetLoading &&
                               forkTarget.target &&
                               isSameBaseVersion(forkTarget.target, vi.patchTarget)

            if (!shouldShow) {
              return
            }
          }

          const isPre = vi.patchTarget.pre
          const specifier = getVersionSpecifierAtLevel(
            vi.patchTarget, isPre ? 'patch' : specificity
          )

          visibleVersions.push({
            content: (
              <ModuleTargetOption
                selected={selected}
                description={specifier}
                badges={(
                  <>
                    {isPre && <Badge color='mango' variant='pastel'>Pre-Release</Badge>}
                    {vi.deprecated && <Badge color='cherry'>Deprecated</Badge>}
                    {latestVersion === vi && <Badge color='purple'>Latest</Badge>}
                  </>
                )}
                rightContent={`${timeSince(vi.publishTime)} ago`}
              />
            ),
            value: selected ? selectedValue : value,
          })
        })
      }
      return (
        <>
          <div className={classes.targetSelector}>
            {typeSelect}
            <div className={combine(classes.largeDropdown, classes.marginRight)}>
              <StandardDropdownField
                id='module-version-target'
                height='small'
                disabled={!availableTargets}
                value={selectedValue}
                onChange={(value) => {
                  if (value === 'beta') {
                    setChannel(value)
                    return
                  }
                  setVersion(value)
                }}
                label={<span className={classes.invisible}>Select version</span>}
                options={visibleVersions}
              />
            </div>
            {target.type === 'version'
              ? (
                <div className={classes.smallDropdown}>
                  <StandardDropdownField
                    id='module-update-target'
                    height='small'
                    disabled={!availableTargets}
                    value={target.level}
                    onChange={value => setVersionUpdate(value as Levels)}
                    label={(
                      <>
                        Allowed Updates <TooltipIcon
                          position='bottom right'
                          content={ALLOWED_UPDATES_TOOLTIP}
                        />
                      </>
                    )}
                    options={UPDATES}
                  />
                </div>)
              : null}
            {moduleIsForkable && commitIsForkable &&
              <div className={classes.forkButtonContainer}>
                <button
                  type='button'
                  className={combine('style-reset', classes.forkButton)}
                  onClick={() => onDoFork(selectedVersion.commitId)}
                >{t('editor_page.dependency_pane.dependency_settings.button.fork_module')}
                </button>
              </div>
            }
          </div>
          {showDeprecatedWarning &&
            <StaticBanner
              type='warning'
              message={WARNING_MESSAGE}
              hasMarginTop
            />
          }
        </>
      )
    }
    // NOTE(Johnny): Gets here if the target is not on master branch or is in development mode.
    default:
      return (
        <div className={classes.targetSelector}>
          {typeSelect}
        </div>
      )
  }
}

export {
  TargetSelector,
}
