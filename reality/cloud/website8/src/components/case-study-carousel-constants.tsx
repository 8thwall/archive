import jumanjiCarousel from '../../img/customer-work/carousel/jumanji-carousel.jpg'
import laDodgersGoldenRoadBrewingCarousel from '../../img/customer-work/carousel/la-dodgers-golden-road-brewing-carousel.png'
import pinkFloydCarousel from '../../img/customer-work/carousel/pink-floyd-carousel.jpg'
import saatchiArtCarousel from '../../img/customer-work/carousel/saatchi-art-carousel.png'
import unileverPotNoodleCarousel from '../../img/customer-work/carousel/pot-noodle-carousel.jpg'
import khaiteCarousel from '../../img/customer-work/carousel/khaite-carousel.png'
import burgerKingCarousel from '../../img/customer-work/carousel/burgerking-carousel.png'
import bonVivCarousel from '../../img/customer-work/carousel/bonviv-carousel.png'
import bloomingdalesCarousel from '../../img/customer-work/carousel/bloomingdales-carousel.png'

import jumanjiLogo from '../../img/customer-work/logos/jumanji-logo.png'
import goldenRoadBrewingLogo from '../../img/customer-work/logos/golden-road-brewing-logo.png'
import laDodgersLogo from '../../img/customer-work/logos/la-dodgers-logo.svg'
import pinkFloydLogo from '../../img/customer-work/logos/pink-floyd-logo.png'
import potNoodleLogo from '../../img/customer-work/logos/pot-noodle-logo.png'
import saatchiArtLogo from '../../img/customer-work/logos/saatchi-art-logo.png'
import unileverLogo from '../../img/customer-work/logos/unilever-logo.png'
import khaiteLogo from '../../img/customer-work/logos/khaite-logo.png'
import burgerKingLogo from '../../img/customer-work/logos/burgerking-logo.png'
import tinieLogo from '../../img/customer-work/logos/tinie-logo.png'
import bonVivLogo from '../../img/customer-work/logos/bonviv-logo.png'
import bloomingdalesLogo from '../../img/customer-work/logos/bloomingdales-logo.png'

export interface ICaseStudyCarouselItemData {
  image: string,
  logo: string[],
  h2: string,
  p: string,
  link: string,
  verticalMargin?: string,
  from?: string, // for a8 eventing
  i18nKey: string,
}

const carouselItems: ICaseStudyCarouselItemData[] = [
  // Bloomingdales
  {
    image: bloomingdalesCarousel,
    logo: [bloomingdalesLogo],
    h2: '+22%',
    p: 'conversion rate',
    link: '/customer-work/bloomingdales',
    i18nKey: 'case_study_carousel_card.bloomingdales',
  },

  // Bon V!V Spiked Seltzer
  {
    image: bonVivCarousel,
    logo: [bonVivLogo],
    h2: '58%',
    p: 'CTR',
    link: '/customer-work/bon-viv-spiked-seltzer',
    i18nKey: 'case_study_carousel_card.bonviv',
  },

  // Burger King
  {
    image: burgerKingCarousel,
    logo: [burgerKingLogo, tinieLogo],
    h2: '10.8M',
    p: 'impressions',
    link: '/customer-work/bully-whoppa-on-a-whopper',
    i18nKey: 'case_study_carousel_card.bully_whoppa',
  },

  // Khaite
  {
    image: khaiteCarousel,
    logo: [khaiteLogo],
    h2: '4x',
    p: 'increase in sales',
    link: '/customer-work/khaite',
    i18nKey: 'case_study_carousel_card.khaite',
  },

  // LA Dodgers - Golden Road Brewing
  {
    image: laDodgersGoldenRoadBrewingCarousel,
    logo: [goldenRoadBrewingLogo, laDodgersLogo],
    h2: '18%',
    p: 'CTR',
    link: '/customer-work/la-dodgers-golden-road-brewing-world-series-webar-face-effect',
    i18nKey: 'case_study_carousel_card.la_dodgers',
  },

  // Saatchi Art
  {
    image: saatchiArtCarousel,
    logo: [saatchiArtLogo],
    h2: '17%',
    p: 'increase in spend',
    link: '/customer-work/saatchi-art-integrates-largest-deployment-of-webar-ecommerce',
    i18nKey: 'case_study_carousel_card.saatchi',
  },

  // Unilever - Pot Noodle
  {
    image: unileverPotNoodleCarousel,
    logo: [unileverLogo, potNoodleLogo],
    h2: '5x',
    p: 'increase in applicants',
    link: '/customer-work/pot-noodle-unilever-launches-virtual-career-fair',
    i18nKey: 'case_study_carousel_card.pot_noodle',
  },

  // Jumanji
  {
    image: jumanjiCarousel,
    logo: [jumanjiLogo],
    h2: '>5min',
    p: 'dwell time',
    link: '/customer-work/jumanji',
    i18nKey: 'case_study_carousel_card.jumanji',
  },

  // Pink Floyd
  {
    image: pinkFloydCarousel,
    logo: [pinkFloydLogo],
    h2: '2min',
    p: 'dwell time',
    link: '/customer-work/pink-floyd',
    i18nKey: 'case_study_carousel_card.pink_floyd',
  },
]

export default carouselItems
