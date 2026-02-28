# xrtrackingstatus

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn [`XR8.XrController`](/legacy/api/xrcontroller) geladen wird und sich der Status oder der Grund der Zeitverfolgung ändert.

`xrtrackingstatus : { status, reason }`

| Eigentum | Beschreibung                                                   |
| -------- | -------------------------------------------------------------- |
| Status   | Eine der Optionen `'LIMITED'` oder `'NORMAL'`. |
| Grund    | Eines von `'INITIALIZING'` oder `'UNDEFINED'`. |

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
