# xrtrackingstatus

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn [`XR8.XrController`](/api/xrcontroller) geladen wird und sich der Status oder der Grund der Zeiterfassung ändert.

`xrtrackingstatus : { status, reason }`

| Eigentum | Beschreibung                                  |
| -------- | --------------------------------------------- |
| status   | Eine von `'LIMITED'` oder `'NORMAL'`.         |
| reason   | Eine von `'INITIALIZING'` oder `'UNDEFINED'`. |

## Beispiel {#example}

```javascript
const updateScene = ({detail}) => {
  const {status, reason} = detail
  if (status === 'NORMAL') {
    // Szene anzeigen
  }
}
this.el.sceneEl.addEventListener('xrtrackingstatus', updateScene)
```
