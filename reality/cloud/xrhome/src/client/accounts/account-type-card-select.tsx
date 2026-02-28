import React from 'react'
import {Card} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {CornerRibbon} from '../uiWidgets/corner-ribbon'
import arCameraIcon from '../static/arCameraIcon.svg'
import arCameraIconHighlighted from '../static/arCameraIcon_highlighted.svg'
import webDeveloperIcon from '../static/webDeveloperIcon.svg'
import webDeveloperIconHighlighted from '../static/webDeveloperIcon_highlighted.svg'
import xrDeveloperIcon from '../static/xrDeveloperIcon.svg'
import xrDeveloperIconHighlighted from '../static/xrDeveloperIcon_highlighted.svg'

interface IAccountTypeCardSelectProps {
  onSelected?: () => void
  cardHeader: string
  selectedIcon: string
  deselectedIcon: string

  selected?: boolean
  children?: React.ReactNode
}

interface IAccountTypeCardSelectsProps {
  value: string
  selectAccountType: (type: 'WebCamera' | 'WebDeveloper' | 'UnityDeveloper') => void
}

const AccountTypeCardSelect: React.FC<IAccountTypeCardSelectProps> = ({
  children, onSelected, cardHeader, selectedIcon, deselectedIcon, selected,
}) => {
  const {t} = useTranslation(['account-onboarding-pages'])

  return (
    <Card onClick={onSelected} className='accountTypeCard with-ribbon'>
      {selected &&
        <CornerRibbon
          color='purple'
          location='top-right'
          size='small'
          className='strong'
        >
          {t('account_type_card_select.selected')}
        </CornerRibbon>}
      <Card.Content textAlign='center'>
        <img src={selected ? selectedIcon : deselectedIcon} className='image' alt='' />
        {cardHeader && <Card.Header textAlign='center'>{cardHeader}</Card.Header>}
        <Card.Description>{children}</Card.Description>
      </Card.Content>
    </Card>
  )
}

const AccountTypeCardSelects: React.FC<IAccountTypeCardSelectsProps> =
  ({value, selectAccountType}) => {
    const {t} = useTranslation(['account-onboarding-pages'])

    return (
      <Card.Group itemsPerRow={3} stackable>
        <AccountTypeCardSelect
          onSelected={() => selectAccountType('WebDeveloper')}
          selected={value === 'WebDeveloper'}
          selectedIcon={webDeveloperIconHighlighted}
          deselectedIcon={webDeveloperIcon}
          cardHeader={t('account_type_card_select.header.web')}
        >
          {t('account_type_card_select.description.web')}
        </AccountTypeCardSelect>

        <AccountTypeCardSelect
          onSelected={() => selectAccountType('WebCamera')}
          selected={value === 'WebCamera'}
          selectedIcon={arCameraIconHighlighted}
          deselectedIcon={arCameraIcon}
          cardHeader={t('account_type_card_select.header.camera')}
        >
          {t('account_type_card_select.description.camera')}
        </AccountTypeCardSelect>

        <AccountTypeCardSelect
          onSelected={() => selectAccountType('UnityDeveloper')}
          selected={value === 'UnityDeveloper'}
          selectedIcon={xrDeveloperIconHighlighted}
          deselectedIcon={xrDeveloperIcon}
          cardHeader={t('account_type_card_select.header.unity')}
        >
          {t('account_type_card_select.description.unity')}
        </AccountTypeCardSelect>
      </Card.Group>
    )
  }

export {
  AccountTypeCardSelects,
}
