# Importación de módulos

## Importación de módulos a un proyecto del Editor Cloud {#importing-modules-into-a-cloud-editor-project}

Los módulos le permiten añadir componentes reutilizables a su proyecto, permitiéndole centrarse en el desarrollo de su experiencia principal. El Editor Cloud de 8th Wall le permite importar módulos propios o módulos publicados por 8th Wall directamente en sus proyectos.

**Para importar un módulo a un proyecto del Editor de Nubes**:

1. Dentro del Editor de Nubes, pulse el botón "+" junto a Módulos.

![modules-step1-add-module](/images/modules-step1-add-module.png)

2. Seleccione en la lista el módulo que desea importar. Sólo se podrán importar los módulos compatibles con el proyecto alojado en el 8º Muro. (Más información sobre [Compatibilidad de módulos](/legacy/guides/modules/compatibility/))

![modules-step2-select-template](/images/modules-step2-select-template.png)

3. Pulse "Importar" para añadir su módulo a su proyecto. Tome nota del alias del módulo. Si ya
   tiene un módulo en su proyecto con el mismo alias, es posible que tenga que cambiar el nombre de su módulo.

![modules-step3-press-import](/images/modules-step3-press-import.png)

4. Ahora el módulo está visible en su proyecto, en la sección "Módulos".

![modules-step4-press-import](/images/modules-added-to-project.jpg)

5. Si selecciona el módulo importado, accederá a la página de configuración del módulo. Esta página permite configurar varios parámetros del módulo.

![modules-step5-press-import](/images/modules-config-page.jpg)

Una vez que haya añadido un módulo a su proyecto, es posible que tenga que realizar cambios en el código para integrar completamente el módulo. Los módulos con readmes contienen documentación que debe consultarse para comprender cómo integrar el módulo específico en el código del proyecto.

## Importación de módulos a un proyecto propio {#importing-modules-into-a-self-hosted-project}

Los módulos le permiten añadir componentes reutilizables a su proyecto, permitiéndole centrarse en el desarrollo
de su experiencia central. Puede importar módulos propios o módulos publicados por 8th
Wall directamente en sus proyectos autoalojados.

**Para importar un módulo en su proyecto autoalojado**:

1. Dentro del Editor Cloud, abra su proyecto Self-Hosted y pulse el icono Módulo en la navegación de la izquierda
   :

![Modules-left-nav](/images/modules-icon-left-nav.jpg)

2. Pulse "+" o "Importar módulo" para añadir un módulo disponible a su proyecto.

3. Pulse "Módulos públicos" para importar un módulo creado por 8th Wall, o "Mis módulos" para importar un módulo
   creado por un miembro de su espacio de trabajo. Sólo los módulos compatibles con el proyecto Self-Hosted estarán disponibles para su importación en
   . (Más información sobre [Compatibilidad de módulos](/legacy/guides/modules/compatibility/))

4. Seleccione en la lista el módulo que desea importar.

5. Pulse "Importar" para añadir su módulo a su proyecto. Tome nota del alias del módulo. Si ya
   tiene un módulo en su proyecto con el mismo alias, es posible que tenga que cambiar el nombre de su módulo.

6. Puede añadir hasta 10 módulos a su proyecto autoalojado. Estos módulos serán visibles como pestañas
   en la página Módulos del proyecto del Editor de la Nube de 8 Wall.

![self-hosted-project-modules](/images/self-hosted-project-modules.jpg)

7. Si selecciona el módulo importado, se mostrarán los detalles de configuración del módulo. A través de
   se pueden configurar diversos parámetros del módulo.

![self-hosted-project-module-details](/images/self-hosted-project-module-details.jpg)

8. Si importa un módulo creado por su equipo, verá varias opciones de destino de anclaje
   , entre las que se incluyen "Versión" (sólo si el módulo se ha desplegado al menos una vez) y "Commit" (le permite
   anclar el módulo a cualquier commit del código del módulo). Si selecciona un objetivo de anclaje "Versión",
   puede suscribir su módulo importado a actualizaciones de corrección de errores, actualizaciones de nuevas funciones o desactivar las actualizaciones automáticas del módulo
   .

![self-hosted-project-module-pinning-target](/images/self-hosted-project-module-pinning-target.jpg)

9. Una vez que haya añadido un módulo a su proyecto pulse "Copiar Código" y pegue el contenido de su portapapeles
   en el archivo `head.html` de su proyecto. Este fragmento permite que los módulos se carguen en
   su proyecto autoalojado con los ajustes de configuración del módulo que haya especificado. Tendrá que
   volver a copiar el fragmento de código y actualizar el `head.html` de su proyecto cada vez que realice un cambio en
   los ajustes de configuración del módulo.

![self-hosted-project-module-copy-code](/images/self-hosted-project-module-copy-code.jpg)

10. Es posible que tenga que realizar cambios en su código para integrar completamente el módulo.
