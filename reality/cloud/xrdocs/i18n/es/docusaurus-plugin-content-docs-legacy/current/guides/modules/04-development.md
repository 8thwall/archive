# Desarrollo de módulos

## Creación de un nuevo módulo {#creating-a-new-module}

Los módulos le permiten añadir activos, archivos y código modularizados e importarlos a sus proyectos
con un sistema de versiones. Esto le permite centrar el código de su proyecto en diferenciadores clave y
importar fácilmente funcionalidades comunes a través de un módulo creado por usted.

Para crear un nuevo módulo en su espacio de trabajo:

1. En el panel de control de su espacio de trabajo, haga clic en la pestaña "Módulos":

![ModulesTab](/images/modules-tab.jpg)

2. En la pestaña "Módulos" del panel de control del espacio de trabajo, haga clic en "Crear nuevo módulo".

![ModulesTab](/images/create-new-module.jpg)

También puede crear un nuevo módulo directamente en el contexto de un proyecto. Dentro de su proyecto Cloud Editor
, pulse el botón "+" situado junto a Módulos. A continuación, pulse "Crear nuevos módulos" y continúe con las siguientes instrucciones de
.

3. Introduzca la información básica del módulo: Proporcione un ID de módulo (este ID aparece en la url de su espacio de trabajo
   y puede utilizarse para hacer referencia a su módulo en el código del proyecto) y el título del módulo. El título del módulo
   puede editarse posteriormente en la página de configuración del módulo.

4. Una vez que haya creado su módulo, se le llevará al archivo module.js dentro del Editor Cloud.
   A partir de aquí puede empezar a desarrollar sus módulos. Encontrará más detalles sobre el desarrollo de módulos en
   , en la sección Desarrollo de su módulo.

## Desarrollo de un módulo {#developing-a-module}

El desarrollo de módulos es ligeramente diferente del desarrollo de proyectos. Los módulos no pueden ejecutarse por sí solos en
y sólo pueden ejecutarse después de haber sido importados a un proyecto. Los módulos pueden desarrollarse en una vista específica del módulo
del Editor de Nube, o en el contexto de un proyecto. **Los módulos sólo están
disponibles para el espacio de trabajo en el que se desarrollan.**

Cuando desarrolle un módulo dentro de la vista específica del módulo, no verá el botón "Vista previa" en la navegación superior
del Editor Cloud, ya que los módulos sólo se pueden previsualizar cuando se importan a un proyecto.

Los principales componentes de un módulo son:

`manifest.json`

Dentro de `manifest.json` puede crear parámetros que son editables a través de un configurador visual cuando los módulos
se importan en los proyectos. Tu código `module.js` puede suscribirse a los parámetros que hagas
disponibles en el manifiesto del módulo para cambiar dinámicamente en función de la entrada del usuario al configurar el módulo
en el contexto de un proyecto.

El módulo config builder se inicia automáticamente con un grupo de parámetros disponible. Grupos de parámetros
puede utilizarse para divisiones lógicas de parámetros que luego se expresan y agrupan visualmente cuando
utiliza su módulo en un proyecto.

1. Cambie el nombre de un grupo de configuración haciendo doble clic en el título del grupo.
2. Añada un nuevo grupo de configuración pulsando el botón "Nuevo grupo de configuración".
3. Añade un parámetro a un grupo de configuración pulsando "+ Nuevo parámetro".

![ModulesConfigBuilder](/images/modules-config-builder.jpg)

4. Al crear un nuevo parámetro debes darle un nombre. Este nombre podría utilizarse en el módulo
   y en el código del proyecto, por lo que no debe incluir espacios ni caracteres especiales.
5. Seleccione el tipo de parámetro. Los tipos de parámetros admitidos actualmente son
   `String`, `Number`, `Boolean` y `Resource`.
6. Una vez realizada la selección, pulse "**Siguiente**".

![ModulesParameterGroup](/images/modules-param-group.jpg)

**NOTA:** El orden de los grupos de configuración, y de los parámetros dentro de estos grupos, dicta el orden en que
se muestra a los usuarios cuando se utiliza un módulo dentro de un proyecto. Puede reordenar fácilmente los parámetros
dentro de un grupo, así como reordenar los grupos de configuración arrastrándolos en el orden que desee. Para
cambiar un parámetro de un grupo a otro pulse el icono de la flecha en el campo del parámetro y
seleccione en el desplegable el grupo al que desea mover el parámetro.

## Tipos de parámetros y opciones del módulo {#module-parameter-types--options}

Si está creando un manifiesto para su módulo, podrá seleccionar entre diferentes tipos de parámetros en
, como `String`, `Number`, `Boolean` y `Resource`. Detalles sobre cada tipo de parámetro
:

#### Cadena {#string}

Los parámetros de cadena tienen los siguientes campos editables:

| Campos de parámetros                                                                              | Tipo   | Descripción                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etiqueta (1)                                                                   | Cadena | Un nombre legible para el parámetro que se mostrará en la interfaz de usuario de configuración cuando el módulo se importe en un proyecto. El valor predeterminado se genera dinámicamente en función del nombre del parámetro. |
| Por defecto [Opcional] (2) | Cadena | El valor de cadena por defecto si no se especifica ninguno cuando el módulo se importa en un proyecto. Por defecto es "".                                                                                                       |

![ModulesParameterString](/images/modules-param-string.jpg)

#### Número {#number}

Los parámetros numéricos tienen los siguientes campos editables:

| Campos de parámetros                                                                              | Tipo     | Descripción                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etiqueta (1)                                                                   | Cadena   | Un nombre legible para el parámetro que se mostrará en la interfaz de usuario de configuración cuando el módulo se importe en un proyecto. El valor predeterminado se genera dinámicamente en función del nombre del parámetro. |
| Por defecto [Opcional] (2) | `Número` | El valor numérico por defecto si no se especifica ninguno al importar el módulo a un proyecto. Por defecto es `null`.                                                                                                           |
| Mín [Opcional] (3)         | `Número` | El valor numérico máximo que un usuario puede introducir cuando el módulo se importa en un proyecto. Por defecto es `null`.                                                                                                     |
| Max [Opcional] (4)         | `Número` | El valor numérico mínimo que un usuario puede introducir cuando el módulo se importa en un proyecto. Por defecto es `null`.                                                                                                     |

![ModulesParameterNumber](/images/modules-param-number.jpg)

#### Booleano {#boolean}

Los parámetros booleanos tienen los siguientes campos editables:

| Campos de parámetros                                                                                           | Tipo     | Descripción                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etiqueta (1)                                                                                | Cadena   | Un nombre legible para el parámetro que se mostrará en la interfaz de usuario de configuración cuando el módulo se importe en un proyecto. El valor predeterminado se genera dinámicamente en función del nombre del parámetro. |
| Por defecto [Opcional] (2)              | Booleano | Valor booleano por defecto si no se especifica ninguno al importar el módulo a un proyecto. Por defecto es `false`.                                                                                                             |
| Etiqueta si es verdadero [Opcional] (3) | Cadena   | La etiqueta para la opción booleana verdadera que se mostrará en la interfaz de usuario de configuración cuando el módulo se importe en un proyecto. Por defecto es `true`.                                                     |
| Etiqueta si es falso [Opcional] (4)     | Cadena   | La etiqueta para la opción booleana false que se mostrará en la interfaz de usuario de configuración cuando el módulo se importe en un proyecto. Por defecto es `false`.                                                        |

![ModulesParameterBoolean](/images/modules-param-boolean.jpg)

#### Recursos {#resource}

Los parámetros de recursos tienen los siguientes campos editables:

| Campos de parámetros                                                                                                    | Tipo              | Descripción                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etiqueta (1)                                                                                         | Cadena            | Un nombre legible para el parámetro que se mostrará en la interfaz de usuario de configuración cuando el módulo se importe en un proyecto. El valor predeterminado se genera dinámicamente en función del nombre del parámetro. |
| No permitir ninguno (2)                                                                              | Booleano          | Activa/desactiva la capacidad de establecer explícitamente el recurso como nulo desde la interfaz de usuario de configuración cuando el módulo se importa en el proyecto. Por defecto es `false`.                               |
| Extensiones de activos permitidas [Opcional] (3) | Tipos de ficheros | Habilita la posibilidad de cargar los tipos de archivo especificados a través de la interfaz de usuario de configuración cuando el módulo se importa en un proyecto. Por defecto, todos los tipos de archivos.                  |
| Recurso por defecto [Opcional] (4)               | Archivo           | El recurso por defecto si no se especifica ninguno cuando el módulo se importa en un proyecto. Por defecto es `null`.                                                                                                           |

![ModulesParameterResource](/images/modules-param-resource.jpg)

`module.js`

`module.js` es el punto de entrada principal para tu módulo 8th Wall. El código en `module.js` se ejecutará
antes de que se cargue el proyecto. También puede añadir otros archivos y activos y hacer referencia a ellos dentro de
`module.js`.

Los módulos pueden ser muy diferentes en función de su finalidad y de tu estilo de desarrollo. Normalmente, los módulos de
contienen algunos de los siguientes elementos:

## Suscripción a los valores de configuración del módulo {#subscription-to-module-configuration-values}

```javascript
import {subscribe} from 'config' // config es como accedes a las opciones de tu módulo

subscribe((config) => {
  // Tu código hace algo con la configuración aquí
})
```

## Propiedades de exportación a las que se hace referencia en el código del proyecto {#export-properties-that-are-referenced-in-project-code}

```javascript
export {
  // Exporta aquí las propiedades
}

```

`README.md`

Puedes incluir un "readme" en tu módulo simplemente creando un archivo llamado `README.md` en el directorio de archivos
de tu módulo. Al igual que los módulos readme de los proyectos, los readmes pueden formatearse utilizando markdown y
puede incluir recursos como imágenes y vídeo.

**NOTA:** Si tu módulo tiene un readme será automáticamente empaquetado con el módulo cuando
\*despliegue una versión. Este readme del módulo apropiado se mostrará en contexto con el módulo dependiendo
\*de la versión del módulo que se esté utilizando en el proyecto.

## Desarrollar un módulo en el contexto de un proyecto {#developing-a-module-within-the-context-of-a-project}

Puede activar el modo de desarrollo en el contexto de un proyecto en los módulos que pertenezcan a su espacio de trabajo
activando "Modo de desarrollo" (en rojo en la imagen siguiente) en la página de configuración del módulo.
Una vez activado el modo Desarrollo, el código y los archivos subyacentes de los módulos serán visibles en el panel lateral izquierdo de
.

Cuando un módulo está en modo de desarrollo dentro del contexto de un proyecto, verá opciones adicionales
en la página de configuración, entre las que se incluyen: controles de cliente de módulo (en color verde azulado), un botón de despliegue de módulo
(en color rosa) y un conmutador de "Modo de edición" para alternar entre la edición del contenido de la página de configuración visual
y el uso de la configuración.

![ModulesDevelopmentMode](/images/modules-development-mode.jpg)

Cuando esté desarrollando módulos en el contexto de un proyecto y tenga cambios en los terrenos, verá en
un flujo de terrenos que le llevará a través de los cambios del proyecto y del módulo. Puede elegir si desea o no
land specific changes. Cualquier proyecto o módulo que tenga cambios que usted está aterrizando debe tener un mensaje de confirmación
añadido antes de que usted sea capaz de completar el aterrizaje de su código.

![ModulesReviewChanges](/images/modules-review-changes.jpg)

Cuando estés desarrollando módulos en el contexto de un proyecto y tengas cambios, también notarás la actualización de las opciones Abandonar y Revertir cambios en el editor de la nube. Puede elegir si desea o no Abandonar/Revertir sólo los cambios del proyecto o los cambios tanto de su proyecto como de cualquier módulo en desarrollo.

## Despliegue de un módulo {#deploying-a-module}

#### Despliegue inicial de módulos {#initial-module-deployment}

El despliegue de módulos le permite compartir versiones estables, al tiempo que permite a los proyectos suscribirse a
actualizaciones de módulos dentro de una familia de versiones. Esto puede permitirle enviar automáticamente actualizaciones de módulos sin interrupciones a
.

#### Para desplegar un módulo por primera vez {#deploy-a-module-for-the-first-time}

1. Si está desarrollando desde la vista específica del módulo del Editor de Nube, pulse el botón "Desplegar" en la esquina superior derecha. Si está desarrollando un módulo en el contexto de un proyecto, pulse el botón "Desplegar" en la esquina superior derecha de la página de configuración del módulo.

![ModulesDeploy](/images/modules-deploy.jpg)

2. Valide el título de su módulo.
3. Seleccione la confirmación deseada para la versión de su módulo.
4. Escriba una descripción de la funcionalidad inicial del módulo en la sección Notas de la versión. Esta sección acepta el formato markdown.
5. Haga clic en "Siguiente".

![ModulesDeployInitialVersion](/images/modules-deploy-initial-version.jpg)

6. Opcionalmente, añada una descripción del módulo y/o una imagen de portada. La descripción del módulo y la imagen de portada se muestran en el flujo de importación del módulo cuando se introduce un módulo en un proyecto. Añadir una descripción y una imagen de portada puede ayudar a diferenciar el módulo, y dar a otros miembros de su espacio de trabajo contexto sobre el uso del módulo.
7. Haga clic en "Desplegar".

![ModulesDeployInitialVersion2](/images/modules-deploy-initial-version2.jpg)

## Despliegue de actualizaciones de módulos {#deploying-module-updates}

El despliegue de actualizaciones de módulos es similar al despliegue de un módulo por primera vez, con dos opciones de despliegue adicionales
.

1. **Tipo de versión**: Al desplegar una actualización de módulo se le pedirá que elija si la actualización es una corrección de errores, una nueva función o una versión mayor.
   - **Corrección de errores**: Debe seleccionarse para código refactorizado y correcciones de problemas existentes. Los proyectos con módulos suscritos a Corrección de errores o Nuevas funciones recibirán automáticamente una actualización cuando esté disponible una nueva versión del módulo de Corrección de errores.
   - **Nuevas funciones**: Debe seleccionarse cuando haya añadido funcionalidad adicional no rompedora a su módulo. Los proyectos con módulos suscritos a Nuevas funciones recibirán automáticamente una actualización cuando esté disponible una nueva versión del módulo de Nuevas funciones.
   - **Lanzamiento importante**: Debe seleccionarse para cambios de última hora. Los proyectos con módulos no reciben actualizaciones automáticas para las versiones principales.
2. **Marcar como Pre-lanzamiento**: Después de seleccionar un tipo de versión, puede marcar la versión como pre-lanzamiento.
   Esto añadirá una insignia de pre-lanzamiento para notificar a otros usuarios que la versión del módulo es un pre-lanzamiento, si
   el tipo de versión es Bug Fixes o New Features los proyectos tampoco recibirán una actualización automática
   mientras una versión esté marcada como pre-lanzamiento. Para utilizar una versión preliminar en un módulo importado
   en su proyecto, seleccione manualmente la versión preliminar en el destino de fijación de versiones.

![ModulesDeployNewVersion](/images/modules-deploy-new-version.jpg)

## Módulo de edición Pre-lanzamiento {#edit-module-pre-release}

Cuando hay una versión preliminar activa, puede seguir actualizándola hasta que
la promocione o la abandone.

**Para editar un módulo previo a su lanzamiento**:

1. Si desarrolla desde la vista específica del módulo del Editor de Nube tras haber configurado previamente una nueva versión de
   como pre-lanzamiento, pulse el botón "Desplegar" en la esquina superior derecha. Si está desarrollando
   un módulo desde el contexto de un proyecto tras haber configurado previamente una nueva versión como pre-lanzamiento
   , pulse el botón "Desplegar" en la esquina superior derecha de la página de configuración del módulo.

![ModulesDeploy2](/images/modules-deploy.jpg)

2. Seleccione un nuevo commit para su pre-lanzamiento o mantenga el commit actual.
3. Cambiar la descripción de la funcionalidad de la versión del módulo en la sección Notas de la versión. Esta sección acepta el formato markdown.
4. Marque la casilla "Promover a versión" si está listo para convertir su versión preliminar en una versión estándar.
5. Pulse "Abandonar prealerta" para borrar la prealerta. Esta opción se utiliza normalmente para seleccionar un tipo de versión distinto al de la versión preliminar (por ejemplo, pasar de una versión de corrección de errores a una versión principal con cambios de última hora). Los proyectos con módulos actualmente anclados a la versión preliminar seguirán funcionando con la versión preliminar hasta que reciban una actualización suscrita o se modifiquen manualmente.
6. El botón "Desplegar" hace que los cambios editados en la versión preliminar estén disponibles (ya sea actualizando la versión preliminar o pasando a la versión preliminar si la casilla de verificación está seleccionada):

![ModulesEditPreReleaseDeploy](/images/modules-edit-pre-release.jpg)