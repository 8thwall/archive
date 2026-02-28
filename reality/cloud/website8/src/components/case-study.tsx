import React from 'react'
import {createUseStyles} from 'react-jss'
import parse from 'html-react-parser'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'

import Layout from './layouts/layout'
import {FadeIn} from './fade-in'
import ToplineStat from './topline-stats'
import {ICaseStudy} from './case-study-interfaces'
import HeroPageHeading from './hero-page-heading'
import CaseStudySection from './case-study-section'
import {combine} from '../styles/classname-utils'
import {
  MOBILE_VIEW_OVERRIDE, TABLET_VIEW_OVERRIDE, SMALL_MONITOR_VIEW_OVERRIDE,
} from '../styles/constants'
import {
  brandHighlight, brandPurple, moonlight, gray1, gray4, gray5, gray6,
} from '../styles/brand-colors'

const useStyles = createUseStyles({
  section: {
    '& *': {
      textAlign: 'center',
    },
    '& p, & blockquote': {
      textAlign: 'left',
    },
  },
  heroSection: {
    boxShadow: `inset 0 0 0 50vw ${gray6}9A`,
  },
  overviewSection: {
    '& blockquote': {
      'position': 'relative',
      'padding': '1rem 3rem',
      'color': gray4,
      '&:before': {
        position: 'absolute',
        fontSize: '7rem',
        lineHeight: 1,
        top: '-1rem',
        left: 0,
        content: '\'\\201C\'',
        color: brandHighlight,
      },
      '&:after': {
        position: 'absolute',
        fontSize: '7rem',
        lineHeight: 1,
        bottom: '-4rem',
        right: 0,
        content: '\'\\201D\'',
        color: brandHighlight,
      },
      [MOBILE_VIEW_OVERRIDE]: {
        'fontSize': '1.2em',
        '&:before': {
          fontSize: '3.5rem',
          left: '0.5rem',
          top: '1rem',
        },
        '&:after': {
          fontSize: '3.5rem',
          right: '-0.5rem',
          bottom: '-0.25rem',
        },
      },
    },
    '& h4': {
      color: gray4,
    },
  },
  quoteSubSection: {
    [MOBILE_VIEW_OVERRIDE]: {
      display: 'none !important',
    },
  },
  videoSection: {
    backgroundColor: moonlight,
  },
  videoCaption: {
    display: 'flex',
    alignItems: 'center',
    margin: '1rem 4rem 1rem 0',
    [SMALL_MONITOR_VIEW_OVERRIDE]: {
      margin: '1rem 2rem 1rem 0',
    },
    [TABLET_VIEW_OVERRIDE]: {
      margin: '1rem 0',
    },
  },
  agencySection: {
    'backgroundColor': gray1,
    '& h2': {
      margin: '1rem 0',
    },
  },
  subSection: {
    'margin': '1rem 0',
    'display': 'flex',
    'justifyContent': 'center',
    '& > *': {
      padding: 0,
    },
  },
  studioLogoImg: {
    transform: (props) => `scale(${props.studioLogo.scale})`,
  },
  tagCategories: {
    '& button': {
      minWidth: '124px',
      height: '32px',
      borderRadius: '4px',
      margin: '1rem 0.25rem',
      border: 'none',
      background: gray1,
      color: gray5,
      outline: 'none',
      [MOBILE_VIEW_OVERRIDE]: {
        margin: '0.5rem',
      },
    },
  },
})

const CaseStudy: React.FunctionComponent<ICaseStudy> = ({caseStudyData}) => {
  const {
    metaData,
    hero,
    projectOverview,
    experience,
    results,
    about,
  } = caseStudyData
  const {t} = useTranslation(['case-study-pages'])
  const classes = useStyles({hero, studioLogo: about.studioLogo})
  const studioName = about.profilePage
    ? (
      <a
        target='_blank'
        rel='noopener noreferrer'
        href={about.profilePage}
        a8='click;case-study;click-partner-public-profile'
        className='font8-bold'
      >
        {{studioName: t(about.studioName)}}
      </a>
    )
    : <b>{{studioName: t(about.studioName)}}</b>

  return (
    <Layout
      title={t(metaData.titleTag)}
      description={t(metaData.metaDescription)}
      usePrefix={false}
      metaImage={metaData.metaImage}
    >
      <HeroPageHeading
        className={classes.heroSection}
        heroSrc={hero.img}
        title={t(hero.h1)}
        subTitle={t('hero_page_heading.subtitle')}
        awards={hero.awards}
      />

      <FadeIn>
        <section className={combine(classes.section, classes.overviewSection)}>
          <h2 className='h2-xl'>{t('heading.project_overview')}</h2>

          <div className={combine('row', classes.subSection)}>
            <div className='col-sm-10 col-md-10 col-lg-8'>
              <p className='text8-lg'>{parse(t(projectOverview.paragraph))}</p>
            </div>
          </div>
          <div className={combine('row', classes.subSection)}>
            <FadeIn
              className='col-10 col-sm-4'
              translateAmount='20px'
              delay={200}
              transitionDuration={800}
              transitionType='ease-out'
              id='case-study-stat'
            >
              {projectOverview.stats.map((stat, i) => (
                <ToplineStat
                  key={stat.title}
                  stat={stat}
                  index={i}
                  textColor={brandPurple}
                />
              ))}
            </FadeIn>
          </div>

          <div className={combine('row', classes.subSection, classes.quoteSubSection)}>
            <div className='col-sm-10 col-md-10 col-lg-8'>
              <blockquote className='text8-lg font8-medium'>{t(projectOverview.blockQuote)}</blockquote>
              <h4 className='font8-black'>{t(projectOverview.citation)}</h4>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className={combine(classes.section, classes.videoSection)}>
          <h2 className='h2-xl'>{t('heading.experience')}</h2>
          <div className={combine('row mt-sm-4 mt-md-5 mt-lg-5', classes.subSection)}>
            <div className={combine('row order-last order-lg-first col-lg-4 col-md-8 col-sm-10', classes.videoCaption)}>
              <p className='text8-lg'>{parse(t(experience.paragraph))}</p>
            </div>

            <div className='col-lg-4 col-md-8 col-sm-10 d-flex align-items-center madeWithTitle'>
              {experience.isGif
                ? <img src={experience.video} alt={t('image.alt.case_study_video')} />
                : <video id='case-study-video' autoPlay loop muted playsInline src={experience.video} />}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className={classes.section}>
          <h2 className='h2-xl'>{t('heading.results')}</h2>
          <div className={combine('row', classes.subSection)}>
            <div className='col-sm-10 col-md-10 col-lg-8'>
              <p className='text8-lg'>{parse(t(results.paragraph))}</p>
            </div>
          </div>

          {results.awards.length > 0 &&
            <div className={combine('row', classes.subSection)}>
              <div className='col'>
                <div className='row mb-3 justify-content-center'>
                  {results.awards.map((award) => (
                    <img
                      key={award.alt}
                      src={award.src}
                      alt={award.alt}
                      id='case-study-award'
                    />
                  ))}
                </div>
              </div>
            </div>}

          <div className={combine('row', classes.subSection, classes.tagCategories)}>
            <div className='col-sm-6 col-sm-10 col-md-10 col-lg-8'>
              {results.tags.map((tag) => (
                <button className='text8-xs text-nowrap' key={tag} type='button'>
                  {t(tag)}
                </button>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className={combine(classes.section, classes.agencySection)}>
          <h2 className='h2-xl'>{t('heading.about_agency')}</h2>
          <div
            className={
              combine('row mt-sm-4 mt-md-5 mt-lg-5 align-items-center', classes.subSection)
            }
          >
            <div className='col-sm-10 col-md-10 col-lg-4'>
              <p className='text8-lg'>
                <Trans
                  ns='case-study-pages'
                  i18nKey={about.paragraph}
                >
                  {studioName}
                  {about.paragraph}
                </Trans>
              </p>
            </div>
            <div className='col-md-6 col-lg-3'>
              <img
                className={combine('img-fluid', classes.studioLogoImg)}
                src={about.studioLogo.img}
                alt={about.studioLogo.alt}
              />
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <CaseStudySection
          from='case-study'
          heading={t('heading.read_more_case_studies')}
          description=''
        />
      </FadeIn>
    </Layout>
  )
}

export default CaseStudy
