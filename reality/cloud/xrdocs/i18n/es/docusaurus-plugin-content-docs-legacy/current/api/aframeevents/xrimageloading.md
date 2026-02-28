# xrimageloading

## Descripción {#description}

Este evento es emitido por [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando comienza la carga de la imagen de detección.

`imageloading.detail : { imageTargets: {name, type, metadata} }`

| Propiedad | Descripción                                             |
| --------- | ------------------------------------------------------- |
| nombre    | El nombre de la imagen.                 |
| tipo      | Una de "PLANA", "CILÍNDRICA", "CÓNICA". |
| metadatos | Metadatos del usuario.                  |

## Ejemplo {#example}

```javascript
const componentMap = {}

const addComponents = ({detail}) => {
  detail.imageTargets.forEach(({name, type, metadata}) => {
    // ...
  })
}

this.el.sceneEl.addEventListener('xrimageloading', addComponents)
```
