import React from 'react'
import {createUseStyles} from 'react-jss'

import {InputContainer} from './input-container'
import {combine} from '../common/styles'
import {WHITE_50} from './colors'
import {Icon, type IconStroke} from '../ui/components/icon'
import {SrOnly} from '../ui/components/sr-only'
import {SpaceBetween} from '../ui/layout/space-between'

const useStyles = createUseStyles({
  complexInput: {
    padding: '1rem',
    display: 'grid',
    gridTemplateColumns: 'min-content 1fr',
    gridTemplateRows: 'auto auto',
    columnGap: '1rem',
    rowGap: '0.5rem',
    alignItems: 'center',
    fontFamily: 'Geist Mono',
  },
  simpleInput: {
    padding: '0rem 1rem',
    display: 'flex',
    flexGrow: 1,
    fontFamily: 'Geist Mono',
  },
  label: {
    color: WHITE_50,
    fontWeight: 600,
  },
  prefix: {
    color: WHITE_50,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  textInput: {
    'flexGrow': 1,
    '&::selection': {
      'color': '#fff',
      'backgroundColor': 'rgba(0, 123, 255, 0.3)',
    },
    '&::-moz-selection': {
      'color': '#fff',
      'backgroundColor': 'rgba(0, 123, 255, 0.3)',
    },
    '&::placeholder': {
      'color': WHITE_50,
    },
    '&::-webkit-input-placeholder': {
      'color': WHITE_50,
    },
    '&::-moz-placeholder': {
      'color': WHITE_50,
    },
    '&:-ms-input-placeholder': {
      'color': WHITE_50,
    },
  },
})

interface ITextInput extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: React.ReactNode
  grow?: boolean
  iconStroke?: IconStroke
}

const DetailedTextInput: React.FC<Omit<ITextInput, 'grow'>> = ({
  id, label, iconStroke, prefix, ...rest
}) => {
  const classes = useStyles()
  return (
    <InputContainer>
      <label
        htmlFor={id}
        className={classes.complexInput}
      >
        {iconStroke && <Icon color='gray4' stroke={iconStroke} />}
        <div className={classes.label}>
          {label}
        </div>
        <div />
        <div>
          <div className={classes.inputContainer}>
            {prefix && <span className={classes.prefix}>{prefix}</span>}
            <input
              id={id}
              className={combine('style-reset', classes.textInput)}
              {...rest}
            />
          </div>
        </div>
      </label>
    </InputContainer>
  )
}

const SimpleTextInput: React.FC<Omit<ITextInput, 'prefix'>> = ({
  id, label, iconStroke, grow, ...rest
}) => {
  const classes = useStyles()

  return (
    <InputContainer grow={grow}>
      <label
        htmlFor={id}
        className={classes.simpleInput}
      >
        <SpaceBetween centered narrow grow>
          {iconStroke && <Icon color='white' stroke={iconStroke} />}
          <SrOnly>{label}</SrOnly>
          <input
            id={id}
            className={combine('style-reset', classes.textInput)}
            {...rest}
          />
        </SpaceBetween>
      </label>
    </InputContainer>
  )
}

export {
  DetailedTextInput,
  SimpleTextInput,
}
