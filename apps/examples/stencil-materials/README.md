## three.js: Stencil Materials

### About this project

To enable stencil buffer, you must specify `{stencil: true}` on the `glContextConfig` parameter of `XR8.Run()`:

```
XR8.run({canvas, allowedDevices: XR8.XrConfig.device().ANY, glContextConfig: {stencil: true}})
```

You also must call `clearStencil()` in the `onRender` lifecycle function in `threejs-scene-init.js`:

```
onRender: () => {
  const {renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs
  renderer.clearStencil()
},
```

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGF0c3NraDltbjc0czZiMGtma2xnYjI5eTM0ZXpzamQ1NjI1bzEwaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KueOTAPcAmaFZIr0wC/giphy.gif)
