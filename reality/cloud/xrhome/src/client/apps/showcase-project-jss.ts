import {createUseStyles} from 'react-jss'

import {
  gray3, gray4, tinyViewOverride, cherry, blueberry,
} from '../static/styles/settings'

const useStyles = createUseStyles({
  showcaseThisProject: {
    marginBottom: '1.5em',
  },
  viewFeaturedProjectBtn: {
    textAlign: 'right',
    marginBottom: '1em',
  },
  bold: {
    fontWeight: 'bold',
  },
  topDistance: {
    marginTop: '1em',
  },
  errorBorder: {
    '& > input': {
      border: `2px solid ${cherry} !important`,
      padding: '-1px',
    },
  },
  errorCode: {
    color: cherry,
    marginBottom: '0',
  },
  miniDesc: {
    fontStyle: 'italic',
    margin: '0',
  },
  coverImage: {
    margin: '0.25em 0 0 0',
    borderRadius: '1em',
    width: '20em',
    [tinyViewOverride]: {
      width: '15em',
    },
  },
  redBorder: {
    border: `2px solid ${cherry}`,
  },
  subSection: {
    margin: '1em 0',
  },
  miniHeader: {
    fontSize: '1.1em',
    lineHeight: '1.75em',
    fontWeight: 'bold',
    margin: '1em 0 0 0',

  },
  cloneableFooter: {
    fontStyle: 'italic',
    fontSize: '0.9em',
  },
  tagsInput: {
    margin: '0.5em 0',
  },
  isTryableToggle: {
    marginBottom: '1em',
    fontWeight: 'bold',
  },
  isCloneableToggle: {
    marginBottom: '0.5em',
    fontWeight: 'bold',
  },
  disabledToggle: {
    '& label::before': {
      background: 'rgba(0, 0, 0, 0.05) !important',
    },
    '& label': {
      color: `${gray3} !important`,
    },
  },
  lockIcon: {
    marginLeft: '0.25em !important',
    color: gray3,
  },
  videoUrlInputContainer: {
    'marginBottom': '1em',
  },
  videoUrlInput: {
    'width': '100%',
    'margin': '0.5em 0',
    '& > input': {
      '&:focus': {
        border: `1px solid ${blueberry} !important`,
      },
    },
  },
  deemphasized: {
    marginBottom: '0.25em',
    color: `${gray4}`,
  },
  requiredField: {
    color: cherry,
  },
  disabled: {
    color: gray3,
  },
  split: {
    display: 'flex',
    gap: '1em',
    marginBottom: '1em',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  splitCell: {
    width: '100%',
  },
  crossAccountContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: gray4,
    gap: '0.5rem',
    marginTop: '7rem',
    fontWeight: '600',
  },
  crossAccountImage: {
    maxWidth: '10rem',
  },
  crossAccountHeading: {
    fontSize: '1.3rem',
    marginTop: '1.5rem',
  },
  crossAccountSubheading: {
    fontSize: '1rem',
  },
})

export default useStyles
