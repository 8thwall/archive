import React from 'react'

import AutoHeadingScope from '../../widgets/auto-heading-scope'
import AutoHeading from '../../widgets/auto-heading'
import {createThemedStyles} from '../../ui/theme'

const useStyles = createThemedStyles(theme => ({
  inputGroupContainer: {
    border: `1px solid ${theme.subtleBorder}`,
    borderRadius: '0.5rem',
    margin: '1rem 0 0',
  },
  inputGroupHeader: {
    display: 'inline',
    fontSize: 'inherit',
    padding: '0.25rem 0.5rem',
    color: theme.fgMuted,
  },
  inputGroupSummary: {
    padding: '1rem',
    color: theme.fgMuted,
    cursor: 'pointer',
  },
  inputGroupContents: {
    padding: '1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(20em, 1fr))',
    gap: '2.5rem',
  },
}))

interface IInputGroup {
  name: string
  children?: React.ReactNode
}

const InputGroup: React.FC<IInputGroup> = ({name, children}) => {
  const classes = useStyles()

  return (
    <AutoHeadingScope>
      <details className={classes.inputGroupContainer} open>
        <summary className={classes.inputGroupSummary}>
          <AutoHeading className={classes.inputGroupHeader}>
            {name}
          </AutoHeading>
        </summary>
        <div className={classes.inputGroupContents}>
          {children}
        </div>
      </details>
    </AutoHeadingScope>
  )
}

export {
  InputGroup,
}
