import React from 'react'
import {Form} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {combine} from '../../common/styles'
import type {IG8Commit} from '../../git/g8-dto'
import {getCommitHashString, getCommitTimeString} from '../../git/g8-commit'
import {useCurrentGit} from '../../git/hooks/use-current-git'
import {createThemedStyles} from '../../ui/theme'
import {editorMonospace, smallMonitorViewOverride} from '../../static/styles/settings'

const useStyles = createThemedStyles(theme => ({
  monoSpace: {
    fontFamily: editorMonospace,
  },
  commitListContainerField: {
    overflowY: 'hidden',
  },
  commitListContainer: {
    // TODO (tri) maybe pull this border out into a theme variable
    border: `1px solid ${theme.modalContainerBg}`,
    borderRadius: '0.5rem',
    overflowY: 'auto',
    scrollbarGutter: 'stable',
    scrollbarWidth: 'thin',
  },
  tableTimestamp: {
    paddingRight: '0.5em',
    color: theme.fgMuted,
    fontWeight: '400',
    textAlign: 'right',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tableBody: {
    'fontSize': '12px',
    '& > :last-child': {
      'borderBottom': 'none',
    },
  },
  commitTable: {
    'maxHeight': '30vh',
    'width': '100%',
    [smallMonitorViewOverride]: {
      width: 'auto',
    },
    'tableLayout': 'fixed',
    'position': 'relative',

    '&, tr, th, td': {
      border: 'none',
      borderSpacing: '0',
    },

    '& td, th': {
      padding: '0.5rem',
      [smallMonitorViewOverride]: {
        padding: '0.25rem',
      },
    },

    '& thead th': {
      position: 'sticky',
      top: 0,
    },
  },
  commit: {
    width: '7em',
  },
  radio: {
    width: '7em',
    textAlign: 'center',
  },
  date: {
    width: '15em',
  },
  summary: {
  },
}))

interface ICommitSelectRow {
  commit: IG8Commit
  stagingHash: string
  productionHash: string
  onSelectStaging: () => void
  onSelectProduction: () => void
}

const CommitSelectRow: React.FC<ICommitSelectRow> = ({
  commit, stagingHash, productionHash, onSelectStaging, onSelectProduction,
}) => {
  const timeString = getCommitTimeString(commit)
  const attributionString = `by ${(commit.signature && commit.signature.name) || '8th Wall'}`
  const infoText = `${timeString ? `${timeString} ` : ''}${attributionString}`
  const classes = useStyles()

  return (
    <tr>
      <td className={combine(classes.monoSpace, classes.commit)}>
        {getCommitHashString(commit)}
      </td>
      <td className={classes.radio}>
        <Form.Radio onClick={onSelectStaging} checked={stagingHash === commit.id} />
      </td>
      <td className={classes.radio}>
        <Form.Radio onClick={onSelectProduction} checked={productionHash === commit.id} />
      </td>
      <td className={classes.summary}>{commit.summary}</td>
      <td className={classes.tableTimestamp}>{infoText}</td>
    </tr>
  )
}

interface PublishCommitTableProps {
  newStagingHash?: string
  newProductionHash?: string
  handleVersionSelect: (commitId: string, version: 'staging' | 'production') => void
}

const PublishCommitTable: React.FC<PublishCommitTableProps> = ({
  newStagingHash = '', newProductionHash = '', handleVersionSelect,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])
  const {logs} = useCurrentGit()

  return (
    <div className={classes.commitListContainer}>
      <Form.Field className={classes.commitListContainerField}>
        <table className={classes.commitTable}>
          <thead>
            <tr>
              <th
                className={classes.commit}
                aria-label={t('editor_page.publish_modal.table_header.commit')}
              />
              <th className={classes.radio}>
                {t('editor_page.publish_modal.table_header.staging')}
              </th>
              <th className={classes.radio}>
                {t('editor_page.publish_modal.table_header.public')}
              </th>
              <th
                className={classes.summary}
                aria-label={t('editor_page.publish_modal.table_header.commit_summary')}
              />
              <th
                className={classes.tableTimestamp}
                aria-label={t('editor_page.publish_modal.table_header.commit_timestamp')}
              />
            </tr>
          </thead>
          <tbody className={classes.tableBody}>
            {logs.map(commit => (
              <CommitSelectRow
                key={commit.id}
                commit={commit}
                stagingHash={newStagingHash}
                productionHash={newProductionHash}
                onSelectStaging={() => handleVersionSelect(commit.id, 'staging')}
                onSelectProduction={() => handleVersionSelect(commit.id, 'production')}
              />
            ))}
          </tbody>
        </table>
      </Form.Field>
    </div>
  )
}

export type {PublishCommitTableProps}
export {PublishCommitTable}
