# xrtrackingstatus

## Descripción {#description}

Este evento lo emite [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando se carga [`XR8.XrController`](/api/xrcontroller) y cambia cualquier estado o motivo de seguimiento temporal.

`xrtrackingstatus : { status, reason }`

| Propiedad | Descripción                              |
| --------- | ---------------------------------------- |
| status    | Uno de `'LIMITED'` o `'NORMAL'`.         |
| reason    | Uno de `'INITIALIZING'` o `'UNDEFINED'`. |

## Ejemplo {#example}

```javascript
const updateScene = ({detail}) => {
  const {status, reason} = detail
  if (status === 'NORMAL') {
    // Mostrar escena
  }
}
this.el.sceneEl.addEventListener('xrtrackingstatus', updateScene)
```
