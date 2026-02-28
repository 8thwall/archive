# xrimageloading

## Description {#description}

This event is emitted by [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) when detection image loading begins.

`imageloading.detail : { imageTargets: {name, type, metadata} }`

Property  | Description
--------- | -----------
name | The image's name.
type | One of `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.
metadata | User metadata.

## Example {#example}

```javascript
const componentMap = {}

const addComponents = ({detail}) => {
  detail.imageTargets.forEach(({name, type, metadata}) => {
    // ...
  })
}

this.el.sceneEl.addEventListener('xrimageloading', addComponents)
```
