---
id: invalid-timestamps-detected
---

# Se han detectado marcas de tiempo no válidas

#### Problema {#issue}

En los dispositivos iOS, los registros de la consola muestran una advertencia que dice `webvr-polyfill: se han detectado marcas de tiempo no válidas: marcas de tiempo de devicemotion fuera del rango esperado.`

#### Resolución {#resolution}

No se requiere ninguna acción.

Se trata de una advertencia **** procedente de `webvr-polyfill`, una dependencia de la biblioteca AFrame/8Frame. Devicemotion es un evento procedente del navegador que se dispara a intervalos regulares. Indica la cantidad de fuerza física de aceleración que recibe el aparato en ese momento. Estos mensajes de "Marca de tiempo no válida" son un subproducto de la implementación devicemotion de iOS, en la que las marcas de tiempo a veces se informan fuera de orden.

Esto es simplemente un **aviso**, no un error, y puede ignorarse con seguridad. No tiene ningún impacto en tu experiencia WebAR.
