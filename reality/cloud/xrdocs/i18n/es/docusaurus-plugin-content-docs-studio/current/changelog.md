---
id: release-notes
sidebar_position: 999
toc_max_heading_level: 2
latest_popup_id: más reciente
runtime_version_2025_10_24: 2.2.0
runtime_version_2025_10_16: 2.1.0
runtime_version_2025_10_10: 2.0.1
runtime_version_2025_09_25: 2.0.1
runtime_version_2025_09_17: 2.0.0
runtime_version_2025_09_09: 2.0.0
runtime_version_2025_08_29: 1.1.0
runtime_version_2025_08_19: 1.0.0
runtime_version_2025_08_06: 1.0.0
---

# Notas de publicación

<style> p:has(+ ul) {margin-bottom: 0 !important}</style>

## Octubre de 2025 [Actualización 3] {#version-2025-october-24}

24 de octubre de 2025

### Nuevas funciones

La versión Runtime 2.2.0 añade desplazamientos rotacionales al colisionador de física y otras correcciones y mejoras. Lea las notas de la versión completa de
[aquí](/api/studio/changelog/#2.2.0).

## Octubre de 2025 [Actualización 2] {#version-2025-october-16}

16 de octubre de 2025

### Nuevas funciones

Runtime 2.1.0 introduce una API para skybox y niebla, y otras correcciones/mejoras. Lea las notas de la versión completa de
[aquí](/api/studio/changelog/#2.1.0).

## Octubre de 2025 [Actualización 1] {#version-2025-october-10}

10 de octubre de 2025

### Nuevas funciones

Aplicación de escritorio

- Se ha añadido compatibilidad con Windows. Descargar [aquí](https://www.8thwall.com/download).

Exportación de aplicaciones nativas

- Se han añadido opciones de incrustación de iFrame con un fragmento de código copiable en el flujo de publicación. Más información [aquí](https://www.8thwall.com/blog/post/196857049250/embedding-made-easy-iframe-support-in-8th-walls-publish-flow).

### Correcciones y mejoras

Aplicación de escritorio

- Se ha solucionado un problema por el que la aplicación de escritorio de 8th Wall en Mac a veces se bloqueaba en la reproducción inicial.
- La aplicación de escritorio ahora admite traducciones basadas en las preferencias de idioma del usuario.

Exportación de aplicaciones nativas

- Se ha introducido una opción de configuración para incluir o eliminar la barra de estado en las compilaciones de exportación de aplicaciones nativas de iOS.

General

- Los archivos Markdown se abrirán por defecto en modo de vista previa (Studio Web)

## Septiembre de 2025 [Actualización 3] {#version-2025-september-25}

25 de septiembre de 2025

### Correcciones y mejoras

Física

- Se ha solucionado un problema que impedía que los objetos dinámicos alcanzaran el reposo completo.
- Corregido el fallo tras cambios repetidos de escala del colisionador

Partículas

- Corregidas direcciones de emisión incorrectas
- Los efectos de partículas son independientes de la velocidad de fotogramas.

Aplicación de escritorio

- Mayor fiabilidad del simulador

INTERFAZ DE USUARIO

- Se ha corregido un problema que provocaba la colocación incorrecta del desplazamiento en los elementos de la interfaz de usuario.

## Septiembre de 2025 [Actualización 2] {#version-2025-september-17}

17 de septiembre de 2025

### Nuevas funciones

Aplicación de escritorio

- [La aplicación de escritorio de 8th Wall está aquí](http://8th.io/desktopappblog). Ya en beta pública para macOS, y próximamente para Windows, la aplicación de escritorio combina la velocidad del desarrollo local con la colaboración en la nube. [Más información](https://www.8thwall.com/docs/studio/app/) y [descargar ahora](https://www.8thwall.com/download).

![](/images/studio/app/hub.jpg)

## Septiembre de 2025 [Actualización 1] {#version-2025-september-9}

9 de septiembre de 2025

### Nuevas funciones

Mejora de la física

- El nuevo Studio Runtime 2.0.0 viene con un [motor de física reconstruido](https://8th.io/v2update) más rápido, fluido y preparado para lo que le eches.
- Algunos comportamientos físicos son diferentes como resultado de propiedades como Fricción, Restitución y Amortiguación. Consulte la [guía de actualización](https://8th.io/v2upgradeguide) para pasar sin problemas a la versión 2.0.
- Colisionadores cinemáticos: Añadida la opción Cinemática a los tipos de Colisionadores. Permite que los objetos tengan un movimiento animado o programado, al tiempo que permite interacciones de colisión física.

Exportación de aplicaciones nativas

- Exporte su experiencia 3D o XR como una aplicación iOS y aumente su alcance publicando tanto en la web como en la tienda de aplicaciones iOS.

### Correcciones y mejoras

Prefabricados

- Se ha solucionado un problema por el que los colisionadores de los objetos prefabricados anidados no se generaban correctamente.

Exportación de aplicaciones nativas

- Se ha actualizado el objetivo del SDK de Android para la exportación de aplicaciones nativas de Android del nivel de API 34 al nivel de API 36 para garantizar el cumplimiento de los requisitos de distribución de Google Play (las aplicaciones deben tener como objetivo el nivel de API 35+).
- Se ha corregido un problema por el que los efectos de partículas y las fuentes personalizadas no se mostraban correctamente en el modo de compilación Static Bundle para la exportación de aplicaciones nativas de Android.

General

- Se ha actualizado el comportamiento de la reproducción automática de vídeos para que los vídeos con audio se reproduzcan automáticamente silenciados. El audio del vídeo se desactivará automáticamente cuando se produzca una interacción con el usuario.
- Se ha activado una comprobación más estricta de la tipografía en tiempo de compilación para mejorar la notificación de errores.
- Ahora, en Studio, recibirás automáticamente notificaciones de las nuevas actualizaciones.

## Agosto de 2025 [Actualización 3] {#version-2025-august-29}

29 de agosto de 2025

### Nuevas funciones

Control de versiones en tiempo de ejecución

- Los proyectos de Studio pueden ejecutarse en una versión específica, que puede actualizarse en Configuración. Vincule su proyecto a un tiempo de ejecución fijo para mayor previsibilidad, u opte por actualizaciones menores y correcciones de errores automáticas para mantenerse siempre al día.

### Correcciones y mejoras

Laboratorio de activos

- Los pasos previos de generación de activos ahora se rellenan al enviar activos desde la biblioteca para generar flujos de trabajo.
- Reintentar varios ángulos multivista a la vez durante el paso de generación de imágenes para los flujos de trabajo de modelos 3D y personajes animados.

Cara

- Arreglado que la malla de la cara no se renderizara como estaba configurada con la cámara Face AR.

Física

- Corregida una forma corrupta que se aplicaba a los autocolisionadores.

## Agosto de 2025 [Actualización 2] {#version-2025-august-19}

19 de agosto de 2025

### Nuevas funciones

Facturación

- Añadidas recargas de saldo únicas

General

- Widget de vista previa de la cámara

### Correcciones y mejoras

Facturación

- Se ha añadido el portal de facturación Stripe para gestionar las suscripciones, la información de facturación y las facturas.

Objetivos de imagen

- Se ha corregido un problema que impedía actualizar los objetivos de imágenes curvas.

Laboratorio de activos

- Permite volver a generar una sola imagen durante la generación de imágenes multivista para flujos de trabajo de modelos 3D y personajes animados.

General

- Se ha corregido un problema que impedía a algunos usuarios registrarse en Google.

## Agosto de 2025 [Actualización 1] {#version-2025-august-6}

6 de agosto de 2025

### Correcciones y mejoras

General

- Mejora de la facilidad de uso y la organización del componente de cámara.
- Se ha solucionado un problema por el que la niebla no aparecía cuando estaba activada en el configurador.
- Se ha solucionado un problema de bloqueo del puntero del ratón que afectaba al componente Fly Controls de Studio.

Laboratorio de activos

- Se ha añadido soporte de interfaz de usuario para la opacidad del fondo de las imágenes generadas con Image-GPT-1.

Elementos de interfaz de usuario

- Arreglado el artefacto que aparecía en elementos de interfaz de usuario con imágenes transparentes en algunos dispositivos iOS
  Particles
- Corregidas las partículas GLTF que no mostraban
  Prefabs
- Arreglar las actualizaciones del colisionador infantil prefabricado

## Julio de 2025 [Actualización 4] {#version-2025-july-29}

29 de julio de 2025

### Nuevas funciones

Laboratorio de activos

- Añadidos controles para optimizar los modelos 3D generados

Elementos de interfaz de usuario

- Se ha añadido la configuración del orden de apilamiento para gestionar los elementos superpuestos.

### Correcciones y mejoras

Elementos de interfaz de usuario

- Mejora de la ordenación entre elementos hermanos
- Los grupos de elementos de la interfaz de usuario se aplanan en una sola capa.

Transformaciones

- Añadido `getWorldQuaternion` y `setWorldQuaternion` a world.transform

Física

- Activado el modo de alta precisión para los colisionadores dinámicos

Materiales

- Añadido el filtrado de texturas con soporte mipmap

Splats

- Añadido soporte para spz v3

Laboratorio de activos

- Se ha añadido la opción de seleccionar activos de la biblioteca para utilizarlos como entradas en los flujos de trabajo de imágenes, modelos 3D y personajes animados.

## Julio de 2025 [Actualización 3] {#version-2025-july-22}

22 de julio de 2025

### Nuevas funciones

Gestor de entradas

- Añadida la vinculación de Pantalla Táctil al Gestor de Entradas.

### Correcciones y mejoras

Laboratorio de activos

- Se ha añadido compatibilidad con imágenes cargadas por el usuario para el flujo de trabajo de generación de modelos 3D.
- Se ha actualizado el flujo de trabajo de personajes animados para admitir generaciones de una sola imagen a 3D.
- Se ha añadido compatibilidad con modelos 3D cargados por el usuario para el flujo de trabajo de personajes animados.

XR

- Se ha solucionado un problema por el que se producía un parpadeo inicial durante los permisos de la cámara mientras se cargaban los objetos de la escena.

Exportación de aplicaciones nativas

- Se ha actualizado la cadena de agente de usuario de las aplicaciones nativas de Android para reflejar con mayor precisión la plataforma y el dispositivo.
- Se ha corregido un problema por el que los eventos táctiles se comportaban de forma inesperada en aplicaciones Android nativas.

## Julio de 2025 [Actualización 2] {#version-2025-july-15}

15 de julio de 2025

### Nuevas funciones

Espacios

- Añadida la configuración de Niebla a los Ajustes de Espacio.

### Correcciones y mejoras

Elementos de interfaz de usuario

- Añadida la opción ignoreRaycast.

Laboratorio de activos

- Se ha añadido la posibilidad de previsualizar clips de animación en el flujo de trabajo de personajes animados.

XR

- Corregido error de tecla de aplicación no válida al recargar la cámara XR.

## Julio de 2025 [Actualización 1] {#version-2025-july-07}

7 de julio de 2025

### Nuevas funciones

Laboratorio de activos

- Se ha añadido compatibilidad con el modelo de generación de imágenes 3D Hunyuan3D-2.1.
- Añadido soporte para el modelo de generación de imágenes Flux Schnell.

Exportación de aplicaciones nativas

- Compatibilidad con diversas orientaciones de dispositivos.
- Se añadieron opciones de configuración para la barra de estado del dispositivo.
- Añadido soporte para multitoque.

### Correcciones y mejoras

General

- Se ha corregido un problema en el que la cámara se centraba en los objetos en movimiento no se actualizaba correctamente.

Prefabricados

- Corrección de varios problemas de ejecución de prefabricados.
- Se ha solucionado un problema por el que los componentes prefabricados hijos no se eliminaban correctamente.
- Actualizaciones de estilo para resaltar mejor los componentes sobreescritos y los cambios.
- Se ha solucionado un problema por el que los componentes prefabricados hijos no se eliminaban correctamente.

Elementos de interfaz de usuario

- Se ha solucionado el problema de las imágenes que se estiraban cuando se establecía la opción "Contener".

Laboratorio de activos

- Corrección de los tiempos de espera de carga de las bibliotecas.

Partículas

- Problema fijo en el que las partículas se retirarían incorrectamente al uso de primitivos cubanos cuando no se establecía primitivo.

Materiales

- Mejora del rendimiento de los materiales de vídeo GLTF.

Malla

- Se ha corregido un problema en el que añadir un colisionador a ciertos BLG haría que el objeto desapareciera en la vista de Studio.

Exportación de aplicaciones nativas

- Consistencia de escalado de interfaz mejorada en aplicaciones Android.
- Se solucionaron problemas intermitentes al abrir o cerrar aplicaciones Android.

Simulador

- Se ha corregido un problema por el que el simulador se inicializaba dos veces al abrirlo.

## Junio de 2025 [Actualización 3] {#version-2025-june-11}

11 de junio de 2025

### Nuevas funciones

Laboratorio de activos

- Genera imágenes, modelos 3D y personajes animados y riggeados con nuestro nuevo Laboratorio de Activos y añádelos fácilmente a tu escena.

Exportación de aplicaciones nativas

- Exporte su experiencia 3D o XR como una aplicación Android y aumente su alcance publicando tanto en la web como en las tiendas de aplicaciones.

**Correcciones y mejoras**

General

- Se ha eliminado el ajuste opcional Live Sync para agilizar la reproducción.
- Se han actualizado los controles de reproducción y creación del estudio para facilitar su uso.

## Junio de 2025 [Actualización 2] {#version-2025-june-09}

9 de junio de 2025

### Nuevas funciones

Elementos de interfaz de usuario

- Ahora los elementos de la interfaz de usuario admiten eventos Hover.

Materiales

- Se ha añadido una API para trabajar con texturas de vídeo en tiempo de ejecución.

**Correcciones y mejoras**

Elementos de interfaz de usuario

- Se ha corregido un problema que provocaba la persistencia de elementos de la interfaz de usuario cuando se utilizaba `display: none`.

Animaciones

- Se ha corregido un error en las transiciones de las animaciones.

## Junio de 2025 [Actualización 1] {#version-2025-june-02}

2 de junio de 2025

### Nuevas funciones

Prefabricados

- Hemos añadido soporte para Prefabs en Studio para crear plantillas de juego reutilizables y personalizables que agilizan y escalan tu desarrollo, y optimizan el rendimiento.
- Consulta nuestra [Guía de prefabricados](/studio/guides/prefabs) para empezar.

General

- Ahora los vídeos son compatibles como mapas de textura de material. Nota: El nuevo VideoMaterial anulará todos los materiales glTF, como HiderMaterial y VideoMaterial.

## Mayo de 2025 [Actualización 2] {#version-2025-may-29}

29 de mayo de 2025

### Nuevas funciones

Elementos de interfaz de usuario Eventos

- Hemos introducido eventos de interfaz de usuario para trabajar elementos de interfaz de usuario como botones. (es decir Pulsado, Liberado, Seleccionado, Desactivado)
- Los eventos de interfaz de usuario ahora tienen cadenas dedicadas.
- Más información en la sección Eventos de la Documentación de la API.

Luces

- Hemos introducido un nuevo tipo de Luz llamado "Luz de área" que emite luz desde una primitiva rectangular.

### Correcciones y mejoras

Audio

- Se ha corregido un problema por el que no aparecían correctamente varias entidades de audio.

## Mayo de 2025 [Actualización 1] {#version-2025-may-05}

5 de mayo de 2025

### Nuevas funciones

Escena Reflexiones

- Se ha añadido la posibilidad de establecer un mapa de reflejos en un espacio. Este mapa de reflexión afecta a la configuración de iluminación de tu escena y altera lo que muestran los materiales reflectantes. Consulte la nueva configuración de Reflejos en el Panel de configuración del espacio.

**Correcciones y mejoras**

General

- Se ha añadido una nueva directiva "required" para que los campos de los componentes personalizados sean obligatorios. La directiva `@required` para Custom Components lanzará un error si la condición no se cumple en Build.

## Abril de 2025 [Actualización 2] {#version-2025-april-29}

29 de abril de 2025

### Nuevas funciones

Materiales

- Se ha añadido un nuevo ajuste para la envoltura de texturas en el configurador de materiales.

## Abril de 2025 [Actualización 1] {#version-2025-april-9}

9 de abril de 2025

### Nuevas funciones

Objetivos de imagen

- \*\*Los desarrolladores ahora pueden anclar el contenido de RA a imágenes del mundo real, lo que permite una nueva gama de experiencias creativas y educativas.

### Correcciones y mejoras

Entrada

- Ahora `input.getMousePosition()` devuelve `clientX/Y` en lugar de `screenX/Y` para mejorar la alineación con las coordenadas de la ventana gráfica.
- Añadido un nuevo evento `ecs.input.UI_CLICK` para mejorar el seguimiento de la interacción de la interfaz de usuario.

Transformaciones

- Añadidas funciones de utilidad de transformación a world.transform.

Raycasting

- Añadidas nuevas funciones de raycasting: `raycast()` y `raycastFrom()` para una interacción más flexible y precisa con objetos 3D.

INTERFAZ DE USUARIO

- Actualizaciones de la interfaz del sistema Studio UI para una experiencia de desarrollo más intuitiva.

General

- Se ha corregido un error por el que no se podía acceder a `world.spaces` en las llamadas de retorno de `add`.
- Se ha solucionado el problema por el que los archivos adjuntos a las orejas no aparecían en la ventana gráfica cuando estaban activados.

## Marzo de 2025 [Actualización 1] {#version-2025-March-5}

5 de marzo de 2025

### Correcciones y mejoras

General

- Se ha añadido un evento de aparición de ubicación

Sombra

- Foco de cámara de sombra inteligente

Animaciones

- Corrección de errores en las animaciones de posición/rotación
- Corregido el bloqueo de la animación al cambiar de modelo

Activos

- Se ha corregido un error por el que los ajustes quedaban obsoletos al cargar los activos.
- Se ha corregido una condición de carrera en la carga de activos de imagen de interfaz de usuario.

## Febrero de 2025 [Actualización 1] {#version-2025-february-13}

13 de febrero de 2025

### Nuevas funciones

Mapas de Niantic para la web

- Conectando experiencias con el mundo real
  Los mapas son clave para crear experiencias basadas en la localización y, ahora, con Niantic Maps para Web disponible directamente en 8th Wall Studio, añadirlos a tu flujo de trabajo es muy sencillo. Con Niantic Maps in Studio, los desarrolladores de Studio ahora tienen acceso a la misma tecnología que Niantic utiliza para impulsar nuestros juegos más populares del mundo real, lo que le permite arraigar sus experiencias de RA en ubicaciones del mundo real, ayudar a descubrir experiencias basadas en la ubicación y actuar como un agregador de experiencias de RA del mundo real. Los mapas están ahora totalmente integrados en la jerarquía de escenas de Studio, lo que te permite colocar mapas en tus proyectos con un solo clic, sin necesidad de configurar la API.

Espacios

- Spaces le ofrece ahora la posibilidad de construir y gestionar varias áreas distintas dentro de un mismo proyecto. Puedes pensar en Spaces como en escenas o entornos de otros motores de juego o herramientas de diseño. En pocas palabras, los espacios son marcos 3D en los que puedes colocar recursos, iluminación, cámaras e interacciones de juego. Un Espacio (también llamado Escena) contiene todas sus entidades.

## Enero de 2025 [Actualización 3] {#version-2025-january-31}

31 de enero de 2025

### Correcciones y mejoras

General

- Corrección de errores generales para mejorar el rendimiento de la carga de escenas, la carga de Splat y el trabajo en modo Live Sync.

## Enero de 2025 [Actualización 2] {#version-2025-january-23}

23 de enero de 2025

### Correcciones y mejoras

Elementos de interfaz de usuario

- Se ha añadido una configuración de estiramiento de 9 cortes para el tamaño del fondo (sólo elementos de interfaz de usuario 3D).
- Añadida la configuración del radio de los bordes

General

- Se ha corregido un error por el que el espacio de color no se reflejaba correctamente en los elementos de la interfaz de usuario.

Física

- Añade un conmutador para el sistema de física, saltará el sistema en cada tick, también funciona como una optimización cuando la física no está en uso.

## Enero de 2025 [Actualización 1] {#version-2025-january-15}

15 de enero de 2025

### Correcciones y mejoras

Luz

- Añadido el tipo de luz \`spot

Sombra

- La configuración de la Sombra de recepción se traslada al componente Malla

Matemáticas

- Añadido `Mat4.decomposeT`
- Añadido `Mat4.decomposeR`
- Añadido `Mat4.decomposeS`

## Diciembre de 2024 [Actualización 1] {#version-2024-december-09}

9 de diciembre de 2024

### Correcciones y mejoras

VPS

- Se ha añadido la posibilidad de ocultar el activo Ubicación para que no se muestre en la ventana gráfica.

INTERFAZ DE USUARIO

- Solucionados los problemas de visualización de fuentes personalizadas

Audio

- Se ha añadido la posibilidad de obtener y establecer el progreso de los clips de audio.

VPS

- Añadido `location` a los datos de eventos VPS con el eid de la entidad Location correspondiente.

## Noviembre de 2024 [Actualización 2] {#version-2024-november-11}

11 de noviembre de 2024

### Correcciones y mejoras

General

- Mejora del comportamiento de `ecs.Disabled`.
- Mejora del rendimiento con raycasting

VPS

- Se ha corregido un error que hacía que los LocationMeshes quedaran ocultos en la ventana gráfica durante la Sincronización en Directo.

Iluminación

- admite "cámara de seguimiento" para luz direccional

## Noviembre de 2024 [Actualización 1] {#version-2024-november-05}

5 de noviembre de 2024

### Correcciones y mejoras

General

- Se ha añadido la posibilidad de desactivar entidades y sus componentes en una escena para mejorar el control y optimizar el rendimiento en tiempo de ejecución.
- Se ha añadido la posibilidad de crear una nueva versión del proyecto cliente a partir de una versión anterior confirmada. Accede a esta funcionalidad mediante la vista Historial de proyectos en la Configuración de escenas de Studio.

Audio

- Añadidos eventos de carga y fin de reproducción de audio para facilitar la gestión y el control de la reproducción de audio: eventos `ecs.events.AUDIO_CAN_PLAY_THROUGH`, \`ecs.events.AUDIO_END

Activos

- Añadida función para ver el estado de la carga de activos: `ecs.assets.getStatistics`

INTERFAZ DE USUARIO

- Añadida función para estirar la imagen como parte de un elemento UI: `Ui.set({backgroundSize: 'contain/cover/stretch'})`

## Octubre de 2024 [Actualización 3] {#version-2024-october-29}

29 de octubre de 2024

### Nuevas funciones

Servicios de backend

- Las funciones de backend y los proxies de backend ya son compatibles con 8th Wall Studio.

## Octubre de 2024 [Actualización 2] {#version-2024-october-24}

24 de octubre de 2024

### Nuevas funciones

VPS

- \*\*Ahora los desarrolladores pueden crear experiencias WebAR basadas en la localización conectando el contenido de RA con ubicaciones del mundo real.

### Correcciones y mejoras

Modelos 3D

- Añadido soporte para reproducir todos los clips de animación en un modelo gltf.

INTERFAZ DE USUARIO

- Se ha añadido la posibilidad de fijar la opacidad de los elementos de la interfaz de usuario.

## Octubre de 2024 [Actualización 1] {#version-2024-october-18}

18 de octubre de 2024

### Correcciones y mejoras

Eventos

- Añadido el evento `ecs.events.SPLAT_MODEL_LOADED`.

Física

- Añadida la función [getLinearVelocity()](/api/studio/ecs/physics/#getlinearvelocity).

Primitivos

- Añadida primitiva poliedro, sustituyendo al tetraedro.
- Añadida la primitiva Torus.

## Septiembre de 2024 [Actualización 2] {#version-2024-september-30}

30 de septiembre de 2024

### Nuevas funciones

Modelos 3D

- Soporte para cargar y convertir activos 3D en formato FBX.
- Soporte para previsualizar y configurar tus modelos 3D. Con nuestro Previsualizador de Activos actualizado puedes comprobar tu modelo en diferentes configuraciones de iluminación, ajustar el punto de pivote, cambiar la configuración de compresión de la malla, actualizar la escala, inspeccionar los materiales incluidos y mucho más.

Materiales

- Los materiales pueden editarse y guardarse en la vista previa de activos. Los cambios se reflejarán en el activo y en la escena.

INTERFAZ DE USUARIO

- Soporte para fuentes personalizadas con capacidad de carga de archivos TTF.
- Ajusta elementos como el color, los bordes, el texto, la opacidad y mucho más. El UI builder también permite combinar varios elementos 2D en un mismo lienzo para crear gráficos e interfaces 2D compuestos. Edita y modifica estos elementos en tiempo real en la ventana de Studio, y los cambios se reflejarán al instante en el simulador.

### Correcciones y mejoras

Partículas

- Componente de partículas actualizado con opciones de configuración adicionales y valores por defecto más fáciles de usar.

Física

- applyImpulse api, alternativa a aplicar fuerza para el desarrollo de juegos. Bueno para acciones como saltar, dar puñetazos, empujar rápidamente, etc.
- Función simple de obtención en tiempo de ejecución para consultar la configuración actual de la gravedad.

## Septiembre de 2024 [Actualización 1] {#version-2024-september-11}

11 de septiembre de 2024

### Correcciones y mejoras

Máquina de estados

- Capacidades mejoradas y API ampliada para trabajar con Máquinas de Estado y Eventos. Consulte la documentación [State Machine](/studio/essentials/state-machines/) para obtener más información.

## Agosto de 2024 [Actualización 5] {#version-2024-august-29}

29 de agosto de 2024

### Correcciones y mejoras

Partículas

- Se ha corregido un problema por el que la posición de generación de partículas no se establecía correctamente para las entidades secundarias.

## Agosto de 2024 [Actualización 4] {#version-2024-august-26}

26 de agosto de 2024

### Nuevas funciones

Splats

- \*\*Con la aplicación Niantic Scaniverse, puedes crear y exportar fácilmente splats como archivos `.SPZ`. Una vez cargados en 8th Wall Studio, los splats pueden integrarse perfectamente en tus proyectos, sirviendo de base para experiencias 3D hiperrealistas.

### Correcciones y mejoras

Animaciones

- Se ha solucionado un problema por el que las animaciones sin bucle no se completaban en la posición correcta.

Activos

- Se ha mejorado la previsualización de los activos y la modificación de su configuración.

Audio

- API de ciclo de vida de audio actualizadas (reproducción, pausa, silencio, anulación del silencio).

Primitivos

- Soporte para materiales Hider para objetos primitivos que permiten oscurecer u ocultar objetos dentro de una escena.
- Soporte para materiales Unlit para objetos primitivos que ignoran las condiciones de iluminación.
- Se ha solucionado un problema por el que los colisionadores de cilindros no coincidían con la forma primitiva.

## Agosto de 2024 [Actualización 3] {#version-2024-august-15}

15 de agosto de 2024

### Correcciones y mejoras

Eventos

- Se ha corregido un problema por el que se omitían o eliminaban los escuchadores de eventos en determinados escenarios.

INTERFAZ DE USUARIO

- Se ha corregido un problema por el que no se podían cambiar las fuentes.
- Se han solucionado problemas de rendimiento al cargar y representar elementos de la interfaz de usuario.

Docs

- Se ha añadido información sobre los problemas más comunes y las mejores prácticas que se deben seguir al crear secuencias de comandos [Custom Components](/studio/essentials/best-practices/)

## Agosto de 2024 [Actualización 2] {#version-2024-august-08}

8 de agosto de 2024

### Correcciones y mejoras

Gestor de entradas

- Se ha corregido un problema por el que no se controlaban los comportamientos de deslizamiento/arrastramiento en navegadores móviles.
- Se ha añadido la posibilidad de controlar y acceder al bloqueo del puntero, lo que mejora las entradas de control del juego.

Física

- Se ha corregido un problema de sincronización que creaba comportamientos de física incorrectos.

Presentación

- Se ha corregido un problema que hacía que los materiales tuvieran un aspecto desvaído.

INTERFAZ DE USUARIO

- Se ha añadido la posibilidad de ocultar elementos de interfaz de usuario en la escena, lo que permite comportamientos de interfaz de usuario más dinámicos.

## Agosto de 2024 [Actualización 1] {#version-2024-august-01}

1 de agosto de 2024

### Nuevas funciones

Animación

- Añadidos eventos y controles de configuración para soportar modelos GLTF con animaciones pre-cocinadas - ver [3D Model guide](/studio/guides/models/)

Jerarquía

- Se ha añadido la posibilidad de multiseleccionar y mover objetos con las teclas Comando/Ctrl.
- Se ha añadido la posibilidad de seleccionar objetos con la tecla Mayús.

Física

- Se ha añadido un factor de gravedad para la física y los colisionadores con el fin de permitir efectos de física más configurables - véase [Physics guide](/studio/guides/physics/).

Primitivos

- Añadido el tipo primitivo RingGeometry - ver [Guía de primitivas](/studio/guides/models#primitives)

Ventana

- Añadido el menú contextual del botón derecho del ratón para los objetos seleccionados.
- Se ha añadido el ajuste de transformaciones al mantener pulsada la tecla Mayús.

### Correcciones y mejoras

Activos

- Se ha solucionado un problema que impedía añadir nuevos archivos y mover activos.

Cámara

- Se ha corregido un error por el que no funcionaba el ajuste Clip cercano/lejano.

Gestor de entradas

- Se ha solucionado un problema por el que se intercambiaban las teclas de flecha izquierda y derecha.

Simulador

- Ahora se puede cambiar el tamaño del simulador.

INTERFAZ DE USUARIO

- Se ha corregido un error que impedía cambiar el tamaño de fuente de los elementos de la interfaz de usuario.

Ventana

- Los modelos 3D arrastrados a la ventana gráfica se ajustarán a la posición actual del cursor.

Varios

- Varias mejoras en la usabilidad de la interfaz de usuario.
- Mejoras para copiar y pegar objetos.

## Junio de 2024 [Actualización 1] {#version-2024-june-18}

18 de junio de 2024

### Nuevas funciones

¡Lanzamiento inicial de 8th Wall Studio! Hola a todos.

- Las principales actualizaciones incluyen sistemas iniciales y herramientas de edición para física, animaciones, entradas de jugador, cámaras, iluminación, partículas, audio, modelos 3D, materiales, mallas y mucho más. Consulte la documentación de Studio para obtener más información sobre estos sistemas.
