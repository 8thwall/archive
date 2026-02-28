import React from 'react'
import Carousel, {consts} from 'react-elastic-carousel'

import PremierLabel from './premier-label'
import aircards from '../../img/partner-logos/aircards-logo.png'
import aircardsWebp from '../../img/partner-logos/aircards-logo.webp'
import alivenow from '../../img/partner-logos/alivenow.png'
import alivenowWebp from '../../img/partner-logos/alivenow.webp'
import bully from '../../img/partner-logos/bully.png'
import bullyWebp from '../../img/partner-logos/bully.webp'
import eyekandy from '../../img/partner-logos/eyekandy.png'
import eyekandyWebp from '../../img/partner-logos/eyekandy.webp'
import fourteenFour from '../../img/partner-logos/14four-logo.png'
import fourteenFourWebp from '../../img/partner-logos/14four-logo.webp'
import hoopla from '../../img/partner-logos/hoopla-logo.png'
import hooplaWebp from '../../img/partner-logos/hoopla-logo.webp'
import mawari from '../../img/partner-logos/mawari-logo.png'
import mawariWebp from '../../img/partner-logos/mawari-logo.webp'
import nextnow from '../../img/partner-logos/nextnow.png'
import nextnowWebp from '../../img/partner-logos/nextnow.webp'
import powster from '../../img/partner-logos/powster-logo.png'
import powsterWebp from '../../img/partner-logos/powster-logo.webp'
import rpr from '../../img/partner-logos/rpr.png'
import rprWebp from '../../img/partner-logos/rpr.webp'
import spark from '../../img/partner-logos/spark-logo.png'
import sparkWebp from '../../img/partner-logos/spark-logo.webp'
import svarmony from '../../img/partner-logos/svarmony-logo.png'
import svarmonyWebp from '../../img/partner-logos/svarmony-logo.webp'
import tactic from '../../img/partner-logos/tactic.png'
import tacticWebp from '../../img/partner-logos/tactic.webp'
import threesixonedrx from '../../img/partner-logos/threesixonedrx.png'
import threesixonedrxWebp from '../../img/partner-logos/threesixonedrx.webp'
import trigger from '../../img/partner-logos/trigger-logo.png'
import triggerWebp from '../../img/partner-logos/trigger-logo.webp'
import unbnd from '../../img/partner-logos/unbnd-logo.png'
import unbndWebp from '../../img/partner-logos/unbnd-logo.webp'
import * as styles from './partners-carousel.module.scss'
import {combine} from '../styles/classname-utils'

export interface IPartnerCard {
  logo: string,
  link: string,
  from?: string, // for a8 eventing
  partnerName?: string, // for a8 eventing
  logoWebp?: string,
}

const PartnerCard: React.FunctionComponent<IPartnerCard> = (
  {logo, link, from, partnerName, logoWebp}
) => (
  <a
    target='_blank'
    rel='noopener noreferrer'
    href={link}
    className={styles.partnerCardLink}
    a8={from && `click;${from};click-partner-logo-${partnerName}`}
  >
    <div className={combine('card align-items-center shadow', styles.partnerCard)}>
      <div style={{maxWidth: '70%', margin: 'auto'}}>
        <picture>
          {logoWebp && <source srcSet={logoWebp} type='image/webp' />}
          <img className='card-img' src={logo} alt='Studio Logo' />
        </picture>
      </div>
      <PremierLabel bottom right />
    </div>
  </a>
)


const Partners = [
  // Aircards
  {
    name: 'aircards', // for a8 eventing
    logo: aircards,
    logoWebp: aircardsWebp,
    link: '/aircards',
  },
  // Alive Now
  {
    name: 'alive-now', // for a8 eventing
    logo: alivenow,
    logoWebp: alivenowWebp,
    link: '/alivenow',
  },
  // bully entertainment
  {
    name: 'bully-entertainment', // for a8 eventing
    logo: bully,
    logoWebp: bullyWebp,
    link: '/bullyentertainment',
  },

  // eyekandy
  {
    name: 'eyekandy', // for a8 eventing
    logo: eyekandy,
    logoWebp: eyekandyWebp,
    link: '/eyekandy',
  },

  // Hoopla Digital
  {
    name: 'hoopla-digital', // for a8 eventing
    logo: hoopla,
    logoWebp: hooplaWebp,
    link: '/hoopla',
  },

  // Mawari
  {
    name: 'mawari', // for a8 eventing
    logo: mawari,
    logoWebp: mawariWebp,
    link: '/mawari',
  },

  // Next/Now
  {
    name: 'next-now', // for a8 eventing
    logo: nextnow,
    logoWebp: nextnowWebp,
    link: '/nextnow',
  },

  // Powster
  {
    name: 'powster', // for a8 eventing
    logo: powster,
    logoWebp: powsterWebp,
    link: '/powster',
  },

  // RPR
  {
    name: 'rock-paper-reality', // for a8 eventing
    logo: rpr,
    logoWebp: rprWebp,
    link: '/rockpaperreality',
  },

  // Spark
  {
    name: 'spark labs', // for a8 eventing
    logo: spark,
    logoWebp: sparkWebp,
    link: '/spark',
  },

  // svarmony (formerly innovation.rocks)
  {
    name: 'svarmony', // for a8 eventing
    logo: svarmony,
    logoWebp: svarmonyWebp,
    link: '/svarmony',
  },

  // Tactic
  {
    name: 'tactic', // for a8 eventing
    logo: tactic,
    logoWebp: tacticWebp,
    link: '/tactic',
  },

  // Trigger
  {
    name: 'trigger', // for a8 eventing
    logo: trigger,
    logoWebp: triggerWebp,
    link: '/trigger',
  },

  // UNBND
  {
    name: 'unbnd', // for a8 eventing
    logo: unbnd,
    logoWebp: unbndWebp,
    link: '/unbnd',
  },

  // 14Four
  {
    name: '14-four', // for a8 eventing
    logo: fourteenFour,
    logoWebp: fourteenFourWebp,
    link: '/14four',
  },

  // 361/DRX
  {
    name: '361-drx', // for a8 eventing
    logo: threesixonedrx,
    logoWebp: threesixonedrxWebp,
    link: '/361drxwebar',
  },
]

interface IPartnerCarousel {
  from?: string, // for a8 eventing
}

const PartnerCarousel: React.FunctionComponent<IPartnerCarousel> = ({from}) => {
  const carouselBreakPoints = [
    {width: 900, itemsToShow: 3},
    {width: 1000, itemsToShow: 3.5},
  ]

  const myArrow = ({type, onClick, isEdge}) => {
    const pointer = (
      type === consts.PREV
        ? <i className='fas fa-chevron-left pl-4' />
        : <i className='fas fa-chevron-right pr-4' />
    )
    return (
      <button
        className={styles.myArrow}
        type='button'
        onClick={onClick}
        disabled={isEdge}
      >
        {pointer}
      </button>
    )
  }

  const partnerCards = Partners.map(data => <PartnerCard key={data.link} from={from} {...data} />)

  return (
    <div className={combine('row', 'justify-content-center')}>
      <div className={combine('col-12', styles.carousel)} style={{maxWidth: '1200px'}}>
        <Carousel
          renderArrow={myArrow}
          breakPoints={carouselBreakPoints}
          showArrows
          itemPadding={[30, 50]}
        >
          {partnerCards}
        </Carousel>
      </div>
      <div className={styles.carouselSmall}>
        {partnerCards}
      </div>
    </div>
  )
}

export default PartnerCarousel
