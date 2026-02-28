---
id: domain-not-authorized
---

# Dominio no autorizado

#### Problema {#issue}

Al intentar ver una experiencia de WebAR autoalojada, recibo un mensaje de error "Dominio no autorizado".

#### Soluciones {#solutions}

1. Asegúrese de que tiene en la lista blanca el dominio o dominios de su servidor web. Los dominios autoalojados son **específicos del subdominio** - por ejemplo, `midominio.com` NO es lo mismo que `www.mydomain.com.` Si va a alojar tanto en `midominio.com` como en `www.mydomain.com,` debe especificar **AMBOS**. Para más información, consulte la sección [Dominios conectados](/guides/projects/connected-domains) (véase Proyectos autoalojados) de la documentación de .

2. Si Dominio='' (vacío), compruebe la configuración de `RefererPolicy` en su servidor web.

![domain-not-authorized](/images/domain-not-authorized.jpg)

En la captura de pantalla anterior, el valor `Domain=` está vacío. Debe establecerse en el dominio de su experiencia WebAR autoalojada en . En esta situación, la `Referer Policy` de su servidor web es demasiado restrictiva. La cabecera`Referer` http se utiliza para verificar que la clave de su aplicación se está utilizando desde un servidor aprobado/en la lista blanca.

Para verificar la configuración, abra el depurador de Chrome/Safari y mire en la pestaña Red.  Las cabeceras de solicitud `xrweb` deben incluir un valor `Referer`, y éste tiene que coincidir con el dominio o dominios que haya incluido en la lista blanca en la configuración de su proyecto.

**** incorrecto - en esta captura de pantalla la política de referenciadores está configurada como "same-origin". Esto significa que sólo se enviará una referencia para los sitios de origen idéntico, pero las solicitudes de origen cruzado a no enviarán información sobre la referencia:

![referer-missing](/images/referer-missing.jpg)

**Correcto** - Las cabeceras de solicitud `xrweb` incluyen un valor `Referer`.

![referer-ok](/images/referer-ok.jpg)

Se recomienda el valor por defecto de "strict-origin-when-cross-origin". Consulta <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy> para conocer las opciones de configuración.
