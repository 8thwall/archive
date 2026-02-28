import React from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {Button} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import type {IAccount} from '../common/types/models'
import {getPublicPathForAccount} from '../common/paths'
import {combine} from '../common/styles'
import {MILLISECONDS_PER_SECOND} from '../../shared/time-utils'
import useStyles from './account-profile-page-jss'
import {isEntryWebAccount} from '../../shared/account-utils'
import {Icon} from '../ui/components/icon'

const DELAY_IN_MILLISECONDS = 3 * MILLISECONDS_PER_SECOND

interface IAccountProfileTopSection {
  // Variables
  account: IAccount
  isUpdatingPublicFeatured: boolean
  shouldHighlightRequired: boolean
  isPublishDisabled: boolean

  // Functions
  updatePublicFeatured(value: boolean): void
}

const AccountProfileTopSection: React.FC<IAccountProfileTopSection> = ({
  account,
  isUpdatingPublicFeatured,
  shouldHighlightRequired,
  updatePublicFeatured,
  isPublishDisabled,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['account-pages', 'common'])
  const [isPublicProfileUrlCopied, setIsPublicProfileUrlCopied] = React.useState(false)

  React.useEffect(() => {
    let timer
    if (isPublicProfileUrlCopied) {
      timer = setTimeout(() => setIsPublicProfileUrlCopied(false), DELAY_IN_MILLISECONDS)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [isPublicProfileUrlCopied])

  const copyPublicProfileUrl = () => setIsPublicProfileUrlCopied(true)

  const {publicFeatured} = account
  const publicProfileUrl = `${window.location.host}${getPublicPathForAccount(account)}`

  if (publicFeatured) {
    return (
      <div className={classes.publicProfileUrl}>
        <p><b>{t('profile_page.public_url_subheader')}</b></p>
        <p>
          {publicProfileUrl}
          <CopyToClipboard text={publicProfileUrl} onCopy={copyPublicProfileUrl}>
            <Icon inline stroke='copy' />
          </CopyToClipboard>
          {isPublicProfileUrlCopied &&
            <span className={classes.copiedNotificationIcon}>
              {t('button.copied', {ns: 'common'})}
            </span>
          }
        </p>
      </div>
    )
  } else {
    return (
      <>
        {shouldHighlightRequired &&
          <p className={combine(classes.generalError, classes.marginBottom)}>
            {t('profile_page.missing_reqs_for_activation')}
          </p>
        }
        {!isEntryWebAccount(account) &&
          <Button
            primary
            disabled={isPublishDisabled}
            loading={isUpdatingPublicFeatured}
            onClick={() => updatePublicFeatured(true)}
          >{t('profile_page.button.activate')}
          </Button>}
      </>
    )
  }
}

export default AccountProfileTopSection
