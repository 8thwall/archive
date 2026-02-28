import React from 'react'
import {Trans, useTranslation} from 'gatsby-plugin-react-i18next'

import {brandPurple, brandHighlight} from '../styles/brand-colors'
import {FadeIn} from './fade-in'

const ComparePlatformSection = () => {
  const {t} = useTranslation(['why-webar-page'])
  const statRef = React.useRef<HTMLDivElement>(null!)
  const [isStatVisible, setStatVisible] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setStatVisible(true)
        }
      })
    })
    observer.observe(statRef.current)
    return () => {
      if (typeof statRef.current === 'Element') {
        observer.unobserve(statRef.current)
      }
    }
  }, [])

  return (
    <section
      className='dark px-0 py-5'
      style={{
        position: 'relative',
        backgroundImage: `linear-gradient(300deg, #5C0D8F, #582E9E 35%, #563BA4 62%, ${brandPurple})`,
        overflowX: 'hidden',
      }}
    >
      <FadeIn>
        <div className='px-4 px-md-0'>
          <div className='row justify-content-center text-center'>
            <div className='col-10'>
              <h2 className='text-white h2-xl'>{t('compare_platform_section.heading')}</h2>
            </div>
          </div>

          <div className='row justify-content-center text-center'>
            <div className='col-12 col-sm-10'>
              <p className='text8-lg text-white font8-regular'>
                <Trans
                  ns='why-webar-page'
                  i18nKey='compare_platform_section.description'
                >
                  8th Wall supports more smartphone users&nbsp;
                  <br className='d-none d-md-block d-lg-none' />
                  than any other AR platform.
                </Trans>
              </p>
            </div>
          </div>

          <div ref={statRef} className='row justify-content-center mb-2'>
            <div className='col-md-10 max-width'>
              <div className='row justify-content-center mb-2'>
                <div className='col'>
                  <span className='text8-lg font8-bold text-white'>8th Wall WebAR</span>
                </div>
              </div>

              <div className='row justify-content-start mb-4'>
                <div className='col'>
                  <div
                    className='progress center-block'
                    style={{height: '3em', backgroundColor: brandPurple}}
                  >
                    <div
                      className='progress-bar'
                      role='progressbar'
                      style={{
                        width: isStatVisible ? '100%' : '0%',
                        background: `linear-gradient(to right, #C064E4, ${brandHighlight})`,
                      }}
                    >
                      <div className='text-right mr-2 mr-md-3'>
                        <span className='text8-lg text-white d-none d-sm-block'>
                          {t('compare_platform_section.platform.8th_wall_webar.user_count')}
                        </span>
                        <span className='text8-lg text-white d-block d-sm-none'>
                          {t('compare_platform_section.platform.8th_wall_webar.user_count_short')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='row justify-content-center mb-2'>
                <div className='col'>
                  <span className='text8-lg font8-bold text-white'>ARKit</span>
                </div>
              </div>

              <div className='row justify-content-start align-items-center mb-4'>
                <div className='col-6 col-md-5'>
                  <div
                    className='progress center-block'
                    style={{height: '3em', backgroundColor: brandPurple}}
                  >
                    <div
                      className='progress-bar'
                      role='progressbar'
                      style={{
                        width: isStatVisible ? '100%' : '0%',
                        background: `linear-gradient(to right, #C064E4, ${brandHighlight})`,
                      }}
                    >
                      <div className='text-right mr-2 mr-md-3'>
                        <span className='text8-lg text-white d-none d-sm-block'>
                          {t('compare_platform_section.platform.arkit.user_count')}
                        </span>
                        <span className='text8-lg text-white d-block d-sm-none'>
                          {t('compare_platform_section.platform.arkit.user_count_short')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='row justify-content-center mb-2'>
                <div className='col'>
                  <span className='text8-lg font8-bold text-white'>ARCore</span>
                </div>
              </div>

              <div className='row justify-content-start align-items-center'>
                <div className='col-4 col-sm-3'>
                  <div
                    className='progress center-block'
                    style={{height: '3em', backgroundColor: brandPurple}}
                  >
                    <div
                      className='progress-bar'
                      role='progressbar'
                      style={{
                        width: isStatVisible ? '100%' : '0%',
                        background: `linear-gradient(to right, #C064E4, ${brandHighlight})`,
                      }}
                    >
                      <div className='text-right mr-2 mr-md-3'>
                        <span className='text8-lg text-white d-none d-sm-block'>
                          {t('compare_platform_section.platform.arcore.user_count')}
                        </span>
                        <span className='text8-lg text-white d-block d-sm-none'>
                          {t('compare_platform_section.platform.arcore.user_count_short')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col text-right text-white align-self-end'>
                  <p className='m-0'>
                    {t('compare_platform_section.blurb.source')}:&nbsp;
                    <a
                      target='_blank'
                      rel='noopener noreferrer'
                      href='https://arinsider.co/2019/07/09/ar-revenues-to-reach-27-4-billion-by-2023/'
                      style={{color: 'white', textDecoration: 'underline'}}
                    >
                      AR Insider, 2021
                    </a>
                  </p>
                </div>
              </div>

              <div className='row justify-content-start text-white d-none d-md-block mt-3' />
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

export default ComparePlatformSection
