import type {IOptionItem} from './option-item'

const isRenderableOption = (props: IOptionItem) => {
  if (!props) {
    return false
  }

  const {onClick, downloadPath, externalLink, options} = props

  // The "options" array is defined for a dropdown item that expands to the right with additional
  // options.
  if (options) {
    return options.some(isRenderableOption)
  }
  return onClick || downloadPath || externalLink
}

export {isRenderableOption}
