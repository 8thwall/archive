# Compatibilidad de módulos {#module-compatibility}

los módulos de 8th Wall pueden estar disponibles solo para proyectos hospedados en 8th Wall, solo para proyectos autohospedados o para ambos casos. Por defecto, los módulos están disponibles tanto para los proyectos alojados en 8th Wall como para los autohospedados. Esto se puede cambiar en la página de configuración del módulo.

![module-compatibility-settings](/images/modules-compatibility-settings.jpg)

Los módulos deben estar correctamente codificados para funcionar tanto en proyectos hospedados en 8th Wall como en proyectos autohospedados. En los activos particulares referenciados desde dentro de los módulos deben cargarse como de origen cruzado para que puedan cargarse en dominios autohospedados. Por ejemplo, estableciendo explícitamente el atributo de origen cruzado en los archivos:

![module-example-cors](/images/modules-example-cors.jpg)

O cargando previamente un blob de web worker utilizando captación antes de invocar al web worker:

![module-example-webworker](/images/modules-example-webworker.jpg)