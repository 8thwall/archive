---
id: loading-infinite-spinner
---

# Pantalla de carga Infinite Spinner

#### Problema {#issue}

Al acceder a una experiencia WebAR, la página se queda atascada en la pantalla Cargando con un "spinner infinito".

![loading-infinite-spinner](/images/loading-infinite-spinner.jpg)

#### ¿Por qué ocurre esto? {#why-does-this-happen}

Si utiliza el módulo de XRExtras `loading` (que se incluye por defecto con todos los proyectos de 8th Wall y los ejemplos ), la pantalla de carga se muestra mientras se cargan la escena y los activos, y mientras el navegador espera a que se acepten los permisos del navegador. Si la escena tarda mucho tiempo en cargarse, o si algo impide que la escena se inicialice completamente, puede parecer que se queda "atascada" en esta pantalla para siempre.

#### Posibles causas {#potential-causes}

1. Activos grandes y/o conexión a Internet lenta

Si se encuentras en un lugar con wifi lento y/o servicio de telefonía móvil mientras intenta cargar una página Web AR con activos de gran tamaño, puede que la escena no esté realmente "atascada", sino que simplemente tarde mucho en cargarse . Utilice el inspector de Red del navegador para ver si su página está simplemente en proceso de descarga de activos .

Además, intente [optimizar al máximo los activos de la escena](/guides/your-3d-models-on-the-web/#texture-optimization) .  Esto puede incluir técnicas como la compresión de texturas, la reducción de la textura y/o la resolución de vídeo, y la reducción del número de polígonos de los modelos 3D.

2. Cámara bloqueada en una pestaña de fondo

Es posible que algunos dispositivos/navegadores no le permitan abrir la cámara si ya está siendo utilizada por otra pestaña. Intente cerrando cualquier otra pestaña que pueda estar utilizando la cámara, y luego vuelva a cargar la página.

3. específico de Safari iOS: Los elementos CSS empujan el elemento de vídeo "fuera de la pantalla"

Si ha añadido elementos HTML/CSS personalizados a su experiencia de WebAR, asegúrese de que están correctamente superpuestos sobre la escena. Si el elemento de vídeo de la página se desplaza fuera de la pantalla, iOS Safari no mostrará el vídeo. Esto, a su vez, desencadena una serie de acontecimientos que hacen que aparezca como si 8th Wall estuviera «atascado».  En realidad, esto es lo que ocurre:

El vídeo no se renderiza -> La escena AFrame no se inicializa completamente -> La escena AFrame nunca emite el evento "loaded" -> El módulo XRExtras Loading nunca desaparece (¡está a la escucha del evento "loading" de la escena, que nunca se dispara!)

Para resolverlo, le recomendamos que utilice la vista "Diseño" del inspector de Safari para visualizar el posicionamiento de su contenido DOM. A menudo, verá algo parecido a la imagen de abajo, en la que el elemento de vídeo queda "fuera de la pantalla" / "debajo del pliegue".

![video-element-offscreen](/images/video-element-offscreen.jpg)

Para solucionarlo, ajuste el posicionamiento CSS de eus elementos para que no empujen la señal de vídeo fuera de la pantalla . Utilizar el posicionamiento `absolute` es una forma de hacerlo.
