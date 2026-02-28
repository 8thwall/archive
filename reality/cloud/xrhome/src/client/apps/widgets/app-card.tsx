import * as React from 'react'
import {Link, useParams} from 'react-router-dom'
import {Card, Dropdown, Label} from 'semantic-ui-react'
import {join} from 'path'
import {useTranslation, TFunction} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {useRouteMatch} from 'react-router-dom'

import {useUserAccountRole} from '../../hooks/use-user-account-role'
import type {IAccount, IApp, ICrossAccountPermission} from '../../common/types/models'
import {
  canUpgradeAppToPaidCommercial,
  getStatusUpgrade,
  isActive,
  isArchived,
  deriveAppCoverImageUrl,
  getDisplayNameForApp,
  isAppLicenseType,
  isAppShareable,
  isCloudEditorApp,
  isAdApp,
  isSelfHosted,
  isCloudStudioApp,
  hasLaunchLicense,
} from '../../../shared/app-utils'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../../shared/app-constants'
import {
  isPro, isBusiness, hasPendingCancellation, isEnterprise, isCloudEditorEnabled,
  isCloudStudioEnabled,
} from '../../../shared/account-utils'
import {
  getPathForAccount, getPathForApp, getPathForAppNoTrailing, AccountPathEnum, AppPathEnum,
  getPathForLicensePurchase,
} from '../../common/paths'
import AppStatus from './app-status'
import useAppSharingInfo from '../../common/use-app-sharing-info'
import {Badge} from '../../ui/components/badge'
import '../../static/styles/index.scss'
import {useSelector} from '../../hooks'
import {BasicCardThumbnail} from '../../widgets/basic-card-thumbnail'
import ShareProjectModal from '../../cross-account-permissions/widgets/share-project-modal'
import {isBillingRole} from '../../../shared/roles-utils'
import {useCurrentUser} from '../../user/use-current-user'
import {LinkButton} from '../../ui/components/link-button'
import appsBillingActions from '../../billing/apps-billing-actions'
import {
  ReactivateWithSplashScreenModal,
} from '../../cross-account-permissions/widgets/reactivate-with-splash-screen-modal'
import type {UserAccountRole} from '../../common/types/db'
import type {Dispatch} from '../../common/types/actions'
import {canPurchaseWhiteLabelLicense} from '../../../shared/billing/white-label-gating'
import {RemoveExternalAppConfirmationModal}
  from '../../cross-account-permissions/widgets/remove-external-app-confirm-modal'
import {getRouteMemberAccount} from '../../common/paths'
import {PROFILE_ROLES} from '../../../shared/account-constants'
import {bool, combine} from '../../common/styles'
import {useAppCardStyles} from './use-app-card-styles'

interface AppCardProps {
  app: IApp
  noLink?: boolean

  /** Whether account information should be displayed in the footer.  */
  accountFooter?: boolean
}

const getAppCommercialUpgrade = (app, account, role) => {
  if (app.violationStatus === 'Violation' ||
    app.status === 'DELETED' ||
    !isBillingRole(role) ||
    !(isPro(account) || isBusiness(account)) ||
    hasPendingCancellation(account)) {
    return null
  }

  return getStatusUpgrade(app.commercialStatus)
}

const maybeAddEnterpriseWhiteLabelOption = (
  options: Array<React.JSX.Element>,
  app: IApp,
  account: IAccount,
  role: UserAccountRole,
  t: TFunction,
  dispatch: Dispatch | null = null
) => {
  if (isArchived(app)) {
    options.push(
      <Dropdown.Item
        key='reactivate'
        as={LinkButton}
        onClick={async () => {
          await dispatch?.(appsBillingActions).upgradeEnterpriseApp(app.uuid)
        }}
        text={t('account_dashboard_page.app_card.link.reactivate_white_label',
          {ns: 'account-pages'})}
      />
    )
  } else if (canUpgradeAppToPaidCommercial(account, app, role)) {
    options.push(
      <Dropdown.Item
        key='upgrade'
        as={LinkButton}
        onClick={async () => {
          await dispatch?.(appsBillingActions).upgradeEnterpriseApp(app.uuid)
        }}
        text={t('account_dashboard_page.app_card.link.launch_white_label', {ns: 'account-pages'})}
      />
    )
  }
}

const maybeAddWhiteLabelOption = (
  options: Array<React.JSX.Element>,
  app: IApp,
  account: IAccount,
  role: UserAccountRole,
  t: TFunction,
  dispatch: Dispatch | null = null
) => {
  if (!canPurchaseWhiteLabelLicense(account)) {
    return
  }

  if (isEnterprise(account)) {
    maybeAddEnterpriseWhiteLabelOption(options, app, account, role, t, dispatch)
    return
  }

  const purchaseCta = t(
    'account_dashboard_page.app_card.link.purchase_white_label',
    {ns: 'account-pages'}
  )
  const reactivateCta = t(
    'account_dashboard_page.app_card.link.reactivate_white_label',
    {ns: 'account-pages'}
  )

  if (canUpgradeAppToPaidCommercial(account, app, role) && !hasLaunchLicense(app)) {
    const upgradeLink = getPathForLicensePurchase(account, app)
    options.push(
      <Dropdown.Item
        key='upgrade'
        as={Link}
        to={upgradeLink}
        text={isArchived(app) ? reactivateCta : purchaseCta}
      />
    )
  }
}

const maybeAddDuplicateProject = (options, app, account, fromWorkspace, t, isOnlyAccount) => {
  if (isAdApp(app) || isSelfHosted(app)) {
    return
  }

  // If app is public and user has more than one workspace, user can select
  // which workspace he can copy into.
  // Otherwise, copy the app into the same workspace as the source project.
  const isSourcePublic = app.repoStatus === 'PUBLIC'
  const appPath = getPathForAppNoTrailing(account, app)
  const duplicateAppPath = isSourcePublic && !isOnlyAccount
    ? join('/duplicate-project', appPath)
    : join(getPathForAccount(account, AccountPathEnum.duplicateProject), appPath)

  options.push((
    <Dropdown.Item
      as={Link}
      to={{
        pathname: duplicateAppPath,
        state: {fromWorkspace},
      }}
      key='duplicate'
      text={t('account_dashboard_page.app_card.link.duplicate_project',
        {ns: 'account-pages'})}
    />
  ))
}

const maybeAddManageLicenseOption = (options, app, account, t) => {
  // TODO(alvin): Should this check whether the app is in violation?

  if (app.commercialStatus === 'DEVELOP' || app.commercialStatus === 'LAUNCH') {
    const billingPath = getPathForAccount(account, AccountPathEnum.account)

    options.push(
      <Dropdown.Item
        as={Link}
        to={billingPath}
        key='manageLicense'
        text={t('account_dashboard_page.app_card.link.manage_subscription', {ns: 'account-pages'})}
      />
    )
  }
}

const maybeAddEditorOption = (options, app, account, t, appFilesPath = '') => {
  const canGoToCloudEditor = isCloudEditorApp(app) || isAdApp(app)
  if (isCloudEditorEnabled(account) && canGoToCloudEditor) {
    options.push((
      <Dropdown.Item
        key='editor'
        as={Link}
        to={appFilesPath || getPathForApp(account, app, AppPathEnum.files)}
        text={t('account_dashboard_page.app_card.link.go_to_editor',
          {ns: 'account-pages'})}
      />
    ))
  }
}

const maybeAddStudioOption = (options, app, account, t, appFilesPath = '') => {
  if (isCloudStudioEnabled(account) && isCloudStudioApp(app)) {
    options.push((
      <Dropdown.Item
        key='studio'
        as={Link}
        to={appFilesPath || getPathForApp(account, app, AppPathEnum.studio)}
        text={t('account_dashboard_page.app_card.link.go_to_studio',
          {ns: 'account-pages'})}
      />
    ))
  }
}

const maybeAddReactivateSplashScreenOption = (
  options: any, app: IApp, t: TFunction, onReactivateSplashScreenClick: () => void
) => {
  if (isArchived(app)) {
    const label = t('account_dashboard_page.app_card.link.reactivate_with_splash_screen',
      {ns: 'account-pages'})
    options.push(
      <Dropdown.Item
        key='reactivate-as-demo'
        as={LinkButton}
        onClick={onReactivateSplashScreenClick}
        text={label}
      />
    )
  }
}

type RouteParams = {
  account: string
}

interface IArchivedCardOptions {
  app: IApp
  account: IAccount
  onReactivateSplashScreenClick?: () => void
}

const ArchivedCardOptions: React.FC<IArchivedCardOptions> = ({
  app, account, onReactivateSplashScreenClick,
}) => {
  const {t} = useTranslation('sign-up-pages')
  const {account: fromWorkspace} = useParams<RouteParams>()
  const user = useCurrentUser()
  const dispatch = useDispatch<Dispatch>()
  const userAccount = account.Users && account.Users.find(u => u.UserUuid === user.uuid)
  const role = userAccount?.role
  const isOnlyAccount = useSelector(state => state.accounts.allAccounts.length === 1)
  const options = []
  maybeAddDuplicateProject(options, app, account, fromWorkspace, t, isOnlyAccount)
  maybeAddWhiteLabelOption(options, app, account, role, t, dispatch)
  maybeAddReactivateSplashScreenOption(options, app, t, onReactivateSplashScreenClick)
  if (options.length !== 0) {
    return <Dropdown options={options} pointing='top right' icon='ellipsis vertical' />
  } else {
    return null
  }
}

interface IActiveCardOptions {
  app: IApp
  account: IAccount
  onShareOptionClick?: () => void
}

const ActiveCardOptions: React.FC<IActiveCardOptions> = ({app, account, onShareOptionClick}) => {
  const {t} = useTranslation('account-pages')
  const {account: fromWorkspace} = useParams<RouteParams>()
  const user = useCurrentUser()
  const userAccount = account.Users && account.Users.find(u => u.UserUuid === user.uuid)
  const role = userAccount?.role
  const dispatch = useDispatch<Dispatch>()
  const isOnlyAccount = useSelector(
    state => state.accounts.allAccounts.length === 1 && state.accounts.allAccounts[0]
  )
  const options = []
  // Ordering matters here.
  maybeAddEditorOption(options, app, account, t)
  maybeAddStudioOption(options, app, account, t)
  maybeAddWhiteLabelOption(options, app, account, role, t, dispatch)
  maybeAddDuplicateProject(options, app, account, fromWorkspace, t, isOnlyAccount)
  maybeAddManageLicenseOption(options, app, account, t)
  const settingsLink = getPathForApp(account, app, AppPathEnum.settings)
  if (isAppShareable(app, account)) {
    options.push((
      <Dropdown.Item
        as='div'
        key='share'
        text={t('account_dashboard_page.app_card.link.share')}
        onClick={onShareOptionClick}
      />
    ))
  }
  options.push((
    <Dropdown.Item
      as={Link}
      to={settingsLink}
      key='settings'
      text={t('account_dashboard_page.app_card.link.settings')}
    />
  ))
  return (
    <Dropdown options={options} pointing='top right' icon='ellipsis vertical' />
  )
}

interface IExternalAppOptions {
  app: IApp
  onRemoveExternalAppClick: (permissionToRemove) => void
}

const ExternalAppOptions: React.FC<IExternalAppOptions> = ({app, onRemoveExternalAppClick}) => {
  const {externalOwnerAccount, memberInviteeAccount} = useAppSharingInfo(app)
  const routeMatch = useRouteMatch()
  const currentWorkspace = useSelector(state => getRouteMemberAccount(state, routeMatch))
  const role = useUserAccountRole(currentWorkspace)
  const permissions = useSelector(state => state.crossAccountPermissions.entities)
  const activePermission = Object.values(permissions).find((perm: ICrossAccountPermission) => (
    perm.AppUuid === app.uuid &&
    perm.ToAccount.uuid === memberInviteeAccount?.uuid &&
    perm.FromAccount.uuid === externalOwnerAccount?.uuid
  ))

  const options = []
  const getAppPath = (page: AppPathEnum) => getPathForApp(
    {member: memberInviteeAccount, external: externalOwnerAccount},
    app,
    page
  )
  const settingsPath = getAppPath(AppPathEnum.settings)

  const {t} = useTranslation('account-pages')
  maybeAddEditorOption(options, app, externalOwnerAccount, t, getAppPath(AppPathEnum.files))
  maybeAddStudioOption(options, app, externalOwnerAccount, t, getAppPath(AppPathEnum.studio))

  if (currentWorkspace?.uuid === memberInviteeAccount?.uuid && PROFILE_ROLES.includes(role)) {
    options.push((
      <Dropdown.Item
        as={LinkButton}
        onClick={() => onRemoveExternalAppClick(activePermission)}
        key='removeExternalProjectDropdown'
        text={t('account_dashboard_page.app_card.link.remove_external_project')}
      />
    ))
  }
  options.push((
    <Dropdown.Item
      as={Link}
      to={settingsPath}
      key='settings'
      text={t('account_dashboard_page.app_card.link.settings')}
    />
  ))

  return (
    <Dropdown options={options} pointing='top right' icon='ellipsis vertical' />
  )
}

interface ICardOptions {
  app: IApp
  account: IAccount
  isExternalApp?: boolean
  onShareOptionClick?: () => void
  onReactivateSplashScreenClick?: () => void
  onRemoveExternalAppClick?: (permission: ICrossAccountPermission) => void
}

const CardOptions: React.FC<ICardOptions> = ({
  app, account, onShareOptionClick, isExternalApp,
  onReactivateSplashScreenClick, onRemoveExternalAppClick,
}) => {
  if (isExternalApp) {
    return <ExternalAppOptions app={app} onRemoveExternalAppClick={onRemoveExternalAppClick} />
  } else if (isActive(app)) {
    return <ActiveCardOptions app={app} account={account} onShareOptionClick={onShareOptionClick} />
  } else {
    return (
      <ArchivedCardOptions
        app={app}
        account={account}
        onReactivateSplashScreenClick={onReactivateSplashScreenClick}
      />
    )
  }
}

const getCardBadgeLabel = (app?: IApp): string => {
  if (app) {
    if (app.hostingType === 'CLOUD_STUDIO') {
      // eslint-disable-next-line local-rules/hardcoded-copy
      return 'Studio'
    }
    if (app.hostingType === 'SELF') {
      // eslint-disable-next-line local-rules/hardcoded-copy
      return 'App Key'
    }
  }
  return ''
}

const AppCard: React.FC<AppCardProps> = ({app, accountFooter, noLink = false}) => {
  const {t} = useTranslation('account-pages')
  const classes = useAppCardStyles()
  const accounts = useSelector(state => state.accounts.allAccounts)
  const {
    isExternalApp, externalOwnerAccount, sharingAccounts, memberInviteeAccount,
  } = useAppSharingInfo(app)
  let account: IAccount | undefined = accounts?.find(
    a => a.uuid === app.AccountUuid
  )

  if (isExternalApp) {
    account = externalOwnerAccount
  }
  const [showShareModal, setShowShareModal] = React.useState(false)
  const [reactivateSplashScreenModal, setReactivateSplashScreenModal] = React.useState(false)
  const [permissionToRemove, setPermissionToRemove] = React.useState<ICrossAccountPermission>(null)
  const cardLink = getPathForApp({
    member: isExternalApp ? memberInviteeAccount : account,
    external: isExternalApp ? externalOwnerAccount : undefined,
  }, app)
  const shortLink = app && app.shortLink && `8th.io/${app.shortLink}`
  const badgeLabel = getCardBadgeLabel(app)

  const isAppActive = isActive(app)
  const isAppDisabled = app.status === 'DISABLED'

  const thumbnailSrc = deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[400])

  return (
    <>
      <Card className={combine(classes.appCard, bool(isAppDisabled, 'disabled'))}>
        <Card.Content className='header-content'>
          <Card.Header className={classes.header}>
            {noLink
              ? <div className='left truncate-span'>{getDisplayNameForApp(app)}</div>
              : (
                <Link
                  title={getDisplayNameForApp(app)}
                  className='left truncate-span'
                  to={cardLink}
                >{getDisplayNameForApp(app)}
                </Link>
              )
            }
            {isAppDisabled && isAppActive &&
              <Label
                className='thin-label'
                basic
                color={app.commercialStatus === 'LAUNCH' ? 'red' : undefined}
                content={t('account_dashboard_page.app_card.label.disabled')}
              />
            }
            <div className='right'>
              {(isAppActive || isArchived(app)) && account &&
                <CardOptions
                  app={app}
                  account={account}
                  onShareOptionClick={() => setShowShareModal(true)}
                  onRemoveExternalAppClick={setPermissionToRemove}
                  onReactivateSplashScreenClick={() => setReactivateSplashScreenModal(true)}
                  isExternalApp={isExternalApp}
                />
              }
            </div>
          </Card.Header>
        </Card.Content>
        <BasicCardThumbnail
          to={noLink ? null : cardLink}
          src={thumbnailSrc}
          badgeLabel={badgeLabel}
        />
        <Card.Content className='footer-content'>
          <div className='left truncate-span'>
            {accountFooter && account &&
              <p className='account-name truncate-span'>
                {account.name}
              </p>
            }
            {!accountFooter && shortLink && isAppActive && (sharingAccounts.length < 1) &&
              <a href={`https://${shortLink}`}>{shortLink}</a>
            }
            {!accountFooter && sharingAccounts.length > 0 &&
              <Badge color='purple' variant='pastel'>
                {t('account_dashboard_page.app_card.badge.shared_project')}
              </Badge>
            }
          </div>
          <div className='right'>
            {!isExternalApp && !isAppLicenseType(app) && <AppStatus app={app} />}
          </div>
        </Card.Content>
      </Card>
      {showShareModal && <ShareProjectModal app={app} onClose={() => setShowShareModal(false)} />}
      {!!permissionToRemove && (
        <RemoveExternalAppConfirmationModal
          onClose={() => setPermissionToRemove(null)}
          permission={permissionToRemove}
          appName={getDisplayNameForApp(app)}
        />
      )}
      {reactivateSplashScreenModal && (
        <ReactivateWithSplashScreenModal
          app={app}
          onClose={() => setReactivateSplashScreenModal(false)}
        />
      )}
    </>
  )
}

export {
  AppCard as default,
  getAppCommercialUpgrade,
}
