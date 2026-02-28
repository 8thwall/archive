import React from 'react'
import {graphql} from 'gatsby'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import Layout from '../components/layouts/layout'
import ForumLink from '../components/forum-link'
import forumLogo from '../../img/forum-gray.svg'
import envelopLogo from '../../img/envelope-regular.svg'
import BasicPageHeading from '../components/basic-page-heading'
import FaqQuestionSection from '../components/faq-question-section'
import * as classes from './faq.module.scss'

export default ({data}) => {
  const {i18n, t} = useTranslation(['faq-page'])
  const {edges} = data.allMarkdownRemark
  return (
    <Layout title={t('page.title')}>
      <BasicPageHeading>{t('page.heading')}</BasicPageHeading>
      <div className={classes.questionsSection}>
        {edges.filter(({node}) => node.fileAbsolutePath.includes(i18n.language)).map(({node}) => {
          const {frontmatter, html, id} = node
          const {title} = frontmatter
          return <FaqQuestionSection qid={id} key={title} title={title} html={html} />
        })}
      </div>
      <section className={classes.communitySection}>
        <div className='row justify-content-center text-center'>
          <div className='col-md-10'>
            <h2 className='text-center'>{t('still_have_question_section.heading')}</h2>
            <p className='text8-lg text-center'>{t('still_have_question_section.description')}
            </p>
            <div className={classes.supportRow}>
              <ForumLink>
                <img
                  className={classes.filterGray4}
                  src={forumLogo}
                  alt='forum-logo'
                  width='40'
                  height='40'
                />
              </ForumLink>
              <a href='mailto:support@8thwall.com'>
                <img
                  className={classes.filterGray4}
                  src={envelopLogo}
                  alt='email-logo'
                  width='40'
                  height='40'
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const query = graphql`
  {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: {glob: "**/docs/**/faq/*.md"}
        frontmatter: {defaultpriority: {gt: 0}}
      },
      sort: {fields: frontmatter___defaultpriority, order: ASC}
    ) {
      edges {
        node {
          fileAbsolutePath
          frontmatter {
            title
            defaultpriority
          }
          html
          id
        }
      }
    }
  }
`
