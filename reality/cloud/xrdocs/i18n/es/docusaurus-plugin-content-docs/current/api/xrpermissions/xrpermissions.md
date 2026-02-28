# XR8.XrPermissions

## Descripción {#description}

Utilidades para especificar los permisos requeridos por un módulo de canalización.

Los módulos pueden indicar qué capacidades del navegador requieren que puedan necesitar solicitudes de permisos. El marco de trabajo puede utilizarlos para solicitar los permisos adecuados si no los tiene, o para crear componentes que soliciten los permisos adecuados antes de ejecutar XR.

## Propiedades {#properties}

| Propiedad                       | Tipo | Descripción                                                                                 |
| ------------------------------- | ---- | ------------------------------------------------------------------------------------------- |
| [permissions()](permissions.md) | Enum | Lista de permisos que se pueden especificar como necesarios para un módulo de canalización. |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
