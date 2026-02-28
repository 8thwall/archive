import * as React from 'react'

import {createCustomUseStyles} from '../common/create-custom-use-styles'
import {getContrastFontColor, hexColorByString} from '../../shared/colors'
import {getMonogram} from '../../shared/profile/user-monogram'

const useStyles = createCustomUseStyles<{
  backgroundColor: string, contrastColor: string, fontSize: number
}>()({
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

interface IMonogramProfilePicture {
  name: string
  size?: number
}

const MonogramProfilePicture: React.FC<IMonogramProfilePicture> = ({
  name, size,
}) => {
  const divRef = React.useRef(null)
  const divRect = divRef.current?.getBoundingClientRect()
  const height = size || Math.round(divRect?.height) || 50
  const profileBg = hexColorByString(name)
  const classes = useStyles({
    backgroundColor: profileBg,
    contrastColor: getContrastFontColor(profileBg),
    fontSize: height / 2,
  })

  return (
    <div ref={divRef} className={classes.iconContainer}>
      {getMonogram(name)}
    </div>
  )
}

export {MonogramProfilePicture}
