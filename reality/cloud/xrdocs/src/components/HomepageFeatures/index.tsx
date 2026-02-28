/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
import React, {useState} from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'

import userGuideImg from '@site/static/images/icon-user-guide.png'
import userGuideHighlightedImg from '@site/static/images/icon-user-guide-highlighted.png'
import apiImg from '@site/static/images/icon-api.png'
import apiHighlightedImg from '@site/static/images/icon-api-highlighted.png'

import styles from './styles.module.scss'

const FeatureList = [
  {
    title: 'User Guide',
    img: userGuideImg,
    hoveredImg: userGuideHighlightedImg,
    url: '/docs/website',
    description: (
      <>
        Learn how to create, collaborate and publish Web AR experiences that run directly in a
        mobile web browser.
      </>
    ),
  },
  {
    title: 'API Reference',
    img: apiImg,
    hoveredImg: apiHighlightedImg,
    url: '',
    description: (
      <>
        Detailed documentation for 8th Wall&apos;s Javascript API.
      </>
    ),
  },
]

interface IFeature {
  title: string
  img: string
  hoveredImg: string
  url: string
  description: React.ReactNode
  idx: number
}

function Feature({img, hoveredImg, title, description, url, idx}: IFeature) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className={clsx('col col--4', idx === 0 && 'col--offset-2')}>
      <Link
        className={clsx('card', styles.card)}
        to={url}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        <div className='text--center'>
          <img
            className={styles.featureSvg}
            src={hovered ? hoveredImg : img}
            alt={title}
          />
        </div>
        <div className='card__body'>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {FeatureList.map((props, idx) => (
            <Feature key={props.title} idx={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
