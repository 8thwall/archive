---
id: qr-8code
---

# QR 8Code

Para mayor comodidad, se pueden generar códigos QR de la marca 8th Wall (también conocidos como "8 Codes") para un proyecto, de modo que sea fácil de escanear desde un dispositivo móvil para acceder a su proyecto WebAR.  Siempre puede generar sus propios códigos QR, o utilizar sitios web o servicios de generación de códigos QR de terceros.

El código QR del panel de control del proyecto apunta a un enlace corto "8.io" único para su proyecto. Este enlace corto redirige entonces al usuario a la URL de su experiencia WebAR.

<u>Tanto el código QR como el código "8.io" de un proyecto determinado son estáticos y no cambiarán en función del tipo de proyecto o licencia.</u>

### proyectos hospedados en 8th Wall (SIN dominio conectado) {#8th-wall-hosted-projects-no-connected-domain}

Si su proyecto utiliza la URL hospedada por defecto en 8th Wall (con el formato "**workspace-name**.8thwall.app/**project-name**"), el código QR y el enlace corto de 8th.io siempre redirigirán a la URL por defecto.  No es posible modificar la URL de destino.

![ProjectDashboard8wHostedQR](/images/console-appkey-qrcode-8w-hosted.png)

### proyectos hospedados en 8th Wall (CON dominio conectado) {#8th-wall-hosted-projects-with-connected-domain}

Si ha configurado un [dominio conectado](/guides/projects/connected-domains) para su proyecto alojado en 8th Wall , tendrá la opción de establecer el destino del código QR/enlace corto en la URL predeterminada del proyecto o en el dominio conectado principal.

Utilice el botón de opción para establecer el destino de tu Código QR / Enlace Corto:

![ProjectDashboard8wHostedQRConnectedDomain](/images/console-appkey-qrcode-8w-hosted-connected-domain.png)

### Solo proyectos autohospedados {#self-hosted-projects}

Para generar un código QR y un enlace corto, introduzca la URL completa de su proyecto autohospedado y haga clic en **Guardar**:

![ProjectDashboardSelfHostedQR](/images/console-appkey-qrcode.png)

El código QR generado puede descargarse en formato PNG o SVG para incluirlo en un sitio web, en un soporte físico o en otros lugares para facilitar a los usuarios el escaneo con sus teléfonos inteligentes para visitar la URL autohospedada.  Haga clic en el icono del lápiz para editar el destino del enlace corto en caso de que la URL autohospedada cambie en el futuro.

Ejemplo:

![ProjectDashboardSelfHostedQRResult](/images/console-appkey-qrcode-result.png)
