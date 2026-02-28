---
id: navigate-interface
sidebar_position: 4
---

# Navegar por la interfaz

Studio cuenta con una rica interfaz de edición compuesta por varias herramientas y vistas diferentes, cada una de ellas de
que son esenciales a la hora de desarrollar tu proyecto.

Las secciones siguientes muestran los principales elementos de la interfaz del editor de Studio, con las características fundamentales
resaltadas.

![StudioInterface1](/images/studio/studio-navigate-interface.png)

![StudioInterface2](/images/studio/studio-navigate-editor.png)

## Jerarquía {#hierarchy}

Visualice las entidades y objetos incluidos en el espacio, y modifique su anidamiento. Puede reasignar o desasignar el objeto en
haciendo clic en él y arrastrándolo a otra posición de la jerarquía. Haga clic con el botón derecho del ratón para
duplicar o eliminar objetos. Añade nuevos objetos a tu espacio. Búsqueda y filtrado de diferentes objetos.

![StudioHierarchy](/images/studio/studio-navigate-hierarchy.png)

## Activos {#assets}

Los archivos y activos pueden gestionarse desde el panel inferior izquierdo.

![StudioAssets](/images/studio/studio-navigate-assets.png)

### Archivos {#files}

Cargue sus propios modelos 3D, imágenes 2D, archivos de audio
, scripts personalizados y mucho más. Crea carpetas y arrastra archivos para reorganizar su ubicación. Usted puede
también arrastrar y soltar un activo en el Viewport o la Jerarquía para agregar la entidad en su escena. Para obtener más información sobre el uso y la optimización de módulos 3D en formato GLB/GLTF, consulte Sus modelos 3D en la web
&#x20;en
.

### Laboratorio de activos {#asset-lab}

Genere imágenes, modelos 3D y personajes animados y riggeados con Asset Lab y acceda a su biblioteca de
Asset Lab para importar fácilmente activos a su proyecto.
[Más información sobre Asset Lab](/studio/asset-lab/).

### Prefabricados {#prefabs}

Cree plantillas de juego reutilizables y personalizables que agilicen y amplíen su desarrollo.
[Más información sobre prefabricados](/studio/guides/prefabs/).

### Objetivos {#targets}

Cargar y gestionar los objetivos de imagen del proyecto.
[Más información sobre objetivos de imagen](/studio/guides/xr/image-targets/).

### Módulos {#modules}

8th Wall Modules es una potente función de 8th Wall diseñada para aumentar drásticamente la eficacia del desarrollo de proyectos en
. Los módulos de 8th Wall le permiten guardar y reutilizar componentes (código, activos, archivos)
dentro de su espacio de trabajo y también encontrar e importar módulos creados por 8th Wall en su proyecto.
[Más información sobre los módulos de 8ª pared](/studio/guides/modules/).

## Ventana {#viewport}

Añada, coloque, actualice y trabaje con objetos e iluminación en el espacio. Utilice el dispositivo de perspectiva inferior
para cambiar la vista de la escena, modificar la iluminación y la visibilidad de las sombras, y pasar de la vista ortográfica
a la vista en perspectiva. Utilice la barra de herramientas superior para cambiar la posición, rotación o escala de
un objeto seleccionado, o para deshacer y rehacer ediciones.

![StudioViewport](/images/studio/studio-navigate-viewport.png)

### Atajos {#shortcuts}

| Función                                     | Atajo de teclado                                                                          |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Órbita de la cámara                         | ⌥ Clic izquierdo + arrastrar                                                              |
| Panorámica de la cámara                     | ⌥ Clic derecho+arrastrar, Clic derecho+arrastrar, Clic central+arrastrar. |
| Zoom de la cámara                           | Rueda de desplazamiento                                                                   |
| Centrarse en el objeto seleccionado         | F                                                                                         |
| Traducir                                    | W                                                                                         |
| Gire                                        | E                                                                                         |
| Escala                                      | R                                                                                         |
| Ocultar/Mostrar capa de interfaz de usuario | ⌘\                                                                                       |
| Borrar objeto                               | Borrar                                                                                    |
| Duplicar                                    | ⌘D                                                                                        |
| Copiar objeto                               | ⌘C                                                                                        |
| Pegar objeto                                | ⌘V                                                                                        |
| Deshacer                                    | ⌘Z                                                                                        |
| Rehacer                                     | ⌘⇧Z, ⌘Y                                                                                   |

## Simulador {#simulator}

Inicia el simulador para reproducir tu escena. Puede realizar modificaciones en las entidades de su espacio y
verlas reflejadas inmediatamente en el simulador. El simulador también te permite probar y ver los cambios del proyecto en diferentes tamaños de pantalla y
simula entornos reales sin necesidad de salir de Studio.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

![Simulator2](/images/studio/studio-navigate-simulator2.png)

Si estás desarrollando RA, puedes acceder a una colección de secuencias de cámara pregrabadas.
El simulador de realidad aumentada dispone de una serie de controles de reproducción y funciones prácticas, como
:

- Barra de reproducción, scrubber y tiradores de entrada/salida: Le permiten establecer puntos de bucle, lo que le proporciona un control granular
  sobre la secuencia seleccionada.
- Botón de recentrado (abajo a la derecha): Recentra la alimentación de la cámara a su origen. NOTA: También se llama a Recenter en
  cada vez que la secuencia hace un bucle y cada vez que se selecciona una nueva secuencia.

## Iniciar barra de herramientas {#launch-toolbar}

Studio guardará automáticamente tu progreso a medida que trabajas en un proyecto, sin embargo, las etapas clave en el desarrollo de
pueden marcarse construyendo manualmente tu proyecto, aterrizando tus cambios como commits, y
publicando tu proyecto.

![StudioLaunchToolbar](/images/studio/studio-navigate-launch-toolbar.png)

**Construir**: Haz clic en Construir para guardar tu trabajo e iniciar una nueva compilación en la nube de tu proyecto.

**Aterrizar o sincronizar**: Una vez que estés satisfecho con los cambios, aterriza el código actualizado en el control de código fuente integrado de Studio
. En la parte superior derecha de la ventana Estudio, haz clic en Aterrizar. El botón será de color verde,
indicando que hay cambios en su proyecto que aún no se han aterrizado en el control de código fuente.
"Sync" indica que su proyecto no está actualizado con los últimos cambios aterrizados en el control de fuentes
(ejemplo: otro miembro del equipo ha aterrizado cambios del proyecto en el control de fuentes).

![StudioLand](/images/studio/studio-navigate-land.png)

**Publicar**: El paso final es publicar el código actualizado y aterrizado de su proyecto utilizando el alojamiento incorporado de 8th Wall en
. Público permite que el proyecto sea visto públicamente por cualquier persona en Internet. Staging
permite ver su proyecto a quienes dispongan de un código de acceso.

![StudioPublish](/images/studio/studio-navigate-publish.png)

Cuando esté listo para publicar su proyecto, necesitará una descripción y una imagen de portada. Para obtener más información
sobre cómo presentar un proyecto para su visualización pública, consulte la sección
[Publique su proyecto](/studio/getting-started/publish).

## Ajustes e inspector {#settings-inspector}

Visualice y configure los componentes específicos de cada objeto, así como los ajustes generales del editor.

### Ajustes de espacio {#space-settings}

Cuando **no se selecciona ninguna entidad** verá los ajustes generales de su proyecto.

![StudioGeneralSettings](/images/studio/studio-navigate-general-settings.png)

#### Ajustes por defecto {#default-settings}

Dale estilo a tu espacio con ajustes como Skybox y Niebla. Los Skyboxes son una envoltura alrededor de toda tu escena que muestra el aspecto del mundo
más allá de tu geometría. Si su proyecto está configurado para usar AR en un dispositivo compatible con AR,
(ver [XR](/studio/guides/xr/world/)) el Skybox no será renderizado.

#### Configuración del proyecto {#project-settings}

Si tiene varios Espacios, seleccione cuál es el espacio de entrada.

Utiliza el Gestor de entradas para configurar experiencias que funcionen con entradas de distintos dispositivos, como teclados
, controles de gamepad, trackpads y acciones de pantalla táctil. Cree su acción de evento y establezca en
una asignación (o vinculación) a diferentes entradas. [Más información sobre el sistema de entrada](/studio/guides/input)

#### Versión del proyecto {#project-version}

Los proyectos de Studio pueden ejecutarse en una versión de tiempo de ejecución específica, que puede seleccionarse aquí. Vincule su proyecto a un tiempo de ejecución fijo para mayor previsibilidad, u opte por actualizaciones menores y correcciones de errores automáticas para mantenerse siempre al día.

#### Control de fuentes {#source-control}

Gestione las distintas versiones de su proyecto y el historial de cambios. La creación de un nuevo cliente crea una nueva versión
de su proyecto que puede ser útil para probar cambios sin afectar a su versión principal
. También puede acceder a un historial de los cambios anteriores del proyecto Landed seleccionando la función
Historial del proyecto.

#### Editor de código {#code-editor}

Elige entre distintos ajustes de usabilidad, como los modos de luz/oscuridad, las combinaciones de teclas y los ajustes de guardado de código.

### Inspector {#inspector}

Inspeccionar y configurar una entidad y sus componentes. Más información sobre entidades y componentes en [Visión general](/studio/essentials/overview/).

Por defecto, cada entidad muestra un componente Transformar en el Inspector. Diferentes tipos de entidades
pueden mostrar diferentes componentes, por ejemplo una Primitiva mostrará un componente de Malla con
opciones configurables como ajustes de forma de geometría, materiales, texturas, etc.

#### Componentes {#components}

Puede añadir un componente utilizando el botón "+ Nuevo componente". En Studio hay varios tipos de componentes integrados en
, como física, iluminación, audio y animaciones, entre otros. También se pueden añadir componentes personalizados\* [Más información sobre los componentes personalizados](/studio/essentials/custom-components/). Una vez configurado, su componente personalizadoaparecerá en la categoría Personalizado. Haga clic en los tres puntos para eliminar un componente.

![StudioNewComponent](/images/studio/studio-navigate-components.png)

## Dispositivos y consola {#devices--console}

### Conectar dispositivo {#connect-device}

:::tip
Probar el proyecto en varios dispositivos garantiza que los usuarios disfruten de una experiencia coherente en
y en distintos tamaños de pantalla y plataformas.
:::

Previsualice instantáneamente proyectos en dispositivos móviles, de sobremesa o auriculares o en otra ventana del navegador mientras
desarrolla mediante enlace/código QR.

![SimulatorPreview](/images/studio/studio-navigate-preview-links.png)

- En la parte inferior de la interfaz de Studio, haz clic en el botón Conectar dispositivo.
- Escanee el código QR con su dispositivo móvil para abrir un navegador web y probar su proyecto.
  O haga clic en el código QR para abrir una nueva pestaña en su navegador de escritorio.
- Cuando se carga la página, si tu proyecto utiliza WebAR, se te pedirá acceso a los sensores de movimiento y orientación
  (en algunos dispositivos) y a la cámara (todos los dispositivos). Haga clic en Permitir para todas las solicitudes de permiso
  . Accederá a la URL de desarrollo privado del proyecto.
- Nota: El código QR "Preview" es un código QR temporal, de un solo uso
  destinado únicamente al uso por parte del desarrollador mientras desarrolla activamente en Studio. Este código QR te lleva
  a una URL privada y de desarrollo, y no es accesible para otros. Para compartir su trabajo con los demás,
  , consulte la sección siguiente sobre Publicación de su proyecto.
- Haz clic en el icono de auriculares para generar un enlace para un dispositivo de auriculares.

### Consola {#console}

Depura las acciones de compilación y ejecución de tu proyecto. El modo de depuración es una función avanzada de Studio que proporciona registros en
, información sobre el rendimiento y visualizaciones mejoradas directamente en el dispositivo.

![StudioConsole](/images/studio/studio-navigate-console.png)

## Editor de código {#code-editor-1}

El editor de código de 8th Wall equipa a los desarrolladores con un conjunto de herramientas de codificación para crear, colaborar y publicar en
contenidos XR basados en web. Nuestro potente IDE incluye el editor de código, control de código fuente integrado, historial de confirmaciones
, vista previa en directo, depuración remota inalámbrica y alojamiento mediante pulsador en una CDN global.
Otras funciones del Editor de código son:

- Intellisense
- Paleta de comandos
- Código Peek
- Temas claros/oscuros

![StudioEditor](/images/studio/studio-navigate-editor.png)
