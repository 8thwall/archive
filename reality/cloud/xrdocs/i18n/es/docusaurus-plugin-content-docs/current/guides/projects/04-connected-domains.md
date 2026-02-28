---
id: connected-domains
---

# Dominios conectados

Cuando se utiliza el editor de la nube de 8th Wall para desarrollar, la experiencia WebAR creada se publica en la infraestructura de hospedaje de 8th Wall. La URL por defecto de su experiencia Web AR publicada tendrá el siguiente formato:

"**workspace-name**.8thwall.app/**project-name**"

Si posee un dominio personalizado y desea utilizarlo con un proyecto alojado en 8th Wall en lugar de la URL predeterminada, puede conectar el dominio a su proyecto 8th Wall añadiendo unos cuantos registros DNS. Para ello, necesitarás acceso para crear/editar la configuración DNS de tu dominio.

**NOTE**: Connecting custom domains to 8th Wall Hosted projects requires a **Pro or Enterprise** plan.

**ADVERTENCIA**: se recomienda encarecidamente que conecte **un subdominio** ("ar.mydomain.com") en lugar del dominio raíz ("mydomain.com" sin nada delante) ya que **no todos los proveedores de DNS admiten registros CNAME/ALIAS/ANAME para el dominio raíz**. Póngase en contacto con su proveedor de DNS para comprobar si admite registros CNAME o ALIAS para el dominio raíz antes de continuar.

1. En la página del panel de control del proyecto, seleccione "Configurar dominios".

![SetupConnectedDomains](/images/connected-domains-setup-domains.png)

2. Abra "Configurar dominio para que apunte a este proyecto hospedado en 8th Wall".

3. En el **paso 1** del asistente de dominio conectado, introduzca su **dominio personalizado** (por ejemplo, www.mydomain.com), en el campo Dominio conectado primario.

![ConnectedDomains](/images/console-appkey-domains.png)

4. [Opcional] Si quieres conectar subdominios adicionales, haga clic en el botón **Añadir subdominio adicional** y añada los **dominios adicionales** que quiera conectar. **Nota**: Si conecta subdominios adicionales, estos se redirigirán al dominio principal conectado. Deben compartir la misma raíz que el dominio principal conectado.

![AdditionalConnectedDomains](/images/console-appkey-domains-additional.png)

5. Haga clic en **Conectar**. En este punto, 8th Wall generará un certificado SSL para el dominio o dominios personalizados que se están conectando. Esta operación puede tardar unos minutos, así que tenga paciencia. Haga clic en el botón "Actualizar estado" si es necesario.

6. Después, **verifique la propiedad** de su(s) dominio(s) Para verificar que es el propietario del dominio personalizado, debe acceder al sitio web de tu proveedor de DNS y añadir uno o varios registros CNAME de verificación.  Utilice el botón **Copiar** para asegurarse de que recoge correctamente los registros servidor (Host) y Valor (Value) completos.

![ConnectedDomainVerificationRecord](/images/connected-domain-verification-record.png)

Estos registros DNS pueden tardar hasta 24 horas en verificarse, pero en la mayoría de los casos ocurre en cuestión de minutos.  Tenga paciencia y haga clic en el botón "Actualizar estado de verificación" periódicamente si es necesario.

Cuando se haya completado la verificación, verá una marca de verificación verde junto al registro DNS de verificación:

![ConnectedDomainVerified](/images/connected-domain-verified.png)

7. Por último, el **paso 3** mostrará uno o más registros CNAME (si se conecta un subdominio) o ANAME (si se conecta un dominio raíz, véase la advertencia anterior) que deben añadirse a su servidor DNS para finalizar la configuración del dominio conectado. Estos registros asignan su dominio personalizado a la infraestructura de hospedaje de 8th Wall.

![ConnectedDomainConnectionRecord](/images/connected-domain-connection-record.png)

Resultado: Registro de conexión verificado:

![ConnectedDomainConnectionEstablished](/images/connected-domain-connection-established.png)

Comentarios adicionales:

* Si está conectando un dominio de **raíz**, el paso 3 mostrará un registro `ANAME`.  Suponiendo que su proveedor de DNS admita realmente este tipo de registros, no aparecerán como "conectados". Su dominio conectado seguirá funcionando siempre que haya creado los registros DNS adecuados.
* No es posible modificar la configuración del dominio conectado una vez definida. Si necesitas hacer cambios, tendrá que:
    1. Eliminar el dominio conectado de su proyecto 8th Wall.
    2. Limpiar y añadir los registros DNS de la configuración anterior.
    3. Volver a empezar con la nueva configuración del dominio personalizado.
* **No** utilice un **registro A** para el paso 3.  las experiencias hospedas en 8th Wall se sirven utilizando un CDN global con cientos de ubicaciones en todo el mundo. Los usuarios son encaminados automáticamente al centro de datos más cercano/rápido para obtener el máximo rendimiento. Debe conectar su dominio a la URL única "xxxxx.cloudfront.net" que aparece en el `paso 3` del asistente.
