import React from 'react'

import {combine} from '../styles/classname-utils'
import * as styles from './pricing-faq-question.module.scss'

interface IPricingFaqQuestion {
  qid: string
  title: string
  html: string
  link: string
}

const PricingFaqQuestion: React.FC<IPricingFaqQuestion> = ({qid, title, html, link}) => {
  const openFaqQuestion = (
    typeof window !== 'undefined' && window.location.hash === `#${link}`
  )

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={combine('row', 'justify-content-center', styles.faqOpener)}>
          <div className={styles.header}>
            <button
              id={link}
              className={combine(styles.faqButton, 'btn', 'font8-bold', 'btn-block', 'text-left')}
              data-toggle='collapse'
              data-target={`#${qid}`}
              aria-expanded='false'
              aria-controls={qid}
              type='button'
            >
              <h4 className={combine(styles.faqButtonContent, 'mb-0', 'purple')}>
                {title}
              </h4>
            </button>
          </div>
        </div>
        <div
          id={qid}
          aria-labelledby={qid}
          data-parent={`#${qid}`}
          className={`row collapse w-100 m-0 ${openFaqQuestion && 'show'}`}
        >
          <div>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{__html: html}} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingFaqQuestion
