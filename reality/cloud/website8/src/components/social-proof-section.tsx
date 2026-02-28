import React from 'react'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'

import {FadeIn} from './fade-in'
import * as classes from './social-proof-section.module.scss'
import {combine} from '../styles/classname-utils'
import Button8 from './button8'
import {useUserContext, IUserContext} from '../common/user-context'
import IndustrySectionLogos from './why-webar/industry-section-logos'

const SocialProofSectionContent = ({fadeIn, children}) => (
  fadeIn ? <FadeIn>{children}</FadeIn> : children
)

interface Props {
  fadeIn?: boolean
  a8: string
}

const SocialProofSection: React.FC<Props> = ({fadeIn, a8}) => {
  const {t} = useTranslation(['pricing-page'])
  const {currentUser}: IUserContext = useUserContext()

  return (
    <section className={combine('small-content', classes.socialProofSection)}>
      <SocialProofSectionContent fadeIn={fadeIn}>
        <div className={classes.socialProofContent}>
          <div className='row'>
            <div className='col-12'>
              <h2 className={classes.socialHeader} style={{margin: 0}}>
                <Trans
                  ns='pricing-page'
                  i18nKey='social_proof_section.heading'
                >
                  Join the world’s most innovative companies
                  <br className='d-none d-md-block d-lg-none' /> using 8th Wall WebAR
                </Trans>
              </h2>
            </div>
          </div>
          <IndustrySectionLogos />
          {!currentUser &&
            <a a8={a8} href='/get-started'>
              <Button8>
                {t('social_proof_section.button.get_started_free')}
              </Button8>
            </a>}
        </div>
      </SocialProofSectionContent>
    </section>
  )
}

export default SocialProofSection
