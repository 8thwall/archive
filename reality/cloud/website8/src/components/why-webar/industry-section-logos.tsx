import React from 'react'

import Picture from '../picture'
import {combine} from '../../styles/classname-utils'
import * as classes from './industry-section.module.scss'
import nikeLogoIndSec from '../../../img/industry-section-logos/nike-logo.png'
import morganStanleyLogo from '../../../img/industry-section-logos/morgan-stanley-logo.png'
import cocaColaLogo from '../../../img/industry-section-logos/coca-cola-logo.png'
import pradaLogo from '../../../img/industry-section-logos/prada-logo.png'
import barbieLogo from '../../../img/industry-section-logos/barbie-logo.png'
import ferrariLogo from '../../../img/industry-section-logos/ferrari-logo.png'
import universalPicturesLogo from '../../../img/industry-section-logos/universal-pictures-logo.png'
import lancômeLogo from '../../../img/industry-section-logos/lancôme-logo.png'
import stateFarmLogo from '../../../img/industry-section-logos/state-farm-logo.png'
import mcdonaldsLogo from '../../../img/industry-section-logos/mcdonalds-logo.png'
import molsonCoorsLogo from '../../../img/industry-section-logos/molson-coors-logo.png'
import walmartLogo from '../../../img/industry-section-logos/walmart-logo.png'
import diageoLogo from '../../../img/industry-section-logos/diageo-logo.png'
import verizonLogo from '../../../img/industry-section-logos/verizon-logo.png'
import chaseLogo from '../../../img/industry-section-logos/chase-logo.png'
import spotifyLogo from '../../../img/industry-section-logos/spotify-logo.png'
import netflixLogo from '../../../img/industry-section-logos/netflix-logo.png'
import starbucksLogo from '../../../img/industry-section-logos/starbucks-logo.png'
import diorLogo from '../../../img/industry-section-logos/dior-logo.png'
import volvoLogo from '../../../img/industry-section-logos/volvo-logo.png'

const IndustrySectionLogos: React.FC = () => (
  <div className={classes.logos}>
    <Picture
      className={combine('d-lg-block py-3', classes.logo)}
      pngSrc={nikeLogoIndSec}
      alt='Nike Logo'
    />
    <Picture
      className={combine(classes.hideSmall, classes.logo)}
      pngSrc={morganStanleyLogo}
      alt='Morgan Stanley Logo'
    />
    <Picture
      className={combine('d-lg-block', classes.logo)}
      pngSrc={cocaColaLogo}
      alt='Coca Cola Logo'
    />
    <Picture
      className={combine('d-lg-block', classes.logo)}
      pngSrc={pradaLogo}
      alt='Prada Logo'
    />
    <Picture
      className={combine('d-lg-block', classes.logo)}
      pngSrc={barbieLogo}
      alt='Barbie Logo'
    />
    <Picture
      className={combine('d-lg-block', classes.logo)}
      pngSrc={ferrariLogo}
      alt='Ferrari Logo'
    />
    <Picture
      className={combine(classes.hideSmall, classes.logo)}
      pngSrc={universalPicturesLogo}
      alt='Universal Pictures Logo'
    />
    <Picture
      className={combine(classes.hideSmall, classes.logo)}
      pngSrc={lancômeLogo}
      alt='Lancôme Logo'
    />
    <Picture
      className={combine('d-lg-block', classes.logo)}
      pngSrc={stateFarmLogo}
      alt='State Farm Logo'
    />
    <Picture
      className={combine('d-lg-block', classes.logo)}
      pngSrc={mcdonaldsLogo}
      alt='McDonalds Logo'
    />
    <Picture
      className={combine(classes.hideSmall, classes.logo)}
      pngSrc={molsonCoorsLogo}
      alt='Molson Coor Logo'
    />
    <Picture
      className={combine(classes.hideSmall, classes.logo)}
      pngSrc={walmartLogo}
      alt='Walmart Logo'
    />
    <Picture
      className={combine('d-lg-block', classes.logo)}
      pngSrc={diageoLogo}
      alt='Diageo Logo'
    />
    <Picture
      className={combine(classes.hideSmall, classes.logo)}
      pngSrc={verizonLogo}
      alt='Verizon Logo'
    />
    <Picture
      className={combine(classes.hideSmall, classes.logo)}
      pngSrc={chaseLogo}
      alt='Chase Logo'
    />
    <Picture
      className={combine(classes.hideSmall, classes.logo)}
      pngSrc={spotifyLogo}
      alt='Spotify Logo'
    />
    <Picture
      className={combine('d-lg-block', classes.logo)}
      pngSrc={netflixLogo}
      alt='Netflix Logo'
    />
    <Picture
      className={combine(classes.hideSmall, classes.logo)}
      pngSrc={starbucksLogo}
      alt='Starbucks Logo'
    />
    <Picture
      className={combine(classes.hideSmall, classes.logo)}
      pngSrc={diorLogo}
      alt='Dior Logo'
    />
    <Picture
      className={combine(classes.hideSmall, classes.logo)}
      pngSrc={volvoLogo}
      alt='Volvo Logo'
    />
  </div>
)

export default IndustrySectionLogos
