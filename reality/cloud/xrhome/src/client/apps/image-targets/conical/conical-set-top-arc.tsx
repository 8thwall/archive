import * as React from 'react'
import {Button} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import type {ConicalWizardStep} from './types'
import {ArcVisualizer} from './deconer'
import {ParameterSlider} from '../../cameras/parameter-editor'
import ImageMetadata from './image-metadata'
import uploadConicalUnwrappedTopArc from '../../../static/uploadConicalUnwrappedTopArc.svg'
import {gray4, brandHighlight} from '../../../static/styles/settings'
import {LinkButton} from '../../../ui/components/link-button'

export const useStyles = createUseStyles({
  controls: {
    display: 'flex',
    margin: '1em 0',
  },
  instructions: {
    flex: '1 0 0',
    height: '8em',
  },
  parameterControls: {
    'flex': '1 0 0',
    'display': 'flex',
    'alignItems': 'center',
    '& .name': {
      flex: '0 0 auto',
    },
    '& .slider': {
      flex: '1 0 auto',
    },
    '& .text-input': {
      flex: '0 0 6em',
    },
  },
  resetButton: {
    backgroundColor: `${gray4} !important`,
  },
  nextButton: {
    backgroundColor: `${brandHighlight} !important`,
  },
  buttonGroupRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '2em',
    alignItems: 'center',
  },
})

interface IConicalSetTopArc extends ConicalWizardStep {
  name: string
  topRadius: number
  bottomRadius: number
  image: string
  width: number
  height: number
  setTopRadius(val: number): void
  setBottomRadius(val: number): void
}

const ConicalSetTopArc: React.FunctionComponent<IConicalSetTopArc> = ({
  onClose, onNext, onPrevious, topRadius, bottomRadius, image, width, height,
  setTopRadius, setBottomRadius, name,
}) => {
  const {t} = useTranslation(['app-pages', 'common'])
  const classes = useStyles()
  const setBottom = () => {
    if (!bottomRadius) {
      setBottomRadius(Math.round(Math.abs(topRadius) - height / 2))
    }
  }
  return (
    <>
      <h3>{t('image_target_page.conical_set_top_arc.heading')}</h3>
      <p>{t('image_target_page.conical_set_top_arc.instruction')}</p>
      <div className={classes.controls}>
        <div className={classes.instructions}>
          <img alt='set top arc with slider' src={uploadConicalUnwrappedTopArc} />
        </div>
        <ParameterSlider
          className={classes.parameterControls}
          min={-10 * height}
          max={10 * height}
          step={1}
          displayName={t('image_target_page.conical_set_top_arc.parameter_slider.display_name')}
          value={topRadius}
          onChange={val => setTopRadius(parseInt(val, 10))}
        />
      </div>
      <ImageMetadata name={name} width={width} height={height} />
      <ArcVisualizer
        topRadius={topRadius}
        bottomRadius={bottomRadius}
        img={image}
        width={width}
        height={height}
        hideBottomArc
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
            onClick={() => { setBottom(); onNext() }}
          >
            {t('button.next', {ns: 'common'})}
          </Button>
        </div>
      </div>
    </>
  )
}

export default ConicalSetTopArc
