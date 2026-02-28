import React from 'react'
import {Card, Button, Image} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import unityIconSvg from '../../static/unityIcon.svg'
import AccountTierLabel from '../account-tier-label'
import {brandPurple, brandHighlight, tinyViewOverride} from '../../static/styles/settings'
import {Icon} from '../../ui/components/icon'

const useStyles = createUseStyles({
  buttonGroup: {
    'display': 'flex',
    'justify-content': 'space-between',
    'gap': '0.875rem',
    '& > button.ui.button': {
      margin: '0',
    },
    [tinyViewOverride]: {
      'flex-direction': 'column',
    },
  },
  manageAccountButton: {
    '&.ui.button': {
      'border': '1px solid',
      'color': brandPurple,
      'borderColor': brandPurple,
      'background': 'transparent',
      '&:hover': {
        color: brandHighlight,
        borderColor: brandHighlight,
      },
    },
  },
})

const AccountCard = ({
  a, isOwner, role, appCount, select, onManageAccountClick, editAcct,
}) => {
  const {t} = useTranslation(['account-pages'])
  const classes = useStyles()
  return (
    <Card
      onClick={select}
      className='with-ribbon'
    >
      <Card.Content>
        <Card.Header>
          {a.isCamera && <Icon stroke='photoCamera' color='gray4' />}
          {!a.isCamera && a.isWeb && <Icon stroke='jsSquare' color='gray4' />}
          {!a.isCamera && !a.isWeb && <Image className='icon' src={unityIconSvg} />}
          {a.name}
          <AccountTierLabel style={{margin: '10px'}} account={a} />
        </Card.Header>
        <Card.Meta>
          {a.url}
        </Card.Meta>
        <Card.Meta>
          {a.shortName && a.webPublic && `https://apps.8thwall.com/${a.shortName}`}
        </Card.Meta>
        <Card.Description>
          {t('accounts_page.account_card.description.role')}: {role}<br />
          {t('accounts_page.account_card.description.number_apps')}: {appCount}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        {isOwner
          ? (
            <div className={classes.buttonGroup}>
              <Button
                fluid
                onClick={onManageAccountClick}
                size='mini'
                className={classes.manageAccountButton}
              >
                {t('accounts_page.account_card.button.manage_account')}
              </Button>
              <Button fluid onClick={editAcct} size='mini'>
                <Icon inline stroke='editBox' color='gray4' />
                {t('accounts_page.account_card.button.edit')}
              </Button>
            </div>
          )
          : <div className='hint'>{t('accounts_page.account_card.content.hint')}</div>
        }
      </Card.Content>
    </Card>
  )
}

export {AccountCard}
