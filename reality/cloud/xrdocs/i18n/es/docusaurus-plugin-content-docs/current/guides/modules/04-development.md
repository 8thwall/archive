# Desarrollo de módulo

## Crear un nuevo módulo {#creating-a-new-module}

Los módulos le permiten añadir activos, archivos y código modularizados e importarlos a sus proyectos con un sistema de versiones. Esto le permite centrar el código de su proyecto en diferenciadores clave e importar fácilmente funcionalidades comunes a través de un módulo que usted cree.

Para crear un nuevo módulo en su espacio de trabajo:

1. En el panel de control de su espacio de trabajo, haga clic en la pestaña "Módulos":

![ModulesTab](/images/modules-tab.jpg)

2. En la pestaña "Módulos" del Panel de control del espacio de trabajo, haga clic en "Crear nuevo módulo".

![PestañaMódulos](/images/create-new-module.jpg)

También puede crear un nuevo módulo directamente en el contexto de un proyecto. Dentro de su proyecto del editor de la nube , pulse el botón "+" junto a Módulos. A continuación, pulse "Crear nuevos módulos" y continúe con las instrucciones que aparecen a continuación.

3. Introduzca la información básica del módulo: proporcione un ID de módulo (el ID aparece en la URL de su área de trabajo y se puede utilizar para hacer referencia a su módulo en el código del proyecto) y el título del módulo. El título del módulo se puede editar más adelante en la página configuración del módulo.

4. Una vez que hayas creado tu módulo, accederás al archivo module.js dentro del editor de la nube. A partir de aquí puedes empezar a desarrollar tus módulos. Puedes encontrar más detalles sobre el desarrollo de módulos en , en la sección Desarrollar su módulo.

## Desarrollar un módulo {#developing-a-module}

El desarrollo de módulos es ligeramente diferente del desarrollo de proyectos. Los módulos no pueden ejecutarse por sí solos y solo pueden ejecutarse después de haber sido importados a un proyecto. Los módulos pueden desarrollarse en una vista específica del módulo del editor de la nube, o en el contexto de un proyecto. **Los módulos solo están disponibles en para el espacio de trabajo en el que se desarrollan.**

Cuando desarrolle un módulo dentro de la vista específica del módulo, no verá un botón de "Vista previa" en la navegación superior del editor de la nube, ya que los módulos solo pueden previsualizarse cuando se importan a un proyecto.

Los principales componentes de un módulo son

`manifest.json`

Dentro de `manifest.json` puedes crear parámetros que son editables a través de un configurador visual cuando se importan módulos en los proyectos. Tu código `module.js` puede suscribirse a los parámetros que pongas a disposición en el manifiesto del módulo para cambiar dinámicamente en función de las entradas del usuario al configurar el módulo en el contexto de un proyecto.

El configurador de módulos se inicia automáticamente con un grupo de parámetros disponible. Los grupos de parámetros pueden utilizarse para divisiones lógicas de parámetros que luego se expresan y agrupan visualmente cuando utiliza su módulo en un proyecto.

1. Cambia el nombre de un grupo de configuración haciendo doble clic en el título del grupo.
2. Añade un nuevo grupo de configuración pulsando el botón "Nuevo grupo de configuración".
3. Añade un parámetro a un grupo de configuración pulsando "+ Nuevo parámetro".

![ModulesConfigBuilder](/images/modules-config-builder.jpg)

4. Al crear un nuevo parámetro debe darle un nombre. Este nombre podría utilizarse en el módulo y en el código del proyecto, por lo que no debe incluir espacios ni caracteres especiales.
5. Seleccione el tipo de parámetro. Los tipos de parámetros admitidos actualmente son `String`, `Number`, `Boolean`, & `Resource`.
6. Una vez que haya hecho sus selecciones pulse "**Siguiente**".

![ModulesParameterGroup](/images/modules-param-group.jpg)

**NOTA:** el orden de los grupos de configuración, y de los parámetros dentro de estos grupos, dicta el orden en que se muestra a los usuarios cuando utilizan un módulo dentro de un proyecto. Puede reordenar fácilmente los parámetros dentro de un grupo, así como reordenar los grupos de configuración arrastrándolos en el orden que desee. Para cambiar un parámetro de un grupo a otro grupo pulse el icono de la flecha en el campo del parámetro y seleccione el grupo al que quiere mover el parámetro en el desplegable.

## Módulo Tipos de parámetros & Opciones {#module-parameter-types--options}

Si está creando un manifiesto para su módulo, podrá seleccionar entre diferentes tipos de parámetros , como `String`, `Number`, `Boolean`, & `Resource`. Detalles de cada parámetro tipo:

#### Cadena {#string}

Los parámetros de cadena tienen los siguientes campos editables:

| Campos de los parámetros     | Tipo     | Descripción                                                                                                                                                                                                       |
| ---------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etiqueta (1)                 | `Cadena` | Un nombre legible para su parámetro, que se mostrará en la interfaz de configuración cuando el módulo se importe a un proyecto. El valor por defecto se genera dinámicamente en función del nombre del parámetro. |
| Por defecto \[Opcional\] (2) | `Cadena` | El valor por defecto de la cadena si no se especifica ninguno al importar el módulo a un proyecto. Por defecto es "".                                                                                             |

![ModulesParameterString](/images/modules-param-string.jpg)

#### Número {#number}

Los parámetros numéricos tienen los siguientes campos editables:

| Campos de los parámetros     | Tipo     | Descripción                                                                                                                                                                                                       |
| ---------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etiqueta (1)                 | `Cadena` | Un nombre legible para su parámetro, que se mostrará en la interfaz de configuración cuando el módulo se importe a un proyecto. El valor por defecto se genera dinámicamente en función del nombre del parámetro. |
| Por defecto \[Opcional\] (2) | `Number` | El valor numérico por defecto si no se especifica ninguno al importar el módulo a un proyecto. El valor por defecto es `null`.                                                                                    |
| Mín \[Opcional\] (3)         | `Number` | El valor numérico máximo que puede introducir un usuario al importar el módulo a un proyecto. El valor por defecto es `cero`.                                                                                     |
| Máx \[Opcional\] (4)         | `Number` | El valor numérico mínimo que puede introducir un usuario al importar el módulo a un proyecto. El valor por defecto es `cero`.                                                                                     |

![ModulesParameterNumber](/images/modules-param-number.jpg)

#### Booleano {#boolean}

Los parámetros booleanos tienen los siguientes campos editables:

| Campos de los parámetros                  | Tipo      | Descripción                                                                                                                                                                                                       |
| ----------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etiqueta (1)                              | `Cadena`  | Un nombre legible para su parámetro, que se mostrará en la interfaz de configuración cuando el módulo se importe a un proyecto. El valor por defecto se genera dinámicamente en función del nombre del parámetro. |
| Por defecto \[Opcional\] (2)              | `Boolean` | El valor booleano por defecto si no se especifica ninguno al importar el módulo a un proyecto. El valor por defecto es `false`.                                                                                   |
| Etiqueta si es Verdadero \[Opcional\] (3) | `Cadena`  | La etiqueta para la opción booleana verdadero que se mostrará en la interfaz de usuario de configuración cuando el módulo se importe en un proyecto. El valor por defecto es `true`.                              |
| Etiqueta si es Falso \[Opcional\] (4)     | `Cadena`  | La etiqueta para la opción booleana falso que se mostrará en la interfaz de usuario de configuración cuando el módulo se importe en un proyecto. El valor por defecto es `false`.                                 |

![ModulesParameterBoolean](/images/modules-param-boolean.jpg)

#### Recursos {#resource}

Los parámetros de recursos tienen los siguientes campos editables:

| Campos de los parámetros                           | Tipo              | Descripción                                                                                                                                                                                                                      |
| -------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Etiqueta (1)                                       | `Cadena`          | Un nombre legible para su parámetro, que se mostrará en la interfaz de configuración cuando el módulo se importe a un proyecto. El valor por defecto se genera dinámicamente en función del nombre del parámetro.                |
| No permitir ninguno (2)                            | `Boolean`         | Activa/desactiva la posibilidad de establecer explícitamente el recurso como nulo desde la interfaz de configuración cuando el módulo se importa en el proyecto. El valor por defecto es `falso`.                                |
| Extensiones de activos permitidas \[Opcional\] (3) | Tipos de archivos | Habilita la posibilidad de cargar tipos de archivo especificados a través de los que se muestran en la interfaz de usuario de configuración cuando el módulo se importa en un proyecto. Por defecto, todos los tipos de archivo. |
| Recurso por defecto \[Opcional\] (4)               | Archivo           | El recurso por defecto si no se especifica ninguno al importar el módulo a un proyecto. El valor por defecto es `cero`.                                                                                                          |

![ModulesParameterResource](/images/modules-param-resource.jpg)

`module.js`

`module.js` es el punto de entrada principal de tu módulo 8th Wall. El código en `module.js` ejecutará antes de que se cargue el proyecto. También puedes añadir otros archivos y activos y hacer referencia a ellos dentro de `module.js`.

Los módulos pueden ser muy diferentes en función de su finalidad y de su estilo de desarrollo. Normalmente, los módulos contienen algunos de los siguientes elementos:

## Suscripción a los valores de configuración del módulo {#subscription-to-module-configuration-values}

```javascript
import {subscribe} from 'config' // config es cómo accede a las opciones de su módulo

subscribe((config) => {
 // Su código hace algo con el config aquí
}})
```

## Exportar propiedades a las que se hace referencia en el código del proyecto {#export-properties-that-are-referenced-in-project-code}

```javascript
export {
 // Exporte aquí las propiedades
}}

```

`README.md`

Puede incluir un readme en su módulo simplemente creando un archivo llamado `README.md` en el directorio de archivos de su módulo. Al igual que los readme de los proyectos, los readmes de los módulos pueden formatearse utilizando markdown y pueden incluir recursos como imágenes y vídeo.

**NOTA:** Si su módulo tiene un readme, se empaquetará automáticamente con el módulo cuando *despliegue una versión. Este readme del módulo apropiado se mostrará en contexto con el módulo dependiendo *de la versión del módulo que se esté utilizando en el proyecto.

## Desarrollar un módulo en el contexto de un proyecto {#developing-a-module-within-the-context-of-a-project}

Puede activar el modo de desarrollo en el contexto de un proyecto en los módulos que pertenezcan a su espacio de trabajo activando "Modo de desarrollo" (en rojo en la imagen siguiente) en la página de configuración del módulo. Una vez activado el modo Desarrollo, el código y los archivos subyacentes de los módulos serán visibles en el panel lateral izquierdo.

Cuando un módulo está en modo desarrollo en el contexto de un proyecto, verá opciones adicionales en la página de configuración, entre las que se incluyen: controles de cliente del módulo (en color verde azulado), un botón de despliegue del módulo (en color rosa) y un conmutador de "Modo edición" para alternar entre la edición del contenido de la página de configuración visual y el uso de la configuración.

![ModulesDevelopmentMode](/images/modules-development-mode.jpg)

Cuando estés desarrollando módulos en el contexto de un proyecto y tenga cambios que implementar, verás en un flujo de cambios que le lleva a través de los cambios del proyecto y del módulo. Puedes elegir si quieres o no cambios específicos del aterrizaje. Cualquier proyecto o módulo que tenga cambios que vayas a aterrizar debe tener un mensaje de confirmación antes de que puedas terminar de aterrizar tu código.

![MódulosRevisarCambios](/images/modules-review-changes.jpg)

Cuando estés desarrollando módulos en el contexto de un proyecto y tengas cambios, también notarás la actualización de las opciones Abandonar & Revertir cambios en el editor de la nube. Puedes elegir si quieres Abandonar/Revertir solo los cambios del proyecto o los cambios tanto de tu proyecto como de cualquier módulo en desarrollo.

## Desplegar un módulo {#deploying-a-module}

#### Despliegue inicial del módulo {#initial-module-deployment}

Desplegar módulos le permite compartir versiones estables, al tiempo que permite a los proyectos suscribirse a actualizaciones de módulos dentro de una familia de versiones. Esto puede permitirle enviar actualizaciones de módulos sin ruptura a sus proyectos automáticamente.

#### Desplegar un módulo por primera vez {#deploy-a-module-for-the-first-time}

1. Si desarrollas desde la vista específica del módulo del editor de la nube, pulse el botón "Desplegar" en la esquina superior derecha. Si está desarrollando un módulo desde el contexto de un proyecto, pulse el botón "Desplegar" en la esquina superior derecha de la página de configuración del módulo.

![ModulesDeploy](/images/modules-deploy.jpg)

2. Valide el título de tu módulo.
3. Seleccione la entrega deseada para la versión de su módulo.
4. Escriba una descripción de la funcionalidad inicial del módulo en la sección Notas de la versión. Esta sección acepta el formato Markdown.
5. Haga clic en "Siguiente".

![ModulesDeployInitialVersion](/images/modules-deploy-initial-version.jpg)

6. De manera opcional, añada una descripción del módulo o una imagen de portada. La descripción del módulo y la imagen de portada se muestran en el flujo de importación de módulos al introducir un módulo en un proyecto. Añadir una descripción y una imagen de portada puede ayudar a diferenciar el módulo, y dar contexto a otros miembros de tu área de trabajo sobre el uso del módulo.
7. Haga clic en "Desplegar".

![ModulesDeployInitialVersion2](/images/modules-deploy-initial-version2.jpg)

## Desplegar actualizaciones de módulos {#deploying-module-updates}

El despliegue de actualizaciones de módulos es similar al despliegue de un módulo por primera vez, con dos opciones adicionales de despliegue.

1. **Tipo de versión**: cuando despliegue la actualización de un módulo, se le pedirá que indique si la actualización es una corrección de errores, una nueva función o una versión nueva.
    * **Corrección de errores**: debe seleccionarse para código refactorizado y correcciones de errores existentes. Los proyectos con módulos suscritos a corrección de errores o nuevas funciones recibirán automáticamente una actualización cuando esté disponible una nueva versión del módulo de corrección de errores.
    * **Nuevas funciones**: debe seleccionarse cuando haya añadido a su módulo una funcionalidad adicional sin ruptura. Los proyectos con módulos suscritos a nuevas funciones recibirán automáticamente una actualización cuando esté disponible una nueva versión del módulo de nuevas funciones.
    * **Nueva versión**: debe seleccionarse para los cambios de ruptura. Los proyectos con módulos no reciben actualizaciones automáticas para las nuevas versiones.
2. **Marcar como versión preliminar**: tras seleccionar un tipo de versión, puede marcarla como versión preliminar. Esto añadirá una insignia de versión preliminar para notificar a otros usuarios que la versión del módulo es preliminar, si el tipo de versión es de correcciones de errores o nuevas funciones, los proyectos tampoco recibirán una actualización automática mientras una versión esté marcada como preliminar. Para utilizar una versión preliminar dentro de un módulo importado en su proyecto, seleccione manualmente la versión preliminar del objetivo de fijación de versiones.

![ModulesDeployNewVersion](/images/modules-deploy-new-version.jpg)

## Editar un módulo preliminar {#edit-module-pre-release}

Cuando haya una versión preliminar activa, puede seguir actualizándola hasta que la ascienda o la abandone.

**Editar la versión preliminar de un módulo**:

1. Si está desarrollando desde la vista específica del módulo del editor de la nube tras haber configurado previamente una nueva versión como preliminar, pulse el botón "Desplegar" en la esquina superior derecha. Si está desarrollando un módulo desde el contexto de un proyecto tras haber configurado previamente una nueva versión como pre-lanzamiento , pulse el botón "Desplegar" en la esquina superior derecha de la página de configuración del módulo.

![ModulesDeploy2](/images/modules-deploy.jpg)

2. Seleccione una nueva entrega para su versión preliminar o mantenga la entrega actual.
3. Cambia la descripción de la funcionalidad de la versión del módulo en la sección de notas de la versión. Esta sección acepta el formato Markdown.
4. Marque la casilla "Ascender a versión" si está preparado para convertir su versión preliminar en una versión estándar.
5. Pulse "Abandonar versión preliminar" para borrar la versión. Normalmente se utilizaría para seleccionar un tipo de versión distinto al que está configurado actualmente la versión preliminar (por ejemplo, pasar de corrección de errores a versión más nueva con cambios sin ruptura). Los proyectos con módulos actualmente anclados a la versión preliminar seguirán funcionando con la versión preliminar hasta que reciban una actualización suscrita o se modifiquen manualmente.
6. El botón "Desplegar" hace que sus cambios editados en la versión preliminar estén disponibles (ya sea actualizando la versión preliminar, o ascendiéndola a versión si esa casilla está seleccionada):

![ModulesEditPreReleaseDeploy](/images/modules-edit-pre-release.jpg)