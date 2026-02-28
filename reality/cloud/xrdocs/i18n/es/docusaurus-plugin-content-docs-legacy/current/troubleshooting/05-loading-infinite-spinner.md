---
id: loading-infinite-spinner
---

# Pantalla de carga Infinite Spinner

#### Edición {#issue}

Al acceder a una experiencia WebAR, la página se queda bloqueada en la pantalla de carga con un "spinner infinito".

![loading-infinite-spinner](/images/loading-infinite-spinner.jpg)

#### ¿Por qué ocurre esto? {#why-does-this-happen}

Si utiliza el módulo XRExtras `loading` (que se incluye por defecto con todos los proyectos de 8th Wall y los ejemplos de
), la pantalla de carga se muestra mientras se cargan la escena y los activos, y
mientras el navegador espera a que se acepten los permisos del navegador. Si la escena tarda mucho tiempo
en cargarse, o si algo impide que la escena se inicialice completamente, puede parecer que se queda "atascada" en
esta pantalla para siempre.

#### Posibles causas {#potential-causes}

1. Activos de gran tamaño y/o conexión a Internet lenta

Si usted está en un lugar con wifi lento y / o servicio celular al intentar cargar una página Web AR
con grandes activos, la escena no puede ser realmente "atascado", sino más bien sólo tomar mucho tiempo para
carga. Utilice el inspector de red del navegador para ver si su página está simplemente en proceso de descarga de activos
.

Además, intente [optimizar los activos de la escena](/legacy/guides/your-3d-models-on-the-web/#texture-optimization)
en la medida de lo posible.  Esto puede incluir técnicas como la compresión de texturas, la reducción de la textura
y/o la resolución de vídeo, y la reducción del número de polígonos de los modelos 3D.

2. Cámara bloqueada en una pestaña de fondo

Es posible que algunos dispositivos/navegadores no te permitan abrir la cámara si ya está siendo utilizada por otra pestaña. Intenta
cerrando cualquier otra pestaña que pueda estar utilizando la cámara, luego vuelve a cargar la página.

3. Específico de Safari para iOS: Los elementos CSS empujan el elemento de vídeo "fuera de la pantalla"

Si ha añadido elementos HTML/CSS personalizados a su experiencia Web AR, asegúrese de que están
correctamente superpuestos sobre la escena. Si el elemento de vídeo de la página se desplaza fuera de la pantalla, iOS
Safari no mostrará el vídeo. Esto desencadena a su vez una serie de acontecimientos que hacen que aparezca como
si 8ª Pared está "atascada".  En realidad, esto es lo que ocurre:

El vídeo no se renderiza -> La escena AFrame no se inicializa completamente -> La escena AFrame nunca emite el evento
"loaded" -> El módulo XRExtras Loading nunca desaparece (está a la escucha del evento "loading"
de la escena, que nunca se dispara).

Para solucionarlo, le recomendamos que utilice la vista "Diseño" del inspector de Safari para visualizar la posición
de su contenido DOM. A menudo, verá algo similar a la imagen de abajo donde
el elemento de vídeo es empujado "fuera de la pantalla" / "por debajo del pliegue".

![video-element-offscreen](/images/video-element-offscreen.jpg)

Para solucionarlo, ajusta el posicionamiento CSS de tus elementos para que no empujen la señal de vídeo fuera de la pantalla de
. Utilizar el posicionamiento `absoluto` es una forma de hacerlo.
