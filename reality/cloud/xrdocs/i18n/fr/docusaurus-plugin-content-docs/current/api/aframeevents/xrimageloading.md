# xrimageloading

## Description {#description}

Cet événement est émis par [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsque le chargement de l'image détectée commence.

`imageloading.detail : { imageTargets: {name, type, metadata} }`

| Propriété   | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| nom         | Nom de l'image.                                                    |
| type        | Un des éléments suivants : `'FLAT'`, `'CYLINDRIQUE'`, `'CONIQUE'`. |
| métadonnées | Métadonnées de l'utilisateur.                                      |

## Exemple {#example}

```javascript
const componentMap = {}

const addComponents = ({detail}) => {
  detail.imageTargets.forEach(({name, type, metadata}) => {
    // ...
  })
}

this.el.sceneEl.addEventListener('xrimageloading', addComponents)
```
