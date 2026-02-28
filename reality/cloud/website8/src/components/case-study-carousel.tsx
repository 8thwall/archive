import React from 'react'
import {Link} from 'gatsby'
import Carousel, {consts} from 'react-elastic-carousel'
import {useLocation} from '@reach/router'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'

import carouselItems, {ICaseStudyCarouselItemData} from './case-study-carousel-constants'
import {combine} from '../styles/classname-utils'
import * as classes from './case-study-carousel.module.scss'

const CaseStudyCarouselCard: React.FunctionComponent<ICaseStudyCarouselItemData> = ({
  image,
  logo,
  h2,
  h4,
  p,
  link,
  from,
  i18nKey
}) => {
  const {t} = useTranslation('case-study-pages')

  return (
    <Link
      to={link}
      className={classes.caseStudyCard}
      a8={from && `click;${from};click-case-study-carousel-card`}
    >
      <div className={combine('shadow', classes.caseStudyCardContainer)}>
        <div className={classes.logo}>
          {logo.map((src) => <img src={src} key={src} alt='Studio Logo' />)}
        </div>
        <div className={classes.experience}>
          <img src={image} alt='Studio Experience' />
        </div>
        <div className={classes.caseStudyCardBody}>
          <div className='d-none d-md-flex justify-content-center align-items-end'>
            <Trans
              ns='case-study-pages'
              i18nKey={i18nKey}
            >
              <div className={combine('d-inline', classes.caseStudyCardStat)}>{h2}</div>
              <div className={combine(classes.caseStudyCardText, 'd-inline text8-lg')}>{p}</div>
            </Trans>
          </div>
          <div className={combine('row mt-md-2 mt-lg-0', classes.readCaseStudyContainer)}>
            <p className='text8-lg'>{t('case_study_carousel.read_case_study')}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

interface ICaseStudyCarousel {
  from?: string, // for a8 eventing
}

const CaseStudyCarousel: React.FunctionComponent<ICaseStudyCarousel> = ({
  from = '',
}) => {
  const carouselBreakPoints = [
    {width: 850, itemsToShow: 3},
    {width: 900, itemsToShow: 3.2},
  ]

  const myArrow = ({type, onClick, isEdge}) => (
    <button
      className={classes.myArrow}
      type='button'
      onClick={onClick}
      disabled={isEdge}
    >
      <i className={type === consts.PREV ? 'fas fa-chevron-left'
        : 'fas fa-chevron-right'}
      />
    </button>
  )

  const carouselItemsCards = (
    carouselItems.reduce<React.ReactElement[]>(
      (o, v) => {
        const {pathname} = useLocation()
        const currentPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
        if (v.link === currentPath) { // Exclude current case-study from carousel.
          return o
        }
        // eslint-disable-next-line implicit-arrow-linebreak
        return o.concat(
          <CaseStudyCarouselCard
            from={from}
            key={v.link}
            {...v}
          />
        )
      },
      []
    )
  )

  return (
    <>
      <div className={classes.caseStudyCarousel}>
        <Carousel
          renderArrow={myArrow}
          breakPoints={carouselBreakPoints}
          itemPadding={[0, 0]}
        >
          {carouselItemsCards}
        </Carousel>
      </div>
      <div className={classes.caseStudyCarouselSmall}>
        {carouselItemsCards}
      </div>
    </>
  )
}

export {CaseStudyCarousel, CaseStudyCarouselCard, carouselItems}
