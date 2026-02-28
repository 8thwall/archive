import React from 'react'

import type {DeepReadonly} from 'ts-essentials'

import {useTranslation} from 'react-i18next'

import {tinyViewOverride} from '../../static/styles/settings'
import {Badge, type BadgeColor} from '../../ui/components/badge'
import type {IG8Commit} from '../../git/g8-dto'
import {withoutHttps} from '../../../shared/hosting-urls'
import {getCommitHashString, getCommitTimeString} from '../../git/g8-commit'
import {createThemedStyles} from '../../ui/theme'

type ColorTypes = 'latest' | 'staging' | 'public'

const COLORS: DeepReadonly<Record<ColorTypes, BadgeColor>> = {
  staging: 'mango', public: 'mint', latest: 'gray',
}

interface IDeploymentInfoBox {
  name: string
  nameValue: ColorTypes
  commit: IG8Commit
  href: string
  unpublishWidget?: React.ReactNode
}

const useStyles = createThemedStyles(theme => ({
  deploymentInfoBox: {
    '& > td:not(:last-child)': {
      borderRight: '0',
    },
    '&:not(:last-child) > td': {
      borderBottom: `1px solid ${theme.modalContainerBg}`,
    },
  },
  tableTimestamp: {
    width: '13rem',
    paddingRight: '0.5em',
    color: theme.fgMuted,
    fontWeight: '400',
    textAlign: 'right',
  },
  deploymentBadge: {
    'width': '5rem',
    '& > span': {
      width: '55px',
      justifyContent: 'center',
    },
    [tinyViewOverride]: {
      borderBottom: 'none !important',
    },
  },
  commitInfo: {
    width: '6rem',
    [tinyViewOverride]: {
      borderBottom: 'none !important',
    },
  },
  urlWrapper: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle',
    fontSize: '12px',
    [tinyViewOverride]: {
      borderBottom: 'none !important',
    },
  },
  link: {
    'color': theme.fgMain,
    'textDecoration': 'underline',
    '&:hover': {
      color: theme.fgMain,
      textDecoration: 'underline',
    },
  },
}))

const DeploymentInfoBox: React.FC<IDeploymentInfoBox> = (
  {name, nameValue, commit, href, unpublishWidget = null}
) => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  return (
    <tr className={classes.deploymentInfoBox}>
      <td className={classes.deploymentBadge}>
        <Badge color={COLORS[nameValue]} height='micro' variant='pastel'>
          {name}
        </Badge>
      </td>
      <td className={classes.urlWrapper}>
        <a
          target='_blank'
          rel='noopener noreferrer'
          className={classes.link}
          href={href}
          title={href}
        >
          {withoutHttps(href.endsWith('/') ? href.slice(0, -1) : href)}
        </a>
      </td>
      <td className={classes.commitInfo}>
        {commit
          ? getCommitHashString(commit)
          : t('editor_page.publish_modal.publish_status.not_published')}
      </td>
      <td className={classes.tableTimestamp}>
        {unpublishWidget || (commit && getCommitTimeString(commit))}
      </td>
    </tr>
  )
}

export {DeploymentInfoBox}
