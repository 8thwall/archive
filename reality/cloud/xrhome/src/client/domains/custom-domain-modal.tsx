import React, {useState} from 'react'
import {Button, Modal} from 'semantic-ui-react'

import type {IAccount, IApp} from '../common/types/models'
import {DeemphasizedButton} from '../widgets/deemphasized-button'
import {CustomDomainView} from './custom-domain-view'

type HeadingLevel = 0 | 1 | 2 | 3 | 4 | 5

interface CICustomDomainModal {
  account: IAccount
  app?: IApp
  hideHeader?: boolean
  headerLevel?: HeadingLevel
}

const CustomDomainModal: React.FC<CICustomDomainModal> = (
  {app, account, hideHeader, headerLevel}
) => {
  const [isOpen, setIsOpen] = useState(false)

  const entity = app || account

  const buttonText = 'Manage domains'

  const trigger = app
    ? (
      <DeemphasizedButton
        color='purple'
        onClick={() => setIsOpen(true)}
        content={buttonText}
      />
    )
    : (
      <Button
        onClick={() => setIsOpen(true)}
        content={buttonText}
      />
    )

  const content = (
    <CustomDomainView
      account={account}
      app={app}
      key={entity.uuid}
      hideHeader={hideHeader}
      headerLevel={headerLevel}
      onClose={() => setIsOpen(false)}
      className='raw'
    />
  )

  return (
    <Modal
      className='modal8 custom-domain-modal'
      open={isOpen}
      trigger={trigger}
      closeIcon
      content={isOpen && content}
      onClose={() => setIsOpen(false)}
    />
  )
}

export {
  CustomDomainModal,
}
