---
id: connected-domains
---

# Dominios conectados

Cuando se utiliza 8th Wall Cloud Editor para desarrollar, la experiencia web de RA creada se publica en la infraestructura de alojamiento de 8th Wall. La URL por defecto de su experiencia Web AR publicada tendrá el siguiente formato:

"**nombre-del-espacio-de-trabajo**.8thwall.app/**nombre-del-proyecto**"

Si posee un dominio personalizado y desea utilizarlo con un proyecto alojado en 8th Wall en lugar de la URL predeterminada, puede conectar el dominio a su proyecto 8th Wall añadiendo unos cuantos registros DNS. Para ello, necesitarás acceso para crear/editar la configuración DNS de tu dominio.

**NOTA**: La conexión de dominios personalizados a proyectos alojados en 8th Wall requiere un plan **Pro o Enterprise**.

**ADVERTENCIA**: Se recomienda encarecidamente conectar un **subdominio** ("ar.midominio.com") en lugar del dominio raíz ("midominio.com" sin nada delante) ya que **no todos los proveedores de DNS soportan registros CNAME/ALIAS/ANAME para el dominio raíz**. Póngase en contacto con su proveedor de DNS para comprobar si admite registros CNAME o ALIAS para el dominio raíz antes de continuar.

1. En la página "Panel de control del proyecto", seleccione "Configurar dominios".

![SetupConnectedDomains](/images/connected-domains-setup-domains.png)

2. Ampliar "Configure su dominio para que apunte a este proyecto alojado en 8th Wall"

3. En el **Paso 1** del asistente de dominio conectado, introduzca su **dominio personalizado** (por ejemplo www.mydomain.com), en el campo Dominio conectado primario.

![ConnectedDomains](/images/console-appkey-domains.png)

4. [Opcional] Si desea conectar subdominios adicionales, haga clic en el botón **Añadir subdominio adicional** y añada los **dominios adicionales** que desee conectar. **Nota**: Si conecta subdominios adicionales, estos redirigirán de nuevo al dominio primario conectado. Deben compartir la misma raíz que el dominio primario conectado.

![AdditionalConnectedDomains](/images/console-appkey-domains-additional.png)

5. Haz clic en **Conectar**. En este punto 8th Wall generará un certificado SSL para el dominio(s) personalizado(s) que se está(n) conectando. Esta operación puede tardar unos minutos, así que tenga paciencia. Haga clic en el botón "Actualizar estado" si es necesario.

6. A continuación, **Verifique la titularidad** de su dominio. Para verificar que usted es el propietario del dominio personalizado, debe acceder al sitio web de su proveedor de DNS y añadir uno o varios registros CNAME de verificación.  Utilice el botón **Copiar** para asegurarse de que recoge correctamente los registros Host y Value completos.

![ConnectedDomainVerificationRecord](/images/connected-domain-verification-record.png)

Estos registros DNS pueden tardar hasta 24 horas en verificarse, pero en la mayoría de los casos ocurre en cuestión de minutos.  Tenga paciencia y haga clic en el botón "Actualizar estado de verificación" periódicamente si es necesario.

Cuando se haya completado la verificación, verá una marca de verificación verde junto al registro DNS de verificación:

![ConnectedDomainVerified](/images/connected-domain-verified.png)

7. Por último, el **Paso 3** mostrará uno o más registros CNAME (si se conecta un subdominio) o ANAME (si se conecta un dominio raíz, véase la advertencia anterior) que deben añadirse a su servidor DNS para finalizar la configuración del dominio conectado. Estos registros asignan su dominio personalizado a la infraestructura de alojamiento de 8th Wall.

![ConnectedDomainConnectionRecord](/images/connected-domain-connection-record.png)

Resultado: Registro de conexión verificado:

![ConnectedDomainConnectionEstablished](/images/connected-domain-connection-established.png)

Notas adicionales:

- Si está conectando un dominio **root**, el paso 3 mostrará un registro `ANAME`.  Suponiendo que su proveedor de DNS admita realmente este tipo de registros, no aparecerán como "conectados". Tu dominio conectado seguirá funcionando siempre que hayas creado los registros DNS adecuados.
- No es posible modificar la configuración del dominio conectado una vez definida. Si necesitas hacer cambios, tendrás que hacerlo:
  1. Elimine el dominio conectado de su proyecto 8th Wall.
  2. Limpieza y registros DNS añadidos desde la configuración anterior.
  3. Vuelva a empezar con la nueva configuración del dominio personalizado.
- No utilice un registro A para el paso 3.  Las experiencias alojadas en 8th Wall se sirven mediante una CDN global con cientos de ubicaciones en todo el mundo. Los usuarios son encaminados automáticamente al centro de datos más cercano/rápido para obtener el máximo rendimiento. Debe conectar su dominio a la URL única "xxxxx.cloudfront.net" mostrada en el `Paso 3` del asistente.
