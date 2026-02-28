---
sidebar_label: xrconfigComponent()
---
# XR8.AFrame.xrconfigComponent()

`XR8.AFrame.xrconfigComponent()`

## Description {#description}

Creates an A-Frame component which can be registered with `AFRAME.registerComponent()`. This,
however, generally won't need to be called directly. On 8th Wall Web script load, this component
will be registered automatically if it is detected that A-Frame has loaded (i.e if `window.AFRAME`
exists).

## Parameters {#parameters}

None

## Example {#example}

```javascript
window.AFRAME.registerComponent('xrconfig', XR8.AFrame.xrconfigComponent())
```
