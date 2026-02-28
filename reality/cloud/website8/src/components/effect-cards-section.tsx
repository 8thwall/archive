import React from 'react'
import {Trans, useTranslation} from 'gatsby-plugin-react-i18next'

import faceEffectsVid from '../../img/vids/face-effects.mp4'
import faceEffectsVidThumb from '../../img/vids/face-effects.jpg'
import imageTargetsVid from '../../img/vids/image-targets.mp4'
import imageTargetsVidThumb from '../../img/vids/image-targets.jpg'
import worldEffectsVid from '../../img/vids/world-effects.mp4'
import worldEffectsThumb from '../../img/vids/world-effects.jpg'
import vpsVid from '../../img/vids/vps.mp4'
import vpsThumb from '../../img/vids/vps.jpg'
import arEffectLine1 from '../../img/ar_effect_line_1.svg'
import arEffectLine2 from '../../img/ar_effect_line_2.svg'
import {combine} from '../styles/classname-utils'
import * as classes from './effect-cards-section.module.scss'
import AREffectCard from './ar-effect-card'
import {FadeIn} from './fade-in'

const EffectsCardSection = () => {
  const {t} = useTranslation(['why-webar-page'])

  return (
    <section className='px-0 pt-5 position-relative' style={{overflowX: 'hidden'}}>
      <div className={classes.exploreDeco}>
        <img
          className={combine(classes.exploreDecoImage, classes.exploreDecoBlue)}
          src={arEffectLine1}
          alt='decorative flourish'
          draggable={false}
        />
        <img
          className={classes.exploreDecoImage}
          src={arEffectLine2}
          alt='decorative flourish'
          draggable={false}
        />
      </div>
      <FadeIn>
        <div className='row justify-content-center text-center mb-3 mb-lg-4'>
          <div className='col-10 max-width'>
            <h2 className='h2-xl'>
              <Trans
                ns='why-webar-page'
                i18nKey='effect_cards_section.heading'
              >
                Create Augmented Reality Content&nbsp;
                <br className='d-none d-sm-block d-lg-none' />for the Web
              </Trans>
            </h2>
            <p className='noto-sans-jp text8-lg font8-medium' style={{marginTop: '0.75em'}}>
              {t('effect_cards_section.description')}
            </p>
          </div>
        </div>
        <div className={classes.exploreEffectWrapper}>
          <AREffectCard
            videoSrc={worldEffectsVid}
            posterSrc={worldEffectsThumb}
            cardText={t('effect_cards_section.card.world_effects.card_text')}
            linkText={t('effect_cards_section.card.world_effects.link_text')}
            link='/products-web#world-effects'
            a8='click;why-webar;click-explore-world-tracking'
          />
          <AREffectCard
            videoSrc={vpsVid}
            posterSrc={vpsThumb}
            cardText={t('effect_cards_section.card.vps.card_text')}
            linkText={t('effect_cards_section.card.vps.link_text')}
            link='/products-web#lightship-vps'
            a8='click;why-webar;click-explore-lightship-vps'
          />
          <AREffectCard
            videoSrc={imageTargetsVid}
            posterSrc={imageTargetsVidThumb}
            cardText={t('effect_cards_section.card.image_targets.card_text')}
            linkText={t('effect_cards_section.card.image_targets.link_text')}
            link='/products-web#image-target'
            a8='click;why-webar;click-explore-world-tracking'
          />
          <AREffectCard
            videoSrc={faceEffectsVid}
            posterSrc={faceEffectsVidThumb}
            cardText={t('effect_cards_section.card.face_effects.card_text')}
            linkText={t('effect_cards_section.card.face_effects.link_text')}
            link='/products-web#face-effect'
            a8='click;why-webar;click-explore-face-effects'
          />
        </div>
      </FadeIn>
    </section>
  )
}

export default EffectsCardSection
