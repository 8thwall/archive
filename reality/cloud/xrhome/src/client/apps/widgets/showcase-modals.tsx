import React, {useState, useEffect, useContext} from 'react'
import {Button, Modal} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useHistory} from 'react-router-dom'
import spdxLicenseList from 'spdx-license-list'
import {useTranslation, Trans} from 'react-i18next'

import type {IAccount, IApp} from '../../common/types/models'
import createModal8Styles from '../../uiWidgets/styles/modal'
import ButtonLink from '../../uiWidgets/button-link'
import {AccountPathEnum, getPathForAccount} from '../../common/paths'
import {combine} from '../../common/styles'
import icons from '../icons'
import {tinyViewOverride} from '../../static/styles/settings'
import ShowcaseSettingsContext from '../settings/showcase-settings-context'
import {PROFILE_ROLES} from '../../../shared/account-constants'
import {useSelector} from '../../hooks'
import {useHasProductionDeployment} from '../../git/hooks/use-deployment'
import {Loader} from '../../ui/components/loader'

const useStyles = createUseStyles({
  loader: {
    left: '-0.5em !important',
  },
  toggledSettings: {
    'margin': 'auto',
    'maxWidth': '60%',
    [tinyViewOverride]: {
      maxWidth: '100%',
    },
    '& > div:not(:last-child)': {
      marginBottom: '1.5em',
    },
  },
  toggledSettingDescription: {
    'display': 'flex',
    'alignItems': 'flex-start',
    '& > div': {
      'marginLeft': '1em',
    },
  },
  header: {
    textAlign: 'center',
  },
  mainText: {
    marginBottom: '2em',
  },
  subheader: {
    'fontSize': '1.15em',
    'fontWeight': 'bold',
    'margin': 0,
    '& span': {
      fontStyle: 'italic',
    },
  },
  license: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
})

interface IAlmostThereModal {
  account: IAccount
  onClose: () => void
  save: () => void
}

interface IPublishModal {
  app: IApp
  isTryable: boolean
  isCloneable: boolean
  previousIsTryable: boolean
  previousIsCloneable: boolean
  onClose: () => void
  publish: () => void
  save: () => void
}

const AlmostThereModal: React.FC<IAlmostThereModal> = ({account, onClose, save}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const history = useHistory()
  const classes = useStyles()
  const modal8 = createModal8Styles()
  const userRole = useSelector(
    state => account.Users?.find(u => u.UserUuid === state.user.uuid)?.role
  )
  const [isLoading, setIsLoading] = useState(false)
  const {setErrorMessage} = useContext(ShowcaseSettingsContext)

  useEffect(() => () => { setIsLoading(false) }, [])

  const canSave = PROFILE_ROLES.includes(userRole)

  const onSaveAndGo = async () => {
    try {
      setErrorMessage(null)
      setIsLoading(true)
      await save()
      history.push(getPathForAccount(account, AccountPathEnum.publicProfile))
    } catch (e) {
      setErrorMessage(t('feature_project_page.almost_there_modal.error.unable_to_save'))
      setIsLoading(false)
      onClose()
    }
  }

  return (
    <Modal className={modal8.modal} onClose={isLoading ? null : onClose} open size='small'>
      <div className={modal8.headerBlock}>
        <h2 className={modal8.header}>
          {t('feature_project_page.almost_there_modal.heading')}
        </h2>
      </div>
      <p className={modal8.mainText}>
        <Trans
          ns='app-pages'
          i18nKey='feature_project_page.almost_there_modal.needs_activate_public_profile'
          components={{1: <b />}}
        />
        {canSave && t('feature_project_page.almost_there_modal.changes_on_settings')}
        {!canSave && t('feature_project_page.almost_there_modal.contact_owner')}
      </p>
      <div className={modal8.centerActions}>
        <ButtonLink onClick={onClose} disabled={isLoading}>
          {t('button.cancel', {ns: 'common'})}
        </ButtonLink>
        {canSave &&
          <Button
            disabled={isLoading}
            primary
            onClick={onSaveAndGo}
          >
            {/* eslint-disable-next-line local-rules/ui-component-styling */}
            {isLoading && (<Loader className={classes.loader} inline size='tiny' />)}
            {t('feature_project_page.almost_there_modal.button.save_go_to_public_profile')}
          </Button>
        }
      </div>
    </Modal>
  )
}

const PublishOrUpdateModal: React.FC<IPublishModal> = ({
  app, onClose, publish, save, isTryable, isCloneable, previousIsTryable, previousIsCloneable,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const classes = useStyles()
  const modal8 = createModal8Styles()
  const [isLoading, setIsLoading] = useState(false)
  const {setErrorMessage} = useContext(ShowcaseSettingsContext)
  const hasProdDeployment = useHasProductionDeployment(app.repoId)

  const license = app.repoLicenseProd
  const licenseName = spdxLicenseList[license]?.name as string

  const showIsTryable = !app.publicFeatured ||
    (app.publicFeatured && isTryable !== previousIsTryable)
  const showIsCloneable = !app.publicFeatured ||
    (app.publicFeatured && isCloneable !== previousIsCloneable)

  const onPublishOrUpdate = async () => {
    try {
      setErrorMessage(null)
      setIsLoading(true)
      if (app.publicFeatured) {
        await save()
      } else {
        await publish()
        if (typeof window !== 'undefined') {
          window.scrollTo(0, 0)
        }
      }
    } catch (e) {
      if (e.status === 409) {
        setErrorMessage(t('feature_project_page.publish_or_update_modal.error.save_conflict'))
      } else {
        setErrorMessage(t('feature_project_page.publish_or_update_modal.error.unable_to_publish'))
      }
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  const getIsTryableText = () => (isTryable
    ? t('feature_project_page.publish_or_update_modal.blurb.is_tryable')
    : t('feature_project_page.publish_or_update_modal.blurb.is_not_tryable')
  )

  const getIsCloneableText = () => (isCloneable
    ? t('feature_project_page.publish_or_update_modal.blurb.is_cloneable')
    : t('feature_project_page.publish_or_update_modal.blurb.is_not_cloneable')
  )

  const tryItOutStatus = (
    <h3 className={classes.subheader}>
      {isTryable &&
        <Trans
          ns='app-pages'
          i18nKey='feature_project_page.publish_or_update_modal.heading.try_it_out_public'
          components={{1: <i />}}
        />
      }
      {!isTryable &&
        <Trans
          ns='app-pages'
          i18nKey='feature_project_page.publish_or_update_modal.heading.try_it_out_hidden'
          components={{1: <i />}}
        />
      }
    </h3>
  )

  const cloneableCodeStatus = (
    <h3 className={classes.subheader}>
      {isCloneable &&
        <Trans
          ns='app-pages'
          i18nKey='feature_project_page.publish_or_update_modal.heading.cloneable_public'
          components={{1: <i />}}
        />
      }
      {!isCloneable &&
        <Trans
          ns='app-pages'
          i18nKey='feature_project_page.publish_or_update_modal.heading.cloneable_hidden'
          components={{1: <i />}}
        />
      }
    </h3>
  )

  return (
    <Modal className={modal8.modal} onClose={isLoading ? null : onClose} open size='small'>
      <div className={modal8.headerBlock}>
        <h2 className={combine(modal8.header, classes.header)}>
          {app.publicFeatured
            ? t('feature_project_page.publish_or_update_modal.heading.update')
            : t('feature_project_page.publish_or_update_modal.heading.publish')
          }
        </h2>
      </div>
      {!app.publicFeatured &&
        <p className={combine(modal8.mainText, classes.mainText)}>
          {t('feature_project_page.publish_or_update_modal.blurb.update_publish_anytime')}
        </p>
      }
      {hasProdDeployment &&
        <div className={classes.toggledSettings}>
          {showIsTryable &&
            <div className={classes.toggledSettingDescription}>
              <img
                src={isTryable ? icons.publicEye : icons.hiddenEye}
                alt={isTryable ? 'public' : 'hidden'}
              />
              <div>
                {tryItOutStatus}
                <p>{getIsTryableText()}</p>
              </div>
            </div>
        }
          {showIsCloneable &&
            <div className={classes.toggledSettingDescription}>
              <img
                src={isCloneable ? icons.publicEye : icons.hiddenEye}
                alt={isCloneable ? 'public' : 'hidden'}
              />
              <div>
                {cloneableCodeStatus}
                <p>
                  {getIsCloneableText()}
                  {license && (
                    <Trans
                      ns='app-pages'
                      i18nKey='feature_project_page.publish_or_update_modal.license_text'
                      values={{licenseName}}
                      components={{1: <span className={classes.license} />}}
                    />
                  )}
                </p>
              </div>
            </div>
        }
        </div>
      }
      <div className={modal8.centerActions}>
        <ButtonLink onClick={onClose} disabled={isLoading}>
          {t('button.cancel', {ns: 'common'})}
        </ButtonLink>
        <Button
          disabled={isLoading}
          primary
          onClick={onPublishOrUpdate}
        >
          {/* eslint-disable-next-line local-rules/ui-component-styling */}
          {isLoading && <Loader className={classes.loader} inline size='tiny' />}
          {app.publicFeatured
            ? t('feature_project_page.publish_or_update_modal.button.update_page')
            : t('feature_project_page.publish_or_update_modal.button.publish_page')
          }
        </Button>
      </div>
    </Modal>
  )
}

export {AlmostThereModal, PublishOrUpdateModal}
