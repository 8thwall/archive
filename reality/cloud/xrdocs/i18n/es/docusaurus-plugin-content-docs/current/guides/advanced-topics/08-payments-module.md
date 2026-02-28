---
id: monetize-with-8th-wall-payments
---

# 8th Wall Payments

8th Wall Payments ofrece a todos los desarrolladores las herramientas que necesitan para añadir pagos seguros a sus aplicaciones web de realidad aumentada y realidad virtual. Los desarrolladores pueden utilizar el módulo de pagos que se encuentra en el editor de la nube para añadir fácilmente productos de compra a su proyecto. Todos los pagos se facilitan mediante la API de pagos de 8th Wall, que permite a los desarrolladores cobrar y recibir pagos.

#### ¿Por qué utilizar 8th Wall Payments? {#why-use-8th-wall-payments}

Monetice fácilmente sus experiencias WebAR o WebVR con 8th Wall Payments con el módulo de pagos. Impulsado por Stripe, 8th Wall Payments proporciona una forma segura para que los usuarios finales paguen por su producto y para que gane dinero desarrollando proyectos WebXR.

Con el módulo de pagos de 8th Wall, tiene una importación de un solo paso que te permite la oportunidad de monetizar su proyecto WebAR o WebVR utilizando opciones de pago extensibles. Con el módulo de pagos, puede personalizar fácilmente las opciones de pago, como el coste y el artículo que vende, todo ello aprovechando nuestro flujo de pago optimizado para su uso en móviles, ordenadores de sobremesa y VR. Acceda a todos los tipos de pago actuales y futuros en un solo módulo. Pruebe el éxito de su integración de pago con el modo de prueba incorporado.

Opciones de pago actuales disponibles:

- **Pase de acceso**: El pase de acceso le permite añadir un pago único a su producto que caduca después de un mínimo de 1 día y un máximo de 7 días. No es necesario que el usuario inicie sesión. El pase de acceso está disponible en un dispositivo y se elimina cuando se borra la caché del navegador.

#### Procesamiento de pagos {#payment-processing}

Para proporcionar este servicio de pago, 8th Wall se lleva una pequeña comisión de cada cuota, que se reparte con nuestro procesador de Stripe. Los usuarios finales deben aceptar las Condiciones del servicio de [8th Wall](https://www.8thwall.com/terms) para poder realizar una compra.

#### Cuota de procesamiento de pagos {#payment-processing-fee}

20 % de cada transacción

## Restricciones de pago {#payment-restrictions}

* actualmente, 8th Wall Payments solo está disponible en los siguientes países y sus respectivas monedas:
  * Australia
  * Canadá
  * Japón
  * Nueva Zelanda
  * REINO UNIDO
  * Estados Unidos
* solo se puede acceder a 8th Wall Payments a través de proyectos que utilicen el editor en la nube.
* Debs ser `administrador` o `propietario` de su área de trabajo de 8th Wall para poder registrarse en la API de pago de 8th Wall.
* los pagos de 8th Wall están vinculados a la [Lista de empresas restringidas de Stripe](https://stripe.com/gb/legal/restricted-businesses).
* Solo puedes utilizar 8th Wall Payments como tu procesador de pagos para la funcionalidad de la App, el contenido digital o los bienes digitales creados utilizando 8th Wall.
* Todos los usuarios finales deben aceptar [Condiciones del servicio de 8th Wall](https://www.8thwall.com/terms), (consulte "Condiciones del usuario final de 8th Wall Payments" en las Condiciones del servicio).

## Fecha de pago {#payout-dates}

Regístrese en la API de Pagos en tu página de cuentas. Una vez que su cuenta reciba fondos, recibirá los pagos el día 15 de cada mes. Los importes que no se hayan abonado aparecerán como **importes pendientes** en su página de cuentas.

## Soporte de pago y devoluciones {#payment-support-and-refunds}

Todos los pagos son no reembolsables. Si un usuario final tiene alguna pregunta sobre su pago, puede ponerse en contacto con [el equipo de asistencia](mailto:support@8thwall.com).

## Utilizar el 8th Wall Payments en su proyecto {#using-8th-wall-payments-in-your-project}

8th Wall Payments utiliza Stripe Connect para procesar los pagos de forma segura. Para empezar a crear aplicaciones web con contenido de pago, debe registrarte para obtener una cuenta Stripe Connect a través de 8th Wall. Esto es necesario para beneficiarse de recibir pagos con 8th Wall Payments.

Regístrese en la API de pagos en tu página de cuentas

1. Vaya a su página de cuentas
1. En Pagos API seleccione el país de su banco o tarjeta de débito.
1. Haga clic en "Empezar aquí" ![payment-api-setting](/images/payment-api-setting.png)
1. Se le dirigirá a Stripe Connect. Siga las indicaciones para rellenar todos los campos obligatorios. Tendrá que introducir:
    1. Correo electrónico
    1. Número de teléfono
    1. Detalles para particulares o empresas
        1. Individuo - Fecha de nacimiento y domicilio, número de la Seguridad Social
        1. Nombre comercial
    1. Industria, página web o descripción del producto
    1. Datos de la cuenta bancaria o tarjeta de débito donde dse cobrarán los pagos

Después de enviar su información completa, Stripe puede tardar varios días en procesar y validar su información. Puede volver a comprobar el estado de su cuenta en la pantalla de cuentas.

Una vez confirmada, verá la información de su cuenta bancaria en su página de cuentas

#### Gestionar la cuenta de pagos de API Stripe Connect {#manage-payments-api-stripe-connect-account}

Puede ver sus detalles de pago para el dinero ganado en todas tus aplicaciones web del área de trabajo en la página de cuentas, en la sección de vista general de la API de pagos.

Vista general de la página de cuentas de la API de pago

- Cuenta bancaria - la cuenta bancaria o tarjeta de débito donde se depositará su pago.
- Importe total - el importe total de dinero que ha recaudado de todas sus aplicaciones web.
- Fecha de pago - el día del mes en el que recibirá su pago. Consulte las fechas de pago para ver el calendario.
- Importe del próximo pago: la cantidad total de dinero que recibirs en la próxima fecha de pago.
- Importe pendiente - el importe total que ha recibido y está pendiente de procesar. Todavía no está listo para ser enviado en el próximo

Para ver su cuenta de Stripe Connect haga clic en **Ir a Stripe**.

Para actualizar la información de pago de su cuenta Stripe, como la dirección o la información de la cuenta bancaria, haga clic en **Actualizar información**.

Para ver pagos individuales desde sus aplicaciones web, haga clic en **Ver historial**.

#### Módulo de pagos {#payments-module}

Una vez que se haya dado de alta en 8th Wall Payments, tendrá que importar el módulo de pagos a su proyecto para poder acceder a la API de pagos.

Importar el módulo de pagos:

1. Abrir un proyecto en el dditor de la nube
2. Haga clic en el signo + situado junto a la sección "Módulos"' en el navegador de la izquierda del editor de la nube.
3. Busque "Pagos" e importe el módulo a su proyecto.

¡Ya ests listo para añadir contenido de pago a su proyecto!

#### Configuraciones {#configurations}

El módulo de pagos le permite personalizar fácilmente el tipo de opción de pago que desee, el coste, el producto y mucho más. También puede activar el modo de rueba para asegurarte de que sus pagos funcionan como espera.

#### Modo de prueba {#test-mode}

El modo de prueba le permite simular las compras realizadas en su aplicación web antes de lanzarla públicamente. Activar el modo de prueba le permite integrar la API de pagos en sus aplicaciones, sin tener que realizar compras reales.

Configuraciones para el modo de prueba:

| Configuración                         | Tipo       | Por defecto | Descripción                                                                                                                                                                                                                                                                                              |
| ------------------------------------- | ---------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modo de prueba activado               | `Booleano` | `false`     | Si es verdadero (true) - Está simulando compras en su producto, los pagos no están en el servidor, sino almacenados en caché local. <br /> Si es falso (false) - El modo de prueba está desactivado.                                                                                               |
| Borrar compras de prueba en ejecución | `Booleano` | `false`     | Si es verdadero (true) - Las compras del modo de prueba se borrarán para que pueda volver a probar la experiencia de compra. <br /> Si es falso (false) - La compra de prueba permanecerá en el almacenamiento local hasta que se borre. Esto es útil para probar los flujos de compra existentes. |

#### Pase de acceso {#access-pass}

Este tipo de pago ofrece a los usuarios acceso de pago a contenidos de AR o VR durante un periodo de tiempo limitado. Los pases de acceso son muy adecuados para permitir el acceso de pago a eventos de AR/VR, como una entrada de 1 día para un concierto holográfico o una exposición de arte virtual, o el acceso de 7 días a una búsqueda del tesoro con AR.

En la experiencia del usuario final, el usuario:

1. Ver el aviso de pase de acceso o el aviso para comprar el producto
2. Al hacer clic en la CTA, se abrirá el flujo de pago hospedado en 8thwall.com
3. Permite a los usuarios comprar un producto por un precio determinado
4. Guarda la compra en el almacenamiento local del dispositivo hasta el periodo de tiempo preconfigurado

Configuraciones por defecto del pase de acceso

| Configuración               | Tipo     | Por defecto | Descripción                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Duración en días del acceso | `Número` | `1`         | El número de días de validez de esta compra. La duración mínima es de 1 día y la máxima de 7 días.                                                                                                                                                                                                                                                                                               |
| Importe                     | `Número` | `0,99`      | El importe a solicitar para el pago del pase de acceso especificado.<br/>Los importes tienen un mínimo y un máximo respectivos definidos por la divisa.<br/>**AUD**: de 0,99 $ a 99,99 $<br/>**CAD**: de 0,99 $ a 99,99 $<br/>**GBP**: de 0,99 £ a 99,99 £<br/>**JPY**: 99 ¥ a 999 ¥<br/>**NZD**: de 0,99 $ a 99,99 $<br/>**USD**: de 0,99 $ a 99,99 $ |
| Nombre del pase de acceso   | `Cadena` | `'N/A'`     | El nombre del producto. Se utilizará en el formulario de pago para describir al usuario lo que está comprando.                                                                                                                                                                                                                                                                                   |
| Moneda                      | `Cadena` | `'usd'`     | La moneda que se cobrará al usuario. Puede ser `'aud'`, `'cad'`, `'gbp'`, `'jpy'`, `'nzd'`, o `'usd'`.                                                                                                                                                                                                                                                                                           |
| Idioma de la página de pago | `Cadena` | `'en-US'`   | El idioma que le aparece al usuario final en la página de pago seguro. Puede ser `'en-US'` (inglés - Estados Unidos) o `'ja-JP'` (japonés).                                                                                                                                                                                                                                                      |
