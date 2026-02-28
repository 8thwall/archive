---
id: self-hosted-domains
---

# Dominios autoalojados

Si tienes un plan Pro o Enterprise de pago, puedes alojar experiencias Web AR en
tu propio servidor web (y verlas sin autorización del dispositivo). Para ello,
deberá especificar una lista de dominios aprobados para alojar su proyecto
.

1. En la página "Panel de control del proyecto", seleccione "Configurar dominios".

2. Amplíe "Configurar este proyecto para autoalojamiento o desarrollo local".

3. Introduzca el(los) dominio(s) o IP(s) del servidor web en el que autoalojará
   el proyecto. Un dominio no puede contener comodines, rutas ni puertos. Haga clic en el signo "+"
   para añadir varios.

Nota: Los dominios autoalojados son **específicos de subdominio** - por ejemplo, `midominio.com` NO es lo mismo que
`www.mydomain.com`. Si va a alojar tanto en midominio.com como en `www.mydomain.com`, debe especificar en
**AMBOS**.

![SelfHostedDomainList](/images/console-app-key-origins.jpg)
