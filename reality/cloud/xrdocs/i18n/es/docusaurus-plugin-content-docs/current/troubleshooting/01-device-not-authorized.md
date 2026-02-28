---
id: device-not-authorized
---

# Dispositivo no autorizado

Problema: Al intentar ver mi Web App, recibo un mensaje de error "Dispositivo no autorizado".

#### Específico para Safari {#safari-specific}

La situación:

- Mientras visualiza su proyecto, ve alertas de "Dispositivo no autorizado", **pero**
- [apps.8thwall.com/token](https://apps.8thwall.com/token) muestra la autorización correcta.

¿Por qué ocurre esto?

Safari tiene una función llamada Prevención Inteligente de Rastreo que puede bloquear las cookies de terceros (lo que usamos para autorizar su dispositivo mientras esta programando). Cuando se bloquean, no podemos verificar su dispositivo.

Pasos para solucionarlo:

1. Cerrar Safari
1. Desactive la Prevención Inteligente de Rastreo en `Settings>Safari>Prevent Cross-Site Tracking`
1. Borre las cookies de 8th Wall en `Settings>Safari>Advanced>Website Data>8thwall.com`
1. Reautorice desde consola
1. Compruebe su proyecto
1. Si no se soluciona: borre todas las cookies en `Settings>Safari>Clear History and Website Data`
1. Reautorice desde consola

#### En caso contrario {#otherwise}

Consulte los pasos de [Invalid App Key](/troubleshooting/invalid-app-key) a partir del nº 5 para solucionar más problemas.
