import * as React from 'react'
import {Link} from 'react-router-dom'
import {Icon, Popup, SemanticICONS} from 'semantic-ui-react'
import {createUseStyles} from 'react-jss'

import {useTranslation} from 'react-i18next'

import userActions from '../user/user-actions'
import useActions from '../common/use-actions'
import {combine} from '../common/styles'
import {useSelector} from '../hooks'
import {gray4} from '../static/styles/settings'
import {getPathForMyProjectsPage} from '../common/paths'
import MyProjectsIcon from './my-projects-icon'
import {OnboardingId} from '../editor/product-tour/product-tour-constants'

const useStyles = createUseStyles({
  logo: {
    padding: '1.5rem',
  },
  popUp: {
    maxWidth: '10rem !important',
  },
  disabledItem: {
    color: `${gray4} !important`,
    opacity: 0.5,
  },
})

interface IResponsiveSidebarItem {
  icon?: SemanticICONS
  iconComponent?: React.ComponentType<{className: string}>
  link: string
  text: string
  iconSize?: 'small' | 'large'
  showText?: boolean
  active?: boolean
  a8?: string
  disabled?: boolean
  disabledMessage?: string
}

const ResponsiveSidebarItem: React.FC<IResponsiveSidebarItem> = ({
  icon,
  iconComponent: IconComponent,
  link,
  text,
  iconSize,
  showText,
  active = false,
  a8,
  disabled,
  disabledMessage,
}) => {
  const {t} = useTranslation(['app-pages'])
  const classes = useStyles()
  const convertedIconSize = iconSize === 'large' ? 'big8' : 'default'
  const itemComponent = (
    <>
      {IconComponent
        ? <IconComponent className={convertedIconSize} />
        : <Icon className={convertedIconSize} name={icon} />
      }
      {showText && text}
    </>
  )

  if (disabled) {
    return (
      <Popup
        className={classes.popUp}
        content={t(disabledMessage)}
        position='left center'
        trigger={(
          <div className={combine('item', classes.disabledItem)}>{itemComponent}</div>
        )}
        inverted
      />
    )
  } else {
    return (
      <Link
        to={link}
        className={`item ${active && 'active'}`}
        title={showText ? undefined : text}
        a8={a8}
      >
        {itemComponent}
      </Link>
    )
  }
}

interface IResponsiveSidebarProps {
  size: 'thin' | 'wide'
  iconSize: 'small' | 'large'
  showText?: boolean
  children?: React.ReactElement<Pick<IResponsiveSidebarProps, 'iconSize' | 'showText' >>[]
}

type IResponsiveSidebar<P> = React.FC<P> & {
  Item: typeof ResponsiveSidebarItem
}

const ResponsiveSidebar: IResponsiveSidebar<IResponsiveSidebarProps> = ({
  size = 'wide',
  iconSize = 'small',
  showText = true,
  children,
}) => {
  const isSmallScreen = useSelector(state => state.common.isSmallScreen)
  const showNav = useSelector(state => state.common.showNav)
  const {setShowNav} = useActions(userActions)
  const responsiveSize = isSmallScreen ? 'wide' : size
  const responsiveIconSize = isSmallScreen ? 'small' : iconSize
  const responsiveShowText = isSmallScreen ? true : showText

  const maybeDevClass = BuildIf.LOCAL_DEV && 'dev'
  const maybeShowNavClass = showNav && 'show-nav'

  return (
    <>
      {showNav &&
        <button
          type='button'
          className='style-reset sidebar-dismiss'
          onClick={() => setShowNav(false)}
        >Dismiss Sidebar
        </button>
      }
      <div
        className={combine('sidebar', responsiveSize, maybeDevClass, maybeShowNavClass)}
        id={OnboardingId.NAVIGATION}
      >
        <ResponsiveSidebar.Item
          key='My Projects'
          text='My Projects'
          iconComponent={MyProjectsIcon}
          link={getPathForMyProjectsPage()}
          a8='click;cloud-editor-navigation;my-projects-button'
          iconSize={responsiveIconSize}
          showText={responsiveShowText}
        />
        {children && React.Children.map(children, c => (
          c && React.cloneElement(c, {iconSize: responsiveIconSize, showText: responsiveShowText})
        ))}
      </div>
    </>
  )
}

ResponsiveSidebar.Item = ResponsiveSidebarItem

export default ResponsiveSidebar

export type {
  IResponsiveSidebarProps,
}
