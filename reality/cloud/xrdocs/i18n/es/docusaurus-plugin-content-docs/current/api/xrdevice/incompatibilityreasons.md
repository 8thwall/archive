---
sidebar_label: IncompatibilityReasons
---

# XR8.XrDevice.IncompatibilityReasons

Enumeración

## Descripción {#description}

Las posibles razones por las que un dispositivo y un navegador pueden no ser compatibles con 8th Wall Web.

## Propiedades {#properties}

| Propiedad                    | Valor | Descripción                                                    |
| ---------------------------- | ----- | -------------------------------------------------------------- |
| UNSPECIFIED                  | `0`   | No se especifica el motivo de la incompatibilidad.             |
| UNSUPPORTED_OS               | `1`   | El sistema operativo estimado no es compatible.                |
| UNSUPPORTED_BROWSER          | `2`   | El navegador estimado no es compatible.                        |
| MISSING_DEVICE_ORIENTATION | `3`   | El navegador no admite eventos de orientación del dispositivo. |
| MISSING_USER_MEDIA         | `4`   | El navegador no admite el acceso a los medios del usuario.     |
| MISSING_WEB_ASSEMBLY       | `5`   | El navegador no admite el montaje web.                         |
