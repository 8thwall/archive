# xrtrackingstatus

## Descripción {#description}

Este evento es emitido por [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando se carga [`XR8.XrController`](/legacy/api/xrcontroller) y en cualquier momento cambia el estado de seguimiento o la razón.

`xrtrackingstatus : { status, reason }`

| Propiedad | Descripción                                                 |
| --------- | ----------------------------------------------------------- |
| estado    | Una de "LIMITADO" o "NORMAL".               |
| motivo    | Una de `'INICIALIZANDO'` o `'DESDEFINIDO'`. |

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
