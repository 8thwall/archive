import React from 'react'
import ReactMarkdown from 'react-markdown'
import {useTranslation} from 'react-i18next'

const TosRenderer = () => {
  const {i18n} = useTranslation(['terms-of-service'])
  const [source, setSource] = React.useState(null)
  const sourceLanguage = i18n.language

  React.useEffect(() => {
    import(`../i18n/${sourceLanguage}/legal/8w-tos.md`).then(s => setSource(s.default))
  }, [])

  return <ReactMarkdown source={source} linkTarget='_blank' />
}

export default TosRenderer
