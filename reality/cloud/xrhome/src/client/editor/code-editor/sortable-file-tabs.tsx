import * as React from 'react'
import {Icon} from 'semantic-ui-react'
import {useTranslation} from 'react-i18next'
import {useSortable} from '@dnd-kit/react/sortable'

import {NEW_TAB_PATH, updateToShortFilePaths} from '../editor-utils'
import {combine} from '../../common/styles'
import {deriveLocationKey} from '../editor-file-location'
import {ContextDropdown} from '../files/context-dropdown'
import {useChangesetStatus} from '../../git/hooks/use-changeset-status'
import {StatusIcon, isStatusIconDisplayed} from '../files/status-icon'
import {Keys} from '../../studio/common/keys'
import {useId} from '../../hooks/use-id'

type CancellableEvent = React.MouseEvent | React.KeyboardEvent

// This is the info passed from the outer component for each item
type FileTabInfo = {
  paneId: number
  repoId?: string
  index: number
  filePath: string
  disabled?: boolean
  active: boolean
  ephemeral: boolean
  deleted?: boolean
  onClick: (e?: CancellableEvent) => void
  onClose: (e?: CancellableEvent) => void
  onCloseAll?: (e?: CancellableEvent) => void
  onCloseOther?: (e?: CancellableEvent) => void
  onCloseRight?: (e?: CancellableEvent) => void
  onCloseLeft?: (e?: CancellableEvent) => void
  shortFilePath?: string  // This is filled by updateToShortFilePaths
}

interface IFileTab extends Omit<FileTabInfo, 'repoId'> {
  themeName: string
  makeFileTabInView: boolean
  unsetMakeFileTabInView: any
}

const FileTab: React.FunctionComponent<IFileTab> = ({
  paneId,
  filePath,
  disabled,
  index,
  shortFilePath,
  active,
  ephemeral,
  deleted,
  onClick,
  onClose,
  onCloseAll,
  onCloseOther,
  onCloseRight,
  onCloseLeft,
  themeName,
  makeFileTabInView,
  unsetMakeFileTabInView,
}) => {
  const spanClasses = combine(
    'style-reset',
    'editor-file-tab',
    themeName,
    active && 'active',
    ephemeral && 'ephemeral',
    deleted && 'deleted'
  )
  const fileTabRef = React.useRef(null)
  const id = useId()
  const {ref} = useSortable({
    id,
    index,
    type: 'tab',
    accept: 'tab',
    group: paneId,
    disabled,
  })

  const {t} = useTranslation(['cloud-editor-pages'])

  // TODO(cindyhu): should be scoped by repoId
  const {dirty, status} = useChangesetStatus(filePath)

  const [isMouseOverIcon, setIsMouseOverIcon] = React.useState(false)

  // Not using layoutEffect because synchronous updates were blocking visual updates.
  React.useEffect(() => {
    if (active && makeFileTabInView) {
      fileTabRef.current?.scrollIntoView()
    }
    unsetMakeFileTabInView()
  }, [makeFileTabInView])

  const [clickPoint, setClickPoint] = React.useState<[number, number]>(null)

  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setClickPoint([event.clientX, event.clientY])
  }

  const handleMiddleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.button === 1) {
      event.preventDefault()
      onClose(event)
    }
  }

  const options = [
    {
      content: t('sortable_tabs.context_menu.options.close_tab'),
      onClick: onClose,
    },
    {
      content: t('sortable_tabs.context_menu.options.close_all_tabs'),
      onClick: onCloseAll,
    },
    {
      content: t('sortable_tabs.context_menu.options.close_other_tabs'),
      onClick: onCloseOther,
    },
    {
      content: t('sortable_tabs.context_menu.options.close_tabs_right'),
      onClick: onCloseRight,
    },
    {
      content: t('sortable_tabs.context_menu.options.close_tabs_left'),
      onClick: onCloseLeft,
    },
  ]

  const handleMouseEnterIcon = () => {
    setIsMouseOverIcon(true)
  }

  const handleMouseLeaveIcon = () => {
    setIsMouseOverIcon(false)
  }

  const handleCloseButtonKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === Keys.ENTER) {
      e.stopPropagation()
      onClose(e)
    }
  }

  // NOTE(johnny): SortableElement does not like buttons. For a hack fix I swapped it to a span
  // and made it comply with A11y standards.
  return (
    <span
      role='button'
      onKeyDown={e => e.key === Keys.ENTER && onClick()}
      tabIndex={0}
      className={spanClasses}
      title={filePath}
      onClick={onClick}
      onAuxClick={handleMiddleClick}
      ref={(element) => {
        ref(element)
        fileTabRef.current = element
      }}
      onContextMenu={handleContextMenu}
    >
      <span className='file-path'>
        {shortFilePath || filePath || t('sortable_tabs.tab_content.select_file')}
      </span>
      <span
        role='button'
        tabIndex={0}
        className='close-button'
        onMouseEnter={handleMouseEnterIcon}
        onMouseLeave={handleMouseLeaveIcon}
        onClick={onClose}
        onKeyDown={handleCloseButtonKeyDown}
      >
        {
            (isStatusIconDisplayed(status, dirty) && !isMouseOverIcon)
              ? <StatusIcon status={status} dirty={dirty} />
              : <Icon name='close' />
        }
      </span>
      {clickPoint !== null &&
        <ContextDropdown
          options={options}
          onClose={() => setClickPoint(null)}
          clickPoint={clickPoint}
        />
      }
    </span>
  )
}

interface ISortableFileTabs {
  items: FileTabInfo[]
  themeName?: string
  makeFileTabInView: boolean
  unsetMakeFileTabInView: any
}

const SortableFileTabs: React.FunctionComponent<ISortableFileTabs> = ({
  items,
  themeName = 'dark',
  makeFileTabInView,
  unsetMakeFileTabInView,
}) => {
  updateToShortFilePaths(items)
  const tabBarRef = React.useRef(null)

  React.useEffect(() => {
    const replaceVerticalScrollWithHorizontal = (e) => {
      e.preventDefault()
      const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
      const scrollAmount = isVerticalScroll ? e.deltaY : e.deltaX
      tabBarRef.current?.scrollBy(scrollAmount, 0)
    }
    tabBarRef.current?.addEventListener('wheel', replaceVerticalScrollWithHorizontal, {
      passive: false,
    })
    return () => {
      tabBarRef.current?.removeEventListener('wheel', replaceVerticalScrollWithHorizontal)
    }
  }, [tabBarRef.current])

  return (
    <div className={`tab-bar ${themeName} horizontal-flex`} ref={tabBarRef}>
      {items.map(fileTab => (
        <FileTab
          paneId={fileTab.paneId}
          disabled={fileTab.filePath === NEW_TAB_PATH}
          key={deriveLocationKey(fileTab)}
          index={fileTab.index}
          filePath={fileTab.filePath}
          shortFilePath={fileTab.shortFilePath}
          active={fileTab.active}
          ephemeral={fileTab.ephemeral}
          deleted={fileTab.deleted}
          onClick={fileTab.onClick}
          onClose={fileTab.onClose}
          onCloseAll={fileTab.onCloseAll}
          onCloseOther={fileTab.onCloseOther}
          onCloseRight={fileTab.onCloseRight}
          onCloseLeft={fileTab.onCloseLeft}
          themeName={themeName}
          makeFileTabInView={makeFileTabInView}
          unsetMakeFileTabInView={unsetMakeFileTabInView}
        />
      ))}
    </div>
  )
}

export type {
  FileTabInfo,
}

export {
  SortableFileTabs,
}
