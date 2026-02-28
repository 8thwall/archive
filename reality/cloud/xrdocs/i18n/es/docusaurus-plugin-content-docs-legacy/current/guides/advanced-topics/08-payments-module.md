---
id: monetize-with-8th-wall-payments
---

# 8ª Pared Pagos

8th Wall Payments ofrece a los desarrolladores las herramientas que necesitan para añadir pagos seguros a sus aplicaciones web de realidad aumentada y realidad virtual
. Los desarrolladores pueden utilizar el Módulo de Pagos que se encuentra en el Editor Cloud para añadir fácilmente a su proyecto productos para su compra en
. Todos los pagos se facilitan mediante la API de pagos de 8th Wall, que permite a los desarrolladores de
cobrar y recibir pagos.

#### ¿Por qué utilizar 8th Wall Payments? {#why-use-8th-wall-payments}

Monetiza fácilmente tus experiencias WebAR o WebVR con 8th Wall Payments con el módulo de pagos.
Desarrollado por Stripe, 8th Wall Payments proporciona una forma segura para que los usuarios finales paguen por su producto y
para que usted gane dinero desarrollando proyectos WebXR.

Con el módulo 8th Wall Payments, dispones de una importación de un solo paso que te permite la oportunidad de
monetizar tu proyecto web AR o web VR utilizando opciones de pago extensibles. Con el módulo de pagos,
puede personalizar fácilmente las opciones de pago, como el coste y el artículo que está vendiendo, todo ello aprovechando
nuestro flujo de pago optimizado para su uso en móviles, ordenadores de sobremesa y RV. Acceda a todos los tipos de pago actuales y futuros de
en un solo módulo. Pruebe el éxito de su integración de pagos con el modo de prueba incorporado
.

Opciones de pago actuales disponibles:

- **Pase de acceso**: El pase de acceso le permite añadir un pago único a su producto que caduca
  después de un mínimo de 1 día a un máximo de 7 días. No es necesario que el usuario inicie sesión. El pase de acceso está disponible en
  en un dispositivo y se elimina cuando se borra la caché del navegador.

#### Procesamiento de pagos {#payment-processing}

Para proporcionar este servicio de pago, 8th Wall se lleva una pequeña comisión de cada tarifa, que se reparte con
, nuestro procesador de Stripe. Los usuarios finales deben aceptar las Condiciones del servicio
de 8th Wall para poder realizar una compra.

#### Tasa de procesamiento de pagos {#payment-processing-fee}

20% de cada transacción

## Restricciones de pago {#payment-restrictions}

- Actualmente, 8th Wall Payments sólo es accesible en los siguientes países y sus respectivas monedas:
  - Australia
  - Canadá
  - Japón
  - Nueva Zelanda
  - REINO UNIDO
  - Estados Unidos
- Sólo se puede acceder a 8th Wall Payments a través de proyectos que utilicen el Editor en nube.
- Debe ser `Admin` o `Owner` de su espacio de trabajo en 8th Wall para poder registrarse en la API de pago de 8th Wall.
- Los pagos de 8th Wall están vinculados a la [Lista de empresas restringidas de Stripe](https://stripe.com/gb/legal/restricted-businesses).
- Sólo puede utilizar 8th Wall Payments como su procesador de pagos para la funcionalidad de la App, el contenido digital o los bienes digitales creados utilizando 8th Wall.
- Todos los usuarios finales deben aceptar las [Condiciones de servicio de 8th Wall](https://www.8thwall.com/terms), (véase "Condiciones de uso para usuarios finales de 8th Wall Payments" en las CdS)

## Fechas de pago {#payout-dates}

Regístrese en la API de pagos en su página de cuentas. Una vez que su cuenta reciba fondos, recibirá los pagos de
el día 15 de cada mes. Los importes que no se hayan abonado aparecerán como \*\*Importes pendientes
\*\* en su página Cuentas.

## Soporte de pagos y devoluciones {#payment-support-and-refunds}

Todos los pagos son no reembolsables. Si un usuario final tiene alguna pregunta sobre su pago, puede ponerse en contacto con
[support](mailto:support@8thwall.com).

## Utilización de los pagos de la 8ª Pared en su proyecto {#using-8th-wall-payments-in-your-project}

8th Wall Payments utiliza Stripe Connect para procesar los pagos de forma segura. Para empezar a crear aplicaciones web
con contenido de pago, debe registrarse para obtener una cuenta Stripe Connect a través de 8th Wall. Esto es
necesario para beneficiarse de los Pagos de la 8ª Pared para cobrar.

Regístrese en la API de pagos en su página de cuentas

1. Vaya a su página de cuentas
2. En Pagos API seleccione el país de su banco o tarjeta de débito.
3. Haga clic en "Start Here"
   ![payment-api-setting](/images/payment-api-setting.png)
4. Se le dirigirá a Stripe Connect. Siga las instrucciones para rellenar todos los campos obligatorios. Tendrá que proporcionar:
   1. Correo electrónico
   2. Número de teléfono
   3. Detalles para particulares o empresas
      1. Particular - Su fecha de nacimiento y domicilio, número de la Seguridad Social
      2. Nombre comercial
   4. Industria, sitio web o descripción del producto
   5. Datos de la cuenta bancaria o tarjeta de débito en la que cobrará los pagos

Después de que envíe su información completa, Stripe puede tardar varios días en procesar y validar su información. Puede consultar el estado de su cuenta en la pantalla Cuentas.

Una vez confirmada, verá la información de su cuenta bancaria en la página Cuentas

#### Gestionar pagos API Stripe Connect Cuenta {#manage-payments-api-stripe-connect-account}

Puede ver los detalles de pago del dinero ganado en todas las aplicaciones web de su espacio de trabajo en la página Cuentas, en la sección Descripción general de la API de pagos.

Página de cuentas Descripción general de la API de pago

- Cuenta bancaria - la cuenta bancaria o tarjeta de débito donde se depositará su pago
- Importe total: el importe total de dinero que ha recaudado de todas sus aplicaciones web.
- Fecha de pago: día del mes en que recibirá el pago. Consulte las fechas de pago para conocer el calendario.
- Importe del próximo pago: la cantidad total de dinero que recibirá en la próxima fecha de pago.
- Importe pendiente: el importe total que ha recibido y está pendiente de procesamiento. Todavía no está listo para ser enviado en el próximo pago

Para ver su cuenta de Stripe Connect, haga clic en **Ir a Stripe**.

Para actualizar la información de pago de su cuenta Stripe, como la dirección o la información de la cuenta bancaria, haga clic en **Actualizar información**.

Para ver los pagos individuales de sus aplicaciones web, haga clic en **Ver historial**.

#### Módulo de pagos {#payments-module}

Una vez que se haya registrado en 8th Wall Payments, deberá importar el módulo de pagos a su proyecto para poder acceder a la API de pagos.

Para importar el módulo de pagos:

1. Abrir un proyecto del Editor de Nubes
2. Haga clic en el signo + situado junto a la sección "Módulos"' en el menú de navegación de la izquierda del Editor de Nube.
3. Busque "Pagos" e importe el módulo a su proyecto.

Ya está listo para añadir contenido de pago a su proyecto.

#### Configuraciones {#configurations}

El módulo de pagos le permite personalizar fácilmente el tipo de opción de pago que desea, el coste, el producto y mucho más. También puedes activar el modo de prueba para asegurarte de que tus pagos funcionan como esperas.

#### Modo de prueba {#test-mode}

El modo de prueba le permite simular las compras realizadas en su aplicación web antes de lanzarla públicamente. Activar el modo de prueba le permite integrar la API de pagos en sus aplicaciones, sin tener que realizar compras reales.

Configuraciones para el modo de prueba:

| Configuración                         | Tipo     | Por defecto | Descripción                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Modo de prueba activado               | Booleano | `false`     | Si es True - Está simulando compras en su producto, los pagos no están en el servidor sino en la caché local <br /> Si es False - El modo de prueba está desactivado                                                                                                                                                                             |
| Borrar compras de prueba en ejecución | Booleano | `false`     | Si es Verdadero: las compras del modo de prueba se borrarán para que pueda volver a probar la experiencia de compra <br /> Si es Falso: la compra de prueba permanecerá en el almacenamiento local hasta que se borre. Esto es útil para probar los flujos de compra existentes. |

#### Pase de acceso {#access-pass}

Este tipo de pago ofrece a los usuarios acceso de pago a contenidos de RA o RV durante un periodo de tiempo limitado. Los pases de acceso son muy adecuados para permitir el acceso de pago a eventos de RA/VR, como una entrada de un día para un concierto holográfico o una exposición de arte virtual, o el acceso de 7 días a una búsqueda del tesoro con RA.

En la experiencia del usuario final, el usuario:

1. Ver el aviso de pase de acceso o el aviso para comprar el producto
2. Al hacer clic en CTA se abrirá el flujo de pago alojado en 8thwall.com
3. Permite a los usuarios comprar un producto por un precio determinado
4. Guardar la compra en el almacenamiento local del dispositivo hasta el periodo de tiempo preconfigurado.

Configuraciones por defecto de los pases de acceso

| Configuración               | Tipo     | Por defecto | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Acceso Duración Días        | `Número` | `1`         | El número de días de validez de esta compra. La duración mínima es de 1 día y la máxima de 7.                                                                                                                                                                                                                                                                                                                                      |
| Importe                     | `Número` | `0.99`      | El importe a solicitar para el pago del Pase de Acceso especificado.<br/>Los importes tienen un mínimo y un máximo respectivos definidos por la Divisa.<br/>**AUD**: 0,99 $ a 99,99 $<br/>**CAD**: 0,99 $ a 99,99 $<br/>**GBP**: 0,99 £ a 99,99 £<br/>**JPY**: ¥99 a ¥999<br/>**NZD**: 0,99 $ a 99,99 $<br/>**USD**: 0,99$ a 99,99 |
| Nombre del pase de acceso   | Cadena   | `'N/A'`     | El nombre del producto. Se utilizará en el formulario de pago para describir al usuario lo que está comprando.                                                                                                                                                                                                                                                                                                                     |
| Moneda                      | Cadena   | `'usd'`     | La moneda que se cobrará al usuario. Puede ser `'aud'`, `'cad'`, `'gbp'`, `'jpy'`, `'nzd'`, o `'usd'`.                                                                                                                                                                                                                                                                                                                             |
| Idioma de la página de pago | Cadena   | es-US       | El idioma que aparece al usuario final en la página de pago seguro. Puede ser `'en-US'` (inglés - Estados Unidos) o `'ja-JP'` (japonés).                                                                                                                                                                                                                                                     |
