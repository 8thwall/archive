---
id: changelog
sidebar_position: 99999
---

# Registro de cambios

#### Versión 27.4: (2025-Jul-17 27.4.11.427 / 2025-May-07, v27.4.8.427 / 2025-April-10, v27.4.5.427) {#release-27-2025-May-7-2747}

- Nuevas funciones:
  - Se ha añadido compatibilidad con Image Target para los proyectos de 8th Wall Studio.

- Correcciones y mejoras:
  - Aumento a 32 del número máximo de objetivos de imagen activos
  - Desactivado el entorno predeterminado de escritorio para las experiencias de RA móviles con el modo de escritorio activado.
  - Se ha corregido un problema por el que la página de destino no aparecía para los efectos faciales con el modo de escritorio desactivado.
  - API VPS actualizada. VPS requiere ahora la versión 27.4 o superior del motor.
  - Se ha corregido un problema relacionado con el cambio de orientación de la cámara XR en proyectos de Studio (27.4.11.427).

#### Versión 27.3: (2025-Mar-19, v27.3.1.427) {#release-27-2025-March-19-2731427}

- Correcciones y mejoras:
  - Mejora del rendimiento de la localización en ubicaciones VPS
  - Corregidos los fallos al cambiar la orientación y la cámara
  - Corrección de los efectos de parpadeo de la cara

#### Versión 27.2: (2024-diciembre-04, v27.2.6.427 / 2024-noviembre-04, v27.2.5.427 / 2024-octubre-23, v27.2.4.427) {#release-27-2024-october-23-2724427}

- Nuevas funciones:
  - Se ha añadido compatibilidad con VPS para los proyectos de 8th Wall Studio.

- Correcciones y mejoras:
  - Se ha corregido un problema que afectaba a la fiabilidad del simulador en proyectos VPS. (27.2.5.427)
  - Se ha mejorado la fiabilidad de la inicialización del canal de la cámara para mejorar las experiencias de realidad aumentada. (27.2.6.427)

#### Versión 27.1: (2024-Octubre-03, v27.1.9.427 / 2024-Octubre-01, v27.1.6.427) {#release-27-1-2024-october-01-v2716427}

- Correcciones y mejoras:
  - Mejora de la localización y la calidad del seguimiento en ubicaciones VPS, lo que aumenta significativamente la estabilidad
    y la precisión de las experiencias de realidad aumentada VPS.
  - Reubicación y seguimiento SLAM optimizados.
  - Se ha corregido un problema por el que la cámara de Efectos del mundo podía teletransportarse al inicio del tiempo de ejecución en Studio.
  - Resuelto un problema que afectaba a la estabilidad del seguimiento de VPS para mejorar el rendimiento general. (27.1.9.427)
  - La relocalización SLAM mejorada devuelve el contenido AR a la posición correcta con mayor rapidez. (27.1.9.427)

#### Versión 27: (2024-septiembre-12, v27.0.4.427 / 2024-agosto-01, v27.0.2.427) {#release-27-2024-august-01-v2702427}

- Correcciones y mejoras:
  - Se ha corregido un problema al cambiar entre las experiencias Efectos del mundo y Efectos de la cara.
  - Mejorada la sincronización de la cámara XR con las escenas en Studio.
  - Registro optimizado para mejorar el rendimiento y obtener resultados más limpios.

#### Versión 26: (2024-Jun-18, v26.0.6.150) {#release-26-2024-june-18-v2606150}

- Nuevas funciones:
  - Se ha añadido compatibilidad con Face Effects y World Tracking en 8th Wall Studio.

- Correcciones y mejoras:
  - Se ha solucionado un problema con algunos proyectos de A-Frame que podía provocar un comportamiento inesperado.

#### Versión 25: (2024-May-28, v25.0.1.2384) {#release-25-2024-may-28-v25012384}

- Nuevas funciones:
  - Se ha actualizado el motor XR para que se descargue como componentes específicos en lugar de como un paquete grande.

#### Versión 24.1: (2024-28 de marzo, v24.1.10.2165 / 2024-29 de febrero, v24.1.5.2165 / 2024-13 de febrero, v24.1.2.2165 / 2024-25 de enero, v24.1.1.2165) {#release-241-2024-march-28-v241102165--2024-february-29-v24152165--2024-february-13-v24122165--2024-january-25-v24112165}

- Nuevas funciones:
  - Actualizado 8Frame para soportar A-Frame 1.5.0.
  - Se ha añadido compatibilidad con el despliegue metaversal para la actualización del sistema operativo Magic Leap 2 1.5.0.
  - Se ha actualizado el seguimiento de la mano para que admita UV de mano izquierda y derecha, lo que permite dibujar fácilmente diseños en una malla de mano.
  - Se ha añadido compatibilidad con los efectos del cielo al simulador de la octava pared. (24.1.2.2165)
  - Se han añadido cuatro nuevos puntos de enganche de muñeca a Seguimiento de la mano. (24.1.5.2165)
  - Actualización de Metaversal Deployment para soportar realidad virtual en el navegador en Apple Vision Pro. (24.1.10.2165)

- Correcciones y mejoras:
  - Mejora del rendimiento de las experiencias de Sky Effects.
  - Mejora de la estabilidad de seguimiento de la muñeca de Hand Tracking. (24.1.5.2165)

- Mejoras XRExtras:
  - Añadido el parámetro `uv-orientation` a `xrextras-hand-mesh` para soportar la nueva funcionalidad de UV de manos.
  - Se ha solucionado un problema con MediaRecorder en iOS 17.4. (24.1.10.2165)

#### Versión 24: (2023-29 de noviembre, v24.0.10.2165 / 2023-16 de noviembre, v24.0.9.2165 / 2023-01 de noviembre, v24.0.8.2165) {#release-24-2023-november-29-v240102165--2023-november-16-v24092165--2023-november-01-v24082165}

- Nuevas funciones:
  - Se han añadido tres nuevos puntos de fijación en las orejas para Efectos faciales, lo que permite fijar con precisión contenido de RA en varios puntos de las orejas.
  - Se ha actualizado el seguimiento de la mano para exponer las UV de la mano, lo que permite dibujar fácilmente diseños en una malla de mano.
  - Despliegue metaversal mejorado para soportar experiencias de 8ª pared en el Magic Leap 2.
  - Se ha actualizado la integración de PlayCanvas para admitir tres nuevos puntos de fijación de orejas para Efectos faciales. (24.0.9.2165)

- Correcciones y mejoras:
  - Eliminadas algunas advertencias de PlayCanvas (24.0.10.2165)

- Mejoras XRExtras:
  - Componentes AFrame actualizados para facilitar los efectos faciales con nuevos puntos de fijación para las orejas

#### Versión 23: (2023-24 de agosto, v23.1.1.2275 / 2023-09 de agosto, v23.0.12.2275 /2023-28 de julio, v23.0.7.2275 / 2023-25 de julio, v23.0.4.2275) {#release-23-2023-august-24-v23112275--2023-august-09-v230122275-2023-july-28-v23072275--2023-july-25-v23042275}

- Nuevas funciones:
  - Presentamos Hand Tracking: utilice manos, muñecas y dedos como lienzo interactivo para experiencias WebAR inmersivas.
    - Fije objetos 3D a los 36 puntos de fijación manual líderes del sector.
    - Utiliza la malla adaptable de manos del motor 8th Wall para ajustar el tamaño y el volumen de cualquier mano.
    - Se ha añadido un módulo de seguimiento de manos para guiar a los usuarios a través de un flujo para garantizar que sus manos estén a la vista de la cámara.
  - Actualizada la integración de PlayCanvas para soportar el Seguimiento de Manos. (23.0.12.2275)
  - Añadida la API XrDevice.deviceInfo para consultar información detallada del dispositivo. (23.1.1.2275)

- Correcciones y mejoras:
  - La relocalización SLAM mejorada devuelve el contenido AR a la posición correcta con mayor rapidez y precisión tras una interrupción.
  - Selección de cámara refinada en dispositivos Android.
  - Se han eliminado las advertencias relacionadas con los parámetros por defecto de xrhand. (23.0.7.2275)
  - Se ha corregido un problema con el contexto WebGL en dispositivos MacOS que utilizan Safari. (23.0.12.2275)
  - Seguimiento SLAM mejorado en una amplia gama de dispositivos. (23.1.1.2275)

- Mejoras XRExtras:
  - Nuevos componentes A-Frame para facilitar el desarrollo de Hand Tracking.
  - Corregido el sombreado de sombras en PlayCanvas.

#### Versión 22.1: (2023-May-15, v22.1.7.1958 / 2023-May-03, v22.1.2.1958) {#release-221-2023-may-15-v22171958--2023-may-03-v22121958}

- Nuevas funciones:
  - Se ha añadido compatibilidad con varias caras para Efectos faciales, lo que permite aumentar hasta tres caras simultáneamente en una sola experiencia.
  - Se han actualizado los efectos faciales para que admitan UV estándar o proyectadas, lo que permite dibujar fácilmente diseños de efectos faciales en una malla facial proyectada.

- Correcciones y mejoras:
  - Se ha corregido un problema de orientación del dispositivo en dispositivos iOS 16.4.
  - Se ha solucionado un problema de rendimiento que podía producirse al utilizar un mando en un dispositivo Meta Quest.
  - Mejora del rendimiento de las experiencias three.js en auriculares. (22.1.7.1958)

- Mejoras XRExtras:
  - Se ha añadido el parámetro `face-id` a `xrextras-faceanchor` para soportar la nueva funcionalidad multi-face. (22.1.7.1958)

#### Versión 22: (2023-Abril-20, v22.0.4.1958) {#release-22-2023-april-20-v22041958}

- Nuevas funciones:
  - Presentamos los efectos faciales completamente renovados de 8th Wall Engine:
    - Mejora de la calidad de seguimiento y la estabilidad para:
      - Región de las cejas
      - Seguimiento ocular
      - Seguimiento bucal
    - Se ha añadido la función de seguimiento del iris:
      - API añadida para calcular la distancia interpupilar (IPD)
    - Se han añadido eventos faciales en tiempo real fáciles de programar:
      - Cejas levantadas/bajadas
      - Boca abierta/cerrada
      - Ojo abierto/cerrado
    - Habilitados nuevos efectos de morphing facial mediante la exposición de las posiciones uv de los puntos faciales en el encuadre de la cámara.
    - Aumento de la altura de la malla de la cabeza para permitir efectos que se extienden hasta la línea del cabello.

- Correcciones y mejoras:
  - Mejorada la velocidad de detección del cielo para las experiencias de Efecto Cielo.

#### Versión 21.4: (2023-Abril-07, v21.4.7.997 / 2023-Marzo-27, v21.4.6.997) {#release-214-2023-april-07-v2147997--2023-march-27-v2146997}

- Nuevas funciones:
  - Presentamos Sky Effects + World Tracking: cree experiencias inmersivas que aumenten el cielo y el suelo juntos en un solo proyecto:
    - Se ha añadido la capacidad de rastrear simultáneamente contenidos interactivos 3D en el cielo y en superficies mediante SLAM.
    - Se ha añadido la posibilidad de mover contenido RA de la capa del cielo al suelo, y del suelo al cielo.
  - Se ha actualizado la integración de PlayCanvas para que admita los efectos del cielo y el seguimiento del cielo y el mundo.
  - Integración mejorada de PlayCanvas con una nueva API unificada de ejecución() y parada() que sustituye a la API de ejecuciónXr() y paradaXr().
  - Se ha añadido una nueva API xrconfig que facilita la configuración de los distintos componentes XR que utiliza el proyecto.

- Correcciones y mejoras:
  - Se ha solucionado un problema con la detección del cielo en el borde del encuadre de la cámara en algunas experiencias de Efectos del cielo.
  - Se ha corregido un problema con el componente xrlayerscene cuando se utiliza en proyectos autoalojados.
  - Solucionado un problema de orientación del dispositivo en dispositivos iOS 16.4 (21.4.7.997)

#### Versión 21.3: (2023-Mar-17, v21.3.8.997) {#release-213--2023-march-17-v2138997}

- Nuevas funciones:
  - Se han añadido controles de suavizado de bordes (edgeSmoothness) para Efectos del cielo, lo que permite ajustar con precisión el aspecto y la intensidad de los bordes entre el contenido virtual y el real en el cielo.
  - Se ha añadido compatibilidad con los efectos de cielo bloqueado por cámara en three.js, lo que permite añadir contenido al cielo que siempre está a la vista de la cámara en los proyectos three.js.
  - Actualizado 8Frame para soportar A-Frame 1.4.1.
  - Actualizado el Despliegue Metaversal para soportar la Configuración de Salas en el Navegador Meta Quest.

- Correcciones y mejoras:
  - Mejora del rendimiento y la calidad visual de las experiencias de Sky Effects.
  - Se ha añadido la posibilidad de especificar contra qué ubicaciones de proyecto VPS desea localizar. Esto puede ayudar a mejorar los tiempos de localización del VPS si hay muchas Ubicaciones cercanas.
  - Se ha corregido un problema por el que la apertura de las experiencias de PlayCanvas en el escritorio podía provocar un bloqueo.

#### Versión 21.2: (2022-diciembre-16, v21.2.2.997 / 2022-diciembre-13, v21.2.1.997) {#release-212--2022-december-16-v2122997--2022-december-13-v2121997}

- Nuevas funciones:
  - Presentación de Sky Effects: una importante actualización del motor de la 8ª pared que permite segmentar el cielo:
    - Se ha añadido la posibilidad de colocar contenidos interactivos 3D en el cielo.
    - Se ha añadido la posibilidad de sustituir la máscara celeste por imágenes o vídeo.
    - Añadido el módulo Sky Coaching Overlay para guiar a los usuarios a través de un flujo para asegurarse de que están apuntando su dispositivo hacia el Cielo.

- Correcciones y mejoras:
  - Mejora de la calidad del seguimiento en las ubicaciones VPS.
  - Se ha corregido un problema de pixelación de AFrame Sky Effects que afectaba a algunos teléfonos. (21.2.2.997)

- Mejoras XRExtras:
  - MediaRecorder mejorado para añadir otro método de dibujar elementos 2D en el lienzo grabado.
  - Corregido el renderizado de sombras en PlayCanvas v1.55+
  - Mejora del rendimiento de las primitivas Image Target A-Frame.

#### Versión 20.3: (2022-Noviembre-22, v20.3.3.684) {#release-203--2022-november-22-v2033684}

- Nuevas funciones:
  - Actualizado el Despliegue Metaversal para soportar la realidad mixta en el Navegador Meta Quest.
    - Las experiencias de 8th Wall World Effects hacen uso automáticamente del vídeo passthrough AR en Meta Quest Pro y Meta Quest 2 cuando se accede en el navegador.

- Correcciones y mejoras:
  - Localización optimizada en ubicaciones VPS
  - Mejora de la calidad del seguimiento en las ubicaciones VPS mediante el uso de la malla seleccionada de cada ubicación del proyecto.
  - Experiencia mejorada para algunos dispositivos Android con varias cámaras.

#### Versión 20: (2022-Octubre-05, v20.1.20.684 / 2022-Septiembre-21, v20.1.19.684 / 2022-Septiembre-21, v20.1.17.684) {#release-20--2022-october-05-v20120684--2022-september-21-v20119684--2022-september-21-v20117684}

- Nuevas funciones:
  - Presentación de Lightship VPS para Web: cree experiencias WebAR basadas en la ubicación conectando el contenido de RA a ubicaciones del mundo real.
    - Se ha añadido un nuevo navegador geoespacial al portal para desarrolladores 8th Wall.
      - Buscar, crear y gestionar Ubicaciones activadas por VPS.
      - Genere y descargue mallas 3D para utilizarlas como oclusores, objetos de física o como referencia para crear animaciones que tengan en cuenta la ubicación.
    - Añadido el parámetro `enableVps` a XR8.XrController.configure() y xrweb.
    - Se han añadido eventos cuando una Ubicación está lista para ser escaneada, encontrada o perdida.
    - Se ha añadido la posibilidad de encontrar y acceder a la geometría de malla sin procesar de Location.
    - Añadidas las APIs `XR8.Vps.makeWayspotWatcher`, y `XR8.Vps.projectWayspots` para consultar Ubicaciones activadas VPS y Ubicaciones de Proyecto cercanas.
    - Añadido el módulo Lightship VPS Coaching Overlay para guiar a los usuarios a través de un flujo para localizar en lugares del mundo real.
    - Se ha añadido la API XR8.Platform para desbloquear nuevas funciones de la plataforma 8th Wall como Lightship VPS y Niantic Lightship Maps.
  - Módulo Niantic Lightship Map
    - Añade el módulo lightship-maps a tu proyecto en 8thwall.com para facilitar la creación de diversas experiencias basadas en la ubicación.

- Correcciones y mejoras:
  - Mejora de la gestión de errores en las solicitudes de red VPS (20.1.19.684)
  - Solucionados problemas con algunas peticiones de red VPS (20.1.20.684)

#### Versión 19.1: (2022-26 de agosto, v19.1.6.390 / 2022-10 de agosto, v19.1.2.390) {#release-191--2022-august-26-v1916390--2022-august-10-v1912390}

- Correcciones y mejoras:
  - Se han solucionado problemas con las experiencias del 8º muro de WeChat en iOS.
  - Mejorado el seguimiento SLAM inicial para algunos dispositivos Android (19.1.6.390)

#### Versión 19: (2022-May-5, v19.0.16.390 / 2022-April-13, v19.0.14.390 / 2022-March-24, v19.0.8.390) {#release-19--2022-may-5-v19016390--2022-april-13-v19014390--2022-march-24-v1908390}

- Nuevas funciones:
  - Presentamos la Escala Absoluta: una importante actualización del SLAM de la 8ª Pared para permitir la escala del mundo real en los Efectos Mundiales:
    - Se ha añadido la posibilidad de activar la Escala Absoluta en los proyectos de Efectos Mundiales.
    - Añadido el parámetro scale a XR8.XrController.configure().
    - Se ha añadido el módulo Coaching Overlay para guiar a los usuarios a través de un flujo para generar los datos apropiados para la estimación de la escala.
  - Actualizado 8Frame para soportar A-Frame 1.3.0. (19.0.16.390)

- Correcciones y mejoras:
  - Rendimiento mejorado en varios dispositivos.
  - Experiencia mejorada para algunos dispositivos Android con varias cámaras.
  - Mejora del rendimiento de Escala Absoluta en algunos dispositivos iOS. (19.0.14.390)
  - Corregida la mensajería de usuario del navegador Huawei en dispositivos Huawei. (19.0.14.390)

#### Versión 18.2: (2022-marzo-09, v18.2.4.554 / 2022-enero-14, v18.2.3.554 / 2022-enero-13, v18.2.2.554) {#release-182--2022-march-09-v1824554--2022-january-14-v1823554--2022-january-13-v1822554}

- Correcciones y mejoras:
  - Se ha solucionado un problema por el que los dispositivos con iOS 13 podían volver a cargarse tras iniciar una sesión XR8.
  - Se ha corregido un problema por el que el contexto WebGL podía perderse tras muchas sesiones XR8.
  - Experiencia mejorada para algunos dispositivos Android con varias cámaras.
  - Se ha solucionado un problema por el que la mezcla aditiva podía interferir con la alimentación de la cámara.
  - Se ha corregido un problema con los materiales transparentes. (18.2.3.554)
  - Se ha corregido un problema de representación de three.js en dispositivos con iOS 15.4 (18.2.4.554).

#### Versión 18.1: (2021-diciembre-02, v18.1.3.554) {#release-181--2021-december-02-v1813554}

- Correcciones y mejoras:
  - Se ha corregido un problema de carga en algunos dispositivos iOS al acceder a proyectos de RA en línea.
  - Se ha corregido un problema que impedía el acceso a las indicaciones del navegador en algunos dispositivos iOS.
  - Se ha corregido un problema al rotar la orientación del dispositivo entre horizontal y vertical en SFSafariViewController.
  - Se ha mejorado la compatibilidad con algunos dispositivos Android que tienen relaciones de aspecto atípicas en la alimentación de la cámara.

#### Versión 18: (2021-Noviembre-08, v18.0.6.554) {#release-18--2021-november-08-v1806554}

- Nuevas funciones:
  - Presentamos el nuevo motor de la 8ª Muralla con despliegue metaversal:
    - Añadida la API del módulo pipeline para los gestores de sesiones.
    - Añadido gestor de sesiones Web3D.
    - Añadidos gestores de sesión de auriculares para three.js y A-Frame.
    - Actualizado allowedDevices para incluir móvil y auriculares.
    - Añadidos parámetros adicionales de configuración de sesión en XR8.run().

- Correcciones y mejoras:
  - Captura de fotogramas mejorada con diversos dispositivos Pixel.
  - Se ha actualizado el flujo WKWebView de iOS para que sea compatible con las experiencias a las que se accede a través de LinkedIn.

- XRextras:
  - Añadido el componente xrextras-opaque-background A-Frame y XRExtras.Lifecycle.attachListener.

#### Versión 17.2: (2021-Octubre-26, v17.2.4.476) {#release-172--2021-october-26-v1724476}

- Correcciones y mejoras:
  - Mejora de la calidad de construcción del mapa SLAM.
  - Calidad de seguimiento optimizada de las experiencias SLAM.
  - Se ha mejorado la integración con PlayCanvas para poder dibujar en el mismo lienzo en el que se representa la imagen de la cámara.

#### Versión 17.1: (2021-Septiembre-21, v17.1.3.476) {#release-171--2021-september-21-v1713476}

- Nuevas funciones:
  - Nuevas API
    - API para consultar el estado de inicialización del motor.
    - El feed de la cámara three.js está disponible como THREE.Texture.
    - Método de ciclo de vida para la eliminación de módulos de tuberías.

- Correcciones y mejoras:
  - Mejora de la calidad de construcción del mapa SLAM.
  - Calidad de seguimiento mejorada en una amplia gama de dispositivos.
  - Se ha mejorado la velocidad de fotogramas de las experiencias World Effects, Face Effects e Image Target en navegadores basados en Chromium y Firefox.
  - Mejora de la calidad de vídeo de MediaRecorder en dispositivos Android.

- Mejoras XRExtras:
  - Flujo de compartición de MediaRecorder mejorado cuando la API Web Share de nivel 2 está activada.
  - Mejora del tiempo de arranque del módulo de carga.
  - Mejora de la gestión del ciclo de vida de los módulos Runtime Error, Almost There y Loading.
  - Se ha actualizado el módulo Almost There para mejorar el éxito de los escaneados de códigos QR.
  - Se ha mejorado la lógica del lienzo de ventana completa en las vistas de pantalla dividida del iPad.

#### Versión 17: (2021-Julio-20, v17.0.5.476) {#release-17--2021-july-20-v1705476}

- Correcciones y mejoras:
  - El seguimiento mejorado por encima del horizonte aumenta la calidad de los mapas y mejora el rendimiento de las experiencias WebAR que piden a los usuarios que apunten sus teléfonos hacia arriba para explorar completamente el contenido AR.
  - La relocalización SLAM optimizada devuelve el contenido de RA a la posición correcta en el espacio global tras una interrupción.
  - Mejora de la calidad de seguimiento de las experiencias SLAM cuando los usuarios realizan movimientos extremos de guiñada.

- Mejoras XRExtras:
  - Se ha actualizado MediaRecorder para que vuelva a la vista previa de medios cuando los usuarios pulsan el botón "ver" en el cuadro de diálogo de iOS después de elegir descargar medios.

#### Versión 16.1: (2021-Jun-02, v16.1.4.1227) {#release-161--2021-june-02-v16141227}

- Correcciones y mejoras:
  - Recuperación mejorada del seguimiento mundial tras una interrupción.
  - Mejora de la gestión del ciclo de vida de los escuchadores de eventos en los proyectos A-Frame.
  - Se ha corregido un problema de errores de WebGL 1 en algunos dispositivos Android.
  - Se ha corregido un problema por el que, en ocasiones, MediaRecorder no mostraba una vista previa de la grabación.
  - Se ha corregido un problema por el que cambiar de cámara varias veces podía provocar un bloqueo.
  - Mejora de la compatibilidad utilizando lienzos con contextos WebGL 2 predefinidos.

#### Versión 16: (2021-May-21, v16.0.8.1227 / 2021-April-27, v16.0.6.1227 / 2021-April-22, v16.0.5.1227) {#release-16--2021-may-21-v16081227--2021-april-27-v16061227--2021-april-22-v16051227}

- Nuevas funciones:
  - Presentamos el nuevo MediaRecorder de 8th Wall:
    - Utiliza la grabación conforme a los estándares web W3C cuando está disponible.
    - Optimiza el rendimiento para mejorar la frecuencia de imagen durante la grabación.
    - Mejoras en la calidad de imagen y la frecuencia de imagen de la grabación.

- Correcciones y mejoras:
  - Mejora de la calidad de seguimiento y la frecuencia de imagen de las experiencias SLAM.
  - Mejora de la calidad de seguimiento y de la frecuencia de imagen de las experiencias de Image Target.
  - Experiencia mejorada para algunos dispositivos Android con varias cámaras.
  - Arreglados los problemas de raycasting con PlayCanvas.
  - Solucionado el problema de seguimiento SLAM (v16.0.8.1227)

- Mejoras XRExtras:
  - Se ha actualizado MediaRecorder para que muestre una barra de progreso mientras se transcodifican las grabaciones en los dispositivos pertinentes.

#### Versión 15.3: (2021-March-2, v15.3.3.487) {#release-153--2021-march-2-v1533487}

- Nuevas funciones:
  - Actualizado 8Frame para soportar A-Frame 1.2.0.

- Correcciones y mejoras:
  - Se ha solucionado un problema al reanudar la reproducción de la cámara en Safari después de volver a una aplicación de 8th Wall.
  - Se ha corregido un problema con la reanudación de la alimentación de la cámara después de volver a abrir un WKWebView
  - Mejora de la compatibilidad con distintas versiones de motores de renderizado.
  - Flujos WKWebView de iOS optimizados para algunas aplicaciones nativas.

#### Versión 15.2: (2020-diciembre-14, v15.2.4.487) {#release-152--2020-december-14-v1524487}

- Nuevas funciones:
  - Se ha añadido compatibilidad con WKWebView en dispositivos con iOS 14.3 o posterior.
  - Se ha creado un contexto de cálculo accesible a los módulos de canalización para acelerar la visión por ordenador fuera de pantalla en la GPU.
  - Actualizado 8Frame para soportar A-Frame 1.1.0.

- Correcciones y mejoras:
  - Mejora de la compatibilidad con los motores de renderizado.
  - Se ha añadido la posibilidad de cargar y descargar objetivos de imagen mientras se rastrean otros objetivos de imagen.
  - Se ha corregido un problema con MediaRecorder relacionado con el cambio de contexto de audio.
  - Experiencia mejorada para algunos dispositivos Android con varias cámaras.
  - Se ha corregido un problema por el que a veces se ocultaban los errores de WebGL.
  - Se ha solucionado un problema con el seguimiento simultáneo de objetivos de imágenes planas y curvas.
  - Se ha corregido un problema al cambiar entre los canales WebGL y WebGL2.

- Mejoras XRExtras:
  - Flujos mejorados para iOS WKWebView en dispositivos con iOS 14.3 o posterior.
  - Se ha corregido un problema con la desconexión de la tubería del módulo de estadísticas.

#### Versión 15.1: (2020-Octubre-27, v15.1.4.487) {#release-151--2020-october-27-v1514487}

- Nuevas funciones:
  - Añadido soporte para objetivos de imagen curvada para ser utilizados simultáneamente con SLAM.
  - Se ha añadido compatibilidad con A-Frame 1.1.0-beta, THREE 120 y MRCS HoloVideoObject 1.2.5.

- Correcciones y mejoras:
  - Mejora de la calidad del seguimiento de objetivos de imagen plana simultáneamente con SLAM.
  - Mejora de la velocidad de fotogramas en dispositivos con iOS 14 o superior.
  - Experiencia mejorada para algunos dispositivos Android con varias cámaras. (v15.0.9.487)
  - Rendimiento optimizado de algunos procesamientos de GPU.
  - Integración mejorada de PlayCanvas con soporte para cambiar entre cámaras XR y FaceController.
  - Se ha corregido un problema con el acceso al micrófono de MediaRecorder por el que los eventos onPause no cerraban la entrada del micrófono.
  - Se ha corregido un problema por el que MediaRecorder producía ocasionalmente archivos incompatibles con algunos reproductores de vídeo.
  - Se ha corregido un problema de difusión de rayos con AFrame 1.0.x. (v15.0.9.487)

- Mejoras XRExtras:
  - El módulo XRExtras.PauseOnHidden() pausa la alimentación de la cámara cuando se oculta la pestaña del navegador.

#### Versión 15: (2020-Octubre-09, v15.0.9.487 / 2020-Septiembre-22, v15.0.8.487) {#release-15--2020-october-09-v1509487--2020-september-22-v1508487}

- Nuevas funciones:
  - Objetivos de imagen curva de 8ª pared:
    - Se ha añadido compatibilidad con objetivos de imagen cilíndricos, como los que envuelven botellas, latas, etc.
    - Se ha añadido compatibilidad con objetivos de imagen cónicos, como los que envuelven tazas de café, sombreros de fiesta, pantallas de lámparas, etc.

- Correcciones y mejoras:
  - Calidad de seguimiento mejorada para SLAM y objetivos de imagen.
  - Se ha solucionado un problema con los hologramas MRCS y el enrutamiento de dispositivos en iOS 14.
  - Se ha corregido un problema con los efectos faciales y los objetivos de imagen por el que las actualizaciones de mirroredDisplay no se reflejaban durante el tiempo de ejecución.
  - Experiencia mejorada para algunos dispositivos Android con varias cámaras. (v15.0.9.487)
  - Se ha corregido un problema de difusión de rayos con AFrame 1.0.x (v15.0.9.487).

- Mejoras XRExtras:
  - Nuevos componentes AFrame para facilitar el desarrollo de objetivos de imagen curva:
    - Componente prefabricado de contenedor 3D que forma un contenedor similar a un portal en cuyo interior se puede colocar contenido 3D.
    - Componente prefabricado de reproducción de vídeo para habilitar fácilmente vídeo en objetivos de imagen curvos.
  - Detección mejorada de la compatibilidad con Web Share API de nivel 2.

#### Versión 14.2: (2020-Julio-30, v14.2.4.949) {#release-142--2020-july-30-v1424949}

- Nuevas funciones:
  - Actualizado MediaRecorder.configure() para proporcionar más control sobre la salida de audio y la mezcla:
    - Introduce tu propio audioContext.
    - Solicitar permisos de micrófono durante la configuración o la ejecución.
    - Desactiva opcionalmente la grabación del micrófono.
    - Añade tus propios nodos de audio al gráfico de audio.
    - Incorpora el audio de la escena a la reproducción de la grabación.

- Correcciones y mejoras:
  - Se ha corregido un problema por el que los planos de recorte no se establecían desde PlayCanvas en algunos casos.
  - Se ha añadido soporte para cambiar entre el seguimiento del mundo, el seguimiento del objetivo de la imagen y los efectos de cara en tiempo de ejecución.
  - Se ha corregido un problema por el que los búferes de vértices podían recuperarse tras eliminar matrices de vértices.
  - Experiencia mejorada para algunos dispositivos Android con varias cámaras.

#### Versión 14.1: (2020-julio-06, v14.1.4.949) {#release-141--2020-july-06-v1414949}

- Nuevas funciones:
  - Presentamos la 8ª grabación de vídeo mural:
    - Añade grabación de vídeo en el navegador a cualquier proyecto de 8th Wall con la nueva API XR8.MediaRecorder.
    - Añada superposiciones dinámicas y tarjetas finales con imágenes personalizadas y llamadas a la acción.
    - Configure la duración y la resolución máximas del vídeo.
  - Añadido el micrófono como permiso configurable del módulo.

- Correcciones y mejoras:
  - Funcionalidad CanvasScreenshot mejorada con soporte de superposición mejorado.
  - Se ha solucionado un problema con los efectos faciales que podía provocar fallos visuales al cambiar la orientación del dispositivo.
  - Se ha mejorado la compatibilidad de las coordenadas derechas de Face Effects con Bablyon.js.
  - Se ha mejorado la compatibilidad del canal gráfico con Babylon.js.

- Mejoras XRExtras:
  - Componente prefabricado de botón de grabación para capturar vídeo y fotos:
    - Selecciona entre los modos estándar, fijo y de captura de fotos.
  - Componente prefabricado de previsualización para previsualizar, descargar y compartir capturas fácilmente
  - Utilice XRExtras para personalizar fácilmente la experiencia de usuario de grabación de vídeo en su proyecto:
    - Configura la duración y resolución máximas del vídeo.
    - Añade una marca de agua opcional a cada fotograma del vídeo.
    - Añade una tarjeta final opcional para añadir marca y una llamada a la acción al final del vídeo.

#### Release 14: (2020-May-26) {#release-14--2020-may-26}

- Nuevas funciones:
  - Presentamos 8th Wall Face Effects: Adjunta objetos 3D a los puntos de fijación de la cara y píntala con materiales, sombreadores o vídeos personalizados.
  - Modo Selfie: Utiliza la cámara frontal con pantalla de espejo para conseguir el selfie perfecto.
  - Navegadores de escritorio: Permite que tus experiencias de destino de imagen y efecto facial se ejecuten en navegadores de escritorio utilizando la cámara web.

- Correcciones y mejoras:
  - Campo de visión de captura mejorado en los teléfonos Pixel 4/4XL.
  - Perfiles de cámara mejorados para determinados modelos de teléfono.
  - Se ha solucionado un problema con el cambio de orientación del dispositivo durante el inicio.
  - Se ha corregido un problema al cambiar la dirección de la cámara en la misma escena A.
  - Se ha corregido un problema por el que los controles de aspecto AFrame no se eliminaban al reiniciar la escena.
  - Experiencia mejorada para algunos teléfonos Android con varias cámaras.
  - Otras correcciones y mejoras.

- Mejoras XRExtras:
  - Casi hay flujos mejorados para experiencias que se pueden ver en el escritorio.
  - El módulo PauseOnBlur detiene la cámara cuando su pestaña no está activa.
  - Nuevos componentes AFrame para facilitar el desarrollo de efectos faciales y experiencias de escritorio.
  - Nuevo ThreeExtras para renderizar materiales PBR, materiales básicos y vídeos en caras.

#### Versión 13.2: (2020-Feb-13) {#release-132--2020-feb-13}

- Nuevas funciones:
  - Libera el flujo de la cámara con XR8.pause() y vuelve a abrirlo con XR8.resume().
  - Añadida API para acceder al programa de sombreado y modificar los uniformes utilizados por GlTextureRenderer.
  - Añadida API para configurar el contexto WebGL en ejecución.

- Correcciones y mejoras:
  - Se soluciona el problema del vídeo negro en iOS cuando un usuario mantiene pulsada una imagen.
  - Mejora de la velocidad y la fiabilidad de captura de pantalla de iOS.
  - Corregido el renderizado del canal alfa al hacer una captura de pantalla.
  - Experiencia mejorada para algunos teléfonos Android con varias cámaras.
  - Mejora de la detección de vistas web de redes sociales.

- Mejoras XRExtras:
  - Códigos QR mejorados con mayor compatibilidad con las cámaras nativas.
  - Flujos de salida mejorados para las redes sociales.
  - Personalización CSS mejorada.

#### Versión 13.1 {#release-131}

- Nuevas funciones:
  - Mejora del framerate en teléfonos Android de alta resolución.
  - El canal de la cámara puede detenerse y reiniciarse.
  - Los módulos de canalización de cámara pueden eliminarse en tiempo de ejecución o cuando se detienen.
  - Nuevas devoluciones de llamada del ciclo de vida para conectar y desconectar.

- Correcciones y mejoras:
  - Experiencia mejorada para algunos teléfonos Android con varias cámaras.
  - Corregida la calibración del teléfono iOS en iOS 12.2 y superior.

#### Versión 13 {#release-13}

- Nuevas funciones:
  - Añade compatibilidad con la creación, colaboración, publicación y alojamiento de contenidos WebAR basados en la nube.

#### Versión 12.1 {#release-121}

- Correcciones y mejoras:
  - Mayor resolución de la cámara en los nuevos dispositivos iOS.
  - Aumento de los fps de AFrame en dispositivos Android de alta resolución.
  - Solucionados los problemas de raycasting de three.js r103+.
  - Se ha añadido compatibilidad con iPadOS.
  - Se ha corregido un problema de memoria al cargar repetidamente muchos objetivos de imagen.
  - Mejoras menores de rendimiento y corrección de errores.

#### Publicación 12 {#release-12}

- Nuevas funciones:
  - Se ha aumentado el límite de carga de imágenes a 1000 imágenes por aplicación.
  - Nueva API para seleccionar objetivos de imagen activos en tiempo de ejecución.
  - Las aplicaciones ahora pueden escanear hasta 10 objetivos de imagen simultáneamente.
  - La cámara frontal es compatible con el marco de la cámara y los objetivos de imagen.
  - Motor compatible con PlayCanvas.

- Arreglos:
  - Experiencia mejorada para algunos teléfonos Android con varias cámaras.

- XRExtras:
  - Calidad visual mejorada en teléfonos Android.
  - Compatibilidad con los permisos de orientación de dispositivos iOS 13.
  - Mejor tratamiento de los errores de falta de ensamblaje web en algunas versiones antiguas de iOS.
  - Soporte para PlayCanvas.

#### Versión 11.2 {#release-112}

- Nuevas funciones:
  - Compatibilidad con movimiento de iOS 13.

#### Versión 11.1 {#release-111}

- Correcciones y mejoras:
  - Reducción del uso de memoria.
  - Mejora del rendimiento del seguimiento.
  - Detección mejorada de las capacidades del navegador.

#### Versión 11 {#release-11}

- Nuevas funciones:
  - Se ha añadido compatibilidad con objetivos de imagen.
  - Añadido soporte para BabylonJS.
  - Reducido el tamaño del binario JS a 1MB.
  - Se ha añadido soporte para ejecutar 8th Wall Web dentro de un iframe de origen cruzado.
  - Adiciones menores a la API.

#### Versión 10.1 {#release-101}

- Nuevas funciones:
  - Se ha añadido compatibilidad con A-Frame 0.9.0.

- Arreglos:
  - Corregido error al proporcionar includedTypes a XrController.hitTest().
  - Reducción del uso de memoria al rastrear distancias largas.

#### Versión 10 {#release-10}

La versión 10 añade una consola de desarrollador web renovada con un modo de desarrollador optimizado, acceso a los orígenes permitidos y códigos QR. Añade compatibilidad con XRExtras de 8th Wall Web, un paquete de código abierto para la gestión de errores, la carga de visualizaciones, los flujos "casi listos" y mucho más.

- Nuevas funciones:
  - Consola de desarrollador web renovada.
  - XR Extras ofrece una cómoda solución para:
    - Cargar pantallas y solicitar permisos de cámara.
    - Redirigir a los usuarios desde dispositivos o navegadores no compatibles ("casi").
    - Tratamiento de errores en tiempo de ejecución.
    - Dibujar un feed de cámara a pantalla completa en frameworks de bajo nivel como three.js.
  - Añadida la iluminación pública, golpeó interfaces de prueba para XrController.
  - Otras adiciones menores a la API.

- Arreglos:
  - Mejora de la velocidad de inicio de la aplicación.
  - Se ha corregido un problema del marco de trabajo por el que los errores no se propagaban al iniciarse.
  - Se ha corregido un problema que podía producirse con WebGL durante la inicialización.
  - Utilice la interfaz window.screen para la orientación del dispositivo si está disponible.
  - Se ha corregido un problema de three.js que podía producirse al cambiar el tamaño del lienzo.

#### Versión 9.3 {#release-93}

- Nuevas funciones:
  - Adiciones menores a la API: XR.addCameraPipelineModules() y XR.FullWindowCanvas.pipelineModule()

#### Versión 9.2 {#release-92}

- Nuevas funciones:
  - Documentación pública: https://docs.8thwall.com/web

#### Versión 9.1 {#release-91}

- Nuevas funciones:
  - Añadido soporte para Amazon Sumerian en 8th Wall Web
  - Mejora de la estabilidad de seguimiento y eliminación de las fluctuaciones

#### Versión 9 {#release-9}

- ¡Lanzamiento inicial de 8th Wall Web!
