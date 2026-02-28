import React from 'react'

import {MarkdownFilePage} from './markdown-file-page'
import guidelines from '../i18n/en-US/legal/guidelines.md'

const GuidelinesPage = () => {
  // eslint-disable-next-line local-rules/hardcoded-copy
  const guidelinesPageHeader = '8th Wall Content Guidelines'

  return (
    <MarkdownFilePage
      markdownSource={guidelines as unknown as string}
      header={guidelinesPageHeader}
      title={guidelinesPageHeader}
    />
  )
}

export default GuidelinesPage
