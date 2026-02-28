# XR8.PlayCanvas

PlayCanvas (<https://www.playcanvas.com/>) es un motor de juegos 3D de código abierto/motor de aplicaciones 3D interactivas
junto con una plataforma de creación propia alojada en la nube que permite la edición simultánea
desde varios ordenadores a través de una interfaz basada en navegador.

## Descripción {#description}

Proporciona una integración que interactúa con el entorno y el ciclo de vida de PlayCanvas para controlar la cámara
PlayCanvas para realizar superposiciones virtuales.

## Funciones {#functions}

| Función                                                             | Descripción                                                                                                                |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [run](run.md)                                                       | Abre la cámara con los módulos Pipeline especificados y comienza a ejecutarse en una escena PlayCanvas.    |
| [runXr (obsoleto)](runxr.md)                     | Abre la cámara y comienza a ejecutar el Rastreo Mundial y/o el Rastreo de Imagen en una escena PlayCanvas. |
| [runFaceEffects (obsoleto)](runfaceeffects.md)   | Abre la cámara y comienza a ejecutar Efectos faciales en una escena de PlayCanvas.                         |
| [stop](stop.md)                                                     | Elimine los módulos añadidos en [run](run.md) y detenga la cámara.                                         |
| [stopXr (obsoleto)](stopxr.md)                   | Retire los módulos añadidos en [runXr](runxr.md) y detenga la cámara.                                      |
| [stopFaceEffects (obsoleto)](stopfaceeffects.md) | Elimina los módulos añadidos en [runFaceEffects](runfaceeffects.md) y para la cámara.                      |
