import {createThemedStyles} from '../theme'

const useStandardPlaceholderStyles = createThemedStyles(theme => ({
  standardPlaceholder: {
    'backgroundColor': `${theme.placeholderBackgroundColor} !important`,
    'backgroundImage': `${theme.placeholderBackgroundImage} !important`,
    '& $standardPlaceholderHeader$standardPlaceholderImage:after': {
      backgroundColor: `${theme.placeholderBackgroundColor} !important`,
    },
    '& $standardPlaceholderLine, & $standardPlaceholderLine:after': {
      backgroundColor: `${theme.placeholderBackgroundColor} !important`,
    },
    '& > :before': {
      backgroundColor: `${theme.placeholderBackgroundColor} !important`,
    },
  },
  standardPlaceholderHeader: {
  },
  standardPlaceholderImage: {
  },
  standardPlaceholderLine: {
  },
  standardPlaceholderParagraph: {
  },
}))

export {useStandardPlaceholderStyles}
