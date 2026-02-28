import React, {FC} from 'react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import {COVER_IMAGE_PREVIEW_SIZES} from '../../../shared/app-constants'
import {
  deriveAppCoverImageUrl, isBasicInfoCompleted,
} from '../../../shared/app-utils'
import {AppPathEnum, getPathForApp} from '../../common/paths'
import type {IAccount, IApp} from '../../common/types/models'
import Accordion from '../../widgets/accordion'
import useStyles from '../showcase-project-jss'
import ErrorMessage from './error-message'
import {combine} from '../../common/styles'

interface Props {
  account: IAccount
  app: IApp
  active: boolean
  onTitleClick: () => void
}

const RequiredField = ({value, errorMessage}) => {
  const classes = useStyles()
  if (value) {
    return (
      <p className={classes.miniDesc}>
        {value}
      </p>
    )
  } else {
    return (
      <p className={classes.errorCode}>
        {errorMessage}
      </p>
    )
  }
}

const ShowcaseBasicInfo: FC<Props> = ({account, app, active, onTitleClick}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const classes = useStyles()
  const coverImageSrc = app.smallCoverImageUrl ||
    deriveAppCoverImageUrl(app, COVER_IMAGE_PREVIEW_SIZES[400])
  const isBasicInfoComplete = isBasicInfoCompleted(app)

  return (
    <Accordion>
      <Accordion.Title active={active} onClick={onTitleClick}>
        {t('feature_project_page.showcase_basic_info.title')}
      </Accordion.Title>
      <Accordion.Content>
        <p>{t('feature_project_page.showcase_basic_info.metadata_blurb')}</p>
        <h3 className={classes.miniHeader}>
          {t('feature_project_page.showcase_basic_info.heading.project_title')}
        </h3>
        <RequiredField
          value={app.appTitle}
          errorMessage={t('feature_project_page.showcase_basic_info.error.project_title')}
        />
        <h3 className={classes.miniHeader}>
          {t('feature_project_page.showcase_basic_info.heading.description')}
        </h3>
        <p>{app.appDescription}</p>
        <h3 className={classes.miniHeader}>
          {t('feature_project_page.showcase_basic_info.heading.cover_image')}
        </h3>
        {!app.coverImageId && (
          <p className={classes.errorCode}>
            {t('feature_project_page.showcase_basic_info.error.cover_image')}
          </p>
        )}
        <img
          src={coverImageSrc}
          className={classes.coverImage}
          alt='Project Cover'
        />
        {
          !isBasicInfoComplete &&
            <div className={classes.topDistance}>
              <ErrorMessage icon='exclamation'>
                <p>{t('feature_project_page.showcase_basic_info.error.missing_details')}</p>
              </ErrorMessage>
            </div>
        }
        <p className={combine(classes.bold, classes.topDistance)}>
          <Link to={getPathForApp(account, app, AppPathEnum.settings)}>
            {t('feature_project_page.showcase_basic_info.link.edit_project_settings')}
          </Link>
        </p>
      </Accordion.Content>
    </Accordion>
  )
}

export default ShowcaseBasicInfo
