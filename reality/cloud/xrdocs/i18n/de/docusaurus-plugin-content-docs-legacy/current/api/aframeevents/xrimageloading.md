# xrimageloading

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn das Laden von Erkennungsbildern beginnt.

`imageloading.detail : { imageTargets: {name, type, metadata} }`

| Eigentum  | Beschreibung                                                      |
| --------- | ----------------------------------------------------------------- |
| Name      | Der Name des Bildes.                              |
| Typ       | Eines von `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`. |
| Metadaten | Benutzer-Metadaten.                               |

## Beispiel {#example}

```javascript
const componentMap = {}

const addComponents = ({detail}) => {
  detail.imageTargets.forEach(({name, type, metadata}) => {
    // ...
  })
}

this.el.sceneEl.addEventListener('xrimageloading', addComponents)
```
