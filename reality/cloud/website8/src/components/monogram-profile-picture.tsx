import * as React from 'react'
import {createUseStyles} from 'react-jss'

import {getContrastFontColor, hexColorByString} from '../styles/colors'

const useStyles = createUseStyles({
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ({backgroundColor}) => backgroundColor,
    width: '100%',
    height: '100%',
    fontWeight: 700,
    color: ({contrastColor}) => contrastColor,
    textAlign: 'center',
    fontSize: ({fontSize}) => `${fontSize}px`,
  },
})

// eslint-disable-next-line max-len
// https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/campfire/identity-portal/-/blob/trunk/portal/src/utils/strings.ts#L37
const getMonogram = (name: string): string | null => {
  try {
    const match = name.match(/\p{L}/u)
    return (match && match[0])?.toUpperCase() || null
  } catch {
    return name[0]?.toUpperCase() || null
  }
}

interface IMonogramProfilePicture {
  name: string
  size?: number
}

const MonogramProfilePicture: React.FC<IMonogramProfilePicture> = ({
  name, size = 50,
}) => {
  const profileBg = hexColorByString(name)
  const classes = useStyles({
    backgroundColor: profileBg,
    contrastColor: getContrastFontColor(profileBg),
    fontSize: size / 2,
  })

  return (
    <div className={classes.iconContainer}>
      {getMonogram(name)}
    </div>
  )
}

export default MonogramProfilePicture
