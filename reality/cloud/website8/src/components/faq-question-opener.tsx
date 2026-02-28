import React from 'react'

import {combine} from '../styles/classname-utils'
import * as styles from './faq-question-opener.module.scss'

interface IFaqQuestionOpener {
  qid: string
  title: string
  startCollapsed: boolean
}

const FaqQuestionOpener: React.FC<IFaqQuestionOpener> = ({qid, title, startCollapsed}) => (
  <div className={combine('row', 'justify-content-center', styles.faqOpener)}>
    <div className={styles.header}>
      <button
        className={combine(styles.faqButton, 'btn', 'btn-block', 'text-left')}
        data-toggle='collapse'
        data-target={`#${qid}`}
        aria-expanded={startCollapsed}
        aria-controls={qid}
        type='button'
      >
        <h4 className={combine(styles.faqButtonContent, 'font8-bold', 'mb-0', 'purple')}>
          {title}
        </h4>
      </button>
    </div>
  </div>
)

export default FaqQuestionOpener
