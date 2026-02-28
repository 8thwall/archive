import React from 'react'
import {Accordion, Icon, SemanticICONS} from 'semantic-ui-react'
import type {DeepReadonly} from 'ts-essentials'

import {DependencyDiffStatusIcon} from './diff-status-icon'
import {DependencyDiffView} from './dependency-diff-view'
import type {DependencyDiff} from '../../git/g8-dto'

interface IDependencyDiffAccordionEntry {
  index: number
  unfolded: boolean
  depDiff: DeepReadonly<DependencyDiff>
  onTitleClick: (index: number) => void
}

const DependencyDiffAccordionEntry: React.FunctionComponent<IDependencyDiffAccordionEntry> = ({
  index, unfolded, onTitleClick, depDiff,
}) => (
  <div className='file-diff'>
    <Accordion.Title
      active={unfolded}
      index={index}
      onClick={() => onTitleClick(index)}
      className='rows-header'
    >
      <div>
        <DependencyDiffStatusIcon status={depDiff.status} />
        {!!depDiff.previousAlias &&
          <>
            {depDiff.previousAlias}
              &emsp;
            <Icon name='long arrow alternate right' size='large' />
              &emsp;
          </>}
        {depDiff.alias}
      </div>
      <div>
        <Icon
          name={
              `chevron ${unfolded ? 'up' : 'down'}` as SemanticICONS
            }
          size='small'
        />
      </div>
    </Accordion.Title>
    <Accordion.Content
      active={unfolded}
      className='rows-content'
    >
      <DependencyDiffView depDiff={depDiff} />
    </Accordion.Content>
  </div>
)

export {
  DependencyDiffAccordionEntry,
}
