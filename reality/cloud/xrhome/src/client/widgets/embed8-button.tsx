import React from 'react'
import {
  autoUpdate, flip, FloatingPortal, shift, useClick,
  useDismiss, useFloating, useInteractions, useRole,
} from '@floating-ui/react'

import TempUrlPopover from './temp-url-popover'
import {SecondaryButton} from '../ui/components/secondary-button'

const isBrowser = typeof window !== 'undefined'
const {device} = isBrowser
  // eslint-disable-next-line
  ? require('@8thwall/embed8')
  : {
    device: null,
  }

const deviceIsCompatible = isBrowser && device.deviceIsCompatible()

interface IEmbed8Button {
  shortLinkProvider: () => Promise<any>
  a8?: string
  children?: React.ReactNode
}

const Embed8Button: React.FC<IEmbed8Button> = ({shortLinkProvider, a8, children}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [shortLink, setShortLink] = React.useState('')

  const handleOpenChange = async (newOpen: boolean) => {
    if (newOpen) {
      if (deviceIsCompatible) {
        const value = await shortLinkProvider()
        window.location.href = `https://8th.io/${value}`
        return
      } else {
        const value = await shortLinkProvider()
        setShortLink(value)
      }
    }
    setIsOpen(newOpen)
  }

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: handleOpenChange,
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [
      shift(),
      flip(),
    ],
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, {role: 'dialog'})

  const {getReferenceProps, getFloatingProps} = useInteractions([
    click,
    dismiss,
    role,
  ])

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <SecondaryButton
          a8={a8}
          spacing='full'
        >
          {children}
        </SecondaryButton>
      </div>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <TempUrlPopover fading={false} shortLink={shortLink} />
          </div>
        </FloatingPortal>
      )}
    </>
  )
}

export {
  Embed8Button,
}
