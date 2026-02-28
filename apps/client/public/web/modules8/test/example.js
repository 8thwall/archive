console.log('bundle loaded')

window.Modules8.getModule({moduleId: 'module-a'}).test()
const ModuleB = window.Modules8.getModule({moduleId: 'module-b'})

const prevStatus = ModuleB.getStatus()
ModuleB.config.update({status: 'new'})
const newStatus = ModuleB.getStatus()
if (prevStatus !== 'default-module-b-status' || newStatus !== 'new') {
  console.error('Unexpected config state: ', {prevStatus, newStatus})
}

// NOTE(christoph) We need to support configuration before the module loads to allow for up-front
// config, but on-demand module loading, so we don't know the full set of supported config.

// We also may not be exposing all module config through the builder/customizer, for example
// non-serializable config, but still want to tie in to this config state.
ModuleB.config.update({otherThing: 'this should show up too'})

const afterStatus = ModuleB.getStatus() !== 'new'
if (afterStatus) {
  console.error('Unexpected status after unrelated config:', {afterStatus})
}

const ModuleC = window.Modules8.getModule({moduleId: 'module-c'})

const object1 = ModuleC.createObject('object1')
const object2 = ModuleC.createObject('object2')

ModuleC.config.update({color: 'red'})

object1.destroy()

ModuleC.config.update({color: 'green'})

object2.destroy()

ModuleC.config.update({color: 'blue'})

const ModuleD = window.Modules8.getModule({moduleId: 'module-d'})

const myInstance = new ModuleD.ExampleClass('myInstance')

ModuleD.config.update({scale: -1})  // Haven't attached yet, shouldn't see this get logged

ModuleD.config.update({scale: 2})
myInstance.attach()

ModuleD.config.update({scale: 3})
myInstance.detach()

ModuleD.config.update({scale: -1})  // Not attached anymore, shouldn't see this get logged
