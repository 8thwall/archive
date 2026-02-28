import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation, Trans} from 'react-i18next'

import ErrorMessage from '../home/error-message'
import useCurrentAccount from '../common/use-current-account'
import {getPublicPathForAccount} from '../common/paths'
import useActions from '../common/use-actions'
import {getPathForAccount, AccountPathEnum} from '../common/paths'
import {brandBlack, brandPurple} from '../static/styles/settings'
import learnSVG from '../static/icons/learn.svg'
import Page from '../widgets/page'
import ColoredMessage from '../messages/colored-message'
import {FluidCardContainer, FluidCardContent} from '../widgets/fluid-card'
import WorkspaceCrumbHeading from '../widgets/workspace-crumb-heading'
import accountActions from './account-actions'
import useStyles from './account-profile-page-jss'
import AccountProfileTopSection from './account-profile-top-section'
import AccountDeactivateConfirmModal from './widgets/account-deactivate-confirm-modal'
import LinkOut from '../uiWidgets/link-out'
import {
  isShowcaseSettingsEnabled,
  isEntryWebAccount,
} from '../../shared/account-utils'
import {canUpdatePublicProfile} from '../../shared/roles-utils'
import AccountProfilePageInfoSection from './account-profile-page-info-section'
import AccountProfileNonAdminContent from './account-profile-non-admin-content'
import {useUserUuid} from '../user/use-current-user'
import {Icon} from '../ui/components/icon'

const messageUseStyles = createUseStyles({
  purpleMessage: {
    color: brandPurple,
  },
  marginBottom: {
    marginBottom: '1.5em',
  },
  icon: {
    fontSize: '1em !important',
    width: '1em !important',
  },
  link: {
    color: brandBlack,
    textDecoration: 'underline',
    fontWeight: '700',
  },
})

const AccountProfilePage: React.FC = React.memo(() => {
  const account = useCurrentAccount()
  const userUuid = useUserUuid()
  const {updateAccountPublicFeatured} = useActions(accountActions)
  const classes = useStyles()
  const messageClasses = messageUseStyles()
  const {t} = useTranslation(['account-pages', 'common'])

  const {publicFeatured, uuid} = account
  const userAccount = account.Users.find(user => user.UserUuid === userUuid)
  const canUpdate = canUpdatePublicProfile(userAccount)

  const [isUpdatingPublicFeatured, setIsUpdatingPublicFeatured] = React.useState(false)
  const [showDeactivateConfirmModal, setShowDeactivateConfirmModal] = React.useState(false)
  // following states are shared by both section components
  const [hasEmptyRequiredFormField, setHasEmptyRequiredFormField] = React.useState(false)
  const [shouldHighlightRequired, setShouldHighlightRequired] = React.useState(false)
  const [isPublishDisabled, setIsPublishDisabled] = React.useState(true)

  const updatePublicFeatured = async (value) => {
    // Check and highlight not filled required fields
    if (value && hasEmptyRequiredFormField) {
      setShouldHighlightRequired(true)
      return
    }

    setIsUpdatingPublicFeatured(true)
    await updateAccountPublicFeatured({
      uuid, publicFeatured: value,
    })
    if (showDeactivateConfirmModal) {
      setShowDeactivateConfirmModal(false)
    }
    setIsUpdatingPublicFeatured(false)
  }

  const accountProfileTopSectionProps = {
    account,
    isUpdatingPublicFeatured,
    updatePublicFeatured,
    shouldHighlightRequired,
    isPublishDisabled,
  }

  const upgradeAccountCTA = (
    <ColoredMessage
      color='blue'
      iconName='info circle'
      iconClass={messageClasses.icon}
      className={messageClasses.marginBottom}
    >{t('profile_page.upgrade_account_cta')}&nbsp;
      <Link
        className={messageClasses.link}
        to={getPathForAccount(account, AccountPathEnum.account)}
      >{t('profile_page.account_settings')}
      </Link>.
    </ColoredMessage>
  )

  const publicProfileContent = canUpdate
    // Returns form for admin roles.
    ? (
      <AccountProfilePageInfoSection
        account={account}
        setHasEmptyRequiredFormField={setHasEmptyRequiredFormField}
        shouldHighlightRequired={shouldHighlightRequired}
        setShouldHighlightRequired={setShouldHighlightRequired}
        setIsPublishDisabled={setIsPublishDisabled}
      />
    )
    : <AccountProfileNonAdminContent account={account} />

  const publicProfileView = isShowcaseSettingsEnabled(account)
    ? (
      <>
        <div className={classes.topButtonContainer}>
          <div>
            <Button
              primary
              as={Link}
              to={getPublicPathForAccount(account)}
              disabled={!publicFeatured}
              target='_blank'
              rel='noopener noreferrer'
            >{t('profile_page.view')}
            </Button>
          </div>
        </div>
        <ErrorMessage className={classes.errorMessage} />
        <FluidCardContainer>
          <FluidCardContent className='fluid'>
            <div className={classes.publicProfileContainer}>
              <h4 className={classes.sectionTitle}>
                {t('profile_page.title')}&nbsp;
                {!canUpdate && <Icon inline stroke='lock' color='gray3' />}
              </h4>
              <p>
                <Trans
                  ns='account-pages'
                  i18nKey='profile_page.blurb'
                  components={{
                    1: <LinkOut url='https://www.8thwall.com' />,
                    2: <b />,
                  }}
                />
                {!isEntryWebAccount(account) &&
                  <Trans ns='account-pages' i18nKey='profile_page.blurb_pro'>
                    Once activated, you can feature projects on your Public Profile from the{' '}
                    <b>Feature Project</b> page of each project.
                  </Trans>
                }{' '}
                <LinkOut
                  className={classes.learnMore}
                  url='https://8th.io/public-profiles'
                >
                  <img
                    className={classes.learnMoreIcon}
                    alt='learn icon'
                    src={learnSVG}
                    draggable={false}
                  />&nbsp;{t('button.learn_more', {ns: 'common'})}
                </LinkOut>
              </p>
              {canUpdate
                ? <AccountProfileTopSection {...accountProfileTopSectionProps} />
                : (
                  <p>
                    {isEntryWebAccount(account)
                      ? t('profile_page.non_admin_view_web_entry')
                      : t('profile_page.non_admin_view')
                    }
                  </p>
                )
              }
            </div>
            <div className={classes.pageInfoContainer}>
              {publicProfileContent}
            </div>
            {canUpdate && publicFeatured &&
            (!isEntryWebAccount(account)) &&
              <Button
                className={classes.deactivateButton}
                onClick={() => setShowDeactivateConfirmModal(true)}
              >{t('profile_page.button.deactivate')}
              </Button>
            }
          </FluidCardContent>
        </FluidCardContainer>
      </>
    )
    : (
      <>
        <ErrorMessage className={classes.errorMessage} />
        {upgradeAccountCTA}
      </>
    )

  return (
    <Page headerVariant='workspace'>
      <WorkspaceCrumbHeading text={t('profile_page.title')} account={account} />
      {publicProfileView}
      {showDeactivateConfirmModal &&
        <AccountDeactivateConfirmModal
          onConfirm={() => updatePublicFeatured(false)}
          onClose={() => setShowDeactivateConfirmModal(false)}
          isUpdating={isUpdatingPublicFeatured}
        />
      }
    </Page>
  )
})

export default AccountProfilePage
