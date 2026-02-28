import React from 'react'
import type {DeepReadonly as RO} from 'ts-essentials'

import type {VersionInfo} from '../../shared/module/module-target-api'
import {getVersionSpecifier} from '../../shared/module/module-version-patches'
import FeaturedDescriptionRenderer from '../apps/widgets/featured-description-renderer'
import {Badge} from '../ui/components/badge'
import {createThemedStyles} from '../ui/theme'
import AutoHeading from '../widgets/auto-heading'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import {compareVersionInfo} from '../../shared/module/compare-module-target'
import {resolveSelectedVersion} from '../../shared/module/version-resolution'
import {useDependencyContext} from '../editor/dependency-context'

const useStyles = createThemedStyles(theme => ({
  heading: {
    fontSize: '1.25rem',
    fontStyle: 'italic',
  },
  subHeading: {
    fontSize: '1.125rem',
  },
  date: {
    color: theme.fgMuted,
  },
}))

interface IModuleReleaseNotes {
  dependencyPath?: string
  versions: RO<VersionInfo[]>
  preVersions?: RO<VersionInfo[]>
}

const ModuleReleaseNotes: React.FC<IModuleReleaseNotes> = ({
  dependencyPath, versions, preVersions,
}) => {
  const classes = useStyles()

  const dependencyContext = useDependencyContext()
  const dependency = dependencyContext?.dependenciesByPath[dependencyPath]

  const versionTarget = dependency?.target?.type === 'version' && dependency.target

  const sortedVersions = versions.slice(0).sort(compareVersionInfo)

  const selectedVersion = versionTarget && resolveSelectedVersion(
    versionTarget, sortedVersions, preVersions
  )

  const visibleVersions = [
    ...(preVersions ? preVersions.filter(e => !e.deprecated) : []),
    ...sortedVersions,
  ]

  return (
    <>
      {visibleVersions.map((version) => {
        const specifier = getVersionSpecifier(version.patchTarget)
        const dateString = new Date(version.publishTime).toLocaleDateString()
        return (
          <AutoHeadingScope key={specifier}>
            <AutoHeading className={classes.heading}>
              Version {specifier}
              <span className={classes.date}> ({dateString})</span>
              {version.deprecated && (<Badge color='gray' variant='pastel'>Deprecated</Badge>)}
              {version.patchTarget.pre && (
                <Badge color='mango' variant='pastel'>Pre-Release</Badge>
              )}
              {selectedVersion === version && (<Badge color='blue' variant='pastel'>Active</Badge>)}
            </AutoHeading>
            <AutoHeadingScope>
              <FeaturedDescriptionRenderer
                headingClassName={classes.subHeading}
                source={version.versionDescription}
              />
            </AutoHeadingScope>
          </AutoHeadingScope>
        )
      })}
    </>
  )
}

export {
  ModuleReleaseNotes,
}
