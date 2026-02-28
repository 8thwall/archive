import React from 'react'
import {Icon} from 'semantic-ui-react'

import {IG8FileInfoStatus} from '../../git/g8-dto'
import type {DependencyDiff} from '../../git/g8-dto'

const getStatusIconColor = (status: IG8FileInfoStatus) => {
  switch (status) {
    case IG8FileInfoStatus.ADDED:
      return 'green'
    case IG8FileInfoStatus.DELETED:
      return 'red'
    default:
      return 'yellow'
  }
}

interface IDiffStatusIcon {
  status: IG8FileInfoStatus
}

const DiffStatusIcon: React.FC<IDiffStatusIcon> = ({status}) => (
  <Icon
    name='circle'
    size='small'
    color={getStatusIconColor(status)}
  />
)

type DependencyDiffStatus = DependencyDiff['status']

interface IDependencyDiffStatusIcon {
  status: DependencyDiffStatus
}

const getDependencyStatusIconColor = (status: DependencyDiffStatus) => {
  switch (status) {
    case 'ADDED':
      return 'green'
    case 'DELETED':
      return 'red'
    default:
      return 'yellow'
  }
}

const DependencyDiffStatusIcon: React.FunctionComponent<IDependencyDiffStatusIcon> = ({status}) => (
  <Icon
    name='circle'
    size='small'
    color={getDependencyStatusIconColor(status)}
  />
)

export {
  DiffStatusIcon,
  DependencyDiffStatusIcon,
}
