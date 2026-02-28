import React from 'react'

interface IFaqQuestionBody {
  qid: string
  html: string
  startCollapsed: boolean
}

const FaqQuestionBody: React.FC<IFaqQuestionBody> = ({qid, html, startCollapsed}) => (
  <div
    id={qid}
    aria-labelledby={qid}
    data-parent={`#${qid}`}
    className={`row ${!startCollapsed ? '' : 'show'} collapse w-100 m-0`}
  >
    <div>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{__html: html}} />
    </div>
  </div>
)

export default FaqQuestionBody
