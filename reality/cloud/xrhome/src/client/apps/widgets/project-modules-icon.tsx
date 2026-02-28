/* eslint-disable max-len */
import React from 'react'

import {combine} from '../../common/styles'
import {useSidebarIconStyles} from './featured-icon'

interface IProjectModulesIcon {
  className: string  // Determines size, passed from ResponsiveSidebarItem
}

const ProjectModulesIcon: React.FC<IProjectModulesIcon> = ({className}) => {
  const classes = useSidebarIconStyles()

  return (
    <svg className={combine(className, classes.icon)} viewBox='-1 -2 20 20' xmlns='http://www.w3.org/2000/svg' fill='currentColor'>
      <path fillRule='evenodd' clipRule='evenodd' d='M2 2H7V7H2V2ZM2 9L2 14H7V9H2ZM9 9V14H14V9H9ZM7 16H2C0.89543 16 0 15.1046 0 14V9V2C0 0.895431 0.895431 0 2 0H7C8.10457 0 9 0.895431 9 2V7H14C15.1046 7 16 7.89543 16 9V14C16 15.1046 15.1046 16 14 16H7ZM14 5V4H15C15.5523 4 16 3.55228 16 3C16 2.44772 15.5523 2 15 2H14V1C14 0.447715 13.5523 0 13 0C12.4477 0 12 0.447715 12 1V2H11C10.4477 2 10 2.44772 10 3C10 3.55228 10.4477 4 11 4H12V5C12 5.55228 12.4477 6 13 6C13.5523 6 14 5.55228 14 5Z' />
    </svg>
  )
}

export default ProjectModulesIcon
