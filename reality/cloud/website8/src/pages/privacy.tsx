import React from 'react'
import {graphql} from 'gatsby'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import Layout from '../components/layouts/layout'
import BasicPageHeading from '../components/basic-page-heading'
import {combine} from '../styles/classname-utils'
import * as styles from './privacy.module.scss'

type Section = {
  name: string
  id: string
}

interface MenuProps {
  sections: Array<Section>
}

const SECTIONS: Array<Section> = [
  {
    name: 'heading.overview',
    id: 'overview',
  },
  {
    name: 'heading.user_privacy',
    id: 'user-privacy',
  },
  {
    name: 'heading.cookies',
    id: 'cookies',
  },
  {
    name: 'heading.general_information',
    id: 'general-information',
  },
]

const SectionsMenu: React.FC<MenuProps> = ({sections}) => {
  const {t} = useTranslation(['privacy-page'])
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [activeSectionId, setActiveSectionId] = React.useState(sections[0].id)
  const menuClasses = `${styles.privacySectionsMenu}${menuOpen ? ` ${styles.open}` : ''}`

  React.useEffect(() => {
    const handleScrollEvent = () => {
      const sectionIds = sections.map((s) => s.id)
      let activeSection = sectionIds[0]
      sectionIds.forEach((id) => {
        const section = document.getElementById(id)
        if (!section) {
          return
        }

        const scrolledPastTop = section.offsetTop <= (window.scrollY + 150)
        const scrolledPastBottom = (
          (section.offsetTop + section.offsetHeight) <= (window.scrollY + 150)
        )
        if (scrolledPastTop && !scrolledPastBottom) {
          activeSection = id
        }
      })

      setActiveSectionId(activeSection)
    }

    document.addEventListener('scroll', handleScrollEvent)
    return () => {
      document.removeEventListener('scroll', handleScrollEvent)
    }
  }, [])

  React.useEffect(() => {
    const anchorId = window.location.hash
    if (!anchorId) {
      return
    }

    const element = document.getElementById(anchorId.substring(1))
    if (element) {
      element.scrollIntoView()
    }
  }, [])

  return (
    <div className={styles.privacySectionsContainer}>
      <div className={menuClasses}>
        {/* TODO(alvin): Make this keyboard accessible. */}
        <header onClick={() => { setMenuOpen(!menuOpen) }}>
          In this document
        </header>
        <ul className={styles.sectionsItems}>
          {sections.map(({name, id}, index) => (
            <li key={id}>
              <a href={`#${id}`} className={id === activeSectionId ? styles.active : ''}>
                {`${index + 1}. ${t(name)}`}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// TODO(alvin): Add a description to the Layout component for this page's
// metadata.
export default ({data}) => {
  const {i18n} = useTranslation()
  const getData = (queryResult): {title: string, html: string} => {
    const translatedEdge =
      queryResult.edges.find(({node}) => node.fileAbsolutePath.includes(i18n.language))
    const {node} = translatedEdge
    const {title} = node.frontmatter
    const {html} = node
    return {title, html}
  }
  const {title, html} = getData(data.copyrightDisputePolicy)

  return (
    <Layout title={title}>
      <BasicPageHeading>{title}</BasicPageHeading>
      <section className={combine('light', styles.privacyPage)}>
        <div className='d-flex flex-column'>
          <div className={combine('max-width', styles.privacyPage)}>
            <SectionsMenu sections={SECTIONS} />
            <div
              className={combine('justify-content-center', styles.privacyMain)}
              dangerouslySetInnerHTML={{__html: html}}
            />
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
    copyrightDisputePolicy:
      allMarkdownRemark(
        filter: {fileAbsolutePath: {glob: "**/docs/**/legal/privacy.md"}},
      ) {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              title
            }
            html
          }
        }
      }
  }
`
