# Importando módulos

## Importar módulos a un proyecto del editor de la nube {#importing-modules-into-a-cloud-editor-project}

Los módulos le permiten añadir componentes reutilizables a su proyecto, permitiéndole centrarse en el desarrollo de su experiencia principal. El editor de la nube de 8th Wall le permite importar sus propios módulos propios o módulos publicados por 8th Wall directamente a sus proyectos.

**Para importar un módulo a un proyecto del editor de la nube**:

1. Dentro del editor de la nube, pulsa el botón "+" junto a módulos.

![modules-step1-add-module](/images/modules-step1-add-module.png)

2. Seleccione el módulo que quiera importar de la lista. Solo se podrán importar los módulos compatibles con el proyecto hospedado en 8th Wall. (Más información sobre la [compatibilidad de los módulos](#module-compatibility) aquí:)

![modules-step2-select-template](/images/modules-step2-select-template.png)

3. Pulse "Importar" para añadir su módulo a su proyecto. Tome nota del alias del módulo. Si ya tiene un módulo en su proyecto con el mismo alias, puede que tenga que cambiar el nombre de su módulo.

![modules-step3-press-import](/images/modules-step3-press-import.png)

4. Ahora el módulo estará visible en su proyecto, en la sección "Módulos".

![módulos-step4-press-import](/images/modules-added-to-project.jpg)

5. Si selecciona el módulo importado, accederá a la página de configuración del módulo. Esta página puede utilizarse para configurar varios parámetros del módulo.

![modules-step5-press-import](/images/modules-config-page.jpg)

Una vez que haya añadido un módulo a su proyecto, puede que tenga que hacer cambios en su código para integrar completamente el módulo. Los módulos con LÉAME contienen documentación que debe consultar para entender cómo integrar el módulo específico en el código de su proyecto.

## Importar módulos a un proyecto autohospedado {#importing-modules-into-a-self-hosted-project}

Los módulos le permiten añadir componentes reutilizables a su proyecto, permitiéndose centrarse en el desarrollo de su experiencia principal. Puede importar sus propios módulos o módulos publicados por 8th Wall directamente en tus proyectos autohospedados.

**Para importar un módulo a su proyecto autohospedado**:

1. Dentro del editor de la nube, abra su proyecto autohospedado y pulsw el icono Módulo en el navegador de la izquierda:

![Módulos-navegación-izquierda](/images/modules-icon-left-nav.jpg)

2. Pulsa "+" o "Importar módulo" para añadir un módulo disponible a tu proyecto.

3. Pulse "Módulos públicos" para importar un módulo creado por 8th Wall, o "Mis módulos" para importar un módulo creado por un miembro de su área de trabajo. Solo estarán disponibles para importar los módulos compatibles con el proyecto autohospedado. (Más información sobre la [compatibilidad de los módulos](#module-compatibility) aquí:)

4. Seleccione el módulo que quiera importar de la lista.

5. Pulse "Importar" para añadir su módulo a su proyecto. Tome nota del alias del módulo. Si ya tiene un módulo en su proyecto con el mismo alias, puede que tenga que cambiar el nombre de su módulo.

6. Puede añadir hasta 10 módulos a su proyecto autohospedado. Estos módulos estarán visibles como pestañas en la página Módulos del Proyecto del editor de la nube de la 8th Wall.

![self-hosted-project-modules](/images/self-hosted-project-modules.jpg)

7. Si selecciona el módulo importado, se mostrarán los detalles de configuración del módulo. Esto puede utilizarse para configurar varios parámetros del módulo.

![self-hosted-project-module-details](/images/self-hosted-project-module-details.jpg)

8. Si importa un módulo que ha creado su equipo, verá varias opciones de objetivo de fijación , incluyendo "Versión" (solo si el módulo se ha desplegado al menos una vez), y "Entrega" (le permite anclar el módulo a cualquier entrega del código del módulo). Si selecciona un objetivo de fijación "Versión", puede suscribir su módulo importado a actualizaciones de corrección de errores, actualizaciones de nuevas funciones o desactivar las actualizaciones automáticas del módulo .

![self-hosted-project-module-pinning-target](/images/self-hosted-project-module-pinning-target.jpg)

9. Una vez que haya añadido un módulo a su proyecto, pulse "Copiar código" y pegue el contenido de su portapapeles en el archivo `head.html` de su proyecto. Este fragmento permite cargar módulos en su proyecto autohospedado con los ajustes de configuración de módulos que haya especificado. Tendrá que volver a copiar el fragmento de código y actualizar el `head.html` de su proyecto cada vez que realice un cambio en los ajustes de configuración del módulo.

![self-hosted-project-module-copy-code](/images/self-hosted-project-module-copy-code.jpg)

10. Puede que tenga que hacer cambios en su código para integrar completamente el módulo.