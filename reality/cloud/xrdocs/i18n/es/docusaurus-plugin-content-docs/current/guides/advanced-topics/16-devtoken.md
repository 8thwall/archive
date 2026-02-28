---
id: device-authorization
---

# Autorización del dispositivo

Si tiene un plan Pro o Enteprise de pago, tendrá la posibilidad de autohospedar experiencias WebAR. Si la IP o los dominios de su servidor web que no han sido incluidos en una lista de aprobación (consulte la sección [Dominios autoalojados](/guides/projects/self-hosted-domains) de la documentación), necesitará autorizar su dispositivo para poder ver la experiencia.

Si utiliza el editor en la nube, no es necesario autorizar dispositivos.  El editor en la nube autoriza automáticamente los dispositivos al escanear la vista previa del código QR durante el desarrollo.

Al autorizar un dispositivo se instala un token de desarrollador (cookie) en su navegador web, lo que le permite ver cualquier clave de aplicación dentro del área de trabajo actual.

No hay límite en el número de dispositivos que pueden autorizarse, pero cada dispositivo debe autorizarse individualmente. Las visualizaciones de su experiencia WebAR desde dispositivos autorizados cuentan para su total de uso mensual.

**IMPORTANTE**: Si ha seguido los pasos que se indican a continuación en un dispositivo **iOS**, y sigue teniendo problemas, consulte la sección [Solución de problemas](/troubleshooting/device-not-authorized) para conocer los pasos para solucionarlo. Safari tiene una función llamada **Prevención inteligente de rastreo** que puede **bloquear las cookies de terceros ** (las que utilizamos para autorizar su dispositivo mientras usted desarrolla). Cuando se bloquean, nosotros no podemos verificar su dispositivo.

Cómo autorizar un dispositivo:

1. Entre en 8thwall.com y seleccione un proyecto dentro de su área de trabajo.

2. Haga clic en **Autorización de dispositivos** para ampliar el panel de autorización de dispositivos.

3. Seleccione la versión del motor de 8th Wall que quiera utilizar durante el desarrollo.  Para utilizar la última versión estable de 8th Wall, seleccione **publicar**.  Para probar una versión preliminar, seleccione **beta**.

![ConsoleDeveloperModeChannel](/images/console-developer-mode-channel.jpg)

4. Autorizar su dispositivo:

**Desde el escritorio**: Si ha iniciado sesión en la consola desde su ordenador portátil/de sobremesa, **Escanee el código QR** desde el **dispositivo que desee autorizar**.  Se instalará una cookie de autorización en el dispositivo.

Nota: un código QR solo puede escanearse una vez.  Después de escanear, recibirá la confirmación de que su dispositivo ha sido autorizado. La consola generará entonces un nuevo código QR que se puede escanear para autorizar otro dispositivo.

Antes:

![ConsoleDevTokenQR](/images/console-developer-mode-qr.jpg)

Después:

| Confirmación (consola)                                                         | Confirmación (en el dispositivo)                                             |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| ![ConsoleQRConfirmation](/images/console-developer-mode-qr-result-desktop.jpg) | ![MobileQRConfirmation](/images/console-developer-mode-qr-result-mobile.jpg) |

**Desde el móvil**: Si ha iniciado sesión en 8thwall.com directamente en el dispositivo móvil que desea autorizar , simplemente haga clic en **Autorizar navegador**. Al hacerlo, se instala una cookie de autorización en el navegador de su móvil , autorizándole a ver cualquier proyecto dentro del área de trabajo actual.

Antes:

![DeveloperModeMobile](/images/console-developer-mode-mobile.jpg)

Después:

![DeveloperModeMobileAuthorized](/images/console-developer-mode-mobile-authorized.jpg)
