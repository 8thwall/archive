import * as React from 'react'
import {Button} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import type {ConicalWizardStep} from './types'
import {ArcVisualizer} from './deconer'
import {ParameterSlider} from '../../cameras/parameter-editor'
import {useStyles} from './conical-set-top-arc'
import ImageMetadata from './image-metadata'
import uploadConicalUnwrappedBottomArc from '../../../static/uploadConicalUnwrappedBottomArc.svg'
import {LinkButton} from '../../../ui/components/link-button'

interface IConicalSetBottomArc extends ConicalWizardStep {
  name: string
  topRadius: number
  bottomRadius: number
  image: string
  width: number
  height: number
  setBottomRadius(val: number): void
}

const ConicalSetBottomArc: React.FunctionComponent<IConicalSetBottomArc> = ({
  onClose, onNext, onPrevious, topRadius, bottomRadius, image, width, height, setBottomRadius,
  name,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const classes = useStyles()
  return (
    <>
      <h3>{t('image_target_page.conical_set_bottom_arc.heading')}</h3>
      <p>{t('image_target_page.conical_set_bottom_arc.instruction')}</p>
      <div className={classes.controls}>
        <div className={classes.instructions}>
          <img alt='set bottom arc with slider' src={uploadConicalUnwrappedBottomArc} />
        </div>
        <ParameterSlider
          className={classes.parameterControls}
          min={0}
          max={10 * height}
          step={1}
          displayName={t('image_target_page.conical_set_bottom_arc.parameter_slider.display_name')}
          value={bottomRadius}
          onChange={val => setBottomRadius(parseInt(val, 10))}
        />
      </div>
      <ImageMetadata name={name} width={width} height={height} />
      <ArcVisualizer
        topRadius={topRadius}
        bottomRadius={bottomRadius}
        img={image}
        width={width}
        height={height}
      />
      <div className='wizard-actions'>
        <div className='left'>
          <LinkButton onClick={onPrevious}>
            {t('button.back', {ns: 'common'})}
          </LinkButton>
        </div>
        <div className={classes.buttonGroupRight}>
          <LinkButton onClick={onClose}>
            {t('button.cancel', {ns: 'common'})}
          </LinkButton>
          <Button
            className={classes.nextButton}
            size='tiny'
            primary
            onClick={onNext}
          >
            {t('button.next', {ns: 'common'})}
          </Button>
        </div>
      </div>
    </>
  )
}

export default ConicalSetBottomArc
