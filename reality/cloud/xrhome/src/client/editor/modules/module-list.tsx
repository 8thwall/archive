import React from 'react'
import {createUseStyles} from 'react-jss'

import {Icon} from '../../ui/components/icon'

import {combine} from '../../common/styles'
import type {ISplitFiles} from '../../git/split-files-by-type'
import type {ScopedFileLocation} from '../editor-file-location'
import {ModuleListItem} from './module-list-item'
import AutoHeadingScope from '../../widgets/auto-heading-scope'
import AutoHeading from '../../widgets/auto-heading'
import {CollapseButton} from '../files/collapse-button'

interface IModuleList {
  paths: ISplitFiles
  activeFileLocation: ScopedFileLocation
  title: string
  openCreateModuleModal: () => void
  onToggleCollapsed: () => void
  showModulesContent?: boolean
}

const useStyles = createUseStyles({
  fileButton: {
    cursor: 'pointer',
  },
  title: {
    margin: '0',
    // fontSize matches $system-font-size
    fontSize: '13px',
    fontWeight: '700px',
    flexGrow: '1',
  },
  heading: {
    padding: '0.25em 0.75em 0.25em 0',
  },
  hidden: {
    visibility: 'hidden',
  },
  moduleFileList: {
    overflowY: 'scroll',
    height: '100%',
  },
})

const ModuleList: React.FC<IModuleList> = ({
  title, paths, activeFileLocation, openCreateModuleModal,
  onToggleCollapsed, showModulesContent,
}) => {
  const {filePaths} = paths
  const hideCollapseIcon = filePaths.length === 0
  const classes = useStyles()

  return (
    <AutoHeadingScope>
      <div className={combine('file-list-heading no-padding', classes.heading)}>
        <div className={hideCollapseIcon ? classes.hidden : ''}>
          <CollapseButton
            onClick={onToggleCollapsed}
            showFiles={showModulesContent}
          />
        </div>
        <AutoHeading className={classes.title}>
          {title}
        </AutoHeading>
        <button
          type='button'
          aria-label='Import module'
          className={combine('style-reset', classes.fileButton)}
          onClick={() => openCreateModuleModal()}
        >
          <Icon stroke='plus' color='gray4' block />
        </button>
      </div>
      {showModulesContent &&
        <ul className={combine(classes.moduleFileList, 'file-list')}>
          {filePaths.map(filePath => (
            <ModuleListItem
              key={filePath}
              filePath={filePath}
              activeFileLocation={activeFileLocation}
            />
          ))}
        </ul>}
    </AutoHeadingScope>
  )
}

export {ModuleList}

export type {IModuleList}
