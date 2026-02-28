import * as React from 'react'
import {Form} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {MAX_APP_TITLE_LENGTH} from '../../../shared/app-constants'
import '../../static/styles/app-basic-info.scss'
import ProjectTitleLabel from './project-title-label'
import {combine} from '../../common/styles'
import useCurrentAccount from '../../common/use-current-account'

const useStyles = createUseStyles({
  formLabel: {
    '& > label': {
      display: 'flex !important',
      alignItems: 'baseline',
    },
  },
})

const ProjectTitleField = ({value, disabled, onChange, subtitle = ''}) => {
  const {t} = useTranslation(['app-pages'])
  const account = useCurrentAccount()
  const classes = useStyles()

  return (
    <Form.Field className={combine('basic-info-field', classes.formLabel)}>
      <ProjectTitleLabel subtitle={subtitle} account={account} />
      <input
        name='appTitle'
        placeholder={t('project_settings_page.project_title_field.placeholder')}
        value={value}
        disabled={disabled}
        maxLength={MAX_APP_TITLE_LENGTH}
        onChange={onChange}
      />
    </Form.Field>
  )
}

export default ProjectTitleField
