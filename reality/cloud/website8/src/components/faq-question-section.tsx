import React from 'react'

import FaqQuestionBody from './faq-question-body'
import FaqQuestionOpener from './faq-question-opener'
import * as styles from './faq-question-section.module.scss'

interface IFaqQuestionSection {
  qid: string
  title: string
  html: string
  startCollapsed: boolean
}

const FaqQuestionSection: React.FC<IFaqQuestionSection> = ({qid, title, html, startCollapsed}) => (
  <div className={styles.main}>
    <div className={styles.content}>
      <FaqQuestionOpener qid={qid} title={title} startCollapsed={startCollapsed} />
      <FaqQuestionBody qid={qid} html={html} startCollapsed={startCollapsed} />
    </div>
  </div>
)

export default FaqQuestionSection
