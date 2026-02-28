import {Modal, Button} from 'semantic-ui-react'
import * as React from 'react'
import {createUseStyles} from 'react-jss'

import {UnifiedDiffView} from './diff/unified-diff-view'
import {generateUnifiedDiff, transformAssets, transformBlobContents} from '../git/utils'
import '../static/styles/merge-diff-land.scss'
import {useCurrentGit, useScopedGit} from '../git/hooks/use-current-git'
import {DiffStatusIcon} from './diff/diff-status-icon'
import {EditorFileLocation, extractFilePath, extractRepoId} from './editor-file-location'
import {useDismissibleModal} from './dismissible-modal-context'
import {Loader} from '../ui/components/loader'
import {Icon} from '../ui/components/icon'

const useStyles = createUseStyles({
  gridContainer: {
    display: 'grid',
    gridTemplateRows: 'auto auto auto 3.5em',
  },

  singleDiff: {
    paddingRight: '1em',
    paddingLeft: '1em',
    paddingBottom: '1em',
    overflow: 'hidden !important',
    minHeight: '50vh !important',
    maxHeight: '75vh !important',
    height: 'auto !important',
  },

  singleDiffTitle: {
    paddingTop: '1em',
    paddingBottom: '1em',
    float: 'bottom',
  },

  closeDiffButton: {
    position: 'absolute',
    marginRight: '0px !important',
    bottom: '1em',
    right: '1em',
  },

  divText: {
    overflow: 'auto',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
    maxHeight: '50vh !important',
  },

  singleDiffStrip: {
    'paddingLeft': '1em !important',
    'flexDirection': 'row !important',
    'justifyContent': 'space-between !important',
    'borderTopLeftRadius': '5px',
    'borderTopRightRadius': '5px',

    '& .icon': {
      paddingRight: '1.5em',
    },
  },
})

interface IViewSingleDiffModal {
  onClose: () => void
  fileLocation: EditorFileLocation
}

const ViewSingleDiffModal: React.FC<IViewSingleDiffModal> = ({onClose, fileLocation}) => {
  useDismissibleModal(onClose)
  const scopedGit = useScopedGit(extractRepoId(fileLocation))
  const primaryGit = useCurrentGit()
  const git = scopedGit || primaryGit
  const diffState = git.diff
  const classes = useStyles()
  const transformedDiffList = transformAssets(diffState.diffList)
  let diffPreviewComponent
  let changes = 0
  const fileName = extractFilePath(fileLocation)
  const diff = transformedDiffList.find(d => d.info.path === fileName)
  if (diff && git.progress.diff === 'READY') {
    const transformedBlobContents = transformBlobContents(diffState.blobContents)
    const {diffViewData, markers, changeCount, gutterDecorations} =
      generateUnifiedDiff(transformedBlobContents[diff.info?.blobId] || '', diff.lines)
    changes = changeCount
    diffPreviewComponent = (
      <UnifiedDiffView
        diffViewData={diffViewData}
        markers={markers}
        gutterDecorations={gutterDecorations}
        info={diff.info}
      />
    )
  } else {
    // eslint-disable-next-line local-rules/hardcoded-copy
    diffPreviewComponent = <Loader>Preparing Diff</Loader>
  }
  // TODO(alvin): Investigate removing any extra divs in this modal.
  return (
    <Modal
      open
      onClose={() => onClose()}
      size='fullscreen'
      className={`diff-modal ${classes.singleDiff}`}
    >
      <div className={classes.gridContainer}>
        <div className={`title ${classes.singleDiffTitle}`}>
          <Icon stroke='codeBranch' size={2} />
          <div>
            <h1>Diff View</h1>
          </div>
        </div>
        {diff?.info && git.progress.diff === 'READY' &&
          <div className={`description-strip ${classes.singleDiffStrip}`}>
            <div>
              <DiffStatusIcon status={diff.info.status} />
              {diff.info.previousPath &&
                <>
                  {diff.info.previousPath}&emsp;
                  <Icon stroke='directionsRows' size={1.3} />
                  &emsp;
                </>}
              {diff.info.path}
            </div>
            <div>{changes} {changes === 1 ? 'change' : 'changes'}</div>
          </div>
        }
        <div className={classes.divText}>
          {diffPreviewComponent}
        </div>
        <Button
          className={classes.closeDiffButton}
          onClick={() => onClose()}
        >
          Close
        </Button>
      </div>
    </Modal>
  )
}
export default ViewSingleDiffModal
