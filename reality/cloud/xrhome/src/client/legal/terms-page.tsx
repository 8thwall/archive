import React from 'react'

import {MarkdownFilePage} from './markdown-file-page'
import termsMd from '../i18n/en-US/legal/terms.md'

const TermsPage = () => {
  // eslint-disable-next-line local-rules/hardcoded-copy
  const termsPageHeader = 'Terms & Conditions'

  return (
    <MarkdownFilePage
      markdownSource={termsMd as unknown as string}
      header={termsPageHeader}
      title={termsPageHeader}
    />
  )
}

export default TermsPage
