import {Accordion, Icon, Modal} from 'semantic-ui-react'
import React, {useState} from 'react'

import {removeDependencies, transformAssets, transformBlobContents} from '../../git/utils'
import {getTruncatedHash} from '../../git/g8-commit'
import {UnifiedDiffAccordionEntry} from './unified-diff-accordion-entry'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import type {DependencyDiff} from '../../git/g8-dto'
import {DependencyDiffAccordionEntry} from './dependency-diff-accordion-entry'

interface IDiffViewModal {
  onClose: () => void
  commitId: string
  description: string
  whenByWhom: string
  dependencyDiff: DependencyDiff[]
}

const DiffViewModal = ({
  onClose, commitId, description, whenByWhom, dependencyDiff,
}: IDiffViewModal) => {
  const [closeIndex, setCloseIndex] = useState([])
  const diffState = useCurrentGit(git => git.diff)

  const dependenciesRemovedDiffList = removeDependencies(diffState.diffList)

  const transformedDiffList = transformAssets(dependenciesRemovedDiffList)
  const transformedBlobContents = transformBlobContents(diffState.blobContents)

  const toggleFold = (index) => {
    if (closeIndex.includes(index)) {
      setCloseIndex(closeIndex.filter(i => i !== index))
    } else {
      setCloseIndex([...closeIndex, index])
    }
  }

  const numChanges = transformedDiffList.length + dependencyDiff.length
  const msgNumModified = [numChanges, numChanges === 1 ? 'file' : 'files', 'modified'].join(' ')

  return (
    <Modal open onClose={onClose} size='fullscreen' className='diff-modal'>
      <div className='title'>
        <div>
          <Icon name='code branch' size='big' />
        </div>
        <div>
          <h1>Diff View</h1>
          <div>{msgNumModified}</div>
        </div>
      </div>
      <div className='description-strip'>
        <div className='commit-hash'>{getTruncatedHash(commitId)}</div>
        <div>{description}</div>
        <div>{whenByWhom}</div>
      </div>
      <br />
      <Accordion fluid styled className='diff-list'>
        {transformedDiffList.map((diff, i) => (
          <UnifiedDiffAccordionEntry
            key={diff.info.path}
            index={i}
            unfolded={!closeIndex.includes(i)}
            onTitleClick={toggleFold}
            diff={diff}
            blobContents={transformedBlobContents[diff.info.blobId]}
          />
        ))}
        {dependencyDiff.map((depDiff, i2) => {
          const i = transformedDiffList.length + i2
          return (
            <DependencyDiffAccordionEntry
              key={depDiff.filePath}
              index={i}
              unfolded={!closeIndex.includes(i)}
              depDiff={depDiff}
              onTitleClick={toggleFold}
            />
          )
        })}
      </Accordion>
    </Modal>
  )
}

export {
  DiffViewModal,
}

export type {
  IDiffViewModal,
}
