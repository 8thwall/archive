# xrtrackingstatus

## Description {#description}

Cet événement est émis par [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsque [`XR8.XrController`](/legacy/api/xrcontroller) est chargé et à chaque fois que l'état ou la raison du suivi change.

`xrtrackingstatus : { status, reason }`

| Propriété | Description                                                                           |
| --------- | ------------------------------------------------------------------------------------- |
| statut    | L'une des options suivantes : "LIMITÉE" ou "NORMALE". |
| raison    | L'un de `'INITIALIZING'' ou `'UNDEFINED''.                            |

## Exemple {#example}

```javascript
const updateScene = ({detail}) => {
  const {status, reason} = detail
  if (status === 'NORMAL') {
    // Show scene
  }
}
this.el.sceneEl.addEventListener('xrtrackingstatus', updateScene)
```
