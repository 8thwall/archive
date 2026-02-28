import {createUseStyles} from 'react-jss'

import {
  brandPurple, gray1, gray3, gray4, brandWhite, bodySanSerif,
} from '../static/styles/settings'

const useStyles = createUseStyles({
  tagsInputContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    minHeight: '38px',
    padding: '0.5em',
    gap: '0.25em 0.5em',
  },
  tagsTextInput: {
    cursor: 'text',
  },
  tagsInput: {
    '& > input': {
      'fontFamily': bodySanSerif,
      'width': 'fit-content',
      'minWidth': '1em',
      'borderWidth': '0',
      'outline': 'none',
      '&::placeholder': {
        color: gray4,
      },
    },
  },
  tagSuggestions: {
    'margin': '0.25em 0',
    '& > span': {
      fontWeight: '700',
    },
  },
  suggestionButton: {
    'margin': '0.25em',
    'padding': '0.25em 0.5em',
    'backgroundColor': 'transparent',
    'borderStyle': 'none',
    'color': gray4,
    'cursor': 'pointer',
    '&:hover': {
      color: brandPurple,
    },
  },
  dropdown: {
    fontFamily: bodySanSerif,
    position: 'relative',
    display: 'inline-block',
    width: '100%',
  },
  dropdownPlaceholder: {
    color: gray4,
    marginLeft: '0.3em',
  },
  dropdownIcon: {
    marginRight: '0.5em',
    marginLeft: 'auto',
  },
  dropdownContent: {
    'display': 'none',
    'flexDirection': 'column',
    'position': 'absolute',
    'minWidth': '100%',
    'maxHeight': '300px',
    'top': 'calc(100% + 0.5rem)',
    'padding': '0.5em 0',
    'background': brandWhite,
    'border': `1px solid ${gray3}`,
    'borderRadius': '4px',
    'zIndex': '1',
    'overflowY': 'scroll',
    'scrollbarWidth': 'thin',
    'scrollbarColor': `${gray3} ${gray1}`,
    '&::-webkit-scrollbar': {
      width: '8px',
      marginRight: '0.5em',
    },
    '&::-webkit-scrollbar-thumb': {
      'background': gray3,
      'borderRadius': '4px',
      '&:hover': {
        background: gray3,
      },
    },
    '&::-webkit-scrollbar-track': {
      background: gray1,
      borderRadius: '4px',
    },
  },
  dropdownOption: {
    'padding': '0.5em',
    '&:hover': {
      cursor: 'pointer',
      background: gray1,
    },
  },
  clickableArea: {
    display: 'flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    flexGrow: '1',
    cursor: 'pointer',
  },
  inactive: {
    'color': gray3,
    '&:hover': {
      cursor: 'default',
      background: 'none',
    },
  },
  show: {
    display: 'flex',
  },
})

export default useStyles
