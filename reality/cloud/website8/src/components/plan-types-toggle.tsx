import {useTranslation} from 'gatsby-plugin-react-i18next'
import React from 'react'

import Toggle from './toggle'
import rocketIcon from '../../img/rocket-icon.svg'
import gameController from '../../img/game-controller.svg'
import Badge from './badge'

interface IPlanTypesToggle {
  showToggledState: boolean,
  onToggleClick: () => void
}

const PlanTypesToggle: React.FC<IPlanTypesToggle> = ({
  showToggledState, onToggleClick,
}) => {
  const {t} = useTranslation(['pricing-page'])

  return (
    <Toggle
      id='types'
      showToggledState={showToggledState}
      onToggleClick={onToggleClick}
      toggledText={(
        <div>
          <img src={rocketIcon} alt='rocket' />&nbsp;{t('pricing_toggle.marketing')}
        </div>
      )}
      untoggledText={(
        <div>
          <img
            src={gameController}
            alt='game controller'
          />&nbsp;{t('pricing_toggle.gaming')}&nbsp;
          <Badge height='tiny' color='mango'>
            <div className='text8-sm font8-regular'>{t('pricing_toggle.beta')}</div>
          </Badge>
        </div>
      )}
      toggleBkgColor='blueberry'
    />
  )
}

export default PlanTypesToggle
