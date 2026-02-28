import React from 'react'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'

import {brandPurple} from '../styles/brand-colors'
import metaverseBackground from '../../img/metaverse_bg.svg'
import metaverseDevices from '../../img/metaverse_devices.svg'
import {FadeIn} from './fade-in'
import * as classes from './device-deploy-section.module.scss'

const DeviceDeploySection = () => {
  const {t} = useTranslation('product-web-page')
  return (
    <section
      className='dark px-0 pb-0 pt-5'
      style={{
        position: 'relative',
        backgroundImage: `linear-gradient(300deg, #5C0D8F, #582E9E 35%, #563BA4 62%, ${brandPurple})`,
        overflowX: 'hidden',
      }}
    >
      <FadeIn>
        <div className='px-4 px-md-0 pt-3'>
          <div>
            <div className='row justify-content-center text-center'>
              <h2 className='text-white h2-xl px-2'>
                <Trans
                  ns='product-web-page'
                  i18nKey='device_deploy_section.heading'
                >
                  Develop Once.<br className='d-block d-sm-none' /> Deploy Everywhere.
                </Trans>
              </h2>
            </div>
          </div>
          <div className='row justify-content-center text-center'>
            <FadeIn
              className='col-12 col-sm-10 max-width'
              translateAmount='20px'
              delay={200}
              transitionDuration={800}
              transitionType='ease-out'
            >
              <p className='text-white text8-lg font8-regular'>
                {t('device_deploy_section.description')}
              </p>
            </FadeIn>
          </div>
        </div>
        <div className='position-relative'>
          <div className={classes.metaverseItemsContainer}>
            <img
              className={classes.metaverseItem}
              src={metaverseDevices}
              alt='Devices for the Metaverse'
              draggable={false}
            />
          </div>
          <div className={classes.metaverseBGContainer}>
            <img
              className={classes.metaverseBG}
              src={metaverseBackground}
              alt='Background for metaverse graphic'
              draggable={false}
            />
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

export default DeviceDeploySection
