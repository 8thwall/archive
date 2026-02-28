import React from 'react'
import {Form} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import type {DeepReadonly} from 'ts-essentials'

import {TFunction, useTranslation, Trans} from 'react-i18next'

import {appNamePattern, INVALID_APP_NAMES} from '../../../shared/app-utils'
import type {IApp} from '../../common/types/models'
import {gray2, gray4, gray5, blueberry, tinyViewOverride} from '../../static/styles/settings'
import {combine} from '../../common/styles'
import {isEntryWebAccount} from '../../../shared/account-utils'
import useCurrentAccount from '../../common/use-current-account'
import {useSelector} from '../../hooks'
import {TextNotification} from '../../ui/components/text-notification'

const PROJECT_NAME_PLACEHOLDER = 'project-name'
const PROJECT_URL_PLACEHOLDER = 'project-url'

const useStyles = createUseStyles({
  subText: {
    color: gray5,
    fontWeight: '400',
    paddingTop: '0.2em',
  },
  containedInputContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    width: '100%',
    [tinyViewOverride]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  containedLabel: {
    borderRadius: '4px 0 0 4px !important',
    borderTop: `1px solid ${gray2}`,
    borderBottom: `1px solid ${gray2}`,
    borderLeft: `1px solid ${gray2}`,
    padding: '.57em 1em',
    color: gray4,
    [tinyViewOverride]: {
      width: '100%',
      borderRadius: '4px 4px 0 0 !important',
      borderBottom: '0',
      borderRight: `1px solid ${gray2}`,
    },
  },
  containedInput: {
    'borderColor': `${gray2} !important`,
    '&:hover': {
      cursor: 'text',
      borderColor: `${gray4} !important`,
    },
    '&:focus': {
      borderColor: `${blueberry} !important`,
    },
  },
  labelBorder: {
    'borderRadius': '0 4px 4px 0 !important',
    [tinyViewOverride]: {
      borderRadius: '0 0 4px 4px !important',
    },
  },
  noLabelBorder: {
    'borderRadius': '4px !important',
  },
  urlText: {
    color: gray4,
  },
})

interface IProjectUrlField {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  showLabel: boolean
  isFTUEAppField?: boolean
}

const isDuplicateAppName = (apps: DeepReadonly<IApp[]>, appName: string) => (
  apps.some(app => app.appName === appName)
)

type ValidationResult = {
  status: 'danger' | 'warning'
  message: string
}

const validateValue = (
  apps: DeepReadonly<IApp[]>, value: string, t: TFunction<'app-pages'[]>
): ValidationResult => {
  if (!value) {
    return null
  }

  const appNameRegex = new RegExp(appNamePattern)
  if (!appNameRegex.test(value)) {
    return {
      status: 'danger',
      message: t('create_project_page.project_url_field.error.limit_characters'),
    }
  }
  if (isDuplicateAppName(apps, value)) {
    return {
      status: 'danger',
      message: t('create_project_page.project_url_field.error.duplicate_app_name', {value}),
    }
  }
  if (INVALID_APP_NAMES.includes(value)) {
    return {
      status: 'danger',
      message: t('create_project_page.project_url_field.error.app_name_not_allowed', {value}),
    }
  }

  if ((value.includes('test') || value.includes('demo') || value.match(/\d/))) {
    return {
      status: 'warning',
      message: t('create_project_page.project_url_field.warning.avoid_using_test_demo'),
    }
  }

  return null
}

const ProjectUrlField: React.FunctionComponent<IProjectUrlField> = ({
  value, onChange, disabled, showLabel, isFTUEAppField,
}) => {
  const {t} = useTranslation(['app-pages'])
  const account = useCurrentAccount()
  const apps = useSelector(s => s.apps)
  const [isFocused, setIsFocused] = React.useState(false)

  const result = !isFocused && validateValue(apps, value, t)

  const classes = useStyles()
  const labelURLPrefix = isEntryWebAccount(account)
    ? `https://8thwall.com/${account.shortName}/`
    : `https://${account.shortName}.8thwall.app/`

  if (isFTUEAppField) {
    return (
      <div className={classes.urlText}>
        {`${labelURLPrefix}${value}`}
      </div>
    )
  }

  return (
    <Form.Field error={result?.status === 'danger'}>
      <div className={classes.containedInputContainer}>
        {showLabel &&
          <label
            className={classes.containedLabel}
            htmlFor='appName'
          >
            {labelURLPrefix}
          </label>
        }
        <input
          className={combine(classes.containedInput,
            showLabel ? classes.labelBorder : classes.noLabelBorder)}
          name='appName'
          placeholder={showLabel ? PROJECT_URL_PLACEHOLDER : PROJECT_NAME_PLACEHOLDER}
          value={value}
          disabled={disabled || isFTUEAppField}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      <div className={classes.subText}>
        <Trans
          ns='app-pages'
          i18nKey='create_project_page.project_url_field.labeled_name_blurb'
          components={{1: <strong />}}
        />
      </div>
      {result &&
        <TextNotification type={result.status}>
          {result.message}
        </TextNotification>
      }
    </Form.Field>
  )
}

export default ProjectUrlField
