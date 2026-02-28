import React from 'react'
import {Checkbox} from 'semantic-ui-react'
import type {DeepReadonly} from 'ts-essentials'

import type {DependencyDiff, IG8FileDiff} from '../../git/g8-dto'
import {DependencyDiffAccordionEntry} from '../diff/dependency-diff-accordion-entry'
import {UnifiedDiffAccordionEntry} from '../diff/unified-diff-accordion-entry'
import {ConditionalPopupWrap} from '../../widgets/conditional-popup-wrap'

interface ILandItemRow {
  diff?: DeepReadonly<IG8FileDiff>
  depDiff?: DeepReadonly< DependencyDiff>
  conflicted: boolean
  hasConflict: boolean
  checked: boolean
  onToggle: () => void
  blobContents?: string
}

const LandItemRow: React.FC<ILandItemRow> = ({
  diff, depDiff, checked, hasConflict, onToggle, conflicted, blobContents,
}) => {
  const [unfolded, setUnFolded] = React.useState(true)

  const toggleFold = () => {
    setUnFolded(s => !s)
  }

  let filePath: string
  let diffContents: React.ReactNode
  if (diff) {
    filePath = diff.info.path
    diffContents = (
      <UnifiedDiffAccordionEntry
        index={undefined}
        unfolded={unfolded}
        onTitleClick={toggleFold}
        diff={diff}
        blobContents={blobContents}
      />
    )
  } else if (depDiff) {
    filePath = depDiff.filePath
    diffContents = (
      <DependencyDiffAccordionEntry
        index={undefined}
        unfolded={unfolded}
        depDiff={depDiff}
        onTitleClick={toggleFold}
      />
    )
  }

  return (
    <div className='land-item-row'>
      <div className='check-box'>
        <ConditionalPopupWrap
          wrap={conflicted}
          message='Conflict detected. Sync before trying to land this file'
        >
          <Checkbox
            icon='check'
            value={filePath}
            checked={checked}
            disabled={hasConflict}
            readOnly={hasConflict}
            onClick={hasConflict ? undefined : onToggle}
          />
        </ConditionalPopupWrap>
      </div>
      <div className='diff'>
        {diffContents}
      </div>
    </div>
  )
}

export {
  LandItemRow,
}
