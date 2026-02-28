import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {FloatingIconButton} from '../ui/components/floating-icon-button'
import {ResourceCenter} from '../widgets/resource-center'

const useStyles = createUseStyles({
  buttonRowContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonTray: {
    display: 'flex',
    padding: '0.5em',
  },
  badge: {
    paddingRight: '0.75em',
  },
})

const FixedHelpButtonTray: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['app-pages'])

  return (
    <div className={classes.buttonRowContainer}>
      <div className={classes.buttonTray}>
        <ResourceCenter>
          {onClick => (
            <FloatingIconButton
              text={t('in_app_help_center.label.resource_center')}
              stroke='questionMark'
              onClick={onClick}
            />
          )}
        </ResourceCenter>
      </div>
    </div>
  )
}

export {
  FixedHelpButtonTray,
}
