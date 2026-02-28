import React, {FC} from 'react'
import {Accordion, Icon, Divider, Menu} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {Link, useParams, useHistory} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import type {AccountWithApps} from '../common/types/models'
import {accountPages} from '../accounts/account-config'
import {
  brandHighlight, brandWhite, gray3, gray4, gray5, mango, darkMango,
} from '../static/styles/settings'
import {
  getPathForAccount,
  getPathForAccountOnboarding,
} from '../common/paths'
import useActions from '../common/use-actions'
import userActions from '../user/user-actions'
import accountActions from '../accounts/account-actions'
import {bool, combine} from '../common/styles'
import {useSelector} from '../hooks'
import {isOnboardingRequired} from '../../shared/account-utils'
import {useUserAccountRole} from '../hooks/use-user-account-role'
import type {AccountSidebarParams} from './account-sidebar'

const useStyles = createUseStyles({
  accordionTitle: {
    'border-left': '4px solid transparent',
    'padding': '1em !important',
    'color': `${gray4} !important`,
    '&:hover, &:focus, &.active': {
      color: `${gray3} !important`,
    },
    '& i': {
      display: 'flex',
      flexWrap: 'wrap',
      width: 'fit-content',
      height: 'fit-content',
    },
    '&.active > i': {
      transform: 'rotate(90deg)',
    },
  },
  accordionContent: {
    'padding': '0 !important',
    '& i': {
      display: 'flex',
      flexWrap: 'wrap',
      width: 'fit-content',
      height: 'fit-content',
    },
  },
  chevron: {
    float: 'right',
    transition: 'all .35s',
  },
  warning: {
    'color': `${mango} !important`,
    '&:hover, &:focus &.active': {
      color: `${darkMango} !important`,
    },
  },
  accountName: {
    display: 'inline-block',
    width: '10rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  accountMenu: {
    'background': 'inherit !important',
    'border-radius': '0 !important',
    'border': '0 !important',
    '& .item': {
      'border-radius': '0 !important',
      '&:hover, &:focus': {
        color: `${gray3} !important`,
        backgroundColor: 'inherit !important',
      },
      '&.active': {
        color: `${brandWhite} !important`,
        backgroundColor: `${gray5} !important`,
        borderLeft: `4px solid ${brandHighlight}`,
      },
    },
  },
  completeSignUpWarningMenu: {
    '& .item': {
      'display': 'flex !important',
      'flex-wrap': 'no-wrap',
      'color': `${mango} !important`,
      '&:hover, &:focus': {
        color: `${darkMango} !important`,
      },
      '& > i': {
        lineHeight: '1.4285em',
      },
      '& > p': {
        maxWidth: '10em',
      },
    },
  },
  pageIcon: {
    marginRight: '1em !important',
  },
  divider: {
    borderTop: '0 !important',
  },
})

interface Props {
  account: AccountWithApps
}

const AccountSidebarAccordion: FC<Props> = ({account}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  const params = useParams<AccountSidebarParams>()
  const history = useHistory()
  const userRole = useUserAccountRole(account)
  const expandedAccounts: Record<string, boolean> = useSelector(
    state => state.common.sidebarExpandedAccounts
  )
  const {toggleSidebarAccountExpanded} = useActions(userActions)
  const {setActivatingAccount} = useActions(accountActions)

  const filteredPages = accountPages.filter(
    p => (p.availableOn === undefined || p.availableOn(account)) && !p.hideInSidebar
  )

  const onTitleClick = () => {
    toggleSidebarAccountExpanded(account.uuid)
  }

  const onStartOnboardingClick = () => {
    setActivatingAccount(account.uuid)
    history.push(getPathForAccountOnboarding())
  }

  let menu
  if (!isOnboardingRequired(account) && account.Apps.length === 0) {
    menu = (
      <Menu
        className={combine(classes.accountMenu, classes.completeSignUpWarningMenu)}
        vertical
        borderless
        fluid
      >
        <Menu.Item onClick={onStartOnboardingClick}>
          <Icon className={classes.pageIcon} name='warning sign' />
          <p>{t('my_projects_page.account_sidebar_accordion.activate_first_project')}</p>
        </Menu.Item>
      </Menu>
    )
  } else if (isOnboardingRequired(account)) {
    let itemStringKey = 'my_projects_page.account_sidebar_accordion.sign_up_for_workspace'
    if (isOnboardingRequired(account) && userRole !== 'OWNER') {
      itemStringKey = 'my_projects_page.account_sidebar_accordion.requires_owner'
    }
    menu = (
      <Menu
        className={combine(classes.accountMenu, classes.completeSignUpWarningMenu)}
        vertical
        borderless
        fluid
      >
        <Menu.Item onClick={onStartOnboardingClick}>
          <Icon className={classes.pageIcon} name='warning sign' />
          <p>{t(itemStringKey)}</p>
        </Menu.Item>
      </Menu>
    )
  } else {
    menu = (
      <Menu className={classes.accountMenu} vertical borderless fluid>
        {filteredPages.map(p => (
          <Menu.Item
            className={
              bool(params.account === account.shortName && params.page === p.path, 'active')
            }
            key={p.path}
            as={Link}
            to={getPathForAccount(account, p.path)}
          >
            <Icon className={classes.pageIcon} name={p.icon} />
            {t(p.name)}
          </Menu.Item>
        ))}
      </Menu>
    )
  }

  return (
    <>
      <Divider fitted className={classes.divider} />
      <Accordion.Title
        className={classes.accordionTitle}
        active={expandedAccounts[account.uuid]}
        onClick={onTitleClick}
      >
        <span className={classes.accountName}>
          {account.name}
        </span>
        <Icon className={classes.chevron} name='chevron right' />
      </Accordion.Title>
      <Accordion.Content
        className={classes.accordionContent}
        active={expandedAccounts[account.uuid]}
      >
        {menu}
      </Accordion.Content>
    </>
  )
}

export default AccountSidebarAccordion
