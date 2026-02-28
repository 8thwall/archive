# xrtrackingstatus

## Description {#description}

Cet événement est émis par [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsque [`XR8.XrController`](/api/xrcontroller) est chargé et à chaque fois que le statut ou la raison du suivi change.

`xrtrackingstatus : { status, reason }`

| Propriété | Description                                                   |
| --------- | ------------------------------------------------------------- |
| statut    | Un des éléments suivants : `'LIMITED'` ou `'NORMAL'`.         |
| raison    | Un des éléments suivants : `'INITIALIZING'` ou `'UNDEFINED'`. |

## Exemple {#example}

```javascript
const updateScene = ({detail}) => {
  const {status, reason} = detail
  if (status === 'NORMAL') {
    // Afficher la scène
  }
}
this.el.sceneEl.addEventListener('xrtrackingstatus', updateScene)
```
