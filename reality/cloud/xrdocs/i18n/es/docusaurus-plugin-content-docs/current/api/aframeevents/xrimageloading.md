# xrimageloading

## Descripción {#description}

Este evento es emitido por [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando comienza la carga de la imagen de detección.

`imageloading.detail : { imageTargets: {name, type, metadata} }`

| Propiedad | Descripción                                    |
| --------- | ---------------------------------------------- |
| name      | El nombre de la imagen.                        |
| type      | Una de `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`. |
| metadata  | Metadatos de usuario.                          |

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
