import React from 'react'

import {Dropdown} from 'semantic-ui-react'

import {isRenderableOption} from './is-renderable-option'
import type {IOptionItem} from './option-item'
import {OptionItem} from './option-item'

interface IContextDropdown {
  options: IOptionItem[]
  onClose: () => void
  clickPoint: [number, number]
}

const ContextDropdown: React.FC<IContextDropdown> = ({
  options, onClose, clickPoint,
}) => {
  // Filter out options without callbacks
  const optionsToRender = options.filter(isRenderableOption)
  const clickPointX = clickPoint[0]
  const clickPointY = clickPoint[1]

  React.useEffect(() => {
    if (!optionsToRender.length) {
      onClose()
      return undefined
    }
    // Added as a workaround since menus wouldn't close when right clicked elsewhere
    const handleClick = (e: MouseEvent) => {
      if (e.button === 2 || e.ctrlKey) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  const ref = (entity: HTMLSpanElement) => {
    if (entity) {
      const dropdown = entity.children[0] as HTMLDivElement
      const menu = dropdown.children[1] as HTMLDivElement
      const dropdownSize = menu.getBoundingClientRect().width
      const buttonSize = (entity.parentNode as HTMLButtonElement).getBoundingClientRect()
      const min = buttonSize.left
      const max = buttonSize.right
      dropdown.style.left = `${Math.max(
        Math.min(
          clickPointX, max - dropdownSize
        ),
        min
      )}px`
      dropdown.style.top = `${clickPointY}px`
    }
  }

  if (optionsToRender.length === 0) {
    return null
  }

  return (
    <span ref={ref}>
      <Dropdown
        open
        onClose={onClose}
        compact
        icon={null}
        pointing={false}
        style={{position: 'fixed', zIndex: '11'}}
      >
        <Dropdown.Menu>
          {optionsToRender.map(props => <OptionItem key={props.content} {...props} />)}
        </Dropdown.Menu>
      </Dropdown>
    </span>
  )
}

export {ContextDropdown}
