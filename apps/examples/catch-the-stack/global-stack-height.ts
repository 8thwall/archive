let stackHeight: number = 0

const GlobalStackHeight = {
  updateStackHeight: (newHeight: number) => {
    stackHeight = newHeight
  },
  getStackHeight: () => stackHeight,
}

export {
  GlobalStackHeight,
}
