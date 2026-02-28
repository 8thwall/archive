import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {FloatingTray} from '../ui/components/floating-tray'
import {FloatingTrayButton} from '../ui/components/floating-tray-button'
import {useStudioStateContext} from './studio-state-context'
import {FloatingIconButton} from '../ui/components/floating-icon-button'
import {useSceneContext} from './scene-context'
import {ProductTourId} from './product-tour-constants'

const useStyles = createUseStyles({
  studioPlayButtonContainer: {
    display: 'flex',
    gap: '0.5em',
  },
})

interface IPlayButtonTray {
}

const StudioPlayButtonTray: React.FC<IPlayButtonTray> = () => {
  const {t} = useTranslation(['cloud-studio-pages'])
  const classes = useStyles()
  const stateCtx = useStudioStateContext()

  const {state: {playing, pointing, isPreviewPaused}} = stateCtx
  const {playsUsingRuntime, isDraggingGizmo} = useSceneContext()

  const handleTogglePointing = () => {
    stateCtx.update(p => ({...p, pointing: !p.pointing}))
  }

  const handleTogglePlaying = () => {
    stateCtx.update(p => ({...p, playing: !p.playing}))
  }

  const handleTogglePaused = () => {
    stateCtx.update(p => ({...p, isPreviewPaused: !p.isPreviewPaused}))
  }

  return (
    <div className={classes.studioPlayButtonContainer}>
      {(playing && playsUsingRuntime) &&
        <FloatingTray nonInteractive={isDraggingGizmo}>
          <FloatingTrayButton
            onClick={() => stateCtx.update(p => ({
              ...p,
              restartKey: p.restartKey + 1,
            }))}
          >
            {t('studio_play_button_tray.button.restart')}
          </FloatingTrayButton>
          <FloatingTrayButton
            onClick={handleTogglePointing}
            isActive={!pointing}
          >
            {pointing
              ? t('studio_play_button_tray.button.game_freelook_left')
              : t('studio_play_button_tray.button.game_freelook_right')
            }
          </FloatingTrayButton>
        </FloatingTray>
      }
      <FloatingTray nonInteractive={isDraggingGizmo}>
        <FloatingIconButton
          id={ProductTourId.SIMULATOR_PLAY_PAUSE}
          isActive={playing}
          text={playing
            ? t('studio_play_button_tray.button.stop')
            : t('studio_play_button_tray.button.play')}
          onClick={handleTogglePlaying}
          stroke={playing ? 'stop' : 'play'}
        />
        <FloatingIconButton
          isActive={isPreviewPaused}
          text={isPreviewPaused
            ? t('studio_play_button_tray.button.resume')
            : t('studio_play_button_tray.button.pause')}
          onClick={handleTogglePaused}
          stroke='pause'
        />
      </FloatingTray>
    </div>
  )
}

export {
  StudioPlayButtonTray,
}
