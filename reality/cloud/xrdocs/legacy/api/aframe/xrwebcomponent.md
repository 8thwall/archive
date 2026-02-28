---
sidebar_label: xrwebComponent()
---
# XR8.AFrame.xrwebComponent()

`XR8.AFrame.xrwebComponent()`

## Description {#description}

Creates an A-Frame component which can be registered with `AFRAME.registerComponent()`. This,
however, generally won't need to be called directly. On 8th Wall Web script load, this component
will be registered automatically if it is detected that A-Frame has loaded (i.e if `window.AFRAME`
exists).

## Parameters {#parameters}

None

## Example {#example}

```javascript
window.AFRAME.registerComponent('xrweb', XR8.AFrame.xrwebComponent())
```
