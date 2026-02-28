import * as React from 'react'
import {Form, TextArea} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {MAX_APP_DESCRIPTION_LENGTH} from '../../../shared/app-constants'
import '../../static/styles/app-basic-info.scss'
import {bodySanSerif, gray3, cherry} from '../../static/styles/settings'
import {combine} from '../../common/styles'
import useTextStyles from '../../styles/text-styles'
import {TooltipIcon} from '../../widgets/tooltip-icon'

const useStyles = createUseStyles({
  formLabel: {
    'position': 'relative',
    '& > label': {
      display: 'flex !important',
      alignItems: 'baseline',
      flexDirection: 'column',
    },
  },
  textArea: {
    fontFamily: bodySanSerif,
  },
  charCount: {
    color: gray3,
    float: 'right',
    position: 'absolute',
    right: '0.7em',
    bottom: '0.2em',
  },
  limitColor: {
    color: cherry,
  },
})

interface IProjectDescriptionField {
  className?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  disabled: boolean
  subtitle: string
}

const ProjectDescriptionField: React.FC<IProjectDescriptionField> = (
  {className, value, onChange, disabled = false, subtitle = ''}
) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  const textStyles = useTextStyles()
  return (
    <Form.Field className={combine('basic-info-field', classes.formLabel)}>
      <label htmlFor='appDescription'>
        <h3 className={textStyles.miniHeading}>
          {t('project_settings_page.project_description_field')}
          <TooltipIcon content={subtitle} />
        </h3>
        <TextArea
          className={combine(classes.textArea, className)}
          name='appDescription'
          placeholder={t('project_settings_page.project_description_field.placeholder')}
          value={value}
          disabled={disabled}
          maxLength={MAX_APP_DESCRIPTION_LENGTH}
          onChange={onChange}
        />
        <span className={combine(classes.charCount,
          (MAX_APP_DESCRIPTION_LENGTH - value.length < 30) && classes.limitColor)}
        >
          {`${value.length}/${MAX_APP_DESCRIPTION_LENGTH}`}
        </span>
      </label>
    </Form.Field>
  )
}

export default ProjectDescriptionField
