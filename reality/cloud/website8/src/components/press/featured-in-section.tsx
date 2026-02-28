import React from 'react'
import {useStaticQuery, graphql} from 'gatsby'
import Img from 'gatsby-image'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import {combine} from '../../styles/classname-utils'
import {MOBILE_VIEW_OVERRIDE} from '../../styles/constants'

const useStyles = createUseStyles({
  title: {
    marginBottom: '2.5rem',
    [MOBILE_VIEW_OVERRIDE]: {
      marginBottom: '1rem',
    },
  },
  logoContainer: {
    width: '60rem',
  },
})

const FeaturedInSection = () => {
  const {t} = useTranslation(['press-page'])
  const classes = useStyles()
  const data = useStaticQuery(graphql`
    {
      allFile(filter: {absolutePath: {glob: "**/docs/img/press-logos.png"}}) {
        nodes {
          childImageSharp {
            fluid(quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  `)

  const {childImageSharp} = data.allFile.nodes[0]
  return (
    <section>
      <h2 className={combine('text-center', classes.title)}>
        {t('heading.featured_in')}
      </h2>
      <div className='row mx-auto justify-content-center'>
        <div className={combine('mx-md-5 mx-0', classes.logoContainer)}>
          <Img
            alt='press logos'
            fluid={childImageSharp.fluid}
            draggable={false}
          />
        </div>
      </div>
    </section>
  )
}

export default FeaturedInSection
