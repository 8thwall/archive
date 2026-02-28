import React from 'react'

import Accordion from '../widgets/accordion'

interface SettingProps {
  active: boolean
  children: React.ReactNode
  onClick: () => void
  title: string | React.ReactNode
}

const CollapsibleSetting = React.forwardRef<HTMLDivElement, SettingProps>(
  ({active, children, onClick, title}, ref) => (
    <Accordion ref={ref}>
      <Accordion.Title active={active} onClick={onClick}>
        {title}
      </Accordion.Title>
      <Accordion.Content>
        {children}
      </Accordion.Content>
    </Accordion>
  )
)

export default CollapsibleSetting
