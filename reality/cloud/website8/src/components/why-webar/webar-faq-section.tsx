import React from 'react'
import {useStaticQuery, graphql} from 'gatsby'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import FaqQuestionSection from '../faq-question-section'
import * as classes from '../../pages/faq.module.scss'

const WebARFAQSection = () => {
  const {i18n, t} = useTranslation(['why-webar-page'])
  const query = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: {glob: "**/docs/**/faq/*.md"}
          frontmatter: {webarpriority: {ne: null}}
        },
        sort: {fields: frontmatter___webarpriority, order: ASC}
      ) {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              title
              webarpriority
            }
            html
            id
          }
        }
      }
    }
  `)
  const {edges} = query.allMarkdownRemark

  return (
    <section>
      <h2 className='text-center h2-l'>{t('webar_faq_section.heading')}</h2>
      <p className='text-center text8-lg'>{t('webar_faq_section.subheading')}</p>
      <div className={classes.questionsSection}>
        {edges.filter(({node}) => node.fileAbsolutePath.includes(i18n.language)).map(
          ({node}, index) => {
            const {frontmatter, html, id} = node
            const {title} = frontmatter
            return (
              <FaqQuestionSection
                qid={id}
                key={title}
                title={title}
                html={html}
                startCollapsed={index === 0}
              />
            )
          }
        )}
      </div>
    </section>
  )
}

export default WebARFAQSection
