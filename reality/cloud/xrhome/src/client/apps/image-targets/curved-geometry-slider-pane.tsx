import React from 'react'
import {createUseStyles} from 'react-jss'
import {Input, Popup} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import {MIN_ARC_ANGLE, MAX_ARC_ANGLE} from './curved-geometry'
import {Icon} from '../../ui/components/icon'

const useStyles = createUseStyles({
  thumbSliderGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto 6fr 1fr',
    alignItems: 'center',
    columnGap: '1em',
    marginBottom: '1em',
  },
})

interface ICurvedGeometrySliderPane {
  type: string
  arcAngle: number
  isRotated: boolean
  originalWidth: number
  originalHeight: number
  onChange: (change: {newArcAngle?: number}) => void
}

const CurvedGeometrySliderPane: React.FunctionComponent<ICurvedGeometrySliderPane> = (props) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  const fadeTrigger = (
    <span className='link-fade'>
      <Icon inline stroke='questionMark' color='gray4' />
    </span>
  )

  const handleArcAngleChange = (_, {value: newArcAngleString}) => {
    props.onChange({newArcAngle: Number(newArcAngleString)})
  }

  return (
    <div>
      <label className={classes.thumbSliderGrid} htmlFor='slider-pane-curve'>
        {t('image_target_page.edit_image_target.curved_geometry_slider_pane.label')}
        <Popup
          trigger={fadeTrigger}
          position='top left'
          content={t('image_target_page.edit_image_target.popup.curve_amount')}
        />
        <Input
          id='slider-pane-curve'
          className='thumb-slider'
          type='range'
          value={props.arcAngle}
          min={MIN_ARC_ANGLE}
          step='4'
          max={MAX_ARC_ANGLE}
          onChange={handleArcAngleChange}
        />
        <span>{(props.arcAngle / MAX_ARC_ANGLE * 100).toFixed(2)}%</span>
      </label>
    </div>
  )
}
export default CurvedGeometrySliderPane
