import * as React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'react-i18next'

import {
  brandHighlight, brandWhite, tinyViewOverride,
} from '../static/styles/settings'
import vampireIslandLogo from '../static/assetlabdemo/vampire-vacation.png'
import vampireIslandRig from '../static/assetlabdemo/vampire-hevc-safari.mp4'
import vampireIslandRigVP9 from '../static/assetlabdemo/vampire-vp9-chrome.webm'
import vampireIslandModel from '../static/assetlabdemo/tree-hevc-safari.mp4'
import vampireIslandModelVP9 from '../static/assetlabdemo/tree-vp9-chrome.webm'
import {Icon, IconStroke} from '../ui/components/icon'
import {hexColorWithAlpha} from '../../shared/colors'

const ASSET_LAB_SAMPLES: {
  src: string
  altSrc?: string
  isVideo?: boolean
  icon: IconStroke
  type: string
  prompt: string
}[] = [
  {
    src: vampireIslandLogo,
    icon: 'image',
    type: 'image',
    // eslint-disable-next-line local-rules/hardcoded-copy
    prompt: 'Vampire Vacation game logo',
  },
  {
    src: vampireIslandModel,
    altSrc: vampireIslandModelVP9,
    isVideo: true,
    icon: 'meshCube',
    type: 'model',
    // eslint-disable-next-line local-rules/hardcoded-copy
    prompt: 'Spooky, gothic palm tree',
  },
  {
    src: vampireIslandRig,
    altSrc: vampireIslandRigVP9,
    isVideo: true,
    icon: 'guyRunningRight',
    type: 'character',
    // eslint-disable-next-line local-rules/hardcoded-copy
    prompt: 'Vampire on vacation, running',
  },
]

const ANIMATION_SPEED = ASSET_LAB_SAMPLES.length * 15
const TRACK_GAP = '1.5em'
const SLIDE_SIZE = '20em'
const SLIDE_SIZE_MIN = '17em'

const useStyles = createUseStyles({
  '@keyframes scroll': {
    '0%': {
      transform: 'translateX(0)',
    },
    '100%': {
      transform: `translateX(calc(-1 * (${SLIDE_SIZE} + ${TRACK_GAP}) * ` +
      `${ASSET_LAB_SAMPLES.length}))`,
    },
    [tinyViewOverride]: {
      '100%': {
        transform: `translateX(calc(-1 * ${SLIDE_SIZE} * ${ASSET_LAB_SAMPLES.length}))`,
      },
    },
  },
  'carousel': {
    position: 'relative',
    color: brandWhite,
    overflow: 'hidden',
    width: '1000px',
    mask: 'linear-gradient(to right, transparent , #fff 20%, #fff 80%, transparent 100%)',
    [tinyViewOverride]: {
      mask: 'linear-gradient(to right, transparent , #fff 10%, #fff 90%, transparent 100%)',
    },
  },
  'carouselTrack': {
    'gap': TRACK_GAP,
    'animation': `$scroll ${ANIMATION_SPEED}s linear infinite`,
    'display': 'flex',
    'width': `calc((${SLIDE_SIZE} + ${TRACK_GAP}) * ${ASSET_LAB_SAMPLES.length * 2})`,
    [tinyViewOverride]: {
      gap: 0,
      width: `calc((${SLIDE_SIZE_MIN}) * ${ASSET_LAB_SAMPLES.length * 2})`,
    },
  },
  'horizon': {
    background: `linear-gradient(180deg, ${hexColorWithAlpha(brandHighlight, 0.5)} 0%, ` +
    `${hexColorWithAlpha(brandHighlight, 0)} 100%)`,
    maskImage: 'linear-gradient(to right, transparent 5%, black 20%, black 80%, transparent 95%)',
    position: 'absolute',
    height: '50%',
    width: '100%',
    top: '60%',
  },
  'slideContainer': {
    width: SLIDE_SIZE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5em',
    [tinyViewOverride]: {
      width: SLIDE_SIZE_MIN,
    },
  },
  'slideType': {
    display: 'flex',
    gap: '0.25em',
    alignItems: 'center',
  },
  'slideImageContainer': {
    display: 'flex',
    flexDirection: 'column',
  },
  'slideImage': {
    height: '12em',
    zIndex: '3',
  },
  'slideShadow': {
    borderRadius: '50%',
    width: '90%',
    height: '30px',
    background: 'black',
    opacity: 0.5,
    filter: 'blur(5px)',
    margin: '-2em 0 0 1em',
  },
  'carouselContainer': {
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    padding: '1em 0',
  },
})

const AssetLabSampleCarousel: React.FunctionComponent = () => {
  const classes = useStyles()
  const {t} = useTranslation(['pricing-page'])

  const assetLabGallerySlides = ASSET_LAB_SAMPLES.map(sample => (
    <div className={classes.slideContainer} key={sample.prompt}>
      <div className={classes.slideType}>
        <Icon stroke={sample.icon} />
        {t(`asset_lab_sample_carousel.type.${sample.type}`)}
      </div>
      <div className={classes.slideImageContainer}>
        {sample?.isVideo
          ? (
            <video className={classes.slideImage} autoPlay loop muted playsInline>
              <source
                src={sample.src}
                type='video/mp4; codecs="hvc1"'
              />
              <source
                src={sample?.altSrc}
                type='video/webm'
              />
            </video>
          )
          : <img
              draggable={false}
              className={classes.slideImage}
              alt={sample.prompt}
              src={sample.src}
          />
      }
        <div className={classes.slideShadow} />
      </div>
      <div>
        {`“${sample.prompt}”`}
      </div>
    </div>
  ))

  return (
    <div className={classes.carouselContainer}>
      <div className={classes.horizon} />
      <div className={classes.carousel} id='pricing-credit-plans'>
        <div className={classes.carouselTrack}>
          {assetLabGallerySlides}
          {assetLabGallerySlides}
        </div>
      </div>
    </div>
  )
}

export {AssetLabSampleCarousel}
