import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {cherry} from '../../static/styles/settings'
import useTextStyles from '../../styles/text-styles'
import {TooltipIcon} from '../../widgets/tooltip-icon'

const useStyles = createUseStyles({
  isRequired: {
    color: cherry,
  },
})

interface IProjectCoverImageLabel {
  subtitle: string
  isRequired?: boolean
  disablePopup?: boolean
}

const ProjectCoverImageLabel: React.FC<IProjectCoverImageLabel> = (
  {subtitle, isRequired = false, disablePopup = false}
) => {
  const classes = useStyles()
  const textStyles = useTextStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  return (
    /* eslint-disable-next-line jsx-a11y/label-has-associated-control */
    <label htmlFor='coverImage'>
      <h3 className={textStyles.miniHeading}>
        {t('editor_page.cover_image_field.label.header')}
      </h3>
      {isRequired && <span className={classes.isRequired}>&nbsp;*</span>}
      {!disablePopup && <TooltipIcon content={subtitle} /> }
    </label>
  )
}

export default ProjectCoverImageLabel
