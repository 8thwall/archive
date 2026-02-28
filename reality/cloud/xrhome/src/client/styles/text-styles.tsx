import {createUseStyles} from 'react-jss'

import {cherry, headerSanSerif} from '../static/styles/settings'

const useTextStyles = createUseStyles({
  heading: {
    display: 'flex',
    marginBottom: '1.2em',
    marginTop: '3em',
  },
  headingText: {
    fontFamily: headerSanSerif,
    fontWeight: '900',
    margin: '0 0 0 0.5em',
  },
  miniHeading: {
    fontSize: '16px',
    lineHeight: '1.75em',
    fontWeight: '700',
    margin: '1em 0 0 0',
  },
  requiredField: {
    color: cherry,
  },
  headingImage: {
    opacity: '50%',
  },
})

export default useTextStyles
