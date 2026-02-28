# xrtrackingstatus

## Description {#description}

This event is emitted by [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) when [`XR8.XrController`](/legacy/api/xrcontroller) is loaded and any time tracking status or reason changes.

`xrtrackingstatus : { status, reason }`

Property  | Description
--------- | -----------
status | One of `'LIMITED'` or `'NORMAL'`.
reason | One of `'INITIALIZING'` or `'UNDEFINED'`.

## Example {#example}

```javascript
const updateScene = ({detail}) => {
  const {status, reason} = detail
  if (status === 'NORMAL') {
    // Show scene
  }
}
this.el.sceneEl.addEventListener('xrtrackingstatus', updateScene)
```
