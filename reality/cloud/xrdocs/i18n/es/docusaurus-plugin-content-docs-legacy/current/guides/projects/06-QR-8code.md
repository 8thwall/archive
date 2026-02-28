---
id: qr-8code
---

# Código QR 8

Para mayor comodidad, se pueden generar códigos QR con la marca 8th Wall (también conocidos como "8 Codes") para un proyecto, de modo que
sea fácil de escanear desde un dispositivo móvil para acceder a su proyecto WebAR.  Puede generar sus propios códigos QR en
o utilizar servicios o sitios web de terceros.

El código QR en el panel de control del proyecto apunta a un enlace corto único "8th.io" para su proyecto. Este enlace corto de
redirige al usuario a la URL de su experiencia Web AR.

<u>Tanto el código QR como el código "8th.io" de un proyecto determinado son estáticos y no cambiarán en función del tipo de proyecto o licencia.</u>

### Proyectos alojados en el 8º Muro (SIN dominio conectado) {#8th-wall-hosted-projects-no-connected-domain}

Si su proyecto utiliza la URL alojada por defecto en 8th Wall (con el formato
"**nombre-del-espacio-de-trabajo**.8thwall.app/**nombre-del-proyecto**"), el código QR y el enlace corto de 8th.io siempre redirigirán
a la URL por defecto.  No es posible modificar la URL de destino.

![ProjectDashboard8wHostedQR](/images/console-appkey-qrcode-8w-hosted.png)

### Proyectos alojados en el 8º Muro (CON dominio conectado) {#8th-wall-hosted-projects-with-connected-domain}

Si ha configurado un [dominio conectado](/legacy/guides/projects/connected-domains) para su 8º proyecto alojado en
Wall, tendrá la opción de establecer el destino del código QR / Shortlink bien en la URL por defecto
del proyecto, o bien en el dominio primario conectado.

Utilice el botón de opción para establecer el destino de su código QR/enlace corto:

![ProjectDashboard8wHostedQRConnectedDomain](/images/console-appkey-qrcode-8w-hosted-connected-domain.png)

### Proyectos autoalojados {#self-hosted-projects}

Para generar un código QR y un enlace corto, introduzca la URL completa de su proyecto autoalojado y haga clic en **Guardar**:

![ProjectDashboardSelfHostedQR](/images/console-appkey-qrcode.png)

El código QR generado puede descargarse en formato PNG o SVG para incluirlo en un sitio web, en soportes físicos
o en otras ubicaciones para facilitar a los usuarios el escaneo con sus smartphones para visitar
la URL autoalojada.  Haga clic en el icono del lápiz para editar el destino del enlace corto en caso de que la URL de
cambie en el futuro.

Por ejemplo:

![ProjectDashboardSelfHostedQRResult](/images/console-appkey-qrcode-result.png)
