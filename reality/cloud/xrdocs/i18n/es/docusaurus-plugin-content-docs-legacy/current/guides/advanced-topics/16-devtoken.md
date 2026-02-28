---
id: device-authorization
---

# Autorización de dispositivos

Si tiene un plan Pro o Enteprise de pago, podrá alojar sus propias experiencias WebAR. Si
la IP o dominios de su servidor web que no han sido incluidos en la lista blanca (ver
[Self Hosted Domains](/legacy/guides/projects/self-hosted-domains) sección de la documentación), necesitará
autorizar su dispositivo para poder ver la experiencia.

Si utiliza el Editor en la nube, no es necesario autorizar dispositivos.  El Editor en la nube
autoriza automáticamente los dispositivos cuando se escanea el código QR de vista previa durante el desarrollo.

Al autorizar un dispositivo se instala un token de desarrollador (cookie) en su navegador web, lo que le permite ver
cualquier clave de aplicación dentro del espacio de trabajo actual.

No hay límite en el número de dispositivos que pueden autorizarse, pero cada dispositivo debe autorizarse individualmente en
. Las visualizaciones de su experiencia Web AR desde dispositivos autorizados cuentan para su total de uso mensual de
.

**IMPORTANTE**: Si ha seguido los pasos que se indican a continuación en un **dispositivo iOS** y sigue teniendo problemas con
, consulte la sección [Solución de problemas](/legacy/troubleshooting/device-not-authorized) para conocer los pasos que debe seguir
para solucionarlo. Safari tiene una función llamada **Prevención inteligente de rastreo** que puede \*\*bloquear las cookies de terceros
\*\* (lo que usamos para autorizar tu dispositivo mientras te desarrollas). Cuando se bloquean,
no puede verificar su dispositivo.

Cómo autorizar un dispositivo:

1. Inicie sesión en 8thwall.com y seleccione un proyecto dentro de su espacio de trabajo.

2. Haga clic en **Autorización de dispositivos** para ampliar el panel de autorización de dispositivos.

3. Seleccione la versión de 8th Wall Engine que se utilizará durante el desarrollo.  Para utilizar la última versión estable de
   8th Wall, seleccione **release**.  Para probar una versión preliminar, seleccione **beta**.

![ConsoleDeveloperModeChannel](/images/console-developer-mode-channel.jpg)

4. Autoriza tu dispositivo:

**Desde el escritorio**: Si ha iniciado sesión en la consola desde su ordenador portátil/de sobremesa, **escanee el código QR**
desde el **dispositivo que desea autorizar**.  Esto instala una cookie de autorización en el dispositivo.

Nota: Un código QR sólo puede escanearse una vez.  Después de escanear, recibirá la confirmación de que su dispositivo
ha sido autorizado. A continuación, la consola generará un nuevo código QR que podrá escanearse para autorizar otro dispositivo a través de
.

Antes:

![ConsoleDevTokenQR](/images/console-developer-mode-qr.jpg)

Después:

| Confirmación (Consola)                                      | Confirmación (en el dispositivo)                          |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| ![ConsoleQRConfirmation](/images/console-developer-mode-qr-result-desktop.jpg) | ![MobileQRConfirmation](/images/console-developer-mode-qr-result-mobile.jpg) |

**Desde el móvil**: Si ha iniciado sesión en 8thwall.com directamente en el dispositivo móvil que desea autorizar
, simplemente haga clic en **Autorizar navegador**. Al hacerlo, se instala una cookie de autorización en su navegador móvil
, autorizándole a ver cualquier proyecto dentro del espacio de trabajo actual.

Antes:

![DeveloperModeMobile](/images/console-developer-mode-mobile.jpg)

Después:

![DeveloperModeMobileAuthorized](/images/console-developer-mode-mobile-authorized.jpg)
