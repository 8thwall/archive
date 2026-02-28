---
id: changelog
sidebar_position: 7
---

# Registro de cambios

#### Release 27.2: (2024-December-04, v27.2.6.427 / 2024-November-04, v27.2.5.427 / 2024-October-23, v27.2.4.427) {#release-27-2024-october-23-2724427}

* Nuevas funciones:
  * Added VPS compatibility for Niantic Studio projects.

* Correcciones y mejoras:
  * Fixed an issue affecting the reliability of the the simulator in VPS projects. (27.2.5.427)
  * Improved the reliability of the camera pipeline initialization for enhanced AR experiences. (27.2.6.427)

#### Release 27.1: (2024-October-03, v27.1.9.427 / 2024-October-01, v27.1.6.427) {#release-27-1-2024-october-01-v2716427}

* Correcciones y mejoras:
  * Boosted localization and tracking quality at VPS locations, significantly enhancing stability and accuracy of VPS AR experiences.
  * Optimized SLAM relocalization & tracking.
  * Fixed an issue where the World Effects camera could teleport at the start of runtime in Studio.
  * Resolved an issue affecting the stability of VPS tracking to improve overall performance. (27.1.9.427)
  * Improved SLAM relocalization snaps AR content back to the proper position more quickly. (27.1.9.427)

#### Release 27: (2024-Sept-12, v27.0.4.427 / 2024-August-01, v27.0.2.427) {#release-27-2024-august-01-v2702427}

* Correcciones y mejoras:
  * Se ha corregido un problema al cambiar entre las experiencias Efectos del mundo y Efectos de la cara.
  * Mejorada la sincronización de la cámara XR con las escenas en Studio.
  * Registro optimizado para mejorar el rendimiento y obtener resultados más limpios.

#### Versión 26: (2024-jun-18, v26.0.6.150) {#release-26-2024-june-18-v2606150}

* Nuevas funciones:
  * Se ha añadido compatibilidad con los efectos faciales y el seguimiento del mundo en Niantic Studio.

* Correcciones y mejoras:
  * Se ha solucionado un problema con algunos proyectos de A-Frame que podía provocar un comportamiento inesperado.

#### Versión 25: (2024-May-28, v25.0.1.2384) {#release-25-2024-may-28-v25012384}

* Nuevas funciones:
  * Se ha actualizado el motor XR para que se descargue como componentes específicos en lugar de como un paquete grande.

#### Versión 24.1: (2024-28 de marzo, v24.1.10.2165 / 2024-29 de febrero, v24.1.5.2165 / 2024-13 de febrero, v24.1.2.2165 / 2024-25 de enero, v24.1.1.2165) {#release-241-2024-march-28-v241102165--2024-february-29-v24152165--2024-february-13-v24122165--2024-january-25-v24112165}

* Nuevas funciones:
  * Se actualizó 8Frame para que sea compatible con A-Frame 1.5.0.
  * Se agregó compatibilidad con la implementación metaversal para la actualización 1.5.0 del sistema operativo de Magic Leap 2.
  * Se actualizó el seguimiento de manos para que admita UV de mano izquierda y derecha, lo que permite dibujar fácilmente diseños en una malla de mano.
  * Se ha añadido compatibilidad con los efectos del cielo en el simulador de la octava pared. (24.1.2.2165)
  * Añadidos cuatro nuevos puntos de enganche de muñeca a Seguimiento de la mano. (24.1.5.2165)
  * Actualización de Metaversal Deployment para soportar realidad virtual en el navegador en Apple Vision Pro. (24.1.10.2165)

* Correcciones y mejoras:
  * Se mejoró el rendimiento de las experiencias de efectos del cielo.
  * Mejora de la estabilidad de seguimiento de la muñeca de Hand Tracking. (24.1.5.2165)

* Mejoras XRExtras:
  * Se agregó el parámetro `uv-orientation` a `xrextras-hand-mesh` para admitir la nueva funcionalidad de UV de manos.
  * Se ha solucionado un problema con MediaRecorder en iOS 17.4. (24.1.10.2165)

#### Versión 24: (29 de noviembre de 2023, v24.0.10.2165/16 de noviembre de 2023, v24.0.9.2165/1 de noviembre de 2023, v24.0.8.2165) {#release-24-2023-november-29-v240102165--2023-november-16-v24092165--2023-november-01-v24082165}

* Nuevas funciones:
  * Se agregaron tres nuevos puntos de fijación en las orejas para efectos faciales, lo que permite fijar con precisión contenido de RA en varios puntos de las orejas.
  * Se actualizó el seguimiento de manos para exponer los UV de las manos, lo que permite dibujar fácilmente diseños en una malla de manos.
  * Implementación metaversal mejorada para admitir las experiencias de 8th Wall en Magic Leap 2.
  * Se actualizó la integración de PlayCanvas para admitir tres nuevos puntos de fijación de orejas para efectos faciales. (24.0.9.2165)

* Correcciones y mejoras:
  * Se eliminaron algunas advertencias de PlayCanvas (24.0.10.2165)

* Mejoras XRExtras:
  * Se actualizaron componentes de A-Frame para facilitar los efectos faciales con nuevos puntos de fijación para las orejas

#### Versión 23: (24-agosto-2023, v23.1.1.2275 / 09-agosto-2023, v23.0.12.2275 / 28-julio-de 2023, v23.0.7.2275 / 25-julio-2023, v23.0.4.2275) {#release-23-2023-august-24-v23112275--2023-august-09-v230122275-2023-july-28-v23072275--2023-july-25-v23042275}

* Nuevas funciones:
  * Presentamos el Seguimiento de Manos: utilice manos, muñecas y dedos como lienzo interactivo para experiencias WebAR inmersivas.
     * Fije objetos 3D en los 36 puntos de fijación manual líderes del sector.
      * Utiliza la malla adaptable de manos del motor 8th Wall para ajustar el tamaño y el volumen de cualquier mano.
     * Se ha añadido el módulo de Superposición de Entrenamiento de Seguimiento de Manos para guiar a los usuarios a través de un flujo para asegurarse de que sus manos están a la vista de la cámara.
  * Actualización de la integración con PlayCanvas para que admita el Seguimiento de Manos. (23.0.12.2275)
  * Se ha añadida la API XrDevice.deviceInfo para consultar información detallada del dispositivo. (23.1.1.2275)

* Correcciones y mejoras:
  * La relocalización SLAM mejorada devuelve el contenido AR a la posición correcta más rápidamente y con mayor precisión tras una interrupción.
  * Selección de cámara refinada en dispositivos Android.
  * Limpiadas las advertencias relacionadas con los parámetros por defecto de xrhand. (23.0.7.2275)
  * Se ha corregido un problema con el contexto WebGL en dispositivos MacOS que utilizan Safari. (23.0.12.2275)
  * Seguimiento SLAM mejorado en una amplia gama de dispositivos. (23.1.1.2275)

* Mejoras XRExtras:
  * Nuevos componentes A-Frame para facilitar el desarrollo del Seguimiento de la Mano.
  * Corregido el sombreador de sombras en el PlayCanvas.

#### Versión 22.1: (15-mayo-2023, v22.1.7.1958 / 03-mayo-2023, v22.1.2.1958) {#release-221-2023-may-15-v22171958--2023-may-03-v22121958}

* Nuevas funciones:
  * Se ha añadido compatibilidad multifaz para Efectos Cara, lo que te permite aumentar hasta tres caras simultáneamente en una sola experiencia.
  * Se han actualizado los Efectos faciales para que admitan UV estándar o proyectadas, lo que le permite dibujar fácilmente diseños de Efectos faciales en una malla facial proyectada.

* Correcciones y mejoras:
  * Se ha solucionado un problema de orientación del dispositivo en dispositivos iOS 16.4.
  * Se ha solucionado un problema de rendimiento que podía producirse al utilizar un mando en un dispositivo Meta Quest.
  * Mejora del rendimiento de la experiencia three.js en auriculares. (22.1.7.1958)

* Mejoras XRExtras:
  * Añadido el parámetro `face-id` a `xrextras-faceanchor` para soportar la nueva funcionalidad multi-face. (22.1.7.1958)

#### Versión 22: (20-abril-2023, v22.0.4.1958) {#release-22-2023-april-20-v22041958}

* Nuevas funciones:
  * Presentamos los efectos de cara completamente renovados en el motor 8th Wall:
      * Mejora de la calidad y estabilidad del seguimiento para:
        * Zona de las cejas
        * Seguimiento ocular
        * Seguimiento bucal
      * Añadida la función de seguimiento del iris:
        * Añadida API para estimar la distancia interpupilar (DIP)
      * Se han añadido eventos faciales en tiempo real, fáciles de programar, que incluyen:
        * Cejas levantadas/bajadas
        * Boca abierta/cerrada
        * Ojo abierto/cerrado
      * Habilitados nuevos efectos de transformación de caras mediante la exposición de las posiciones uv de los puntos de la cara en el fotograma de la cámara.
      * Aumento de la altura de la malla de la cabeza para permitir efectos que se extiendan hasta el nacimiento del pelo.

* Correcciones y mejoras:
  * Mejorada la velocidad de detección del cielo para las experiencias de efecto cielo.


#### Versión 21.4: (07-abril-2023, v21.4.7.997 / 27-marzo-2023, v21.4.6.997) {#release-214-2023-april-07-v2147997--2023-march-27-v2146997}

* Nuevas funciones:
  * Presentamos efectos de cielo + seguimiento del mundo: crea experiencias inmersivas que aumenten el cielo y el suelo juntos en un solo proyecto.
    * Se ha añadido la capacidad de seguir simultáneamente contenidos interactivos 3D en el cielo y en superficies mediante SLAM.
    * Se ha añadido la posibilidad de mover contenido AR de la capa del cielo al suelo, y del suelo al cielo.
  * Actualizada la integración de PlayCanvas para que admita efectos del cielo, así como Seguimiento del cielo + mundo.
  * Integración mejorada de PlayCanvas con una nueva API unificada de ejecución() & parada() que sustituye a la API de ejecuciónXr() & paradaXr().
  * Se ha añadido una nueva API xrconfig que facilita la configuración de los distintos componentes XR que utiliza tu proyecto.

* Correcciones y mejoras:
  * Se ha solucionado un problema con la detección del cielo en el borde del encuadre de la cámara en algunas experiencias de efectos cielo.
  * Se ha solucionado un problema con el componente xrlayerscene cuando se utiliza en proyectos autoalojados.
  * Se ha solucionado un problema de orientación del dispositivo en dispositivos iOS 16.4 (21.4.7.997)

#### Versión 21.3: (17-marzo-2023, v21.3.8.997) {#release-213--2023-march-17-v2138997}

* Nuevas funciones:
  * Se han añadido controles de suavizado de bordes (edgeSmoothness) para efectos cielo, que te permiten ajustar con precisión el aspecto y la intensidad de los bordes entre el contenido virtual y el real en el cielo.
  * Se ha añadido soporte para efectos de cielo bloqueados por la cámara en three.js, lo que te permite añadir contenido al cielo que siempre está a la vista de la cámara en tus proyectos three.js.
  * Actualizado 8Frame para soportar A-Frame 1.4.1.
  * Actualizado el despliegue metaversal para soportar la Configuración de Salas en el Navegador Meta Quest.

* Correcciones y mejoras:
  * Mejora del rendimiento y la calidad visual de las experiencias con efectos cielo.
  * Se ha añadido la posibilidad de especificar contra qué ubicaciones de proyecto VPS desea localizar. Esto puede ayudar a mejorar los tiempos de localización del VPS si hay muchas Ubicaciones cercanas.
  * Se ha solucionado un problema por el que al abrir experiencias de PlayCanvas en el escritorio podía producirse un fallo.

#### Versión 21.2: (16-diciembre-2022, v21.2.2.997 / 13-diciembre-2022, v21.2.1.997) {#release-212--2022-december-16-v2122997--2022-december-13-v2121997}

* Nuevas funciones:
  * Presentamos efectos cielo: una importante actualización del motor 8th Wall que permite segmentar el cielo.
    * Se ha añadido la posibilidad de colocar contenido interactivo 3D en el cielo.
    * Se ha añadido la posibilidad de sustituir la máscara del cielo por imágenes o vídeo.
    * Se ha añadido el módulo de superposición de entrenamiento al cielo para guiar a los usuarios a través de un flujo para asegurarse de que apuntan su dispositivo al cielo.

* Correcciones y mejoras:
  * Mejora de la calidad del seguimiento en las ubicaciones VPS.
  * Se ha solucionado un problema de pixelación de los efectos cielo AFrame que afectaba a algunos teléfonos. (21.2.2.997)

* Mejoras XRExtras:
  * MediaRecorder mejorado para añadir otro método de dibujar elementos 2D en el lienzo grabado.
  * Corregido el renderizado de sombras en PlayCanvas v1.55+
  * Mejora del rendimiento de las primitivas A-Frame del Objetivo Imagen.

#### Versión 20.3: (22-noviembre-2022, v20.3.3.684) {#release-203--2022-november-22-v2033684}

* Nuevas funciones:
  * Actualizado el despliegue metaversal para soportar la realidad mixta en el navegador Meta Quest.
    * las experiencias de efectos del mundo de 8th Wall utilizan automáticamente el paso de vídeo AR en Meta Quest Pro y Meta Quest 2 cuando se accede en el navegador.

* Correcciones y mejoras:
  * Localización optimizada en ubicaciones VPS
  * Mejora de la calidad del seguimiento en las ubicaciones VPS mediante el uso de la malla seleccionada de cada ubicación del proyecto.
  * Experiencia mejorada para algunos dispositivos Android con varias cámaras.

#### Versión 20: (05-octubre-2022, v20.1.20.684 / 21-septiembre-2022, v20.1.19.684 / 21-septiembre-2022, v20.1.17.684) {#release-20--2022-october-05-v20120684--2022-september-21-v20119684--2022-september-21-v20117684}

* Nuevas funciones:
  * Presentamos Lightship VPS para Web: crea experiencias WebAR basadas en la localización conectando contenidos de AR con ubicaciones del mundo real.
    * Añadido un nuevo navegador geoespacial al portal del desarrollador de 8th Wall.
      * Buscar, crear y gestionar Ubicaciones activadas por VPS.
      * Genera y descarga mallas 3D para utilizarlas como oclusores, objetos de física o como referencia para crear animaciones que tengan en cuenta la ubicación.
    * Añadido el parámetro `enableVps` a XR8.XrController.configure() y xrweb.
    * Se han añadido eventos cuando una Ubicación está lista para ser escaneada, encontrada o perdida.
    * Se ha añadido la posibilidad de encontrar y acceder a la geometría de malla sin procesar de Location.
    * Se agregaron las APIs `XR8` `.Vps.makeWayspotWatcher`, y `XR8.Vps.projectWayspots` para consultar Ubicaciones activadas por VPS y Ubicaciones de Proyecto cercanas.
    * Añadido el módulo de superposición de entrenamiento VPS de Lightship para guiar a los usuarios a través de un flujo para localizar en ubicaciones del mundo real.
    * Se ha añadido la API XR8.Platform para desbloquear nuevas funciones de la plataforma de 8th Wall, como el VPS de Lightship y los mapas Niantic de Lightship.
  * Módulo del Mapa de Lightship de Niantic
    * Añade el módulo lightship-maps a tu proyecto en 8thwall.com para facilitar la creación de diversas experiencias basadas en la ubicación.

* Correcciones y mejoras:
  * Mejorado el tratamiento de errores en las peticiones de red VPS (20.1.19.684)
  * Solucionados problemas con algunas peticiones de red VPS (20.1.20.684)

#### Versión 19.1: (26-agosto-2022, v19.1.6.390 / 10-agosto-2022, v19.1.2.390) {#release-191--2022-august-26-v1916390--2022-august-10-v1912390}

* Correcciones y mejoras:
  * Se han solucionado problemas con las experiencias de 8th Wall dentro de WeChat en iOS.
  * Mejorado el seguimiento SLAM inicial para algunos dispositivos Android (19.1.6.390)

#### Versión 19: (5-mayo-2022, v19.0.16.390 / 13-abril-2022, v19.0.14.390 / 24-marzo-2022, v19.0.8.390) {#release-19--2022-may-5-v19016390--2022-april-13-v19014390--2022-march-24-v1908390}

* Nuevas funciones:
  * Presentamos la escala absoluta: una importante actualización del SLAM de 8th Wall para permitir la escala real en efectos del mundo:
    * Se ha añadido la posibilidad de activar la escala absoluta en los proyectos de efectos mundiales.
    * Añadido el parámetro escala a XR8.XrController.configure().
    * Se ha añadido el módulo Coaching Overlay para guiar a los usuarios a través de un flujo para generar los datos adecuados para la estimación de la escala.
  * Actualizado 8Frame para soportar A-Frame 1.3.0. (19.0.16.390)

* Correcciones y mejoras:
  * Rendimiento mejorado en varios dispositivos.
  * Experiencia mejorada para algunos dispositivos Android con varias cámaras.
  * Mejora del rendimiento de la escala absoluta en algunos dispositivos iOS. (19.0.14.390)
  * Corregida la mensajería de usuario del navegador Huawei en dispositivos Huawei. (19.0.14.390)

#### Versión 18.2: (09-marzo-2022, v18.2.4.554 / 14-enero-2022, v18.2.3.554 / 13-enero-2022, v18.2.2.554) {#release-182--2022-march-09-v1824554--2022-january-14-v1823554--2022-january-13-v1822554}

* Correcciones y mejoras:
  * Se ha solucionado un problema por el que los dispositivos con iOS 13 podían recargarse tras iniciar una sesión XR8.
  * Se ha solucionado un problema por el que el contexto WebGL podía perderse tras muchas sesiones XR8.
  * Experiencia mejorada para algunos dispositivos Android con varias cámaras.
  * Se ha solucionado un problema por el que la mezcla aditiva podía interferir con la alimentación de la cámara.
  * Solucionado un problema con los materiales transparentes. (18.2.3.554)
  * Se ha corregido un problema de representación de three.js en dispositivos con iOS 15.4 (18.2.4.554)

#### Versión 18.1: (02-diciembre-2021, v18.1.3.554) {#release-181--2021-december-02-v1813554}

* Correcciones y mejoras:
  * Se ha corregido un problema de carga en algunos dispositivos iOS al acceder a proyectos de AR en línea.
  * Se ha corregido un problema que negaba las indicaciones del navegador en algunos dispositivos iOS.
  * Se ha corregido un problema al rotar la orientación del dispositivo entre horizontal y vertical en SFSafariViewController.
  * Se ha mejorado la compatibilidad con algunos dispositivos Android que tienen relaciones de aspecto de cámara atípicas.

#### Versión 18: (08-Noviembre-2021, v18.0.6.554) {#release-18--2021-november-08-v1806554}

* Nuevas funciones:
  * Presentamos el Motor 8th Wall completamente reconstruido, con despliegue metaversal:
    * Añadida la API del módulo canalización para los gestores de sesiones.
    * Añadido el gestor de sesiones Web3D.
    * Añadidos gestores de sesión de auriculares para three.js y A-Frame.
    * Actualizados los dispositivos permitidos para incluir el móvil y los auriculares.
    * Añadidos parámetros adicionales de configuración de sesión en XR8.run().

* Correcciones y mejoras:
  * Captura de fotogramas mejorada con diversos dispositivos Pixel.
  * Actualizado el flujo WKWebView de iOS para admitir las experiencias a las que se accede a través de LinkedIn.

* XRextras:
  * Añadido el componente xrextras-opaque-background A-Frame y XRExtras.Lifecycle.attachListener.

#### Versión 17.2: (26-Octubre-2021, v17.2.4.476) {#release-172--2021-october-26-v1724476}

* Correcciones y mejoras:
  * Calidad de construcción del mapa SLAM mejorada.
  * Calidad de seguimiento optimizada de las experiencias SLAM.
  * Se ha mejorado la integración con PlayCanvas para poder dibujar en el mismo lienzo en el que se representa la imagen de la cámara.

#### Versión 17.1: (21-septiembre-2021, v17.1.3.476) {#release-171--2021-september-21-v1713476}

* Nuevas funciones:
  * Añadidas nuevas API
    * API para consultar el estado de inicialización del motor.
    * la imagen de la cámara three.js está disponible como una textura THREE.Texture.
    * Método de ciclo de vida para la eliminación de módulos de canalización.

* Correcciones y mejoras:
  * Calidad de construcción del mapa SLAM mejorada.
  * Calidad de seguimiento mejorada en una amplia gama de dispositivos.
  * Se ha mejorado la velocidad de fotogramas de las experiencias World Effects, Face Effects e Image Target en navegadores basados en Chromium y Firefox.
  * Mejorada la calidad de vídeo de MediaRecorder en dispositivos Android.

* Mejoras XRExtras:
  * Flujo de compartición MediaRecorder mejorado cuando la API Web Share de nivel 2 está activada.
  * Mejorado el tiempo de inicio del módulo de carga.
  * Mejorado el tratamiento del ciclo de vida de los módulos error de tiempo de ejecución, casi está y carga.
  * Se ha actualizado el módulo Almost There para mejorar el éxito de los escaneos de códigos QR.
  * Mejorada la lógica del lienzo de ventana completa en las vistas de pantalla dividida del iPad.

#### Versión 17: (20-julio-2021, v17.0.5.476) {#release-17--2021-july-20-v1705476}

* Correcciones y mejoras:
  * El seguimiento mejorado por encima del horizonte aumenta la calidad de los mapas mejorando el rendimiento de las experiencias WebAR que piden a los usuarios que apunten sus teléfonos hacia arriba para explorar completamente el contenido de AR.
  * La relocalización SLAM optimizada devuelve el contenido AR a la posición correcta en el espacio del mundo tras una interrupción.
  * Mejora de la calidad de seguimiento de las experiencias SLAM cuando los usuarios realizan movimientos de guiñada extremos.

* Mejoras XRExtras:
  * Se ha actualizado MediaRecorder para que vuelva a la vista previa de medios cuando los usuarios pulsen el botón "ver" en el cuadro de diálogo de iOS después de elegir descargar medios.

#### Versión 16.1: (02-junio-2021, v16.1.4.1227) {#release-161--2021-june-02-v16141227}

* Correcciones y mejoras:
  * Recuperación mejorada del seguimiento del mundo tras una interrupción.
  * Mejora de la gestión del ciclo de vida de los escuchadores de eventos en los proyectos A-Frame.
  * Se ha corregido un problema de errores de WebGL 1 en algunos dispositivos Android.
  * Se ha corregido un problema por el que, en ocasiones, MediaRecorder no mostraba una vista previa de la grabación.
  * Se ha solucionado un problema por el que cambiar de cámara varias veces podía provocar un fallo.
  * Compatibilidad mejorada al utilizar lienzos con contextos WebGL 2 predefinidos.

#### Versión 16: (21-mayo-2021, v16.0.8.1227 / 27-abril-2021, v16.0.6.1227 / 22-abril-2021, v16.0.5.1227) {#release-16--2021-may-21-v16081227--2021-april-27-v16061227--2021-april-22-v16051227}

* Nuevas funciones:
  * Presentamos el nuevo grabador multimedia de 8th Wall:
    * Utiliza la grabación conforme a las normas web del W3C cuando esté disponible.
    * Optimiza el rendimiento para mejorar la frecuencia de imagen durante la grabación.
    * Mejoras en la calidad de imagen y en la frecuencia de imagen de la grabación.

* Correcciones y mejoras:
  * Mejora la calidad del seguimiento y la frecuencia de imagen de las experiencias SLAM.
  * Mejora la calidad de seguimiento y la frecuencia de imagen de las experiencias de objetivo imagen.
  * Experiencia mejorada para algunos dispositivos Android con varias cámaras.
  * Solucionados los problemas de raycasting con PlayCanvas.
  * Solucionado un problema de seguimiento SLAM (v16.0.8.1227)

* Mejoras XRExtras:
  * Se ha actualizado MediaRecorder para que ofrezca una barra de progreso mientras se transcodifican las grabaciones en los dispositivos pertinentes.

#### Versión 15.3: (02-marzo-2021, v15.3.3.487) {#release-153--2021-march-2-v1533487}

* Nuevas funciones:
  * Actualizado 8Frame para soportar A-Frame 1.2.0.

* Correcciones y mejoras:
  * Se ha solucionado un problema con la reanudación de la alimentación de la cámara en Safari después de navegar de nuevo a una aplicación 8th Wall.
  * Corregido un problema al reanudar la alimentación de la cámara después de reabrir un WKWebView
  * Compatibilidad mejorada con diferentes versiones del motor de renderizado.
  * Flujos WKWebView de iOS optimizados para algunas aplicaciones nativas.

#### Versión 15.2: (14-diciembre-2020, v15.2.4.487) {#release-152--2020-december-14-v1524487}

* Nuevas funciones:
  * Se ha añadido compatibilidad con WKWebView en dispositivos con iOS 14.3 o posterior.
  * Se ha creado un contexto de cálculo accesible a los módulos de canalización para acelerar la visión por ordenador fuera de la pantalla de la GPU.
  * Actualizado 8Frame para soportar A-Frame 1.1.0.

* Correcciones y mejoras:
  * Mejora de la compatibilidad con los motores de renderizado.
  * Se ha añadido la posibilidad de cargar y descargar objetivos de imagen mientras se rastrean otros objetivos de imagen.
  * Se ha solucionado un problema con MediaRecorder relacionado con el cambio de contexto de audio.
  * Experiencia mejorada para algunos dispositivos Android con varias cámaras.
  * Se ha corregido un problema por el que a veces se ocultaban los errores de WebGL.
  * Solucionado un problema con el seguimiento simultáneo de objetivos de imágenes planas y curvas.
  * Se ha solucionado un problema con el cambio entre las canalizaciones WebGL y WebGL2.

* Mejoras XRExtras:
  * Flujos mejorados para iOS WKWebView en dispositivos con iOS 14.3 o posterior.
  * Se ha solucionado un problema con la desconexión del modulo de canalización de Estadísticas.

#### Versión 15.1: (27-octubre-2020, v15.1.4.487) {#release-151--2020-october-27-v1514487}

* Nuevas funciones:
  * Se ha añadido la posibilidad de utilizar objetivos de imagen curvada simultáneamente con SLAM.
  * Se ha añadido compatibilidad con A-Frame 1.1.0-beta, TRES 120 y MRCS HoloVideoObject 1.2.5.

* Correcciones y mejoras:
  * Mejora la calidad del seguimiento de objetivos de imagen plana simultáneamente con SLAM.
  * Velocidad de fotogramas mejorada para dispositivos con iOS 14 o superior.
  * Experiencia mejorada para algunos dispositivos Android con varias cámaras. (v15.0.9.487)
  * Rendimiento optimizado de algunos procesamientos de la GPU.
  * Integración mejorada de PlayCanvas con soporte para cambiar entre cámaras XR y FaceController.
  * Se ha corregido un problema con el acceso al micrófono de MediaRecorder por el que los eventos onPause no cerraban la entrada del micrófono.
  * Se ha solucionado un problema por el que MediaRecorder producía ocasionalmente archivos incompatibles con algunos reproductores de vídeo.
  * Se ha corregido un problema de difusión de rayos con AFrame 1.0.x. (v15.0.9.487)

* Mejoras XRExtras:
  * El módulo XRExtras.PauseOnHidden() pausa la alimentación de la cámara cuando se oculta la pestaña del navegador.

#### Versión 15: (09-octubre-2020, v15.0.9.487 / 22-septiembre-2020, v15.0.8.487) {#release-15--2020-october-09-v1509487--2020-september-22-v1508487}

* Nuevas funciones:
  * objetivos de imagen curvada de 8th Wall:
    * Se ha añadido compatibilidad con objetivos de imagen cilíndricos, como los que envuelven botellas, latas y otros.
    * Se ha añadido compatibilidad con objetivos de imagen cónicos, como los que envuelven tazas de café, sombreros de fiesta, pantallas de lámparas y otros.

* Correcciones y mejoras:
  * Calidad de seguimiento mejorada para SLAM y objetivos de imagen.
  * Se ha solucionado un problema con los hologramas MRCS y el enrutamiento de dispositivos en iOS 14.
  * Se ha corregido un problema con los efectos faciales y los objetivos de imagen por el que las actualizaciones de mirroredDisplay no se reflejaban durante el tiempo de ejecución.
  * Experiencia mejorada para algunos dispositivos Android con varias cámaras. (v15.0.9.487)
  * Solucionado un problema de difusión de rayos con AFrame 1.0.x (v15.0.9.487)

* Mejoras XRExtras:
  * Nuevos componentes AFrame para facilitar el desarrollo de objetivos de imagen curvada:
    * Componente prefabricado contenedor 3d que forma un contenedor similar a un portal en cuyo interior se puede colocar contenido 3d.
    * Componente prefabricado de reproducción de vídeo para activar fácilmente el vídeo en objetivos de imagen curvos.
  * Detección mejorada de la compatibilidad con Web Share API Nivel 2.

#### Versión 14.2: (30-julio-2020, v14.2.4.949) {#release-142--2020-july-30-v1424949}

* Nuevas funciones:
  * Se ha actualizado MediaRecorder.configure() para proporcionar más control sobre la salida de audio y la mezcla:
    * Introduce tu propio audioContext.
    * Solicita permisos de micrófono durante la configuración o el tiempo de ejecución.
    * Desactiva opcionalmente la grabación del micrófono.
    * Añade tus propios nodos de audio al gráfico de audio.
    * Incorpora el audio de la escena a la reproducción de la grabación.

* Correcciones y mejoras:
  * Se ha corregido un problema por el que, en algunos casos, los planos de recorte no se fijaban desde el PlayCanvas.
  * Se ha añadido la posibilidad de cambiar entre el seguimiento del mundo, el seguimiento del objetivo de la imagen y los efectos de cara en tiempo de ejecución.
  * Se ha solucionado un problema por el que los búferes de vértices podían rebotar después de eliminar matrices de vértices.
  * Experiencia mejorada para algunos dispositivos Android con varias cámaras.

#### Versión 14.1: (06-julio-2020, v14.1.4.949) {#release-141--2020-july-06-v1414949}

* Nuevas funciones:
  * Presentamos la grabación de vídeo de 8th Wall:
    * Añade grabación de vídeo en el navegador a cualquier proyecto de 8th Wall con la nueva API XR8.MediaRecorder.
    * Añade superposiciones dinámicas y tarjetas finales con imágenes personalizadas y llamadas a la acción.
    * Configura la duración y resolución máximas del vídeo.
  * Añadido el micrófono como permiso configurable del módulo.

* Correcciones y mejoras:
  * Funcionalidad mejorada de CanvasScreenshot con soporte de superposición mejorado.
  * Se ha solucionado un problema con los efectos faciales que podía causar fallos visuales al cambiar la orientación del dispositivo.
  * Mejorada la compatibilidad de las coordenadas derechas de los efectos de cara con Bablyon.js.
  * Se ha mejorado la compatibilidad del canal gráfico con Babylon.js.

* Mejoras XRExtras:
  * Componente prefabricado del botón grabar para capturar vídeo y fotos:
    * Selecciona entre los modos estándar, fijo y captura de fotos.
  * Componente prefabricado de previsualización para previsualizar, descargar y compartir capturas fácilmente
  * Utiliza XRExtras para personalizar fácilmente la experiencia de usuario de grabación de vídeo en tu proyecto:
    * Configura la duración y resolución máximas del vídeo.
    * Añade una marca de agua opcional a cada fotograma del vídeo.
    * Añade una tarjeta final opcional para añadir marca y una llamada a la acción al final del vídeo.

#### Versión 14: (26-mayo-2020) {#release-14--2020-may-26}

* Nuevas funciones:
  * Presentamos los efectos faciales de 8th Wall: coloca objetos 3D en los puntos de fijación de la cara y píntala con materiales, sombreadores o vídeos personalizados.
  * Modo Selfie: utiliza la cámara frontal con pantalla de espejo para conseguir el selfie perfecto.
  * Navegadores de escritorio: permite que tus experiencias de objetivo de imagen y efecto facial se ejecuten en navegadores de escritorio utilizando la webcam.

* Correcciones y mejoras:
  * Campo de visión de captura mejorado en los teléfonos Pixel 4/4XL.
  * Perfiles de cámara mejorados para determinados modelos de teléfono.
  * Se ha solucionado un problema al cambiar la orientación del dispositivo durante el inicio.
  * Se ha corregido un problema al cambiar la dirección de la cámara en la misma a-scene.
  * Se ha corregido un problema por el que los controles de aspecto AFrame no se eliminaban al reiniciar la escena.
  * Experiencia mejorada para algunos teléfonos Android con varias cámaras.
  * Otras correcciones y mejoras.

* Mejoras de XRExtras:
  * Casi hay flujos mejorados para experiencias que se pueden ver en el escritorio.
  * El módulo PauseOnBlur detiene la cámara cuando tu pestaña no está activa.
  * Nuevos componentes AFrame para facilitar el desarrollo de efectos faciales y experiencia de escritorio.
  * Nuevos ThreeExtras para renderizar materiales PBR, materiales básicos y vídeos en caras.

#### Versión 13.2: (13-febrero-2020) {#release-132--2020-feb-13}

* Nuevas funciones:
  * Libera el flujo de la cámara con XR8.pause() y vuelve a abrirlo con XR8.resume().
  * Añadida API para acceder al programa de sombreado y modificar los uniformes utilizados por GlTextureRenderer.
  * Añadida API para configurar el contexto WebGL en la ejecución.

* Correcciones y mejoras:
  * Corrige el problema del vídeo negro en iOS cuando un usuario realiza una pulsación larga sobre una imagen.
  * Mejora la velocidad y fiabilidad de la captura de pantalla de iOS.
  * Corregido el renderizado del canal alfa al hacer una captura de pantalla.
  * Experiencia mejorada para algunos teléfonos Android con varias cámaras.
  * Detección mejorada de vistas web de redes sociales.

* Mejoras de XRExtras:
  * Códigos QR mejorados con mayor compatibilidad con las cámaras nativas.
  * Flujos de salida mejorados para las redes sociales.
  * Personalización CSS mejorada.

#### Versión 13.1 {#release-131}

* Nuevas funciones:
  * Mejora de la velocidad de fotogramas en teléfonos Android de alta resolución.
  * El canal de la cámara puede detenerse y reiniciarse.
  * Los módulos del canalización de la cámara se pueden eliminar en tiempo de ejecución o cuando se detienen.
  * Nuevas llamadas de retorno del ciclo de vida para conectar y desconectar.

* Correcciones y mejoras:
  * Experiencia mejorada para algunos teléfonos Android con varias cámaras.
  * Corregida la calibración del teléfono iOS en iOS 12.2 y superiores.

#### Versión 13 {#release-13}

* Nuevas funciones:
  * Añade soporte para la creación, colaboración, publicación y alojamiento de contenidos WebAR basados en la nube.

#### Versión 12.1 {#release-121}

* Correcciones y mejoras:
  * Mayor resolución de la cámara en los nuevos dispositivos iOS.
  * Aumento de los fps de AFrame en dispositivos Android de alta resolución.
  * Solucionados los problemas de raycasting de three.js r103+.
  * Añadido soporte para iPadOS.
  * Solucionado un problema de memoria al cargar muchos objetivos de imagen repetidamente.
  * Mejoras menores de rendimiento y corrección de errores.

#### Versión 12 {#release-12}

* Nuevas funciones:
  * Aumentado el límite de subida de objetivos de imagen a 1000 objetivos de imagen por aplicación.
  * Nueva API para seleccionar objetivos de imagen activos en tiempo de ejecución.
  * Ahora las aplicaciones pueden buscar hasta 10 objetivos de imagen simultáneamente.
  * La cámara frontal es compatible con el marco de la cámara y los objetivos de imagen.
  * Motor compatible con PlayCanvas.

* Correcciones:
  * Experiencia mejorada para algunos teléfonos Android con varias cámaras.

* XRExtras:
  * Calidad visual mejorada en teléfonos Android.
  * Compatibilidad con los permisos de orientación del dispositivo iOS 13.
  * Mejor tratamiento de errores por falta de ensamblaje web en algunas versiones antiguas de iOS.
  * Soporte para PlayCanvas.

#### Versión 11.2 {#release-112}

* Nuevas funciones:
  * compatibilidad con movimiento de iOS 13.

#### Versión 11.1 {#release-111}

* Correcciones y mejoras:
  * Reducción del uso de memoria.
  * Mejora del rendimiento del seguimiento.
  * Detección mejorada de las capacidades del navegador.

#### Versión 11 {#release-11}

* Nuevas funciones:
  * Añadido soporte para objetivos de imagen.
  * Añadido soporte para BabylonJS.
  * Reducido el tamaño del binario JS a 1MB.
  * Se ha añadido soporte para ejecutar 8th Wall Web dentro de un iframe de origen cruzado.
  * Adiciones menores a la API.

#### Versión 10.1 {#release-101}

* Nuevas funciones:
  * Añadida compatibilidad con A-Frame 0.9.0.

* Correcciones:
  * Corregido error al proporcionar includedTypes a XrController.hitTest().
  * Reducción del uso de memoria al rastrear distancias largas.

#### Versión 10 {#release-10}

La versión 10 añade una consola de desarrollador web renovada con un modo de desarrollador optimizado, acceso a los orígenes permitidos y códigos QR. Añade compatibilidad con XRExtras de 8th Wall Web, un paquete de código abierto para la gestión de errores, visualizaciones de carga, flujos "casi está" y mucho más.

* Nuevas funciones:
  * Consola de desarrollador web renovada.
  * XR Extras proporciona una solución cómoda para:
    * Cargar pantallas y solicitar permisos de cámara.
    * Redirigir a los usuarios desde dispositivos o navegadores no compatibles ("casi está").
    * Tratamiento de errores en tiempo de ejecución.
    * Dibujar una imagen de cámara a pantalla completa en marcos de trabajo de bajo nivel como three.js.
  * Añadidas las interfaces públicas de iluminación y prueba de impacto a XrController.
  * Otras adiciones menores a la API.

* Correcciones:
  * Mejora de la velocidad de inicio de la aplicación.
  * Se ha solucionado un problema del marco de trabajo por el que los errores no se propagaban al iniciarse.
  * Se ha corregido un problema que podía producirse con WebGL durante la inicialización.
  * Utiliza la interfaz window.screen para la orientación del dispositivo, si está disponible.
  * Se ha corregido un problema de three.js que podía producirse al cambiar el tamaño del lienzo.

#### Versión 9.3 {#release-93}

* Nuevas funciones:
  * Adiciones menores a la API: XR.addCameraPipelineModules() y XR.FullWindowCanvas.pipelineModule()

#### Versión 9.2 {#release-92}

* Nuevas funciones:
  * Documentación pública publicada: https://docs.8thwall.com/web

#### Versión 9.1 {#release-91}

* Nuevas funciones:
  * Añadida compatibilidad con Amazon Sumerian en 8th Wall Web
  * Mejora de la estabilidad del seguimiento y eliminación de las fluctuaciones

#### Versión 9 {#release-9}

* ¡Lanzamiento inicial de 8th Wall Web!
