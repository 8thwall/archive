---
sidebar_position: 2
---

# Ubicaciones de VPS

## Gestión de ubicaciones {#managing-locations}

Se puede acceder al navegador geoespacial desde el proyecto seleccionando el icono del mapa en el menú de la izquierda de
(marcado como nº 1 en la imagen siguiente). En esta página encontrará una vista de mapa (#2)
que puede utilizar para buscar ubicaciones activadas por VPS. Al seleccionar una ubicación
activada por VPS se mostrará la malla 3D de la ubicación (#3) para que pueda verificar que ha seleccionado la
ubicación correcta y añadirla a su proyecto (#4).

![ConsoleGSB](/images/console-geospatial-browser.jpg)

Cuando añada una Ubicación activada por VPS a su proyecto, verá la Ubicación en la tabla "Ubicaciones del Proyecto
" en el Navegador Geoespacial (anotada como #1 en la imagen de abajo). Una vez que tenga una
Ubicación en la tabla "Ubicaciones del proyecto" puede utilizar el botón "Descargar" (#2) para descargar una versión GLB o
OBJ (conmutador mostrado como #3) de la malla 3D y abrirla en aplicaciones de software 3D de terceros,
como Blender, o importarla directamente a su proyecto 8th Wall. Cuando haga referencia a Ubicaciones en
su código de proyecto tendrá que copiar el campo "Nombre" (#4) de la tabla "Ubicaciones del proyecto".

![ConsoleGSBManageWayspots](/images/console-geospatial-browser-manage-wayspots.jpg)

Si la ubicación que desea utilizar en su proyecto no está disponible como Ubicación VPS, puede crear
la ubicación siguiendo las instrucciones de la sección
[Crear nueva ubicación](#create-new-location).

## Crear nueva ubicación {#create-new-location}

1. Haga clic en un punto abierto del mapa para seleccionar dónde desea crear una nueva Ubicación VPS. Consulte
   [Requisitos de la Ubicación VPS](#location-requirements) para obtener más información sobre cómo elegir un buen lugar para
   crear una Ubicación VPS.

![ConsoleCreateWayspot](/images/console-create-wayspot.png)

2. Los espacios de trabajo de los planes `Pro` o `Enterprise` tendrán la opción de **Crear ubicación pública** o
   **Crear ubicación privada**. Las Ubicaciones Públicas son accesibles para todos los desarrolladores y personas que utilicen
   sus proyectos, mientras que las Ubicaciones Privadas sólo serán visibles y accesibles para tu espacio de trabajo y
   sus proyectos. Crear una Ubicación Pública es la opción correcta para la mayoría de los proyectos; Ubicaciones Privadas
   es una característica premium para desarrolladores que necesitan crear experiencias especiales de VPS
   de acceso controlado o temporales. Haga clic en el botón **Crear ubicación pública** o en el botón **Crear ubicación privada**
   para iniciar el proceso de creación de la ubicación.

3. **Comprobar si hay duplicados**: Antes de crear una nueva Ubicación, es necesario que compruebe que su Ubicación
   no existe ya. Compare su Ubicación deseada con otras que ya estén en el mapa para asegurarse
   de que no está creando un duplicado. Si no se trata de una Ubicación duplicada, debe marcar la casilla **Mi
   Ubicación no es un duplicado** y hacer clic en el botón **Siguiente** para continuar.

![ConsoleCreateWayspotNoDuplicate](/images/console-create-wayspot-nodupe.png)

4. **Añadir información de localización**: Los metadatos de localización serán visibles para los desarrolladores que utilicen el navegador geoespacial
   y podrán ser visibles para los usuarios finales. Recuerda que el equipo de Confianza y Seguridad de Niantic utiliza
   la información que proporcionas para determinar si la Ubicación cumple nuestros criterios para hacerse pública
   disponible. Una vez que haya añadido la siguiente información para la Ubicación que está intentando crear,
   haga clic en el botón **Submit**:

- Título (125 caracteres)
- Descripción (250 caracteres)
- Categoría (1 o más)
- Imagen (si está disponible)

5. Su ubicación debería añadirse inmediatamente a la pestaña de envíos de ubicaciones del navegador geoespacial
   con su tipo ("Público" o "Privado") y el estado ("No activado"). Estará disponible
   para su escaneo en unos minutos y se podrá solicitar la activación del VPS una vez que esté completamente escaneado.

## Requisitos de localización {#location-requirements}

A la hora de elegir cualquier ubicación para su uso con VPS, tenga en cuenta lo siguiente:

- VPS funciona mejor en lugares que son distintos y consistentes en apariencia (por ejemplo, una playa de arena o
  un espacio de patio lleno de gente con muebles móviles no funcionará bien).
- No se recomiendan las ubicaciones dominadas por elementos reflectantes o transparentes (por ejemplo, ventanas y espejos)
  .
- Cuanto mayor sea la experiencia, más escaneado tendrá que hacer para capturar el espacio; el tamaño máximo recomendado actualmente en
  para una experiencia VPS es de 400 m^2 (20 x 20 m), aunque se pueden soportar experiencias mayores en
  con un escaneado cuidadoso.

### Requisitos de ubicación pública {#public-location-requirements}

**Las ubicaciones públicas** son accesibles a todos los desarrolladores y personas que utilizan sus proyectos y aplicaciones. Cuando
añada una nueva Ubicación Pública, tenga en cuenta las siguientes directrices:

- Los Lugares Públicos deben ser lugares u objetos físicos permanentes, tangibles e identificables.
- Las ubicaciones públicas deben ser seguras y accesibles al público peatonal.
- Asegúrese de incluir información precisa en el título, la descripción y la foto para ayudar a sus usuarios
  a encontrar la ubicación.

### Requisitos para la ubicación privada {#private-location-requirements}

**Localizaciones Privadas** son una característica premium para desarrolladores que necesitan crear experiencias VPS especiales
de acceso controlado o temporales. Sólo son visibles y accesibles para el espacio de trabajo
que los creó. Al crear una nueva Ubicación Privada, tenga en cuenta lo siguiente:

- Las Ubicaciones Privadas sólo pueden ser descubiertas por el espacio de trabajo que las creó, por lo que sólo pueden ser exploradas y localizadas en
  por los miembros y usuarios de los proyectos de ese espacio de trabajo.
- Las ubicaciones privadas son una buena opción si va a construir una experiencia especial de acceso controlado
  (por ejemplo, en su propiedad privada o en la de su cliente).
- Las ubicaciones privadas también son una opción si está creando una experiencia en un lugar público que
  tiene temporalmente un aspecto diferente (por ejemplo, un concierto, una exposición en un museo u otro evento especial).

## Ubicación Cantidades {#location-quantities}

No hay límite en el número de ubicaciones que pueden asociarse a un proyecto de 8th Wall.
Las ubicaciones se localizan en el servidor a través del servicio VPS.

## Tipos de ubicación {#location-types}

En el Navegador Geoespacial, verá cuatro tipos diferentes de Ubicaciones:

| Tipo      | Icono                                            | Descripción                                                                                                                                                                                                                                                                                                                                 |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Público   | ![WSPublic](/images/wayspot-type-public.png)     | Las ubicaciones "públicas" han sido aprobadas por el equipo de confianza y seguridad de Niantic y han cumplido los criterios de seguridad y accesibilidad pública requeridos. Estas Ubicaciones pueden utilizarse en proyectos publicados.                                                                  |
| Pendiente | ![WSPending](/images/wayspot-type-pending.png)   | "Pendientes" Las ubicaciones están siendo revisadas por el equipo de Confianza y Seguridad de Niantic para determinar si cumplen los criterios requeridos de seguridad y accesibilidad pública. \*\*Las ubicaciones pendientes pueden escanearse y activarse mientras se espera a que finalice la revisión. |
| Rechazado | ![WSRejected](/images/wayspot-type-rejected.png) | Las Ubicaciones "Rechazadas" pueden no haber superado la revisión de Confianza y Seguridad de Niantic, ser un duplicado de una Ubicación existente o previamente rechazada, o no estar permitidas por Niantic por otro motivo. Estas ubicaciones no pueden añadirse a los proyectos.                        |
| Prueba    | ![WSTest](/images/wayspot-type-private.png)      | "Solo podrás acceder a las ubicaciones de prueba desde tu espacio de trabajo si escaneas la ubicación con la aplicación Wayfarer de Niantic. Las ubicaciones de prueba están pensadas para su uso durante el desarrollo y no pueden incluirse en un proyecto publicado.                                     |

Para preguntas o problemas relacionados con la creación de Ubicaciones VPS, o para comprobar el estado de las Ubicaciones existentes y ya existentes, póngase en contacto con [support@lightship.dev](mailto://support@lightship.dev)

## Ubicación Estado {#location-status}

En el Navegador Geoespacial, verá cinco estados diferentes para las Ubicaciones VPS:

| Estado      | Icono                                                       | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No activado | ![WSNotActivated](/images/wayspot-status-not-activated.png) | Las ubicaciones con el estado "No activado" no han recibido ninguna exploración. Para poder solicitar la activación, es necesario enviar un mínimo de 10 escaneos viables de la ubicación. Después de enviar un escaneado, el estado de la ubicación cambiará a "Escaneando".                                                                                                                                                                    |
| Escaneado   | ![WSScanning](/images/wayspot-status-scanning.png)          | Las ubicaciones con el estado "Escaneando" han recibido al menos un escaneado. Para poder solicitar la activación, es necesario enviar un mínimo de 10 escaneos viables de la ubicación.                                                                                                                                                                                                                                                                         |
| Tratamiento | ![WSProcessing](/images/wayspot-status-processing.png)      | Las ubicaciones con el estado "En proceso" han recibido una solicitud de activación y mostrarán el estado "En proceso" hasta que el proceso de activación haya finalizado. \*\*Normalmente, una solicitud de activación se completa en 4 horas. Recibirás un correo electrónico cuando el proceso haya finalizado.                                                                                                                               |
| Activo      | ![WSActive](/images/wayspot-status-active.png)              | Las ubicaciones con un estado "Activo" están disponibles para ser utilizadas en proyectos para crear contenido WebAR utilizando VPS para Web.                                                                                                                                                                                                                                                                                                                                    |
| Fallido     | ![WSFailed](/images/wayspot-status-failed.png)              | Las ubicaciones con el estado "Fallido" han encontrado un problema durante el proceso de activación. Esto puede deberse a varios factores, como la inadecuación de la ubicación para el VPS, escaneos insuficientes o datos corruptos. Desafortunadamente esto significa que esta Ubicación no puede ser usada para crear contenido WebAR usando VPS. Le animamos a que busque una nueva ubicación para su proyecto del 8º Muro. |

Si tiene preguntas o problemas relacionados con la exploración de ubicaciones, la activación o el estado, póngase en contacto con [support@lightship.dev](mailto://support@lightship.dev)

## Ubicación Calidad {#location-quality}

Una vez que se ha activado el VPS de una ubicación, Niantic proporciona una calificación de calidad en el navegador geoespacial.
Los detalles de la ubicación muestran _Calidad regular_ o _Calidad buena_.

La calidad de localización se refiere a la capacidad de localización de la ubicación en cualquier momento. Las ubicaciones con varios escaneos
en todo tipo de iluminación tienden a tener una mayor calidad. Las ubicaciones con un mínimo de escaneos requeridos o una
mayoría de escaneos en un tipo de iluminación tienden a tener una calidad inferior.

La calificación de la calidad es un proceso automatizado y puede no reflejar el rendimiento real de la Ubicación.
La mejor manera de determinar la calidad es probarlo uno mismo.

## Ubicación Alineación {#location-alignment}

La advertencia de no alineado puede ocurrir por varias razones y significa que la localización contra la malla no puede
ser garantizada. Aunque la malla puede funcionar bien para la localización, la advertencia indica que la malla es
experimental y debe utilizarse bajo su propia responsabilidad.

Nota: Todas las exploraciones de **prueba** están desalineadas.

## Ubicación Eventos {#location-events}

8th Wall emite eventos en distintas fases del ciclo de vida de la ubicación del proyecto (por ejemplo, escaneado, encontrado,
actualizado, perdido, etc.). Consulte la referencia de la API para obtener instrucciones específicas sobre la gestión de estos eventos
en su aplicación web:

- [Eventos AFrame](/legacy/api/aframeevents)
- [Eventos PlayCanvas](/legacy/api/playcanvasevents/playcanvas-image-target-events)
- [Eventos despachados XrController](/legacy/api/xrcontroller/pipelinemodule/#dispatched-events)

## Escaneos de prueba {#test-scans}

Las exploraciones de prueba son una malla única, disponible para un solo espacio de trabajo, para desarrollar y probar experiencias VPS
. Aunque las exploraciones de prueba son una gran solución para desarrollar y probar experiencias VPS
mientras se nomina o activa una Ubicación pública, no están autorizadas para su uso en proyectos publicados de
.

Las exploraciones de prueba se crean con la aplicación Niantic Wayfarer. Asegúrate de haber iniciado sesión en Wayfarer con las credenciales de
8th Wall y de haber seleccionado el espacio de trabajo correcto en la página Perfil. La prueba de escaneado
sólo estará disponible en el espacio de trabajo 8th Wall seleccionado en el momento de escanear y cargar
. Las exploraciones no se pueden mover a otro espacio de trabajo o cuenta de Lightship.

En la aplicación Wayfarer, selecciona _Escanear_ y [haz un escaneo del área](/legacy/guides/lightship-vps#using-niantic-wayfarer).

Las exploraciones de prueba deben durar 60 segundos o menos; cada 60 segundos se genera una nueva malla, por lo que la exploración de
durante 120 segundos dará lugar a 2 exploraciones de prueba. Todas las exploraciones de prueba son
[unaligned](#location-alignment).

Una vez procesada, puede previsualizar la malla y añadirla a su proyecto desde la pestaña _Test Scans_ del navegador geoespacial
.

![Test scans tab](/images/private-scans-tab.jpg)

Si el escaneado de prueba no se procesa, es posible que tenga que volver a escanear. Póngase en contacto con
[support@lightship.dev](mailto://support@lightship.dev) para obtener más información.
