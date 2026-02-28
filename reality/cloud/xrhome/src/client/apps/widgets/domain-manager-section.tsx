import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {Modal, Accordion} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {DeemphasizedButton} from '../../widgets/deemphasized-button'
import {WebOriginsView} from './web-origins-view'
import {CustomDomainView} from '../../domains/custom-domain-view'
import type {IAccount, IApp} from '../../common/types/models'
import {getPathForAccount, AccountPathEnum, AppPathEnum} from '../../common/paths'
import {
  listWebUpgradeAccounts, isCustomDomainsEnabled,
} from '../../../shared/account-utils'
import {is8thWallHosted, isSelfHosted} from '../../../shared/app-utils'
import LinkOut from '../../uiWidgets/link-out'
import learnIcon from '../../static/icons/learn.svg'
import {brandWhite, darkBlueberry, gray4} from '../../static/styles/settings'
import {useAppPathsContext} from '../../common/app-container-context'
import {Icon} from '../../ui/components/icon'

const useStyles = createUseStyles({
  footer: {
    marginTop: '1em',
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  viewPopupButton: {
    '&.ui.button': {
      backgroundColor: 'transparent',
      color: brandWhite,
      fontSize: '1em',
      fontWeight: 'bold',
      padding: 0,
    },
  },
  learnMoreLinkOut: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    color: darkBlueberry,
  },
  notAvailableText: {
    color: gray4,
  },
})

const FreeAccountMessage = ({account}) => {
  const {t} = useTranslation(['app-pages'])
  return (
    <>
      <p>
        {t('project_dashboard_page.connected_domain.modal.free_account.message',
          {account_type: listWebUpgradeAccounts()})}
      </p>
      <Link className='ui button green' to={getPathForAccount(account, AccountPathEnum.account)}>
        {t('project_dashboard_page.connected_domain.modal.free_account.button.manage_plan')}
      </Link>
    </>
  )
}

const MissingWebOriginMessage = ({account}) => {
  const {t} = useTranslation(['app-pages'])
  return (
    <>
      <p>
        {t('project_dashboard_page.connected_domain.modal.missing_origin.message',
          {account_type: listWebUpgradeAccounts()})}
      </p>
      <Link className='ui button green' to={getPathForAccount(account, AccountPathEnum.account)}>
        {t('project_dashboard_page.connected_domain.modal.missing_origin.button.manage_plan')}
      </Link>
    </>
  )
}

const MissingRepoMessage = ({redirect}) => {
  const {t} = useTranslation(['app-pages'])
  return (
    <>
      <p>{t('project_dashboard_page.connected_domain.modal.missing_repo.message')}</p>
      <Link className='ui button primary' to={redirect}>
        {t('project_dashboard_page.connected_domain.modal.missing_repo.button.manage_plan')}
      </Link>
    </>
  )
}

const DomainAccordionItem = ({active, title, content, onClick, a8}) => (
  <>
    <Accordion.Title as='h3' active={active} onClick={onClick} a8={a8}>
      <Icon stroke={active ? 'caretDown' : 'caretRight'} inline size={1.5} />
      {title}
    </Accordion.Title>
    <Accordion.Content active={active}>
      {content}
    </Accordion.Content>
  </>
)

const SelfHostedDomainOption = ({app, account, active, onClick, a8}) => {
  const {t} = useTranslation(['app-pages'])

  const content = account.webOrigin
    ? <WebOriginsView app={app} />
    : <MissingWebOriginMessage account={account} />

  return (
    <DomainAccordionItem
      active={active}
      title={t('project_dashboard_page.connected_domain.modal.dropdown_title.setup_hosting')}
      content={content}
      onClick={onClick}
      a8={a8}
    />
  )
}
const CustomDomainOption = ({app, active, onClick, a8}) => {
  const {getPathForApp} = useAppPathsContext()
  const redirectLink = getPathForApp(AppPathEnum.files)
  const {t} = useTranslation(['app-pages'])

  const content = app.repoStatus === 'NONE'
    ? <MissingRepoMessage redirect={redirectLink} />
    : (
      <CustomDomainView
        app={app}
        hideHeader
        headerLevel={3}
      />
    )

  return (
    <DomainAccordionItem
      active={active}
      title={t('project_dashboard_page.connected_domain.modal.dropdown_title.setup_project')}
      content={content}
      onClick={onClick}
      a8={a8}
    />
  )
}

interface IDomainManagerSection {
  app: IApp
  account: IAccount
}

const DomainManagerSection: React.FC<IDomainManagerSection> = ({app, account}) => {
  const classes = useStyles()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeOption, setActiveOption] = useState(null)
  const {t} = useTranslation(['app-pages', 'common'])

  const handleOpenModalClick = () => {
    // The connectedDomain option starts open if the app has a connectedDomain
    setModalOpen(true)
    setActiveOption(app.connectedDomain ? 'custom' : null)
  }

  const handleOptionClick = (key) => {
    setActiveOption(activeOption === key ? null : key)
  }

  const getModalContents = () => {
    const allowSelfHosted = account.webOrigin
    const showCustomDomain = isCustomDomainsEnabled(account)

    if (showCustomDomain) {
      return (
        <>
          <p>
            {t('project_dashboard_page.connected_domain.modal.blurb')}
          </p>
          <Accordion fluid styled>
            {(isSelfHosted(app)) &&
              <SelfHostedDomainOption
                app={app}
                account={account}
                active={activeOption === 'self'}
                onClick={() => handleOptionClick('self')}
                a8='click;domain-management;setup-self-hosting-accordian'
              />
            }
            {(is8thWallHosted(app)) &&
              <CustomDomainOption
                app={app}
                active={activeOption === 'custom'}
                onClick={() => handleOptionClick('custom')}
                a8='click;domain-management;setup-custom-domain-accordian'
              />
            }
          </Accordion>
        </>
      )
    } else if (allowSelfHosted) {
      return <WebOriginsView app={app} />
    } else {
      return <FreeAccountMessage account={account} />
    }
  }

  const domainCount = (app.webOrigins ? app.webOrigins.length : 0) +
                        (app.connectedDomain ? 1 : 0)

  const callToActionWords = domainCount === 0
    ? t('project_dashboard_page.connected_domain_card.button.setup_domain')
    : t('button.edit', {ns: 'common'})

  return (
    <>
      <p>
        {t('project_dashboard_page.connected_domain_card.domain_count', {count: domainCount})}
      </p>
      <div className={classes.footer}>
        <DeemphasizedButton
          onClick={handleOpenModalClick}
          className='purple'
          content={callToActionWords}
          a8='click;xrhome-project-dashboard-domain-management;setup-domain-button'
        />
        <LinkOut
          className={classes.learnMoreLinkOut}
          url='https://8th.io/connected-domains'
        ><img alt='learn icon' src={learnIcon} />
        &nbsp;<span>{t('button.learn_more', {ns: 'common'})}</span>
        </LinkOut>
      </div>

      {modalOpen &&
        <Modal
          className='custom-domain-modal'
          open
          closeIcon
          onClose={() => setModalOpen(false)}
        >
          <Modal.Header as='h2'>{callToActionWords}</Modal.Header>
          <Modal.Content>
            {getModalContents()}
          </Modal.Content>
        </Modal>
        }
    </>
  )
}

export {
  DomainManagerSection,
}
