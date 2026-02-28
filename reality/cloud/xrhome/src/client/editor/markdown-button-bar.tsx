import React from 'react'
import {Icon} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'

import '../static/styles/code-editor.scss'
import {FloatingPanelButton} from '../ui/components/floating-panel-button'
import {createThemedStyles} from '../ui/theme'

interface IMardownButtonBar {
  isShowingRichPreview: boolean
  previewTheme: string
  toggleRichPreviewTheme: () => void
  toggleRichPreview: () => void
}

const useStyles = createThemedStyles({
  markdownContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '1rem',
    gap: '0.5rem',
  },
})

const MarkdownButtonBar: React.FC<IMardownButtonBar> = ({
  isShowingRichPreview, previewTheme, toggleRichPreviewTheme, toggleRichPreview,
}) => {
  const classes = useStyles()
  const {t} = useTranslation(['cloud-editor-pages'])

  return (
    <div className={classes.markdownContainer}>
      {isShowingRichPreview && (
        <FloatingPanelButton
          onClick={() => toggleRichPreviewTheme()}
        >
          <Icon
            fitted
            name={previewTheme === 'dark' ? 'moon outline' : 'sun outline'}
          />
        </FloatingPanelButton>
      )}
      <FloatingPanelButton
        onClick={() => toggleRichPreview()}
      >
        <Icon
          aria-hidden='true'
          name={isShowingRichPreview ? 'check square outline' : 'square outline'}
        />
        {t('editor_page.button.preview')}
      </FloatingPanelButton>
    </div>
  )
}

export {MarkdownButtonBar}
