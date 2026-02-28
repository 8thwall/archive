window.Modules8.registerModule({
  moduleId: 'module-b',
  module: (context) => {
    console.log('initialized module-b')
    let config
    context.config.subscribe((config_) => {
      console.log('module-b: config update', config_)
      config = config_
      console.log('module-b: status is', config.status)
    })

    return {
      api: {
        test: () => console.log('Called module-b:test()'),
        getStatus: () => config.status,
      },
    }
  },
  defaultConfig: {'status': 'default-module-b-status'},
})
