import React from 'react'

import {
  autoUpdate, useFloating, size, offset, shift, flip, FloatingPortal,
  useInteractions, useClick, useDismiss, useRole,
} from '@floating-ui/react'

import {isRenderableOption} from './is-renderable-option'
import type {IOptionItem} from './option-item'
import {OptionItem} from './option-item'
import {Icon} from '../../ui/components/icon'
import {combine} from '../../common/styles'
import {useOptionsDropdownStyles} from './options-dropdown-styles'

interface IOptionsDropdown {
  options: IOptionItem[]
  icon?: React.ReactNode
  a8?: string
}

const OptionsDropdown: React.FunctionComponent<IOptionsDropdown> =
  ({options, icon = <Icon stroke='kebab' block />, a8}) => {
    // Filter out options without callbacks
    const optionsToRender = options.filter(isRenderableOption)

    const classes = useOptionsDropdownStyles()

    const [menuOpen, setMenuOpen] = React.useState(false)

    const {refs, floatingStyles, context} = useFloating({
      open: menuOpen,
      onOpenChange: setMenuOpen,
      placement: 'bottom-end',
      whileElementsMounted: autoUpdate,
      middleware: [
        size({
          padding: 10,
        }),
        offset(4),
        shift(),
        flip(),
      ],
    })

    const click = useClick(context, {event: 'mousedown'})
    const dismiss = useDismiss(context)
    const role = useRole(context, {role: 'listbox'})

    const {getReferenceProps, getFloatingProps} = useInteractions([
      click,
      dismiss,
      role,
    ])

    if (optionsToRender.length === 0) {
      // Invisible placeholder so that status icon can be aligned.
      return <div style={{opacity: '0'}}>{icon}</div>
    }

    return (
      // eslint-disable-next-line max-len
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        className={combine('options-dropdown', menuOpen && 'active')}
        onClick={e => e.stopPropagation()}
        a8={a8}
      >
        <div
          ref={refs.setReference}
          {...getReferenceProps()}
        >
          {icon}
        </div>
        <FloatingPortal>
          {menuOpen &&
            <div
              ref={refs.setFloating}
              style={{...floatingStyles}}
              className={classes.optionsDropdown}
              onBlur={() => setMenuOpen(false)}
              {...getFloatingProps()}
            >
              {optionsToRender.map(props => <OptionItem key={props.content} {...props} />)}
            </div>
          }
        </FloatingPortal>
      </div>
    )
  }

export {
  OptionsDropdown,
}

export type {IOptionsDropdown}
