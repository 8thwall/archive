import React from 'react'
import {useTranslation} from 'gatsby-plugin-react-i18next'
import {graphql} from 'gatsby'
import {createUseStyles} from 'react-jss'

import Layout from '../components/layouts/layout'
import BasicPageHeading from '../components/basic-page-heading'
import docsLogo from '../../img/docs.svg'
import forumLogo from '../../img/forum.svg'
import tutorialsLogo from '../../img/tutorials.svg'
import projectLibraryLogo from '../../img/project-library.svg'
import questionsLogo from '../../img/questions.svg'
import blogLogo from '../../img/blog.svg'
import coursesLogo from '../../img/courses.svg'
import communityIcon from '../../img/community-icon.svg'
import {combine} from '../styles/classname-utils'
import {brandBlack, brandWhite} from '../styles/brand-colors'
import {
  MOBILE_VIEW_OVERRIDE, TABLET_VIEW_OVERRIDE,
} from '../styles/constants'

const useStyles = createUseStyles({
  section: {
    textAlign: 'center',
  },
  subSection: {
    justifyContent: 'center',
    maxWidth: '84rem',
    margin: 'auto',
  },
  cardList: {
    gap: '2.5rem 3.5rem',
    [TABLET_VIEW_OVERRIDE]: {
      gap: '2.5rem',
    },
    [MOBILE_VIEW_OVERRIDE]: {
      gap: '1rem',
    },
  },
  card: {
    'backgroundColor': brandWhite,
    'boxShadow': `${brandBlack}40 0px 8px 24px`,
    'borderRadius': '4px',
    'padding': '1.5rem',
    'width': '22rem',
    'minHeight': '18rem',
    'color': brandBlack,
    'textDecoration': 'none',
    '&:hover': {
      color: brandBlack,
      textDecoration: 'none',
      transform: 'scale(1.02)',
      transition: 'all 0.08s linear',
    },
    '& img': {
      height: '4.5rem',
      marginBottom: '0.5rem',
    },
    '& h2': {
      margin: '1.125rem',
    },
    '& p': {
      fontSize: '1.125rem',
      lineHeight: '1.6875rem',
      letterSpacing: '-0.2px',
    },
  },
})

export default () => {
  const {t} = useTranslation(['resources-page'])
  const classes = useStyles()
  return (
    <Layout title={t('page.title')}>
      <BasicPageHeading>
        {t('page.title')}
      </BasicPageHeading>
      <section className={combine('light', classes.section)}>
        <div className={combine('row', classes.subSection, classes.cardList)}>
          <a
            className={classes.card}
            href='/docs/'
            target='_blank'
            rel='noopener noreferrer'
            a8='click;support;click-docs'
          >
            <img src={docsLogo} alt='docs logo' />
            <h2 className='font8-bold'>{t('card.heading.docs')}</h2>
            <p className='font8-semibold'>
              {t('card.description.docs')}
            </p>
          </a>

          <a
            className={classes.card}
            href='/forum'
            target='_blank'
            rel='noopener noreferrer'
            a8='click;support;click-forum'
          >
            <img src={forumLogo} alt='forum logo' />
            <h2 className='font8-bold'>{t('card.heading.forum')}</h2>
            <p className='font8-semibold'>
              {t('card.description.forum')}
            </p>
          </a>

          <a
            className={classes.card}
            href='/tutorials'
            target='_blank'
            rel='noopener noreferrer'
            a8='click;support;click-tutorials'
          >
            <img src={tutorialsLogo} alt='tutorials logo' />
            <h2 className='font8-bold'>{t('card.heading.tutorials')}</h2>
            <p className='font8-semibold'>
              {t('card.description.tutorials')}
            </p>
          </a>

          <a
            className={classes.card}
            href='/projects'
            rel='noopener noreferrer'
            a8='click;support;click-project-library'
          >
            <img src={projectLibraryLogo} alt='project library logo' />
            <h2 className='font8-bold'>{t('card.heading.project_library')}</h2>
            <p className='font8-semibold'>
              {t('card.description.project_library')}
            </p>
          </a>

          <a
            className={classes.card}
            href='/blog'
            target='_blank'
            rel='noopener noreferrer'
            a8='click;support;click-blog'
          >
            <img src={blogLogo} alt='Blog logo' />
            <h2 className='font8-bold'>{t('card.heading.blog')}</h2>
            <p className='font8-semibold'>
              {t('card.description.blog')}
            </p>
          </a>

          <a
            className={classes.card}
            href='/courses'
            target='_blank'
            rel='noopener noreferrer'
            a8='click;support;click-courses'
          >
            <img src={coursesLogo} alt='Courses logo' />
            <h2 className='font8-bold'>{t('card.heading.courses')}</h2>
            <p className='font8-semibold'>
              {t('card.description.courses')}
            </p>
          </a>

          <a
            className={classes.card}
            href='/community'
            target='_blank'
            rel='noopener noreferrer'
            a8='click;support;click-community'
          >
            <img src={communityIcon} alt='Community icon' />
            <h2 className='font8-bold'>{t('card.heading.community')}</h2>
            <p className='font8-semibold'>
              {t('card.description.community')}
            </p>
          </a>

          <a
            className={classes.card}
            href='mailto:support@8thwall.com'
            target='_blank'
            rel='noopener noreferrer'
            a8='click;support;click-more-questions'
          >
            <img src={questionsLogo} alt='questions logo' />
            <h2 className='font8-bold'>{t('card.heading.questions')}</h2>
            <p className='font8-semibold'>
              {t('card.description.questions')}
            </p>
          </a>
        </div>
      </section>
    </Layout>
  )
}

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
