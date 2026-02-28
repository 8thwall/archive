window.Modules8.registerModule({
  moduleId: 'module-d',
  module: (context) => {
    console.log('initialized module-d')
    class ExampleClass {
      constructor(name) {
        this.name = name
      }

      attach() {
        console.log(`attaching ${this.name}`)
        const handler = this.refresh.bind(this)
        this.subscription = context.config.subscribe(handler)
      }

      refresh(config) {
        this.scale = config.scale
        console.log(`refreshing ${this.name} with scale: ${this.scale}`)
      }

      detach() {
        console.log(`detaching ${this.name}`)
        this.subscription.unsubscribe()
      }
    }

    return {
      api: {
        ExampleClass,
      },
    }
  },
})
