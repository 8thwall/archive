const getDisplayNameForModule = (module: {name: string, title?: string}) => (
  module.title || module.name
)

export {
  getDisplayNameForModule,
}
