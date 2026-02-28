# xrimageloading

## Description {#description}

Cet événement est émis par [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsque le chargement de l'image de détection commence.

`imageloading.detail : { imageTargets : {name, type, metadata} }`

| Propriété   | Description                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| nom         | Nom de l'image.                                                                         |
| type        | L'un des éléments suivants : `'FLAT'', `'CYLINDRICAL'', \\`'CONICAL''. |
| métadonnées | Métadonnées de l'utilisateur.                                                           |

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
