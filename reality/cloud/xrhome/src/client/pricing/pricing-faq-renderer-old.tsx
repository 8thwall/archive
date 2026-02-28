import React from 'react'
import ReactMarkdown from 'react-markdown'
import {useTranslation} from 'react-i18next'

const PricingFAQRenderer: React.FC <{pathName: string}> = ({pathName}) => {
  const {i18n} = useTranslation(['pricing-page'])
  const [source, setSource] = React.useState(null)
  const sourceLanguage = i18n.language

  React.useEffect(() => {
    const fetchSource = async () => {
      const s = await import(`../i18n/${sourceLanguage}/pricing-faq/${pathName}.md`)
      setSource(s.default)
    }
    fetchSource()
  }, [sourceLanguage])

  return <ReactMarkdown source={source} linkTarget='_blank' />
}

export {PricingFAQRenderer}
