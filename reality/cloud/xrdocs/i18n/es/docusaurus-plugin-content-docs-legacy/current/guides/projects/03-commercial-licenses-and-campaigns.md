---
id: commercial-licenses-and-campaigns
---

# Licencias comerciales y campañas

Las marcas y organizaciones requieren licencias comerciales o un plan Enterprise para el uso público de los proyectos de 8th Wall. Las agencias y estudios del plan Pro deben adquirir licencias comerciales por proyecto en nombre de sus clientes. [Más información](https://www.8thwall.com/pricing)

## Adquirir licencia comercial {#purchase-commercial-license}

**Nota**: Las licencias comerciales, por defecto, se **ejecutarán indefinidamente y se renovarán automáticamente** cada periodo de facturación hasta que las canceles o programes una fecha de finalización. Una vez adquirida, la [configuración de la duración de la licencia](/legacy/guides/projects/commercial-licenses-and-campaigns/#campaign-duration) puede gestionarse desde la página Panel de control del proyecto en cuestión.

1. Ir a la página del Cuadro de mandos del proyecto
2. Cambie el tipo de proyecto a "Comercial" si aún no lo es.
3. Haga clic en "Comprar licencia".

![PurchaseCommercialLicense](/images/console-appkey-project-purchase-license.jpg)

Siga las instrucciones del asistente y adquiera la licencia comercial deseada:

1. Seleccione Acuerdo comercial (y acepte la licencia comercial, si es necesario)
2. Seleccione el periodo de facturación. Puede elegir entre las siguientes opciones:
   - **Mensual**: La licencia se renueva automáticamente cada mes.
   - **Trimestral**: La licencia se renueva automáticamente cada 3 meses.
   - **Semestral**: La licencia se renueva automáticamente cada 6 meses.
   - **Anual**: La licencia se renueva automáticamente cada 12 meses.
3. Seleccione la forma de pago.
4. Revise "Total a pagar hoy" y comprenda cuándo se producirá el próximo cargo automático.
5. Haga clic en "Completar compra".

![PurchaseCommercialLicense2](/images/console-appkey-project-purchase-license2.jpg)

## Reactivar licencia comercial {#reactivate-commercial-license}

Cuando una licencia comercial se cancela o alcanza una fecha de finalización programada, la facturación se detiene y el proyecto deja de ser accesible.

Para relanzar un proyecto y adquirir una nueva licencia comercial, siga una de estas opciones:

**De la página Espacio de trabajo**:

1. En la página Espacio de trabajo, seleccione la pestaña **Proyectos finalizados**.
2. Localice el proyecto que desea reactivar.
3. Haga clic en el menú "..." y seleccione **Reactivar licencia comercial** en el menú desplegable.
4. Complete el asistente [Adquirir licencia comercial](#purchase-commercial-license) para adquirir una nueva licencia y reactivar el proyecto.

![ReactivateCommercialLicenseWorkspace](/images/completed-project-reactivate-workspace.jpg)

**Del Cuadro de Mando del Proyecto**:

1. En la página Espacio de trabajo, seleccione la pestaña **Proyectos finalizados**.
2. Seleccione el proyecto deseado para navegar a la página del panel de control del proyecto.
3. Haga clic en "Reactivar licencia".
4. Complete el asistente [Adquirir licencia comercial](#purchase-commercial-license) para adquirir una nueva licencia y reactivar el proyecto.

![ReactivateCommercialLicenseProjDashboard](/images/completed-project-reactivate-project-dashboard.jpg)

## Duración de la campaña {#campaign-duration}

Las licencias comerciales, por defecto, se **ejecutarán indefinidamente y se renovarán automáticamente** cada periodo de facturación hasta que las cancele o programe una fecha de finalización. Al finalizar una campaña se cancelará la licencia comercial y se desactivará el proyecto WebAR.

La configuración de la duración de la campaña puede gestionarse desde el panel de control del proyecto. Existen las siguientes opciones:

- **En curso**: El proyecto funcionará indefinidamente y su licencia comercial se renovará automáticamente cada mes. Aparecerá la fecha/hora de la próxima renovación.
- **Finalizar después del ciclo de facturación actual**:  La campaña se ejecutará durante el periodo de facturación actual y, a continuación, finalizará.
- **Programar una fecha y hora de finalización**: Seleccione una fecha y hora personalizadas para que finalice la campaña.

Para modificar la duración de la campaña:

1. Vaya al panel de control de su proyecto.
2. En la casilla "Duración del proyecto", haga clic en "Editar":

![project-duration](/images/console-project-duration.jpg)

3. Establezca la fecha de finalización de licencia deseada y haga clic en "Actualizar" para guardar los cambios:

![project-duration-edit](/images/console-project-duration-edit.jpg)

Para cancelar la campaña inmediatamente, visite la página Cuenta del espacio de trabajo y
[gestionar licencias comerciales](/legacy/guides/account-settings/#manage-commercial-licenses).

## URL de redirección de campaña {#campaign-redirect-url}

Cuando se cancela o finaliza un proyecto iniciado, el proyecto WebAR ya no puede visualizarse.  Los usuarios de
que visiten el sitio verán un mensaje de error indicando que el proyecto ya no está disponible.  Es
una buena práctica para redirigir a los usuarios a otra URL una vez que su campaña ha terminado.

Especifique una URL de redirección de campaña para redirigir automáticamente a sus usuarios a un sitio diferente cuando su campaña
haya finalizado.

Las URL de redirección de campaña son compatibles tanto con los proyectos alojados en 8th Wall como con los autoalojados.

En el panel de control del proyecto, haga clic en "Conectar una URL" e introduzca la URL de redirección deseada.
