window.Modules8.registerModule({
  moduleId: 'module-c',
  module: (context) => {
    console.log('initialized module-c')
    const createObject = (name) => {
      const sub = context.config.subscribe((config) => {
        console.log(`updating ${name} with config`, config)
      })
      return {
        destroy: () => {
          sub.unsubscribe()
        },
      }
    }
    return {
      api: {
        createObject,
      },
    }
  },
  defaultConfig: {'color': 'gray'},
})
