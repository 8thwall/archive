import {createUseStyles} from 'react-jss'

import {darkBlueberry, gray4} from '../static/styles/settings'

const useCheckoutStyles = createUseStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
    padding: '0 1.5em',
    maxWidth: '400px',
  },
  paymentTitle: {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: '1em',
  },
  priceContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '1em',
  },
  priceLabel: {
    fontWeight: 'bold',
    fontSize: '1.16em',
    lineHeight: '1.42em',
  },
  priceText: {
    fontWeight: 'bold',
    fontSize: '1.5em',
    lineHeight: '1.36em',
  },
  submitButton: {
    width: '100%',
    marginBottom: '1em !important',
  },
  errorMessage: {
    width: '100%',
    marginBottom: '1em',
  },
  termsText: {
    fontSize: '1em',
    color: gray4,
    marginBottom: '1em',
    textAlign: 'center',
  },
  tosLink: {
    color: darkBlueberry,
    fontWeight: 'bold',
  },
  paymentElement: {
    width: '100%',
    margin: '1.5em 0 1.5em 0',
    padding: 0,
    boxShadow: 'none',
  },
})

export {
  useCheckoutStyles,
}
