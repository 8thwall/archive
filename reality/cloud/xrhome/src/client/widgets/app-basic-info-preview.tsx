import * as React from 'react'
import {Popup} from 'semantic-ui-react'
import spdxLicenseList from 'spdx-license-list'
import {createUseStyles} from 'react-jss'
import {useTranslation, Trans} from 'react-i18next'

import {deriveAppCoverImageUrl, isCloudEditorApp, isCloudStudioApp} from '../../shared/app-utils'
import {COVER_IMAGE_PREVIEW_SIZES} from '../../shared/app-constants'
import {getPublicPathForApp} from '../common/paths'
import {
  bodySanSerif, headerSanSerif, tinyViewOverride,
  gray4, moonlight, gray5,
} from '../static/styles/settings'
import {StandardLink} from '../ui/components/standard-link'
import type {IApp, IBrowseAccount, IPublicApp} from '../common/types/models'
import {Badge} from '../ui/components/badge'
import {Icon} from '../ui/components/icon'

const useStyles = createUseStyles({
  rootContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: '1em',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  coverImage: {
    borderRadius: '0.5em !important',
    width: '20rem',
    height: 'auto',
    textAlign: 'center',
    [tinyViewOverride]: {
      width: '100%',
    },
  },
  appInfo: {
    'flex': '1',
    'display': 'flex',
    'alignItems': 'flex-start',
    'flexWrap': 'wrap',
    'flexDirection': 'column',
    'padding': '0 0 0 1em !important',
    'alignSelf': 'stretch',
    'justifyContent': 'space-between',

    '& h3': {
      fontFamily: headerSanSerif,
    },

    '& p': {
      fontFamily: bodySanSerif,
    },
    [tinyViewOverride]: {
      padding: '1em 0 0 0 !important',
    },
  },
  licenseText: {
    margin: '0em 0em 0.5em 0em',
  },
  infoIcon: {
    cursor: 'pointer',
  },
  appInfoBoxes: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.5em',
    width: '100%',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  appInfoBox: {
    width: '14rem',
    display: 'flex',
    flexDirection: 'column',
    background: moonlight,
    padding: '0.7em 1.34em',
    borderRadius: '0.2em',
    [tinyViewOverride]: {
      width: '100%',
    },
  },
  appInfoLabel: {
    color: gray4,
    margin: '0',
  },
  appInfoText: {
    width: '100%',
    fontWeight: 'bold',
    color: gray5,
    margin: '0',
    overflow: 'hidden',
    whiteSpace: 'no-wrap',
    textOverflow: 'ellipsis',
  },
  appTitle: {
    display: 'flex',
    marginTop: '10px',
  },
})

interface IAppBasicInfoPreview {
  account: IBrowseAccount
  app: IApp | IPublicApp
  isMyAccount?: boolean
}

const AppBasicInfoPreview: React.FC<IAppBasicInfoPreview> = ({account, app, isMyAccount}) => {
  const {t} = useTranslation(['app-pages', 'public-featured-pages'])
  const appLicense = spdxLicenseList[app.repoLicenseMaster]
  const appLicenseUrl = `${getPublicPathForApp(account, app)}/code/LICENSE`
  const classes = useStyles()

  const hostingTypeOptions = [
    {key: 'UNSET', text: 'Unknown'},
    {key: 'CLOUD_EDITOR', text: '8th-Wall Hosted'},
    {key: 'CLOUD_STUDIO', text: '8th-Wall Hosted Cloud Studio'},
    {key: 'SELF', text: 'Self-Hosted'},
  ]

  const projectBadge = app.hostingType === 'CLOUD_STUDIO'
    ? t('project_library_page.badge.cloud_studio', {ns: 'public-featured-pages'})
    : t('project_library_page.badge.cloud_editor', {ns: 'public-featured-pages'})

  return (
    <div className={classes.rootContainer}>
      <img
        src={deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[600])}
        className={classes.coverImage}
        alt='Cover for the app'
      />
      <div className={classes.appInfo}>
        <div>
          <Badge color={isCloudEditorApp(app) ? 'blue' : 'purple'} variant='pastel'>
            {projectBadge}
          </Badge>
          <h3 className={classes.appTitle}>
            {app.appTitle}
          </h3>
          {!isMyAccount && appLicense &&
            <div>
              <p className={classes.licenseText}>
                <b>{t('create_project_page.app_basic_info_preview.label.license_type')}</b>
                {' '}{appLicense.name}&nbsp;
                <Popup
                  trigger={(
                    <span className={classes.infoIcon}>
                      <Icon stroke='info' />
                    </span>
                  )}
                  on='click'
                  position='bottom center'
                  flowing
                >
                  <Trans
                    ns='app-pages'
                    i18nKey='create_project_page.app_basic_info_preview.popup.license_type'
                    components={{
                      licenseLink: <StandardLink newTab href={appLicenseUrl} />,
                    }}
                    values={{licenseType: appLicense.name}}
                  />
                </Popup>
              </p>
              <br />
            </div>
          }
        </div>
        <div className={classes.appInfoBoxes}>
          <div className={classes.appInfoBox}>
            <p className={classes.appInfoLabel}>
              {!isMyAccount
                ? t('create_project_page.app_basic_info_preview.label.created_by')
                : t('create_project_page.app_basic_info_preview.label.workspace')
              }
            </p>
            <p className={classes.appInfoText}>{account.name}</p>
          </div>
          {!isCloudStudioApp(app) &&
            <div className={classes.appInfoBox}>
              <p className={classes.appInfoLabel}>
                {t('create_project_page.app_basic_info_preview.label.hosting_type')}
              </p>
              <p className={classes.appInfoText}>
                {hostingTypeOptions.find(type => type.key === app.hostingType).text}
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default AppBasicInfoPreview
