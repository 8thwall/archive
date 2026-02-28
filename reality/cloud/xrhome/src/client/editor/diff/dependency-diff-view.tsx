import React, {useMemo} from 'react'
import {createUseStyles} from 'react-jss'
import {detailedDiff} from 'deep-object-diff'
import type {DeepReadonly} from 'ts-essentials'
import {Icon} from 'semantic-ui-react'

import {darkBlue} from '../../static/styles/settings'
import type {DependencyDiff} from '../../git/g8-dto'
import AutoHeading from '../../widgets/auto-heading'
import AutoHeadingScope from '../../widgets/auto-heading-scope'

const useStyles = createUseStyles({
  container: {
    backgroundColor: darkBlue,
    padding: '1rem 1.5rem',
  },
})

interface IDependencyDiffView {
  depDiff: DeepReadonly<DependencyDiff>
}

type DetailedDiff = {
  added?: Record<string, any>
  updated?: Record<string, any>
  deleted?: Record<string, any>
}

const friendly = (value) => {
  if (value === undefined) {
    return '[default]'
  }
  return JSON.stringify(value)
}

const DependencyDiffView: React.FC<IDependencyDiffView> = ({depDiff}) => {
  const classes = useStyles()
  const {previousContents, currentContents} = depDiff

  const configDiff: DetailedDiff = useMemo(
    () => detailedDiff(previousContents?.config || {}, currentContents?.config || {}),
    [depDiff]
  )

  const targetDiff: DetailedDiff = useMemo(
    () => detailedDiff(previousContents?.target || {}, currentContents?.target || {}),
    [depDiff]
  )

  // TODO(pawel) Also show target info/config changes from default.
  if (depDiff.status === 'ADDED') {
    return (
      <div className={classes.container}>
        <AutoHeadingScope>
          <AutoHeading>Dependency Added</AutoHeading>
        </AutoHeadingScope>
      </div>
    )
  }

  // TODO(pawel) Also show target info/config changes from default.
  if (depDiff.status === 'DELETED') {
    return (
      <div className={classes.container}>
        <AutoHeadingScope>
          <AutoHeading>Dependency Deleted</AutoHeading>
        </AutoHeadingScope>
      </div>
    )
  }

  const hasAdditions = !!Object.keys(configDiff.added).length
  const hasUpdates = !!Object.keys(configDiff.updated).length
  const hasDeletes = !!Object.keys(configDiff.deleted).length

  const hasTargetChanges = targetDiff.updated && !!Object.keys(targetDiff.updated).length

  return (
    <div className={classes.container}>
      {hasTargetChanges &&
        <AutoHeadingScope>
          <AutoHeading>Target Changes</AutoHeading>
          {Object.entries(targetDiff.updated).map(([key, value]) => (
            <div key={key}>
              {key}: {friendly(depDiff.previousContents.target[key])}
              &emsp;
              <Icon name='long arrow alternate right' size='large' />
              &emsp;
              {friendly(value)}
            </div>
          ))}
          {Object.entries(targetDiff.added).map(([key, value]) => (
            <div key={key}>{key}: {friendly(value)}</div>
          ))}
          {Object.entries(targetDiff.deleted).map(([key]) => (
            <div key={key}>
              {key}: <del> {friendly(depDiff.previousContents.target[key])}</del>
            </div>
          ))}
        </AutoHeadingScope>
      }
      {(hasAdditions || hasUpdates || hasDeletes) &&
        <AutoHeadingScope>
          <AutoHeading>Config Changes</AutoHeading>
          {Object.entries(configDiff.added).map(([key, value]) => (
            <div key={key}>{key}: {friendly(value)}</div>
          ))}
          {Object.entries(configDiff.updated).map(([key, value]) => (
            <div key={key}>
              {key}: {friendly(depDiff.previousContents.config[key])}
              &emsp;
              <Icon name='long arrow alternate right' size='large' />
              &emsp;
              {friendly(value)}
            </div>
          ))}
          {Object.entries(configDiff.deleted).map(([key]) => (
            <div key={key}>
              {key}: <del>{friendly(depDiff.previousContents.config[key])}</del>
            </div>
          ))}
        </AutoHeadingScope>
        }
    </div>
  )
}

export {
  DependencyDiffView,
}
