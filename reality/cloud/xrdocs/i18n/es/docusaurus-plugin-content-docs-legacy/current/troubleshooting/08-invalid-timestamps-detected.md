---
id: invalid-timestamps-detected
---

# Se han detectado marcas de tiempo no válidas

#### Edición {#issue}

En los dispositivos iOS, los registros de la consola muestran una advertencia que dice `webvr-polyfill: Se han detectado marcas de tiempo no válidas: Timestamp from devicemotion outside expected range.`

#### Resolución {#resolution}

No se requiere ninguna acción.

Esta es una **advertencia** procedente de `webvr-polyfill`, una dependencia de la biblioteca AFrame/8Frame. Devicemotion es un evento procedente del navegador que se dispara a intervalos regulares. Indica la cantidad de fuerza física de aceleración que está recibiendo el aparato en ese momento. Estos mensajes "Invalid timestamp" son un subproducto de la implementación devicemotion de iOS, donde las marcas de tiempo a veces se reportan fuera de orden.

Se trata simplemente de una **advertencia**, no de un error, y puede ignorarse con seguridad. No tiene ningún impacto en su experiencia Web AR.
