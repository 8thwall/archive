---
id: troubleshooting
description: >-
  En esta sección se explican las limitaciones y los problemas conocidos de la
  aplicación 8th Wall Desktop.
sidebar_position: 3
---

# Solución de problemas

:::info[Public Beta]
La aplicación de escritorio del **8º Muro está en fase beta pública** y su funcionalidad puede cambiar en una futura versión. Apreciamos tus comentarios y tenemos un [foro de soporte dedicado para los usuarios beta de la aplicación de escritorio](https://forum.8thwall.com/c/desktop-beta/17)-por favor, informa aquí de cualquier problema que encuentres o de tus sugerencias.
:::

## Limitaciones

- Los directorios de proyecto no pueden alojarse en un servidor externo, deben utilizar el proceso de construcción y alojamiento de 8th Wall.

## Problemas conocidos

- Por el momento no se admiten módulos.
- En este momento no es posible modificar los paquetes de activos.
- Los proyectos no pueden crearse o abrirse si el nombre del proyecto coincide con un proyecto existente que se creó anteriormente. Esto puede ocurrir si eres miembro de varios espacios de trabajo con diferentes proyectos que comparten el mismo nombre.
- Los proyectos externos (compartidos) no pueden abrirse en la aplicación de escritorio. Más información sobre el uso compartido de proyectos externos [aquí](/account/projects/project-sharing/).
- Cambiar de cliente mientras el simulador está en marcha hará que el simulador se cuelgue infinitamente en el estado "Inicializando". Puede cerrar el proyecto y volver a abrirlo si entra en este estado.

## Recargar

Puede liberar y forzar la recarga de la aplicación de escritorio 8th Wall desde el menú **Ver** o utilizando los atajos de teclado.

![](/images/studio/app/view-options.jpg)
