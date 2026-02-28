window.Modules8.registerModule({
  moduleId: 'module-a',
  module: () => {
    console.log('initialized module-a')
    return {api: {test: () => console.log('Called module-a:test()')}}
  },
})
