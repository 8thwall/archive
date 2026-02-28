import React from 'react'
import {Modal} from 'semantic-ui-react'

import {combine} from '../common/styles'
import {createThemedStyles} from '../ui/theme'
import {brandBlack, smallMonitorViewOverride} from '../static/styles/settings'
import {CrossSvg} from './cross-svg'

const useStyles = createThemedStyles(theme => ({
  modalContainer: {
    'boxSizing': 'border-box',
    'height': 'calc(100% - 112px) !important',
    'width': 'calc(100% - 340px) !important',
    'lineHeight': '20px',
    'overflowY': 'hidden',

    '&.ui.dimmer': {
      backgroundColor: brandBlack,
    },

    [smallMonitorViewOverride]: {
      width: 'calc(100% - 112px) !important',
    },
  },
  noBackground: {
    backgroundColor: 'transparent !important',
  },
  tabModal: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '8px !important',
    border: '1px solid rgba(128, 131, 162, 0.5)',
    boxShadow: '0px 0px 26px rgba(0, 0, 0, 0.5)',
    color: theme.controlActive,
  },
  leftPane: {
    flex: '0 0 240px',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px 0px 16px',
    backgroundColor: theme.tabPaneBg,
    borderRadius: '8px 0 0 8px',
    fontWeight: 'bold',
  },
  mainPane: {
    flex: '1 1 auto',
    backgroundColor: theme.mainEditorPane,
    borderRadius: '0 10px 10px 0',
  },
  tab: {
    'height': '32px',
    'lineHeight': '32px',
    'marginBottom': '16px',
    'paddingLeft': '16px',
    'borderRadius': '4px',
    'cursor': 'pointer',
    '&:hover': {
      color: theme.tabHover,
      backgroundColor: theme.tabActiveBg,
    },
  },
  defaultTab: {
    color: theme.tabDefault,
  },
  activeTab: {
    backgroundColor: theme.tabActiveBg,
  },
  closeButton: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: '10',
    top: '0',
    right: '0',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    outline: 'none',
    padding: '1rem',
    boxShadow: 'none !important',
  },
  closeIcon: {
    'height': '12px',
    'width': '12px',
    'color': theme.fgMuted,
    '&:hover': {
      color: theme.fgMain,
    },
  },
}))

interface Tab {
  name: React.ReactNode
  key: string
  component: React.ReactNode
}

interface ITabModal {
  tabs: Tab[]
  onClose: () => void
  showCloseButton?: boolean
}

const TabModal: React.FC<ITabModal> = ({
  tabs, onClose, showCloseButton,
}) => {
  const classes = useStyles()
  const [activeKey, setActiveTabKey] = React.useState()

  const clickHandler = (k) => {
    setActiveTabKey(k)
  }

  const activeIndex = tabs.findIndex(t => t.key === activeKey)
  const activeTab = activeIndex === -1 ? tabs[0] : tabs[activeIndex]

  return (
    <Modal
      className={combine(classes.noBackground, classes.modalContainer)}
      open
      onClose={onClose}
    >
      <div className={classes.tabModal}>
        {tabs.length > 1 && (
          <section role='tablist' className={classes.leftPane}>
            {tabs.map(({name, key}) => (
              <div
                role='tab'
                key={key}
                tabIndex={key === activeTab.key ? 0 : -1}
                className={combine(
                  classes.tab,
                  key === activeTab.key ? classes.activeTab : classes.defaultTab
                )}
                onClick={() => clickHandler(key)}
                onKeyDown={() => clickHandler(key)}
              >{name}
              </div>
            ))}
          </section>
        )}
        <section className={classes.mainPane}>
          {activeTab.component}
        </section>
      </div>
      {showCloseButton &&
        <button
          type='button'
          aria-label='Close'
          className={classes.closeButton}
          onClick={onClose}
        >
          <CrossSvg className={classes.closeIcon} />
        </button>
      }
    </Modal>
  )
}

export {TabModal}

export type {Tab}
