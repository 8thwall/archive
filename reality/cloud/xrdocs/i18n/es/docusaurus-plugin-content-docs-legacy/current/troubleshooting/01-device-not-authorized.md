---
id: device-not-authorized
---

# Dispositivo no autorizado

Problema: Al intentar ver mi Web App, recibo un mensaje de error "Dispositivo no autorizado".

#### Safari específico {#safari-specific}

La situación:

- Mientras visualizas tu proyecto, ves alertas de "Dispositivo no autorizado", **pero**
- [apps.8thwall.com/token](https://apps.8thwall.com/token) muestra la autorización correcta.

¿Por qué ocurre esto?

Safari tiene una función llamada Prevención Inteligente de Rastreo que puede bloquear las cookies de terceros (lo que usamos para autorizar su dispositivo mientras está desarrollando). Cuando se bloquean, no podemos verificar tu dispositivo.

Pasos para solucionarlo:

1. Cerrar Safari
2. Desactive la Prevención de Rastreo Inteligente en `Configuración>Safari>Prevención de Rastreo Cruzado`.
3. Borre las cookies de 8th Wall en `Configuración>Safari>Avanzado>Datos del sitio web>8thwall.com`.
4. Reautorizar desde consola
5. Compruebe su proyecto
6. Si no se soluciona: Borre todas las cookies en `Configuración>Safari>Borrar historial y datos del sitio web`.
7. Reautorizar desde consola

#### En caso contrario {#otherwise}

Consulte los pasos [Clave de aplicación no válida](/legacy/troubleshooting/invalid-app-key) a partir del nº 5 para obtener más información sobre la solución de problemas.
