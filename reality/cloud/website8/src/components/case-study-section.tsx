import React, {FC} from 'react'

import {CaseStudyCarousel} from './case-study-carousel'

interface Props {
  from: string // for a8 eventing
  heading: string
  description: string
}

const CaseStudySection: FC<Props> = ({
  from,
  heading,
  description,
}) => (
  <section id='case-studies' className='pb-3 px-0'>
    <h2 className='h2-xl text-center px-2'>{heading}</h2>
    <h3 className='text-center px-2'>{description}</h3>
    <CaseStudyCarousel from={from} />
  </section>
)

export default CaseStudySection
