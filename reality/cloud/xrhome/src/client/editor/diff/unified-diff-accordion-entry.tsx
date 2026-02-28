import {Accordion, Icon, SemanticICONS} from 'semantic-ui-react'
import React from 'react'
import type {DeepReadonly} from 'ts-essentials'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {IG8FileDiff, IG8FileInfoStatus} from '../../git/g8-dto'
import {generateUnifiedDiff} from '../../git/utils'
import {DiffStatusIcon} from './diff-status-icon'
import {UnifiedDiffView} from './unified-diff-view'
import {EXPANSE_FILE_PATH} from '../../studio/common/studio-files'
import {isAssetPath} from '../../common/editor-files'
import {combine} from '../../common/styles'
import {isStudioExpanseDiffEnabled} from '../../../shared/account-utils'
import useCurrentAccount from '../../common/use-current-account'
import {useUserEditorSettings} from '../../user/use-user-editor-settings'

interface IUnifiedDiffAccordionEntry {
  index: number  // our index in the parent Accordion
  unfolded: boolean

  onTitleClick(index: number): void
  diff: DeepReadonly<IG8FileDiff>
  blobContents: string
}

// NOTE(christoph): The land modal is always dark mode currently.
const useStyles = createUseStyles({
  diffMessage: {
    padding: '0.5rem 1rem',
    margin: '0',
    color: 'white',
  },
  green: {
    backgroundColor: '#1f482f',  // $diff-line-addition
  },
  red: {
    backgroundColor: '#4c232d',  // $diff-line-deletion
  },
  yellow: {
    backgroundColor: '#c4a5598f',  // $diff-line-modification
  },
})

interface IDiffMessage {
  children: React.ReactNode
  color?: 'green' | 'red' | 'yellow'
}

const DiffMessage: React.FC<IDiffMessage> = ({children, color}) => {
  const classes = useStyles()
  return (
    <p className={combine(classes.diffMessage, classes[color])}>{children}</p>
  )
}

interface IAssetDiffMessage {
  status: IG8FileInfoStatus
}

const AssetDiffMessage: React.FC<IAssetDiffMessage> = ({status}) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  if (status === IG8FileInfoStatus.DELETED) {
    return <DiffMessage color='red'>{t('editor_page.diff_view.asset_deleted')}</DiffMessage>
  } else if (status === IG8FileInfoStatus.ADDED) {
    return <DiffMessage color='green'>{t('editor_page.diff_view.asset_added')}</DiffMessage>
  } else {
    return <DiffMessage color='yellow'>{t('editor_page.diff_view.asset_changed')}</DiffMessage>
  }
}

const SceneDiffMessage: React.FC<IAssetDiffMessage> = ({status}) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  if (status === IG8FileInfoStatus.ADDED) {
    return <DiffMessage color='green'>{t('editor_page.diff_view.scene_added')}</DiffMessage>
  } else {
    return <DiffMessage color='yellow'>{t('editor_page.diff_view.scene_changed')}</DiffMessage>
  }
}

interface IInnerDiffAccordionEntry {
  index: number  // our index in the parent Accordion
  unfolded: boolean
  onTitleClick(index: number): void
  status: number
  changeCount?: number
  previousPath?: string
  filePath: string
  children: React.ReactNode
}

const InnerDiffAccordionEntry = ({
  index, unfolded, onTitleClick, status, changeCount, previousPath, filePath, children,
}: IInnerDiffAccordionEntry) => {
  const {t} = useTranslation(['cloud-editor-pages'])

  return (
    <div className='file-diff'>
      <Accordion.Title
        active={unfolded}
        index={index}
        onClick={() => onTitleClick(index)}
        className='rows-header'
      >
        <div>
          <DiffStatusIcon status={status} />
          {previousPath &&
            <>
              {previousPath}
              &emsp;
              <Icon name='long arrow alternate right' size='large' />
              &emsp;
            </>}
          {filePath}
        </div>
        <div>
          {changeCount && t('editor_page.land_button.changes_msg', {count: changeCount})}&emsp;
          <Icon name={`chevron ${unfolded ? 'down' : 'up'}` as SemanticICONS} size='small' />
        </div>
      </Accordion.Title>
      <Accordion.Content
        active={unfolded}
        className='rows-content'
      >
        {children}
      </Accordion.Content>
    </div>
  )
}

const UnifiedDiffAccordionEntry = ({
  index, unfolded, onTitleClick, diff, blobContents,
}: IUnifiedDiffAccordionEntry) => {
  const {t} = useTranslation(['cloud-editor-pages'])
  const account = useCurrentAccount()
  const {viewExpanseDiff} = useUserEditorSettings()
  if (
    !viewExpanseDiff &&
    !isStudioExpanseDiffEnabled(account) &&
    diff.info.path === EXPANSE_FILE_PATH
  ) {
    return (
      <InnerDiffAccordionEntry
        index={index}
        unfolded={unfolded}
        onTitleClick={onTitleClick}
        status={diff.info.status}
        filePath={t('editor_page.diff_view.scene_label')}
      >
        <SceneDiffMessage status={diff.info.status} />
      </InnerDiffAccordionEntry>
    )
  } else if (isAssetPath(diff.info.path)) {
    return (
      <InnerDiffAccordionEntry
        index={index}
        unfolded={unfolded}
        onTitleClick={onTitleClick}
        status={diff.info.status}
        filePath={diff.info.path}
        previousPath={diff.info.previousPath}
      >
        <AssetDiffMessage status={diff.info.status} />
      </InnerDiffAccordionEntry>
    )
  } else {
    const {
      diffViewData, markers, changeCount, gutterDecorations,
    } = generateUnifiedDiff(blobContents || '', diff.lines)
    const filePath = diff.info.path === EXPANSE_FILE_PATH
      ? t('editor_page.diff_view.scene_label')
      : diff.info.path

    return (
      <InnerDiffAccordionEntry
        index={index}
        unfolded={unfolded}
        onTitleClick={onTitleClick}
        status={diff.info.status}
        filePath={filePath}
        previousPath={diff.info.previousPath}
        changeCount={changeCount}
      >
        <UnifiedDiffView
          diffViewData={diffViewData}
          markers={markers}
          gutterDecorations={gutterDecorations}
          info={diff.info}
        />
      </InnerDiffAccordionEntry>
    )
  }
}

export {
  UnifiedDiffAccordionEntry,
}
