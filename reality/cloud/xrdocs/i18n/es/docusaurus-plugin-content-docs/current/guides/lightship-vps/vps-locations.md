---
sidebar_position: 2
---

# VPS Locations

## Gestión de ubicaciones {#managing-locations}

Puede acceder al Navegador Geoespacial desde su proyecto seleccionando el icono del mapa en el menú de la izquierda
(marcado como nº 1 en la imagen de abajo). En esta página encontrará una vista de mapa (#2)
que puede utilizar para buscar ubicaciones activadas por VPS. Al seleccionar una ubicación
activada por VPS, se mostrará la malla 3D de la ubicación (#3) para que pueda verificar que ha seleccionado la ubicación
correcta y añadirla a su proyecto (#4).

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

1. Click on an open spot on the map to select where you’d like to create a new VPS Location. See
   [VPS Location Requirements](#location-requirements) to learn more about choosing a good spot to
   create a VPS Location.

![ConsoleCreateWayspot](/images/console-create-wayspot.png)

2. Workspaces on `Pro` or `Enterprise` plans will have the option to **Create Public Location** or
   **Create Private Location**. Public Locations are accessible to all developers and people using
   their projects, while Private Locations will only be visible and accessible to your workspace and
   its projects. Creating a Public Location is the correct choice for most projects; Private Locations
   are a premium feature for developers that need to create special access-controlled or temporary VPS
   experiences. Click either the **Create Public Location** or the **Create Private Location** button
   to start the location creation process.

3. **Comprobar si hay duplicados**: Antes de crear una nueva Ubicación, es necesario que compruebe que su Ubicación
   no existe ya. Compare your desired Location to others already on the map to ensure
   that you are not creating a duplicate. If this is not a duplicate Location, you must check the **My
   Location is not a duplicate** box and click on the **Next** button to continue.

![ConsoleCreateWayspotNoDuplicate](/images/console-create-wayspot-nodupe.png)

4. **Add Location Information**: Location metadata will be visible to developers using the
   Geospatial Browser and can be visible to end-users. Remember that Niantic's Trust & Safety team uses
   the information you provide to determine whether the Location meets our criteria to be made publicly
   available. Once you have added the following information for the Location you are trying to create,
   click on the **Submit** button:

- Título (125 caracteres)
- Descripción (250 caracteres)
- Categoría (1 o más)
- Imagen (si está disponible)

5. Your location should immediately be added to your Location Submissions tab in the Geospatial
   Browser with its type ("Public" or "Private") and the status ("Not Activated"). It will be available
   for scanning within a few minutes and VPS activation can be requested once it's fully scanned.

## Requisitos de localización {#location-requirements}

When choosing any location for use with VPS, please consider the following:

- VPS works best at locations that are distinct and consistent in appearance (e.g. a sandy beach or
  a crowded patio space with moveable furniture will not work well).
- Locations that are dominated by reflective or transparent features (e.g. windows and mirrors) are
  not recommended.
- The larger the experience, the more scanning you will need to do to capture the space; the maximum
  recommended size for a VPS experience today is 400 m^2 (20 x 20 m), though larger experiences can be
  supported with careful scanning.

### Public Location Requirements {#public-location-requirements}

**Public Locations** are accessible to all developers and people using their projects and apps. When
adding a new Public Location, please consider the following guidelines:

- Public Locations should be permanent physical, tangible, and identifiable places or objects.
- Public Locations should be safe and publicly accessible by pedestrians.
- Make sure to include accurate information in the title, description, and photo to help your users
  find the location.

### Private Location Requirements {#private-location-requirements}

**Private Locations** are a premium feature for developers that need to create special
access-controlled or temporary VPS experiences. They are only visible and accessible to the
workspace that created them. When creating a new Private Location, please consider the following:

- Private Locations are only discoverable by the workspace that created them, so they can only be
  scanned and localized against by members and users of that workspace's projects.
- Private Locations are a good choice if you are building a special access-controlled experience
  (e.g. on your or your client's private property).
- Private Locations are also an option if you're building an experience in a public location that
  temporarily has a different appearance (e.g. a concert, museum exhibition, or other special event).

## Ubicación Cantidades {#location-quantities}

No hay límite en el número de ubicaciones que pueden asociarse a un proyecto de 8th Wall.
Las ubicaciones se localizan en el servidor a través del servicio VPS.

## Tipos de ubicación {#location-types}

En el Navegador Geoespacial, verá cuatro tipos diferentes de Ubicaciones:

| Tipo      | Icono                                            | Descripción                                                                                                                                                                                                                                                                                                                                 |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Público   | ![WSPublic](/images/wayspot-type-public.png)     | Las ubicaciones "públicas" han sido aprobadas por el equipo de confianza y seguridad de Niantic y han cumplido los criterios de seguridad y accesibilidad pública requeridos. Estas Ubicaciones pueden utilizarse en proyectos publicados.                                                                  |
| Pendiente | ![WSPending](/images/wayspot-type-pending.png)   | "Pendientes" Las ubicaciones están siendo revisadas por el equipo de Confianza y Seguridad de Niantic para determinar si cumplen los criterios requeridos de seguridad y accesibilidad pública. \*\*Las ubicaciones pendientes pueden escanearse y activarse mientras se espera a que finalice la revisión. |
| Rechazado | ![WSRejected](/images/wayspot-type-rejected.png) | Las Ubicaciones "Rechazadas" pueden no haber superado la revisión de Confianza y Seguridad de Niantic, ser un duplicado de una Ubicación existente o previamente rechazada, o no estar permitidas por Niantic por otro motivo. Estas Ubicaciones no pueden añadirse a los proyectos.                        |
| Prueba    | ![WSTest](/images/wayspot-type-private.png)      | "Solo podrás acceder a las ubicaciones de prueba desde tu espacio de trabajo si escaneas la ubicación con la aplicación Wayfarer de Niantic. Las ubicaciones de las pruebas están pensadas para su uso durante el desarrollo y no pueden incluirse en un proyecto publicado.                                |

Para preguntas o problemas relacionados con la creación de Ubicaciones VPS, o para comprobar el estado de las Ubicaciones existentes y ya existentes, póngase en contacto con [support@lightship.dev](mailto://support@lightship.dev)

## Ubicación Estado {#location-status}

En el Navegador Geoespacial, verá cinco estados diferentes para las Ubicaciones VPS:

| Estado      | Icono                                                       | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No activado | ![WSNotActivated](/images/wayspot-status-not-activated.png) | Las ubicaciones con el estado "No activado" no han recibido ninguna exploración. Deben enviarse un mínimo de 10 escaneos viables para la ubicación antes de que pueda solicitar la activación. Después de enviar un escaneado, el estado de la ubicación cambiará a "Escaneando".                                                                                                                                                                |
| Escaneando  | ![WSScanning](/images/wayspot-status-scanning.png)          | Las ubicaciones con el estado "Escaneando" han recibido al menos un escaneado. Deben enviarse un mínimo de 10 escaneos viables para la ubicación antes de que pueda solicitar la activación.                                                                                                                                                                                                                                                                     |
| Procesando  | ![WSProcessing](/images/wayspot-status-processing.png)      | Las ubicaciones con el estado "En proceso" han recibido una solicitud de activación y mostrarán el estado "En proceso" hasta que el proceso de activación haya finalizado. **Normalmente, una solicitud de activación se completa en 4 horas. Recibirá un correo electrónico cuando se complete el proceso.**                                                                                                                                    |
| Activo      | ![WSActive](/images/wayspot-status-active.png)              | Las ubicaciones con un estado "Activo" están disponibles para ser utilizadas en proyectos para crear contenido WebAR utilizando VPS para Web.                                                                                                                                                                                                                                                                                                                                    |
| Fallado     | ![WSFailed](/images/wayspot-status-failed.png)              | Las ubicaciones con el estado "Fallido" han encontrado un problema durante el proceso de activación. Esto puede deberse a varios factores, como la inadecuación de la ubicación para el VPS, escaneos insuficientes o datos corruptos. Desafortunadamente esto significa que esta Ubicación no puede ser usada para crear contenido WebAR usando VPS. Le animamos a que busque una nueva ubicación para su proyecto del 8º Muro. |

Si tiene preguntas o problemas relacionados con la exploración de ubicaciones, la activación o el estado, póngase en contacto con [support@lightship.dev](mailto://support@lightship.dev)

## Ubicación Calidad {#location-quality}

Una vez que se ha activado el VPS de una ubicación, Niantic proporciona una calificación de calidad en el navegador geoespacial.
Los detalles de la ubicación muestran _Calidad regular_ o _Calidad buena_.

La calidad de localización se refiere a la capacidad de localización de la ubicación en cualquier momento. Las ubicaciones con varios escaneos
en todo tipo de iluminación tienden a tener una mayor calidad. Las ubicaciones con un mínimo de escaneos requeridos o una
mayoría de escaneos en un tipo de iluminación tienden a tener una calidad inferior.

La calificación de la calidad es un proceso automatizado y puede no reflejar el rendimiento real de la Ubicación.
La mejor forma de determinar la calidad es probarlo usted mismo.

## Ubicación Alineación {#location-alignment}

El aviso de no alineado puede ocurrir por varias razones y significa que no se puede garantizar la localización
con la malla. Aunque la malla puede funcionar bien para la localización, la advertencia indica que la malla es
experimental y debe utilizarse bajo su propia responsabilidad.

Nota: Todos los escaneos de **prueba** están desalineados.

## Ubicación Eventos {#location-events}

8th Wall emite eventos en distintas fases del ciclo de vida de la ubicación del proyecto (por ejemplo, escaneado, encontrado,
actualizado, perdido, etc.). Consulte la referencia de la API para obtener instrucciones específicas sobre el manejo de estos eventos
en su aplicación web:

- [Eventos AFrame](/api/aframeevents)
- [Eventos PlayCanvas](/api/playcanvasevents/playcanvas-image-target-events)
- [Eventos enviados por XrController](/api/xrcontroller/pipelinemodule/#dispatched-events)

## Escaneos de prueba {#test-scans}

Los escaneos de prueba son una malla única, disponible para un solo espacio de trabajo, para desarrollar y probar experiencias
de VPS. Aunque las exploraciones de prueba son una gran solución para desarrollar y probar experiencias VPS
mientras se nomina o activa una Ubicación pública, no están autorizadas para su uso en proyectos publicados de
.

Los escaneos de prueba se crean con la aplicación Niantic Wayfarer. Asegúrase de que ha iniciado sesión en Wayfarer utilizando las credenciales de
8th Wall y de que ha seleccionado el área de trabajo correcta en la página de perfil. El escaneo de prueba
solo estará disponible en el espacio de trabajo de 8th Wall seleccionado en el momento de escanear
y subir. Los escaneos no se pueden mover a un área de trabajo o cuenta Lightship diferente.

En la aplicación Wayfarer, seleccione _Escanear_ y [haga un escaneado de la zona](#using-niantic-wayfarer).

Los escaneos de prueba deben durar 60 segundos o menos; cada 60 segundos se genera una nueva malla, por lo que el escaneo
durante 120 segundos dará como resultado 2 escaneos de prueba. Todas las exploraciones de prueba son
[unaligned](#location-alignment).

Una vez procesada, puede previsualizar la malla y agregarla a su proyecto desde la pestaña
_Escaneos de prueba_ del navegador geoespacial.

![Pestaña Escaneos de prueba](/images/private-scans-tab.jpg)

Si el escaneo de prueba no se procesa, es posible que tenga que volver a escanear. Póngase en contacto con
[support@lightship.dev](mailto://support@lightship.dev) para obtener más información.
