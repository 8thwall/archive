# XR8.XrPermisos

## Descripción {#description}

Utilidades para especificar los permisos requeridos por un módulo de canalización.

Los módulos pueden indicar qué capacidades del navegador requieren que puedan necesitar solicitudes de permisos. Estos pueden ser utilizados por el framework para solicitar los permisos apropiados en caso de que no existan, o para crear componentes que soliciten los permisos apropiados antes de ejecutar XR.

## Propiedades {#properties}

| Propiedad                                          | Tipo | Descripción                                                                                            |
| -------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------ |
| [permissions()](permissions.md) | Enum | Lista de permisos que pueden ser especificados como requeridos por un módulo pipeline. |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
