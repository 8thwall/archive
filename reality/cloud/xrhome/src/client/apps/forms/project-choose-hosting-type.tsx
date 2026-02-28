import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'
import {useLocation} from 'react-router-dom'

import {
  brandHighlight, gray1, gray2, gray3, gray4, gray5,
  tinyViewOverride,
} from '../../static/styles/settings'
import {combine} from '../../common/styles'
import cloudEditorLogo from '../../static/icons/cloud_editor_gray4.svg'
import cloudStudioLogo from '../../static/icons/cloud_studio.svg'
import appKeyLogo from '../../static/icons/app_key.svg'
import {hexColorWithAlpha} from '../../../shared/colors'
import ColoredMessage from '../../messages/colored-message'
import SpaceBelow from '../../ui/layout/space-below'
import type {IApp, IPublicApp} from '../../common/types/models'
import useCurrentAccount from '../../common/use-current-account'
import type {AppHostingType} from '../../common/types/db'
import {
  isBusiness,
  isEnterprise,
  isPro,
  isSelfHostingEnabled,
  validateAppType,
} from '../../../shared/account-utils'

const useStyles = createUseStyles({
  hostContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1em',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  graphic: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    backgroundColor: gray1,
    [tinyViewOverride]: {
      display: 'none',
    },
  },
  optionContainer: {
    'display': 'flex',
    'flexDirection': 'column',
    'flex': '1',
    'borderWidth': '1px',
    'borderStyle': 'solid',
    'borderRadius': '6px',
    'gap': '2em',
    'padding': '2em',
    'cursor': 'pointer',
    'transition': 'borderColor 0.5s',
    'maxWidth': '50%',

    [tinyViewOverride]: {
      maxWidth: '100%',
    },
  },
  unselected: {
    borderColor: gray2,
  },
  highlightSelect: {
    borderColor: gray4,
    boxShadow: '8px 8px 8px 0px rgba(0, 0, 0, 0.05)',
  },
  studio: {
    backgroundColor: `${hexColorWithAlpha(brandHighlight, 0.33)}`,
    width: '48px',
    height: '48px',
    borderRadius: '6px',
  },
  gray: {
    'backgroundColor': gray1,
  },
  notifContainer: {
    lineHeight: 'unset',
    marginTop: '0.5em',
  },
  optionHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  optionBody: {
    color: gray4,
    margin: '0.5em 0',
    fontSize: '1em',
  },
  radioContainer: {
    display: 'flex',
    alignItems: 'center',
    [tinyViewOverride]: {
      flex: '1',
      overflow: 'hidden',
    },
  },
  radio: {
    border: `2px solid ${gray3}`,
    height: '16px',
    width: '16px',
    borderRadius: '50%',
  },
  radioFilled: {
    border: `5px solid ${gray5}`,
    height: '16px',
    width: '16px',
    borderRadius: '50%',
  },
  radioLabel: {
    marginBottom: '0',
    marginLeft: '0.5em',
    fontSize: '1.17em',
    lineHeight: '1em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  appKey: {
    width: '30px',
    height: '28px',
    objectFit: 'contain',
  },
})

type AppHostingOption = {
  value: AppHostingType
  label: string
  description: string
  imgSrc: string
  imageClasses: string
}

interface IProjectChooseHostingType {
  selectedOption: AppHostingType
  onOptionClick: (optionValue: string) => void
  fromApp: IApp | IPublicApp
}

interface LocationState {
  isLegacyButton?: boolean
}

const ProjectChooseHostingType: React.FC<IProjectChooseHostingType> = (
  {selectedOption, onOptionClick, fromApp}
) => {
  const classes = useStyles()
  const account = useCurrentAccount()
  const location = useLocation<LocationState>()
  const {t} = useTranslation(['app-pages'])

  const hostingOptions: AppHostingOption[] = [
    {
      value: 'CLOUD_STUDIO' as const,
      label: t('create_project_page.project_host_field_option.cloud_studio.label'),
      description: t('create_project_page.project_host_field_option.cloud_studio.description'),
      imgSrc: cloudStudioLogo,
      imageClasses: classes.studio,
    },
    {
      value: 'CLOUD_EDITOR' as const,
      label: t('create_project_page.project_host_field_option.cloud_editor.label'),
      description: t('create_project_page.project_host_field_option.cloud_editor.description'),
      imgSrc: cloudEditorLogo,
      imageClasses: classes.gray,
    },
    {
      value: 'SELF' as const,
      label: t('create_project_page.project_host_field_option.app_key.label'),
      description: t('create_project_page.project_host_field_option.app_key.description'),
      imgSrc: appKeyLogo,
      imageClasses: classes.appKey,
    },
  ]

  const selfHostNotification = (
    <ColoredMessage
      color='blue'
      // eslint-disable-next-line local-rules/hardcoded-copy
      iconName='info circle'
      className={classes.notifContainer}
    >
      <p>
        {t('create_project_page.project_host_field.self_host_notification')}
      </p>
    </ColoredMessage>
  )

  const cloneImageTargetsOnly = (
    <ColoredMessage
      color='orange'
      // eslint-disable-next-line local-rules/hardcoded-copy
      iconName='exclamation triangle'
      className={classes.notifContainer}
    >
      <p>
        {t('create_project_page.project_host_field.clone_image_targets_only')}
      </p>
    </ColoredMessage>
  )

  const filteredHostingOptions = hostingOptions.filter((option: AppHostingOption) => {
    if (!location.state?.isLegacyButton) {
      return option.value === 'CLOUD_STUDIO'
    } else if (location.state?.isLegacyButton) {
      if ((isPro(account) || isEnterprise(account) || isBusiness(account)) &&
        isSelfHostingEnabled(account)) {
        return ['CLOUD_EDITOR', 'SELF'].includes(option.value)
      } else {
        return option.value === 'CLOUD_EDITOR'
      }
    } return !validateAppType(account, option.value)
  })

  // Note(Brandon): If there is only one option and it is CLOUD_STUDIO,
  // we don't want to show the options.
  const isOnlyStudioOption = (
    filteredHostingOptions.length === 1 && filteredHostingOptions[0].value === 'CLOUD_STUDIO'
  )

  return (
    <>
      {isOnlyStudioOption && null}
      {!isOnlyStudioOption && (
        <SpaceBelow>
          <div className={classes.hostContainer}>
            {filteredHostingOptions.map(option => (
              <button
                type='button'
                className={combine('style-reset', classes.optionContainer,
                  selectedOption === option.value ? classes.highlightSelect : classes.unselected)
                }
                key={option.value}
                onClick={() => {
                  onOptionClick(option.value)
                }
                }
              >
                <div className={classes.graphic}>
                  <img
                    className={option.imageClasses}
                    src={option.imgSrc}
                    alt=''
                  />
                </div>
                <div>
                  <div className={classes.optionHeader}>
                    <div className={classes.radioContainer}>
                      <div className={selectedOption === option.value
                        ? classes.radioFilled
                        : classes.radio}
                      />
                      <p className={classes.radioLabel}>{option.label}</p>&nbsp;
                    </div>
                  </div>
                  <p className={classes.optionBody}>{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </SpaceBelow>
      )}
      {
        selectedOption === 'SELF' &&
        (fromApp?.hostingType === 'UNSET' ? cloneImageTargetsOnly : selfHostNotification)
      }
    </>
  )
}

export {
  ProjectChooseHostingType,
}
