# Compatibilidad de módulos {#module-compatibility}

Los módulos de 8th Wall pueden estar disponibles sólo para proyectos alojados en 8th Wall, sólo para proyectos autoalojados,
o tanto para proyectos alojados en 8th Wall como para proyectos autoalojados. Por defecto, los módulos están disponibles tanto para proyectos alojados en 8th Wall
como para proyectos autoalojados. Esto puede cambiarse en la página de configuración del módulo.

![module-compatibility-settings](/images/modules-compatibility-settings.jpg)

Los módulos deben estar correctamente codificados para funcionar tanto en proyectos alojados en 8th Wall como en proyectos autoalojados. En
los activos particulares referenciados desde dentro de los módulos deben ser cargados como cross-origin enabled para que puedan
cargarse en dominios Self-Hosted. Por ejemplo, estableciendo explícitamente el atributo crossorigin en los medios
:

![module-example-cors](/images/modules-example-cors.jpg)

O precargar un blob de web worker usando fetch antes de invocar al web worker:

![module-example-webworker](/images/modules-example-webworker.jpg)