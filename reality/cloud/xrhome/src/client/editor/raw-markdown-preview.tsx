import React from 'react'

import '../static/styles/code-editor.scss'
import {FreeformMarkdownPreview} from '../widgets/freeform-markdown-preview'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  studioMarkdownContainer: {
    'padding': '1rem',
    'borderRadius': '0.25rem',
    'border': `1px solid ${theme.textInputBorder}`,
    'color': theme.fgMain,
    'overflow': 'auto',
    'backgroundColor': theme.mainEditorPane,
  },
}))

interface IRawMarkdownPreview {
  content: string
}

const RawMarkdownPreview: React.FC<IRawMarkdownPreview> = ({content}) => {
  const classes = useStyles()

  return (
    <div
      className={classes.studioMarkdownContainer}
    >
      <FreeformMarkdownPreview>
        {content}
      </FreeformMarkdownPreview>
    </div>
  )
}

export {RawMarkdownPreview}
