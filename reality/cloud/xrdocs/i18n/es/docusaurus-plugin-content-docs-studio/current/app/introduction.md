---
id: introduction
description: En esta sección se explica cómo utilizar la aplicación de escritorio 8th Wall.
sidebar_position: 2
---

# Uso de la aplicación 8th Wall

:::info[Public Beta]
La aplicación de escritorio del **8º Muro está en fase beta pública** y su funcionalidad puede cambiar en una futura versión. Apreciamos tus comentarios y tenemos un [foro de soporte dedicado para los usuarios beta de la aplicación de escritorio](https://forum.8thwall.com/c/desktop-beta/17)-por favor, informa aquí de cualquier problema que encuentres o de tus sugerencias.
:::

Tras iniciar sesión en 8th Wall a través de la aplicación de escritorio, verás los proyectos que has creado en la vista central. Si eres miembro de varios espacios de trabajo, puedes cambiar de espacio de trabajo utilizando el menú desplegable de la parte superior izquierda del hub. Para crear un nuevo proyecto, haga clic en el botón **Nuevo proyecto** situado en la parte superior derecha del hub.

![](/images/studio/app/hub.jpg)

## Proyectos

En la vista central de Studio, puede mover, eliminar y buscar proyectos mediante el menú Acciones del proyecto `(...)`:

- **Reveal in finder**: abre el explorador de archivos local en la ubicación del proyecto.
- **Eliminar del disco**: elimina los archivos locales del proyecto (el proyecto seguirá disponible en la web a partir de su última compilación en la nube).
- **Cambiar la ubicación del disco**: abre el explorador de archivos para seleccionar una nueva ubicación de la carpeta a la que se moverá el proyecto.
- **Configuración del proyecto**: abre la configuración del proyecto en la web para realizar acciones como cambiar el nombre del proyecto, crear una descripción o cambiar la imagen de portada, entre otras.

![](/images/studio/app/project-actions.jpg)

## Estructura del proyecto

Cuando crea o abre un proyecto por primera vez, se añade una versión local del proyecto en su máquina dentro de `~/Documents/8th Wall/`. Por defecto, la carpeta 8th Wall se crea dentro de la carpeta Documentos, pero si lo prefiere, puede cambiar la ubicación de la carpeta 8th Wall.

La carpeta creada para su proyecto incluirá por defecto determinados archivos y carpetas. La carpeta `src` refleja el directorio de archivos del proyecto que se ve en Studio. Esta carpeta es un directorio dentro de la estructura de archivos de tu proyecto donde almacenas archivos como scripts de componentes, así como activos como imágenes, fuentes, sonidos u otros medios que tu proyecto necesite.

![](/images/studio/app/project-directories.jpg)

:::info
No intente copiar estos archivos a otro servidor, su proyecto no funcionará como se espera. Para publicar y compartir su experiencia, debe utilizar el proceso de creación y alojamiento de 8th Wall.
:::

La aplicación de escritorio escucha los cambios en tu directorio local en tiempo real. Por ejemplo, si utiliza VSCode para actualizar el archivo `component.ts` de un proyecto, en cuanto guarde el archivo, debería ver que el archivo actualizado aparece en Studio.

Del mismo modo, puedes trabajar con herramientas de modelado 3D como Blender y Maya y guardar los cambios de activos directamente en tu proyecto de 8th Wall. Esto le permite trabajar con distintos programas y crear un único proceso optimizado, para que su flujo de trabajo se mantenga intacto de principio a fin.

![](/images/studio/app/blender-to-studio.gif)

## Control de las fuentes

Hay algunas diferencias importantes que debes tener en cuenta al utilizar la versión de escritorio de Studio frente a la versión web.

En primer lugar, no verás un botón **Construir** en la barra de navegación superior derecha como en Studio en la web. Esto se debe a que Studio en el escritorio guarda automáticamente los cambios a medida que avanzas y no necesita utilizar servidores en la nube para compilar los cambios y reconstruir el proyecto.

Cuando quieras sincronizar los cambios de tu proyecto con la nube, puedes acceder a la función **Cloud Build** en la Configuración del proyecto, en **Source Control**. Por ejemplo, puede que quieras cambiar a la versión web de Studio para seguir trabajando. Puedes seleccionar el botón Cloud Build para sincronizar los últimos cambios y, a continuación, encontrarlos en la versión web de Studio. Más información sobre las funciones de control de código fuente [aquí](/studio/getting-started/build-land/).

![](/images/studio/app/source-control.jpg)
