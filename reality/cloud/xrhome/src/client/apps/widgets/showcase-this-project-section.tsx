import React, {FC, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {Button, Icon} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {useTranslation, Trans} from 'react-i18next'

import {AppPathEnum, getPathForApp, getPublicPathForApp} from '../../common/paths'
import type {IAccount, IApp} from '../../common/types/models'
import {combine} from '../../common/styles'
import Accordion from '../../widgets/accordion/accordion'
import {gray4, tinyViewOverride} from '../../static/styles/settings'
import {isAppLicenseType} from '../../../shared/app-utils'

const SECONDS_COPIED_IS_VISIBLE = 3

const useStyles = createUseStyles({
  featuredProjectUrl: {
    'display': 'flex',
    'flexDirection': 'row',
    [tinyViewOverride]: {
      'flexDirection': 'column',
      'alignItems': 'flex-start',
    },
    '& > *:not(:last-child)': {
      marginRight: '0.5em',
    },
    '& > p': {
      'marginBottom': '0',
      'wordBreak': 'break-all',
      '& > i': {
        cursor: 'pointer',
        marginLeft: '0.25em',
      },
    },
  },
  copiedNotificationIcon: {
    color: gray4,
    fontSize: '0.8em',
    verticalAlign: 'text-top',
  },
})

interface Props {
  className?: string
  account: IAccount
  app: IApp
}

const ShowcaseThisProject: FC<Props> = ({account, app, className}) => {
  const {t} = useTranslation('app-pages')
  const classes = useStyles()
  const {pathname}: {pathname: string} = useLocation()
  const shouldShowButton = !pathname.includes(AppPathEnum.featureProject)
  const [isUrlCopied, setIsUrlCopied] = useState(false)
  const isAppLicenseTypeApp = isAppLicenseType(app)

  React.useEffect(() => {
    let timer
    if (isUrlCopied) {
      timer = setTimeout(() => setIsUrlCopied(false), SECONDS_COPIED_IS_VISIBLE * 1000)
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [isUrlCopied])

  const publicFeaturedAppUrl = `${window.location.host}${getPublicPathForApp(account, app)}`

  const showcaseProjectHeaderText = isAppLicenseTypeApp
    ? (
      <p>{t('feature_project_page.showcase_this_project.blurb.increase_discoverability')}</p>
    )
    : (
      <p>
        <Trans
          ns='app-pages'
          i18nKey='feature_project_page.showcase_this_project.blurb.profile_portfolio'
        >
          Your Public Profile is your portfolio page where you can feature your work. Upload visual
          assets and add copy to feature your project with the option to let users try the
          experience.
          <b>
            You have full control over the visibility of your featured project and may
            remove it from your Public Profile at any time.
          </b>
        </Trans>
      </p>
    )

  const showcaseProjectTitleText = isAppLicenseTypeApp
    ? (
      t('feature_project_page.showcase_this_project.title_improve')
    )
    : (
      t('feature_project_page.showcase_this_project.title_feature_this')
    )

  return (
    <Accordion collapsable={false} className={combine('offset-shadow', className)}>
      <Accordion.Title active={false} onClick={() => null}>
        {showcaseProjectTitleText}
      </Accordion.Title>
      <Accordion.Content>
        {showcaseProjectHeaderText}
        {shouldShowButton &&
          <Button
            primary
            as={Link}
            to={getPathForApp(account, app, AppPathEnum.featureProject)}
            content={t('feature_project_page.showcase_this_project.button.get_started')}
          />
        }
        {app.publicFeatured &&
          <div className={classes.featuredProjectUrl}>
            <p><b>{t('feature_project_page.showcase_this_project.label.featured_url')}</b></p>
            <p>
              {publicFeaturedAppUrl}
              <CopyToClipboard text={publicFeaturedAppUrl} onCopy={() => setIsUrlCopied(true)}>
                <Icon
                  name='copy outline'
                  title='copy'
                />
              </CopyToClipboard>
              {isUrlCopied &&
                <span className={classes.copiedNotificationIcon}>Copied!</span>
              }
            </p>
          </div>
        }
      </Accordion.Content>
    </Accordion>
  )
}

export default ShowcaseThisProject
